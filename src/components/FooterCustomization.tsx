
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

interface FooterCustomizationProps {
  onFooterChange: (footer: string) => void;
  footerText: string;
}

export const FooterCustomization = ({ onFooterChange, footerText }: FooterCustomizationProps) => {
  return (
    <Card className="border-gray-100 bg-gradient-to-br from-gray-50/50 to-slate-50/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-4 h-4 text-gray-600" />
          <Label className="text-sm font-medium text-gray-900">Custom Footer Text</Label>
        </div>
        <Input
          placeholder="e.g., Confidential - ABC Legal Services"
          value={footerText}
          onChange={(e) => onFooterChange(e.target.value)}
          className="bg-white"
        />
        <p className="text-xs text-gray-500 mt-1">
          This text will appear at the bottom of every page in your contract
        </p>
      </CardContent>
    </Card>
  );
};
