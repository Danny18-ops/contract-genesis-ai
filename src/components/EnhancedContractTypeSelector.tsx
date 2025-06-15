
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ContractTypeIcon } from './ContractTypeIcon';
import { ProfessionalRentalForm } from './ProfessionalRentalForm';

interface EnhancedContractTypeSelectorProps {
  onContractTypeChange: (type: string) => void;
  selectedType: string;
  onContractGenerate?: (contractData: any) => void;
}

export const EnhancedContractTypeSelector = ({ 
  onContractTypeChange, 
  selectedType,
  onContractGenerate 
}: EnhancedContractTypeSelectorProps) => {
  const [showProfessionalRental, setShowProfessionalRental] = useState(false);

  const contractTypes = [
    {
      id: 'rental',
      title: 'Rental Agreement',
      description: 'Lease agreements for residential properties',
      badge: 'Popular',
      badgeColor: 'default' as const
    },
    {
      id: 'jobOffer',
      title: 'Job Offer Letter',
      description: 'Employment contracts with salary and benefits',
      badge: 'Professional',
      badgeColor: 'secondary' as const
    },
    {
      id: 'business',
      title: 'Business Contract',
      description: 'Service agreements and business partnerships',
      badge: 'Enterprise',
      badgeColor: 'outline' as const
    },
    {
      id: 'carRental',
      title: 'Car Rental Agreement',
      description: 'Vehicle rental terms and conditions',
      badge: 'Travel',
      badgeColor: 'destructive' as const
    }
  ];

  const handleCardClick = (contractType: string) => {
    onContractTypeChange(contractType);
  };

  const handleProfessionalContractGenerate = (contractData: any) => {
    if (onContractGenerate) {
      onContractGenerate(contractData);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Choose Your Contract Type</h3>
        <p className="text-gray-600 text-sm">Select the type of contract you want to create</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contractTypes.map((contract) => (
          <Card 
            key={contract.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
              selectedType === contract.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleCardClick(contract.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <ContractTypeIcon type={contract.id} className="w-8 h-8" />
                  <div>
                    <CardTitle className="text-base">{contract.title}</CardTitle>
                    <Badge variant={contract.badgeColor} className="mt-1">
                      {contract.badge}
                    </Badge>
                  </div>
                </div>
                {selectedType === contract.id && (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {contract.description}
              </CardDescription>
              
              {/* Professional Contract Button for Rental */}
              {contract.id === 'rental' && selectedType === 'rental' && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowProfessionalRental(true);
                    }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                    size="sm"
                  >
                    Create Professional Contract
                  </Button>
                  <p className="text-xs text-gray-500 mt-1 text-center">
                    Full-featured lease agreement builder
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Professional Rental Form Dialog */}
      <ProfessionalRentalForm
        isOpen={showProfessionalRental}
        onClose={() => setShowProfessionalRental(false)}
        onContractGenerate={handleProfessionalContractGenerate}
      />
    </div>
  );
};
