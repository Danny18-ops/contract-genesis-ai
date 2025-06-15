
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Download, FileText, PenTool } from 'lucide-react';
import { generateEnhancedPdf } from '@/utils/enhancedPdfGenerator';
import { ContractSigningFlow } from './ContractSigningFlow';
import { supabase } from '@/integrations/supabase/client';

interface ContractPreviewProps {
  contract: string;
  isGenerating: boolean;
  contractData?: any;
  template?: string;
  contractId?: string;
  showSigningOption?: boolean;
}

export const ContractPreview = ({ 
  contract, 
  isGenerating, 
  contractData,
  template = 'modern',
  contractId,
  showSigningOption = false
}: ContractPreviewProps) => {
  const [showSigningFlow, setShowSigningFlow] = useState(false);
  const [signatures, setSignatures] = useState<any[]>([]);

  useEffect(() => {
    if (contractId) {
      fetchSignatures();
    }
  }, [contractId]);

  const fetchSignatures = async () => {
    if (!contractId) return;
    
    try {
      const { data, error } = await supabase
        .from('digital_signatures')
        .select('*')
        .eq('contract_id', contractId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setSignatures(data || []);
    } catch (error) {
      console.error('Error fetching signatures:', error);
    }
  };

  const handleDownloadPDF = () => {
    if (!contract) return;

    // Determine contract type from contractData
    const contractType = contractData?.contractType || 'default';
    
    // Use enhanced PDF generator with signatures
    const pdf = generateEnhancedPdf({
      contractType,
      contractData,
      contract,
      template,
      signatures: signatures.length > 0 ? signatures : undefined
    });

    // Generate filename based on contract data
    const title = contractData?.contractTitle || contractData?.contractType || 'contract';
    const filename = `${title.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    
    pdf.save(filename);
  };

  const getTemplateStyles = () => {
    switch (template) {
      case 'professional':
        return 'font-serif text-gray-800 leading-relaxed';
      case 'casual':
        return 'font-sans text-gray-700 leading-normal';
      case 'legal':
        return 'font-mono text-gray-900 leading-tight text-sm';
      default:
        return 'font-sans text-gray-800 leading-normal';
    }
  };

  if (isGenerating) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <h3 className="text-lg font-semibold mb-2">Generating Your Contract</h3>
          <p className="text-gray-600">Please wait while we create your personalized contract...</p>
        </CardContent>
      </Card>
    );
  }

  if (!contract) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-8">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold mb-2">No Contract Yet</h3>
          <p className="text-gray-600">Fill out the form to generate your contract preview</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Contract Preview</h3>
        <div className="flex gap-3">
          {showSigningOption && contractId && (
            <Button 
              onClick={() => setShowSigningFlow(true)}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <PenTool className="w-4 h-4" />
              Get Signatures
            </Button>
          )}
          <Button onClick={handleDownloadPDF} className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700">
            <Download className="w-4 h-4" />
            Download Enhanced PDF
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className={`whitespace-pre-wrap ${getTemplateStyles()}`}>
            {contract}
          </div>
        </CardContent>
      </Card>

      {/* Show signature status if available */}
      {signatures.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4">Signature Status</h4>
            <div className="space-y-2">
              {signatures.map((sig, index) => (
                <div key={sig.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{sig.signer_name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sig.signature_status === 'signed' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {sig.signature_status === 'signed' 
                      ? `Signed ${new Date(sig.signed_at).toLocaleDateString()}`
                      : 'Pending'
                    }
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Signing Flow Dialog */}
      <Dialog open={showSigningFlow} onOpenChange={setShowSigningFlow}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Digital Contract Signing</DialogTitle>
          </DialogHeader>
          <ContractSigningFlow
            contractId={contractId!}
            contractTitle={contractData?.contractTitle || 'Contract'}
            onClose={() => {
              setShowSigningFlow(false);
              fetchSignatures(); // Refresh signatures when closing
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
