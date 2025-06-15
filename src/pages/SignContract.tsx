
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DigitalSignature } from '@/components/DigitalSignature';
import { CheckCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SigningData {
  signature: any;
  contract: any;
  otherParty: any;
  expired: boolean;
}

const SignContract = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [signingData, setSigningData] = useState<SigningData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showSignature, setShowSignature] = useState(false);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    if (token) {
      fetchSigningData();
    }
  }, [token]);

  const fetchSigningData = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('contract-signing', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (error) throw error;

      if (data.error) {
        setError(data.error);
      } else {
        setSigningData(data);
      }
    } catch (err: any) {
      setError('Failed to load contract details');
      console.error('Error fetching signing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSignature = async (signatures: { [key: string]: string }) => {
    if (!signingData || !token) return;

    setSigning(true);
    try {
      const signatureData = signatures[signingData.signature.signer_name];
      
      const { data, error } = await supabase.functions.invoke('contract-signing', {
        body: {
          signingToken: token,
          signatureData
        }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Signature Recorded",
        description: data.message,
      });

      // Refresh data to show updated status
      await fetchSigningData();
      setShowSignature(false);

    } catch (err: any) {
      toast({
        title: "Signing Failed",
        description: err.message,
        variant: "destructive"
      });
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-12 h-12 animate-pulse text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900">Loading Contract...</h2>
        </div>
      </div>
    );
  }

  if (error || !signingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Link</h2>
            <p className="text-gray-600 mb-4">{error || 'This signing link is invalid or has expired.'}</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { signature, contract, otherParty, expired } = signingData;
  const isAlreadySigned = signature.signature_status === 'signed';
  const otherPartySigned = otherParty?.signature_status === 'signed';

  if (expired) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <Clock className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Link Expired</h2>
            <p className="text-gray-600 mb-4">This signing link has expired. Please contact the contract sender for a new link.</p>
            <Button onClick={() => navigate('/')} variant="outline">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Signing</h1>
          <p className="text-gray-600">
            {contract.title}
          </p>
        </div>

        {/* Status Alert */}
        <Alert className="mb-6">
          <AlertDescription className="flex items-center gap-2">
            {isAlreadySigned ? (
              <>
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-green-800">
                  You have already signed this contract.
                  {!otherPartySigned && " Waiting for the other party to sign."}
                  {otherPartySigned && " Contract is fully signed!"}
                </span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-blue-800">Pending your signature</span>
              </>
            )}
          </AlertDescription>
        </Alert>

        {/* Parties Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Signing Parties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{signature.signer_name}</span>
                <div className="flex items-center gap-2">
                  {isAlreadySigned ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-600 font-medium">Signed</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span className="text-orange-600 font-medium">Pending</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">{otherParty?.signer_name}</span>
                <div className="flex items-center gap-2">
                  {otherPartySigned ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="text-green-600 font-medium">Signed</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500 font-medium">Waiting</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                {contract.content}
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Signing Action */}
        {!isAlreadySigned && (
          <Card>
            <CardContent className="text-center p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to Sign?
              </h3>
              <p className="text-gray-600 mb-6">
                By signing this contract, you agree to all terms and conditions outlined above.
              </p>
              <Button 
                onClick={() => setShowSignature(true)}
                className="bg-blue-600 hover:bg-blue-700"
                size="lg"
                disabled={signing}
              >
                {signing ? 'Signing...' : 'Sign Contract'}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Digital Signature Modal */}
        <DigitalSignature
          isOpen={showSignature}
          onClose={() => setShowSignature(false)}
          parties={[signature.signer_name]}
          onSignatureChange={handleSignature}
        />
      </div>
    </div>
  );
};

export default SignContract;
