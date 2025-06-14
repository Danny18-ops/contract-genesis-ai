
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ContractTypeIcon, getContractTypeGradient, getContractTypeImage } from './ContractTypeIcon';

interface EnhancedContractTypeSelectorProps {
  onContractTypeChange: (type: string) => void;
  selectedType: string;
}

export const EnhancedContractTypeSelector = ({ onContractTypeChange, selectedType }: EnhancedContractTypeSelectorProps) => {
  return (
    <Card className="border-blue-100 bg-blue-50/30 overflow-hidden">
      <CardContent className="p-0">
        {selectedType && (
          <div className="h-32 relative overflow-hidden">
            <img
              src={getContractTypeImage(selectedType)}
              alt={`${selectedType} contract`}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${getContractTypeGradient(selectedType)} opacity-75`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <ContractTypeIcon contractType={selectedType} className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold text-lg capitalize">{selectedType.replace(/([A-Z])/g, ' $1')} Contract</h3>
              </div>
            </div>
          </div>
        )}
        <div className="p-4">
          <Label className="text-base font-semibold text-gray-900 mb-3 block">
            Contract Type *
          </Label>
          <Select value={selectedType} onValueChange={onContractTypeChange}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select contract type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rental">🏠 Rental Agreement</SelectItem>
              <SelectItem value="jobOffer">💼 Job Offer Letter</SelectItem>
              <SelectItem value="business">🤝 Business Agreement</SelectItem>
              <SelectItem value="carRental">🚗 Car Rental Contract</SelectItem>
              <SelectItem value="storage">📦 Storage Container Lease</SelectItem>
              <SelectItem value="nda">🛡️ Non-Disclosure Agreement (NDA)</SelectItem>
              <SelectItem value="freelance">👤 Freelance/Service Agreement</SelectItem>
              <SelectItem value="employment">💼 Employment Contract</SelectItem>
              <SelectItem value="partnership">👥 Partnership Agreement</SelectItem>
              <SelectItem value="consulting">🏆 Consulting Agreement</SelectItem>
              <SelectItem value="license">📄 License Agreement</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
