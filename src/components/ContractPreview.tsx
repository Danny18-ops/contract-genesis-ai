
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileText, Save, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

// Template style maps:
const templateStyles: Record<string, any> = {
  'classic': {
    wrapper: 'bg-gray-50 border border-gray-300 font-serif text-gray-800',
    title: 'text-center font-bold text-gray-800 text-xl mb-4',
    content: '',
  },
  'modern': {
    wrapper: 'bg-white border-l-4 border-blue-500 text-blue-900',
    title: 'text-2xl font-light text-blue-600 mb-6 text-center',
    content: 'space-y-2',
  },
  'formal': {
    wrapper: 'bg-slate-50 border border-slate-300 text-slate-700',
    title: 'text-center border-b border-slate-300 pb-2 mb-4 font-bold text-slate-800 text-lg',
    content: '',
  },
  'accent': {
    wrapper: 'bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700',
    title: 'text-purple-600 font-bold text-lg text-center mb-2',
    content: '',
  },
  'boxed': {
    wrapper: 'bg-amber-50 border border-amber-200 text-amber-700',
    title: 'font-bold text-amber-700 text-center mb-3',
    content: '',
  },
};

interface ContractPreviewProps {
  contract: string;
  isGenerating: boolean;
  contractData?: any;
  onSaveContract?: () => Promise<void>;
  template?: string;
}

export const ContractPreview = ({ 
  contract, 
  isGenerating, 
  contractData,
  onSaveContract,
  template = 'modern'
}: ContractPreviewProps) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const orgName = 
    contractData?.organizationData?.name || 
    contractData?.organizationData?.orgName || 
    '';

  // For preview
  const style = templateStyles[template] || templateStyles['modern'];

  const handleDownloadPDF = () => {
    if (!contract) return;

    const doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4"
    });

    // Prepare contract text with organization name as header
    let y = 60;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    if (orgName) {
      doc.text(orgName, 40, y);
      y += 28;
    }

    // Apply a title (contract type or just 'Contract')
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    if (contractData?.contractType) {
      doc.text(
        (contractData.contractType === 'rental' ? 'Rental Agreement'
        : contractData.contractType === 'jobOffer' ? 'Job Offer Letter'
        : contractData.contractType === 'business' ? 'Business Agreement'
        : contractData.contractType === 'carRental' ? 'Car Rental Agreement'
        : contractData.contractType === 'storage' ? 'Storage Contract'
        : contractData.contractType === 'nda' ? 'Non-Disclosure Agreement'
        : contractData.contractType === 'freelance' ? 'Freelance Service Agreement'
        : contractData.contractType === 'employment' ? 'Employment Contract'
        : contractData.contractType === 'partnership' ? 'Partnership Agreement'
        : contractData.contractType === 'consulting' ? 'Consulting Agreement'
        : contractData.contractType === 'license' ? 'License Agreement'
        : 'Contract'), 40, y);
      y += 16;
    }

    // footer text (if present, print at bottom)
    const footerText = contractData?.footerText || '';

    // Main contract contents
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const marginX = 40;
    const maxWidth = 515;
    const textLines = doc.splitTextToSize(contract, maxWidth);

    // Render text, start after title
    for (let i = 0; i < textLines.length; i++) {
      // Leave room for footer on last page
      if (y > 730) {
        // Footer per-page if needed
        if (footerText) {
          doc.setFontSize(8);
          doc.text(footerText, marginX, 790, { maxWidth, align: 'left' });
        }
        doc.addPage();
        y = 60;
      }
      doc.setFontSize(10);
      doc.text(textLines[i], marginX, y);
      y += 15;
    }

    // Final footer on last page
    if (footerText) {
      doc.setFontSize(8);
      doc.text(footerText, marginX, 790, { maxWidth, align: 'left' });
    }

    const title = contractData?.contractType || 'Contract';
    doc.save(`${title}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleSave = async () => {
    if (!onSaveContract) return;
    
    setIsSaving(true);
    try {
      await onSaveContract();
    } finally {
      setIsSaving(false);
    }
  };

  if (isGenerating) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/6" />
        <Skeleton className="h-4 w-5/6" />
        <div className="text-center text-gray-600 py-4">
          <p className="text-lg font-semibold">Generating your contract...</p>
          <p className="text-sm">This may take a few moments</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-500">
        <FileText className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className="text-lg font-semibold mb-2">No contract generated yet</h3>
        <p className="text-center text-gray-400">
          Fill out the form on the left to generate your custom contract
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        <Button 
          onClick={handleDownloadPDF} 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        
        {user && onSaveContract && (
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            variant="outline"
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Saving...' : 'Save Contract'}
          </Button>
        )}
      </div>

      {/* Styled template preview */}
      <div 
        className={`p-8 rounded-lg shadow-sm border min-h-[500px] overflow-auto transition-all duration-300 ${style.wrapper}`}
        style={{ fontFamily: style.wrapper.includes('font-serif') ? 'serif' : 'Arial, sans-serif' }}
      >
        {orgName && (
          <div className="text-lg font-bold mb-2 text-center">{orgName}</div>
        )}
        <div className={style.title}>
          {(contractData?.contractType === 'rental' && 'Rental Agreement')
                      || (contractData?.contractType === 'jobOffer' && 'Job Offer Letter')
                      || (contractData?.contractType === 'business' && 'Business Agreement')
                      || (contractData?.contractType === 'carRental' && 'Car Rental Agreement')
                      || (contractData?.contractType === 'storage' && 'Storage Contract')
                      || (contractData?.contractType === 'nda' && 'Non-Disclosure Agreement')
                      || (contractData?.contractType === 'freelance' && 'Freelance Service Agreement')
                      || (contractData?.contractType === 'employment' && 'Employment Contract')
                      || (contractData?.contractType === 'partnership' && 'Partnership Agreement')
                      || (contractData?.contractType === 'consulting' && 'Consulting Agreement')
                      || (contractData?.contractType === 'license' && 'License Agreement')
                      || 'Contract'}
        </div>
        <div className={`whitespace-pre-wrap text-sm leading-relaxed text-gray-800 ${style.content}`}>
          {contract}
        </div>
        {contractData?.footerText && (
          <div className="border-t mt-8 pt-4 text-xs text-gray-500 text-center">
            {contractData.footerText}
          </div>
        )}
      </div>
    </div>
  );
};
