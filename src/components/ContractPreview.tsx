
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Download, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

interface ContractPreviewProps {
  contract: string;
  isGenerating: boolean;
  contractData?: any;
  template?: string;
}

export const ContractPreview = ({ 
  contract, 
  isGenerating, 
  contractData,
  template = 'modern'
}: ContractPreviewProps) => {
  const handleDownloadPDF = () => {
    if (!contract) return;

    const pdf = new jsPDF();
    const pageHeight = pdf.internal.pageSize.height;
    const margin = 20;
    const lineHeight = 7;
    const maxWidth = pdf.internal.pageSize.width - 2 * margin;

    // Split contract into lines that fit the page width
    const lines = pdf.splitTextToSize(contract, maxWidth);
    let yPosition = margin;

    lines.forEach((line: string) => {
      if (yPosition > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
      pdf.text(line, margin, yPosition);
      yPosition += lineHeight;
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
        <Button onClick={handleDownloadPDF} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className={`whitespace-pre-wrap ${getTemplateStyles()}`}>
            {contract}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
