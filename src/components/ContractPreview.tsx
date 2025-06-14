import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, Loader2, Copy, Check, PenTool } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DigitalSignature } from './DigitalSignature';
import jsPDF from 'jspdf';

interface ContractPreviewProps {
  contract: string;
  isGenerating: boolean;
  contractData: any;
}

export const ContractPreview = ({ contract, isGenerating, contractData }: ContractPreviewProps) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatures, setSignatures] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  const getParties = () => {
    if (!contractData) return [];
    
    const parties = [contractData.organizationData?.name || 'Organization'];
    
    // Add second party based on contract type
    if (contractData.dynamicFields?.tenant) parties.push(contractData.dynamicFields.tenant);
    else if (contractData.dynamicFields?.candidate) parties.push(contractData.dynamicFields.candidate);
    else if (contractData.dynamicFields?.party2) parties.push(contractData.dynamicFields.party2);
    else if (contractData.dynamicFields?.renter) parties.push(contractData.dynamicFields.renter);
    else parties.push('Second Party');
    
    return parties;
  };

  const getPreviewStyles = (template: string) => {
    const styles = {
      classic: {
        container: 'bg-gray-50 border-gray-300',
        content: 'bg-white p-8 font-serif text-gray-800 leading-relaxed',
        header: 'text-center text-xl font-bold mb-6 text-gray-900 border-b-2 border-gray-300 pb-4',
        text: 'text-sm leading-7',
        accent: 'text-gray-700 font-semibold'
      },
      modern: {
        container: 'bg-white border-blue-200',
        content: 'bg-white p-12 font-sans text-gray-700 leading-loose border-l-4 border-blue-500',
        header: 'text-2xl font-light text-blue-600 mb-8',
        text: 'text-sm leading-8',
        accent: 'text-blue-600 font-medium'
      },
      formal: {
        container: 'bg-slate-50 border-slate-300',
        content: 'bg-slate-50 p-8 font-sans text-slate-800 leading-relaxed border border-slate-300',
        header: 'text-center text-lg font-bold text-slate-900 border-b border-slate-400 pb-3 mb-6',
        text: 'text-sm leading-6',
        accent: 'text-slate-700 font-semibold'
      },
      accent: {
        container: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
        content: 'bg-gradient-to-br from-purple-50/50 to-pink-50/50 p-10 font-sans text-gray-800 leading-relaxed rounded-lg',
        header: 'text-center text-xl font-bold text-purple-600 mb-6 bg-white/80 p-4 rounded-lg shadow-sm',
        text: 'text-sm leading-7',
        accent: 'text-purple-600 font-bold'
      },
      boxed: {
        container: 'bg-amber-50 border-amber-200',
        content: 'bg-amber-50 p-8 font-sans text-amber-900 leading-relaxed',
        header: 'text-center text-lg font-bold text-amber-800 bg-white border-2 border-amber-300 p-4 rounded mb-6',
        text: 'text-sm leading-6 bg-white/60 p-4 rounded border border-amber-200 mb-4',
        accent: 'text-amber-700 font-bold'
      }
    };
    
    return styles[template as keyof typeof styles] || styles.modern;
  };

  const getTemplateStyles = (template: string) => {
    const styles = {
      classic: {
        fontFamily: 'Times',
        fontSize: 11,
        lineHeight: 1.4,
        headerSize: 16,
        headerFont: 'Times',
        headerWeight: 'bold',
        marginTop: 25,
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 30,
        color: [0, 0, 0]
      },
      modern: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.6,
        headerSize: 18,
        headerFont: 'Helvetica',
        headerWeight: 'normal',
        marginTop: 30,
        marginLeft: 30,
        marginRight: 30,
        marginBottom: 40,
        color: [37, 99, 235]
      },
      formal: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
        headerSize: 14,
        headerFont: 'Helvetica',
        headerWeight: 'bold',
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 30,
        color: [51, 65, 85]
      },
      accent: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
        headerSize: 16,
        headerFont: 'Helvetica',
        headerWeight: 'bold',
        marginTop: 25,
        marginLeft: 25,
        marginRight: 25,
        marginBottom: 35,
        color: [147, 51, 234]
      },
      boxed: {
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.4,
        headerSize: 14,
        headerFont: 'Helvetica',
        headerWeight: 'bold',
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 30,
        color: [180, 83, 9]
      }
    };
    
    return styles[template as keyof typeof styles] || styles.modern;
  };

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

  const downloadAsPDF = async () => {
    if (!contract) return;
    
    setIsDownloading(true);
    
    try {
      const pdf = new jsPDF();
      
      // Get the selected template from contractData, default to 'modern' if not found
      const selectedTemplate = contractData?.template || 'modern';
      console.log('Using template for PDF:', selectedTemplate);
      
      const style = getTemplateStyles(selectedTemplate);
      
      const pageHeight = pdf.internal.pageSize.height;
      const pageWidth = pdf.internal.pageSize.width;
      const maxLineWidth = pageWidth - (style.marginLeft + style.marginRight);
      
      let yPosition = style.marginTop;
      
      // Add organization logo if available
      if (contractData?.organizationData?.logo) {
        try {
          // Make logo smaller and better positioned
          const logoWidth = 40;
          const logoHeight = 25;
          pdf.addImage(contractData.organizationData.logo, 'JPEG', pageWidth - logoWidth - 15, 10, logoWidth, logoHeight);
        } catch (error) {
          console.log('Logo could not be added to PDF');
        }
      }
      
      // Add title with template styling
      pdf.setFont(style.headerFont, style.headerWeight);
      pdf.setFontSize(style.headerSize);
      pdf.setTextColor(style.color[0], style.color[1], style.color[2]);
      
      const title = contractData?.contractType?.toUpperCase().replace(/([A-Z])/g, ' $1').trim() + ' CONTRACT' || 'LEGAL CONTRACT';
      pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 20;
      
      // Add template-specific styling for different sections
      if (selectedTemplate === 'boxed') {
        // Add border around title for boxed template
        pdf.setDrawColor(style.color[0], style.color[1], style.color[2]);
        pdf.rect(style.marginLeft, yPosition - 30, maxLineWidth, 25);
      }
      
      if (selectedTemplate === 'accent') {
        // Add gradient-like effect for accent template
        pdf.setFillColor(style.color[0], style.color[1], style.color[2], 0.1);
        pdf.rect(0, 0, pageWidth, 50, 'F');
      }
      
      // Add organization info as header with template styling
      if (contractData?.organizationData) {
        const org = contractData.organizationData;
        pdf.setFontSize(12);
        pdf.setFont(style.fontFamily, 'bold');
        pdf.setTextColor(style.color[0], style.color[1], style.color[2]);
        pdf.text(org.name || '', pageWidth / 2, yPosition, { align: 'center' });
        yPosition += 8;
        
        pdf.setFontSize(9);
        pdf.setFont(style.fontFamily, 'normal');
        pdf.setTextColor(0, 0, 0);
        if (org.address) {
          pdf.text(org.address, pageWidth / 2, yPosition, { align: 'center' });
          yPosition += 6;
        }
        if (org.email || org.phone) {
          const contact = [org.email, org.phone].filter(Boolean).join(' | ');
          pdf.text(contact, pageWidth / 2, yPosition, { align: 'center' });
          yPosition += 6;
        }
      }
      
      yPosition += 15;
      
      // Add contract content with template styling
      pdf.setFontSize(style.fontSize);
      pdf.setFont(style.fontFamily, 'normal');
      pdf.setTextColor(0, 0, 0);
      
      // Apply template-specific formatting to contract text
      let formattedContract = contract;
      
      if (selectedTemplate === 'boxed') {
        // For boxed template, we could add visual separators
        formattedContract = contract.replace(/\n\n/g, '\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n');
      }
      
      const lines = pdf.splitTextToSize(formattedContract, maxLineWidth);
      
      for (let i = 0; i < lines.length; i++) {
        // Use marginBottom for better spacing at bottom of page
        if (yPosition > pageHeight - style.marginBottom) {
          pdf.addPage();
          yPosition = style.marginTop;
          
          // Apply template background to new pages for accent template
          if (selectedTemplate === 'accent') {
            pdf.setFillColor(style.color[0], style.color[1], style.color[2], 0.05);
            pdf.rect(0, 0, pageWidth, pageHeight, 'F');
          }
        }
        
        pdf.text(lines[i], style.marginLeft, yPosition);
        yPosition += style.fontSize * style.lineHeight;
      }
      
      // Add signatures if available
      if (Object.keys(signatures).length > 0) {
        yPosition += 20;
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = style.marginTop;
        }
        
        pdf.setFont(style.fontFamily, 'bold');
        pdf.setFontSize(12);
        pdf.text('SIGNATURES:', style.marginLeft, yPosition);
        yPosition += 15;
        
        const parties = Object.keys(signatures);
        const signatureWidth = maxLineWidth / parties.length - 10;
        
        parties.forEach((party, index) => {
          const xPosition = style.marginLeft + (index * (signatureWidth + 10));
          
          // Add signature image
          try {
            pdf.addImage(signatures[party], 'PNG', xPosition, yPosition, signatureWidth, 30);
          } catch (error) {
            console.log('Signature could not be added for', party);
          }
          
          // Add signature line and name
          pdf.setDrawColor(0, 0, 0);
          pdf.line(xPosition, yPosition + 35, xPosition + signatureWidth, yPosition + 35);
          pdf.setFont(style.fontFamily, 'normal');
          pdf.setFontSize(8);
          pdf.text(party, xPosition + (signatureWidth / 2), yPosition + 40, { align: 'center' });
          pdf.text('Signature', xPosition + (signatureWidth / 2), yPosition + 45, { align: 'center' });
        });
      }
      
      // Add footer to each page with improved positioning
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        
        const footerY = pageHeight - 15;
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - style.marginRight, footerY, { align: 'right' });
        
        const footerText = contractData?.footerText || 'Generated by GenContract AI';
        pdf.text(footerText, style.marginLeft, footerY);
      }
      
      // Generate filename with template name
      const contractType = contractData?.contractType || 'contract';
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${contractType}_${selectedTemplate}_${timestamp}.pdf`;
      
      // Save the PDF
      pdf.save(filename);
      
      toast({
        title: "PDF Downloaded!",
        description: `Your contract has been saved with ${selectedTemplate} template styling.`,
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "Download Failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const formatContractContent = (content: string, template: string) => {
    const lines = content.split('\n');
    const previewStyle = getPreviewStyles(template);
    
    return lines.map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Format headers (lines in ALL CAPS or with specific patterns)
      if (line.match(/^[A-Z\s]+:?\s*$/) && line.length < 50) {
        return (
          <div key={index} className={`${previewStyle.accent} text-lg font-bold mb-4 mt-6`}>
            {line}
          </div>
        );
      }
      
      // Format section headers (numbered sections)
      if (line.match(/^\d+\.\s/)) {
        return (
          <div key={index} className={`${previewStyle.accent} font-semibold mb-2 mt-4`}>
            {line}
          </div>
        );
      }
      
      // Format subsections (lettered subsections)
      if (line.match(/^\s*[a-z]\)\s/)) {
        return (
          <div key={index} className="ml-4 mb-2">
            {line}
          </div>
        );
      }
      
      // Regular text
      return (
        <div key={index} className="mb-2">
          {line}
        </div>
      );
    });
  };

  if (isGenerating) {
    return (
      <div className="flex flex-col items-center justify-center h-96 text-gray-500">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Generating Your Professional Contract</h3>
        <p className="text-sm text-center max-w-sm">
          Our AI is crafting a comprehensive, legally sound contract with all necessary clauses and provisions. This may take a few moments...
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
          Fill out the detailed form on the left and click "Generate Professional Contract" to create your comprehensive legal agreement.
        </p>
      </div>
    );
  }

  // Count pages (approximate)
  const estimatedPages = Math.ceil(contract.length / 3000);
  const selectedTemplate = contractData?.template || 'modern';
  const previewStyle = getPreviewStyles(selectedTemplate);

  return (
    <div className="space-y-4">
      {/* Contract Stats */}
      <div className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
        <span>Document Length: {contract.length.toLocaleString()} characters</span>
        <span>Template: <span className="font-semibold capitalize">{selectedTemplate}</span></span>
        <span>Estimated Pages: {estimatedPages}</span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Button
          onClick={copyToClipboard}
          variant="outline"
          size="sm"
          disabled={!contract}
        >
          {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
          {copied ? 'Copied!' : 'Copy Text'}
        </Button>
        <Button
          onClick={() => setShowSignatureModal(true)}
          variant="outline"
          size="sm"
          className="bg-purple-50 hover:bg-purple-100 border-purple-200"
        >
          <PenTool className="w-4 h-4 mr-2" />
          Add Signatures
        </Button>
        <Button
          onClick={downloadAsPDF}
          variant="default"
          size="sm"
          className="col-span-2 bg-green-600 hover:bg-green-700"
          disabled={!contract || isDownloading}
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isDownloading ? 'Generating PDF...' : 'Download Styled PDF'}
        </Button>
      </div>

      {/* Signatures Status */}
      {Object.keys(signatures).length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-green-700">
            <Check className="w-4 h-4" />
            <span className="font-medium">Signatures Added ({Object.keys(signatures).length})</span>
          </div>
          <div className="text-sm text-green-600 mt-1">
            {Object.keys(signatures).join(', ')}
          </div>
        </div>
      )}

      {/* Contract Content with Template Styling */}
      <Card className={`border-green-100 ${previewStyle.container}`}>
        <CardContent className="p-6">
          <div className={`${previewStyle.content} rounded-lg shadow-sm border max-h-[600px] overflow-y-auto`}>
            {/* Contract Header */}
            <div className={previewStyle.header}>
              {contractData?.contractType?.toUpperCase().replace(/([A-Z])/g, ' $1').trim() + ' CONTRACT' || 'LEGAL CONTRACT'}
            </div>
            
            {/* Organization Info */}
            {contractData?.organizationData && (
              <div className="mb-6 text-center">
                <div className={`${previewStyle.accent} text-lg mb-2`}>
                  {contractData.organizationData.name}
                </div>
                {contractData.organizationData.address && (
                  <div className="text-sm mb-1">{contractData.organizationData.address}</div>
                )}
                {(contractData.organizationData.email || contractData.organizationData.phone) && (
                  <div className="text-sm">
                    {[contractData.organizationData.email, contractData.organizationData.phone]
                      .filter(Boolean)
                      .join(' | ')}
                  </div>
                )}
              </div>
            )}
            
            {/* Contract Content */}
            <div className={previewStyle.text}>
              {formatContractContent(contract, selectedTemplate)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Disclaimer */}
      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">!</span>
            </div>
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">Important Legal Disclaimer</h4>
              <p className="text-sm text-amber-700 mb-2">
                This contract is AI-generated and provided for informational purposes only. While designed to be comprehensive and legally sound, it should be reviewed by a qualified attorney before execution.
              </p>
              <ul className="text-xs text-amber-600 space-y-1">
                <li>• Ensure compliance with local, state, and federal laws</li>
                <li>• Verify all terms meet your specific requirements</li>
                <li>• Consider jurisdiction-specific legal requirements</li>
                <li>• GenContract is not responsible for legal accuracy or consequences</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Digital Signature Modal */}
      <DigitalSignature
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSignatureChange={setSignatures}
        parties={getParties()}
      />
    </div>
  );
};
