
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2, Download, FileText, PenTool } from 'lucide-react';
import { generateEnhancedPdf } from '@/utils/enhancedPdfGenerator';
import { ContractSigningFlow } from './ContractSigningFlow';

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

  const handleDownloadPDF = () => {
    if (!contract) return;

    // Determine contract type from contractData
    const contractType = contractData?.contractType || 'default';
    
    // Use enhanced PDF generator
    const pdf = generateEnhancedPdf({
      contractType,
      contractData,
      contract,
      template
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

      {/* Signing Flow Dialog */}
      <Dialog open={showSigningFlow} onOpenChange={setShowSigningFlow}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Digital Contract Signing</DialogTitle>
          </DialogHeader>
          <ContractSigningFlow
            contractId={contractId!}
            contractTitle={contractData?.contractTitle || 'Contract'}
            onClose={() => setShowSigningFlow(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
