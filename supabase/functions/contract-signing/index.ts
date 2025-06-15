
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InitiateSigningRequest {
  contractId: string;
  party1Email: string;
  party1Name: string;
  party2Email: string;
  party2Name: string;
}

interface SignContractRequest {
  signingToken: string;
  signatureData: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (req.method === 'GET' && token) {
      // Handle token-based status request for signing page
      const { data: signature, error } = await supabaseClient
        .from('digital_signatures')
        .select(`
          *,
          contracts (
            title,
            content,
            contract_type,
            contract_data
          )
        `)
        .eq('signing_token', token)
        .single();

      if (error || !signature) {
        return new Response(JSON.stringify({
          error: 'Invalid or expired signing token'
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }

      // Get other party info
      const { data: otherSignature } = await supabaseClient
        .from('digital_signatures')
        .select('signer_name, signature_status')
        .eq('contract_id', signature.contract_id)
        .neq('id', signature.id)
        .single();

      return new Response(JSON.stringify({
        signature,
        contract: signature.contracts,
        otherParty: otherSignature,
        expired: new Date(signature.token_expires_at) < new Date()
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    if (req.method === 'POST') {
      const body = await req.json();

      // Check if this is an initiate signing request
      if (body.contractId && body.party1Email && body.party2Email) {
        const { contractId, party1Email, party1Name, party2Email, party2Name }: InitiateSigningRequest = body;

        // Generate signing tokens with 7-day expiration
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const party1Token = crypto.randomUUID();
        const party2Token = crypto.randomUUID();

        // Create signature records
        const { error: insertError } = await supabaseClient
          .from('digital_signatures')
          .insert([
            {
              contract_id: contractId,
              signer_email: party1Email,
              signer_name: party1Name,
              signing_token: party1Token,
              token_expires_at: expiresAt.toISOString()
            },
            {
              contract_id: contractId,
              signer_email: party2Email,
              signer_name: party2Name,
              signing_token: party2Token,
              token_expires_at: expiresAt.toISOString()
            }
          ]);

        if (insertError) throw insertError;

        // Update contract status
        await supabaseClient
          .from('contracts')
          .update({ signing_status: 'pending_signatures' })
          .eq('id', contractId);

        // Generate signing URLs
        const baseUrl = req.headers.get('origin') || 'https://eypbbsbprbeteolxghoe.supabase.co';
        const party1SigningUrl = `${baseUrl}/sign/${party1Token}`;

        console.log('Signing initiated successfully', {
          contractId,
          party1SigningUrl,
          party2Token
        });

        return new Response(JSON.stringify({
          success: true,
          party1SigningUrl,
          message: 'Signing process initiated successfully'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });

      } else if (body.signingToken) {
        // Handle signature submission
        const { signingToken, signatureData }: SignContractRequest = body;

        // Update signature record
        const { data: signature, error: updateError } = await supabaseClient
          .from('digital_signatures')
          .update({
            signature_status: 'signed',
            signed_at: new Date().toISOString()
          })
          .eq('signing_token', signingToken)
          .eq('signature_status', 'pending')
          .select('*, contract_id')
          .single();

        if (updateError || !signature) {
          return new Response(JSON.stringify({
            error: 'Invalid or expired signing token'
          }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders }
          });
        }

        // Check if this completes the signing process
        const { data: allSignatures } = await supabaseClient
          .from('digital_signatures')
          .select('*')
          .eq('contract_id', signature.contract_id);

        const allSigned = allSignatures?.every(s => s.signature_status === 'signed');

        if (allSigned) {
          // Update contract to fully signed
          await supabaseClient
            .from('contracts')
            .update({ signing_status: 'fully_signed' })
            .eq('id', signature.contract_id);
        } else {
          // Send signing request to the other party
          const otherParty = allSignatures?.find(s => s.id !== signature.id);
          if (otherParty) {
            const baseUrl = req.headers.get('origin') || 'https://eypbbsbprbeteolxghoe.supabase.co';
            const signingUrl = `${baseUrl}/sign/${otherParty.signing_token}`;
            
            console.log('Notifying other party:', otherParty.signer_email, signingUrl);
          }
        }

        return new Response(JSON.stringify({
          success: true,
          allSigned,
          message: allSigned ? 'Contract fully signed!' : 'Signature recorded, notifying other party'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('Error in contract-signing function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });
  }
};

serve(handler);
