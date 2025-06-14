
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';

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
    accent: 'text-gray-800'
  },
  {
    id: 'modern',
    name: 'Modern Minimalist',
    description: 'Clean, minimal design with plenty of white space',
    preview: 'bg-white border-blue-200',
    accent: 'text-blue-600'
  },
  {
    id: 'formal',
    name: 'Business Formal',
    description: 'Professional corporate styling',
    preview: 'bg-slate-50 border-slate-300',
    accent: 'text-slate-700'
  },
  {
    id: 'accent',
    name: 'Color Accent',
    description: 'Modern design with colorful accents and highlights',
    preview: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
    accent: 'text-purple-600'
  },
  {
    id: 'boxed',
    name: 'Boxed Sections',
    description: 'Structured layout with clearly defined sections',
    preview: 'bg-amber-50 border-amber-200',
    accent: 'text-amber-700'
  }
];

export const TemplateSelector = ({ onTemplateChange, selectedTemplate }: TemplateSelectorProps) => {
  return (
    <Card className="border-purple-100 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-purple-600" />
          <Label className="text-sm font-medium text-purple-900">PDF Template Style</Label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {templates.map((template) => (
            <Button
              key={template.id}
              variant={selectedTemplate === template.id ? "default" : "outline"}
              className={`h-auto p-3 flex flex-col items-start gap-2 relative ${
                selectedTemplate === template.id ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => onTemplateChange(template.id)}
            >
              {selectedTemplate === template.id && (
                <Check className="absolute top-2 right-2 w-4 h-4 text-white" />
              )}
              <div className={`w-full h-12 rounded ${template.preview} border-2`} />
              <div className="text-left">
                <h4 className={`font-medium text-xs ${template.accent}`}>{template.name}</h4>
                <p className="text-xs text-gray-500 mt-1">{template.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
