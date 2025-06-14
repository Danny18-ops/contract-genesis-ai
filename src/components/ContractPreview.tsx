
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, Loader2, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContractPreviewProps {
  contract: string;
  isGenerating: boolean;
  contractData: any;
}

export const ContractPreview = ({ contract, isGenerating, contractData }: ContractPreviewProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(contract);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Contract text copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy contract to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadAsPDF = () => {
    // Create a simple text file for now (PDF generation would require additional libraries)
    const element = document.createElement('a');
    const file = new Blob([contract], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${contractData?.contractType || 'contract'}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Downloaded!",
      description: "Contract downloaded successfully.",
    });
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Generating Your Contract</h3>
        <p className="text-sm text-center max-w-sm">
          Our AI is crafting a legally sound contract based on your requirements. This may take a few moments...
        </p>
        <div className="mt-6 flex space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-400">
        <FileText className="w-16 h-16 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Contract Generated</h3>
        <p className="text-sm text-center max-w-sm">
          Fill out the form on the left and click "Generate Contract" to see your AI-generated contract here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="flex gap-2 mb-4">
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
        <Button
          onClick={downloadAsPDF}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Contract Content */}
      <Card className="border-green-100 bg-green-50/30">
        <CardContent className="p-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 font-mono">
              {contract}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">Legal Disclaimer</h4>
              <p className="text-sm text-amber-700">
                This contract is AI-generated and should be reviewed by a qualified attorney before use. 
                GenContract is not responsible for legal accuracy or compliance with local laws.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
