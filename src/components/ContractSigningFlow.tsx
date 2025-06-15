
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PenTool, Mail, Users, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useContracts } from '@/hooks/use-contracts';

interface ContractSigningFlowProps {
  contractId: string;
  contractTitle: string;
  onClose: () => void;
}

export const ContractSigningFlow = ({ contractId, contractTitle, onClose }: ContractSigningFlowProps) => {
  const { toast } = useToast();
  const { refetch } = useContracts();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [signingUrl, setSigningUrl] = useState('');
  
  const [formData, setFormData] = useState({
    party1Name: '',
    party1Email: '',
    party2Name: '',
    party2Email: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { party1Name, party1Email, party2Name, party2Email } = formData;
    return party1Name && party1Email && party2Name && party2Email &&
           party1Email.includes('@') && party2Email.includes('@') &&
           party1Email !== party2Email;
  };

  const handleInitiateSigning = async () => {
    if (!validateForm()) {
      toast({
        title: "Invalid Form",
        description: "Please fill all fields with valid email addresses",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('contract-signing', {
        body: {
          contractId,
          party1Email: formData.party1Email,
          party1Name: formData.party1Name,
          party2Email: formData.party2Email,
          party2Name: formData.party2Name
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setSigningUrl(data.party1SigningUrl);
      setStep('success');
      refetch(); // Refresh contracts list to show updated status

      toast({
        title: "Signing Process Started",
        description: "Contract is ready for signing. Each party will receive their own signing link."
      });

    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to initiate signing process",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Signing Process Started!</h3>
          <p className="text-gray-600">
            The contract is now ready for digital signatures from both parties.
          </p>
        </div>

        <Alert>
          <AlertDescription>
            <strong>Next Steps:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li><strong>{formData.party1Name}</strong> can sign using the link below</li>
              <li>After they sign, <strong>{formData.party2Name}</strong> will receive an email to sign</li>
              <li>Once both parties sign, everyone gets a final copy</li>
            </ol>
          </AlertDescription>
        </Alert>

        <div className="bg-blue-50 p-4 rounded-lg">
          <Label className="text-sm font-medium text-blue-900 mb-2 block">
            Signing Link for {formData.party1Name}:
          </Label>
          <div className="flex gap-2">
            <Input 
              value={signingUrl} 
              readOnly 
              className="flex-1 bg-white"
            />
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(signingUrl);
                toast({ title: "Copied!", description: "Link copied to clipboard" });
              }}
              variant="outline"
              size="sm"
            >
              Copy
            </Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={() => window.open(signingUrl, '_blank')}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            Sign as {formData.party1Name}
          </Button>
          <Button 
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <PenTool className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Set Up Digital Signatures</h3>
        <p className="text-gray-600">
          Enter the details for both parties who need to sign "{contractTitle}"
        </p>
      </div>

      <div className="space-y-6">
        {/* Party 1 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              First Party
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="party1Name">Full Name *</Label>
              <Input
                id="party1Name"
                value={formData.party1Name}
                onChange={(e) => handleInputChange('party1Name', e.target.value)}
                placeholder="Enter first party's full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="party1Email">Email Address *</Label>
              <Input
                id="party1Email"
                type="email"
                value={formData.party1Email}
                onChange={(e) => handleInputChange('party1Email', e.target.value)}
                placeholder="Enter first party's email"
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Party 2 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Second Party
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="party2Name">Full Name *</Label>
              <Input
                id="party2Name"
                value={formData.party2Name}
                onChange={(e) => handleInputChange('party2Name', e.target.value)}
                placeholder="Enter second party's full name"
                required
              />
            </div>
            <div>
              <Label htmlFor="party2Email">Email Address *</Label>
              <Input
                id="party2Email"
                type="email"
                value={formData.party2Email}
                onChange={(e) => handleInputChange('party2Email', e.target.value)}
                placeholder="Enter second party's email"
                required
              />
            </div>
          </CardContent>
        </Card>

        <Alert>
          <AlertDescription>
            <strong>How it works:</strong> Each party will receive a unique, secure link to sign. 
            They must sign individually using their own signature. Once both parties sign, 
            everyone gets the final contract with both signatures.
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex gap-3">
        <Button 
          onClick={handleInitiateSigning}
          disabled={!validateForm() || loading}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {loading ? 'Starting...' : 'Start Signing Process'}
        </Button>
        <Button 
          onClick={onClose}
          variant="outline"
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
