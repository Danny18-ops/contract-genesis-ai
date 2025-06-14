
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
  selectedLanguage: string;
}

export const LanguageSelector = ({ onLanguageChange, selectedLanguage }: LanguageSelectorProps) => {
  return (
    <Card className="border-green-100 bg-gradient-to-br from-green-50/50 to-emerald-50/50">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-green-600" />
          <Label className="text-sm font-medium text-green-900">Contract Language</Label>
        </div>
        <Select value={selectedLanguage} onValueChange={onLanguageChange}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Select contract language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">🇺🇸 English</SelectItem>
            <SelectItem value="hindi">🇮🇳 Hindi (हिंदी)</SelectItem>
            <SelectItem value="spanish">🇪🇸 Spanish (Español)</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
