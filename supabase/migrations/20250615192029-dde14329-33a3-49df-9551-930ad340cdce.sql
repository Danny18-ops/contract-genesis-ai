
-- Create digital_signatures table to track contract signatures
CREATE TABLE public.digital_signatures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL REFERENCES public.contracts(id) ON DELETE CASCADE,
  signer_email TEXT NOT NULL,
  signer_name TEXT NOT NULL,
  signature_status TEXT NOT NULL DEFAULT 'pending' CHECK (signature_status IN ('pending', 'signed', 'expired')),
  signed_at TIMESTAMP WITH TIME ZONE,
  signing_token TEXT UNIQUE,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.digital_signatures ENABLE ROW LEVEL SECURITY;

-- Users can view signatures for contracts they own
CREATE POLICY "Users can view signatures for their contracts" 
  ON public.digital_signatures 
  FOR SELECT 
  USING (
    contract_id IN (
      SELECT id FROM public.contracts WHERE user_id = auth.uid()
    )
  );

-- Users can create signatures for their contracts
CREATE POLICY "Users can create signatures for their contracts" 
  ON public.digital_signatures 
  FOR INSERT 
  WITH CHECK (
    contract_id IN (
      SELECT id FROM public.contracts WHERE user_id = auth.uid()
    )
  );

-- Allow public access to signatures via signing token (for second party signing)
CREATE POLICY "Public access via signing token" 
  ON public.digital_signatures 
  FOR ALL
  USING (signing_token IS NOT NULL AND token_expires_at > now());

-- Add signing status to contracts table
ALTER TABLE public.contracts 
ADD COLUMN signing_status TEXT DEFAULT 'draft' CHECK (signing_status IN ('draft', 'pending_signatures', 'fully_signed', 'expired'));

-- Create function to generate secure signing tokens
CREATE OR REPLACE FUNCTION generate_signing_token() 
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Create function to update contract signing status
CREATE OR REPLACE FUNCTION update_contract_signing_status(contract_uuid UUID)
RETURNS VOID AS $$
DECLARE
  total_signatures INTEGER;
  completed_signatures INTEGER;
BEGIN
  SELECT COUNT(*), COUNT(CASE WHEN signature_status = 'signed' THEN 1 END)
  INTO total_signatures, completed_signatures
  FROM public.digital_signatures
  WHERE contract_id = contract_uuid;
  
  IF completed_signatures = total_signatures AND total_signatures > 0 THEN
    UPDATE public.contracts 
    SET signing_status = 'fully_signed'
    WHERE id = contract_uuid;
  ELSIF completed_signatures > 0 THEN
    UPDATE public.contracts 
    SET signing_status = 'pending_signatures'
    WHERE id = contract_uuid;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update contract status when signatures change
CREATE OR REPLACE FUNCTION trigger_update_contract_status()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_contract_signing_status(NEW.contract_id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contract_status_on_signature_change
  AFTER INSERT OR UPDATE ON public.digital_signatures
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_contract_status();
