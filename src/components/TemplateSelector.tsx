
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Palette, Check, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface TemplateSelectorProps {
  onTemplateChange: (template: string) => void;
  selectedTemplate: string;
}

const templates = [
  {
    id: 'classic',
    name: 'Classic Legal',
    description: 'Traditional legal document styling with serif fonts',
    preview: 'bg-gray-50 border-gray-300',
    accent: 'text-gray-800',
    previewContent: (
      <div className="p-4 bg-white border border-gray-300 rounded text-xs font-serif">
        <div className="text-center mb-4 font-bold text-gray-800">RENTAL AGREEMENT</div>
        <div className="mb-2">This Agreement is made between:</div>
        <div className="ml-4 mb-2">Landlord: John Property LLC</div>
        <div className="ml-4 mb-4">Tenant: Jane Smith</div>
        <div className="text-gray-700">Terms and Conditions...</div>
      </div>
    )
  },
  {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Clean, minimal design with plenty of white space',
    preview: 'bg-white border-blue-200',
    accent: 'text-blue-600',
    previewContent: (
      <div className="p-6 bg-white border-l-4 border-blue-500 rounded text-xs">
        <div className="text-2xl font-light text-blue-600 mb-6">Rental Agreement</div>
        <div className="space-y-3">
          <div className="flex"><span className="font-medium w-20">Landlord:</span> John Property LLC</div>
          <div className="flex"><span className="font-medium w-20">Tenant:</span> Jane Smith</div>
        </div>
        <div className="mt-4 text-gray-600">Terms and conditions...</div>
      </div>
    )
  },
  {
    id: 'formal',
    name: 'Business Formal',
    description: 'Professional corporate styling',
    preview: 'bg-slate-50 border-slate-300',
    accent: 'text-slate-700',
    previewContent: (
      <div className="p-4 bg-slate-50 border border-slate-300 rounded text-xs">
        <div className="text-center border-b border-slate-300 pb-2 mb-4">
          <div className="font-bold text-slate-800">RENTAL AGREEMENT</div>
          <div className="text-slate-600">Contract No: RA-2024-001</div>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div><strong>Landlord:</strong> John Property LLC</div>
          <div><strong>Tenant:</strong> Jane Smith</div>
        </div>
      </div>
    )
  },
  {
    id: 'accent',
    name: 'Color Accent',
    description: 'Modern design with colorful accents and highlights',
    preview: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
    accent: 'text-purple-600',
    previewContent: (
      <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded text-xs">
        <div className="text-center mb-4">
          <div className="text-purple-600 font-bold text-lg">🏠 RENTAL AGREEMENT</div>
        </div>
        <div className="space-y-2">
          <div className="bg-white p-2 rounded shadow-sm">
            <span className="text-purple-600 font-medium">Landlord:</span> John Property LLC
          </div>
          <div className="bg-white p-2 rounded shadow-sm">
            <span className="text-purple-600 font-medium">Tenant:</span> Jane Smith
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'boxed',
    name: 'Boxed Sections',
    description: 'Structured layout with clearly defined sections',
    preview: 'bg-amber-50 border-amber-200',
    accent: 'text-amber-700',
    previewContent: (
      <div className="p-4 bg-amber-50 rounded text-xs">
        <div className="border-2 border-amber-300 p-3 mb-3 bg-white rounded">
          <div className="font-bold text-amber-700 text-center">RENTAL AGREEMENT</div>
        </div>
        <div className="border border-amber-200 p-2 mb-2 bg-white rounded">
          <div className="font-medium text-amber-700">Party Information</div>
          <div>Landlord: John Property LLC</div>
          <div>Tenant: Jane Smith</div>
        </div>
        <div className="border border-amber-200 p-2 bg-white rounded">
          <div className="font-medium text-amber-700">Terms</div>
          <div>Monthly Rent: $1,500</div>
        </div>
      </div>
    )
  }
];

export const TemplateSelector = ({ onTemplateChange, selectedTemplate }: TemplateSelectorProps) => {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  return (
    <Card className="border-purple-100 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-purple-600" />
          <Label className="text-sm font-medium text-purple-900">PDF Template Style</Label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((template) => (
            <div key={template.id} className="relative">
              <Button
                variant={selectedTemplate === template.id ? "default" : "outline"}
                className={`h-auto p-3 flex flex-col items-start gap-3 relative w-full min-h-[80px] ${
                  selectedTemplate === template.id ? 'ring-2 ring-purple-500' : ''
                }`}
                onClick={() => onTemplateChange(template.id)}
              >
                {selectedTemplate === template.id && (
                  <Check className="absolute top-2 right-2 w-4 h-4 text-white" />
                )}
                <div className={`w-full h-12 rounded ${template.preview} border-2 flex-shrink-0`} />
                <div className="text-left flex-1 w-full">
                  <h4 className={`font-medium text-sm ${template.accent} leading-tight text-center`}>{template.name}</h4>
                </div>
              </Button>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1 right-1 w-6 h-6 p-0"
                    onClick={() => setPreviewTemplate(template.id)}
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>{template.name} Preview</DialogTitle>
                  </DialogHeader>
                  <div className="mt-4">
                    {template.previewContent}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
