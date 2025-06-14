
import React from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileText, Save, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

interface ContractPreviewProps {
  contract: string;
  isGenerating: boolean;
  contractData?: any;
  onSaveContract?: () => Promise<void>;
}

export const ContractPreview = ({ 
  contract, 
  isGenerating, 
  contractData,
  onSaveContract 
}: ContractPreviewProps) => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleDownloadPDF = () => {
    if (!contract) return;

    const pdf = new jsPDF();
    const lines = pdf.splitTextToSize(contract, 180);
    
    pdf.setFont('helvetica');
    pdf.setFontSize(10);
    
    let y = 20;
    for (let i = 0; i < lines.length; i++) {
      if (y > 280) {
        pdf.addPage();
        y = 20;
      }
      pdf.text(lines[i], 15, y);
      y += 5;
    }
    
    const title = contractData?.contractType || 'Contract';
    pdf.save(`${title}-${new Date().toISOString().split('T')[0]}.pdf`);
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

      <div 
        className="bg-white p-8 rounded-lg shadow-sm border min-h-[500px] overflow-auto"
        style={{ fontFamily: 'Arial, sans-serif' }}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
          {contract}
        </div>
      </div>
    </div>
  );
};
