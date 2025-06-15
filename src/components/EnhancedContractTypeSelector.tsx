
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
    console.log('Card clicked for contract type:', contractType);
    onContractTypeChange(contractType);
  };

  const handleProfessionalContractGenerate = (contractData: any) => {
    console.log('Professional contract data received:', contractData);
    if (onContractGenerate) {
      onContractGenerate(contractData);
    }
    setShowProfessionalRental(false);
  };

  const handleCloseForm = () => {
    console.log('Closing professional rental form');
    setShowProfessionalRental(false);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="px-2">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">Choose Your Contract Type</h3>
        <p className="text-gray-600 text-sm">Select the type of contract you want to create</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 px-2">
        {contractTypes.map((contract) => (
          <Card 
            key={contract.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 w-full ${
              selectedType === contract.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleCardClick(contract.id)}
          >
            <CardHeader className="pb-3 p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                  <ContractTypeIcon contractType={contract.id} className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-sm sm:text-base truncate">{contract.title}</CardTitle>
                    <Badge variant={contract.badgeColor} className="mt-1 text-xs">
                      {contract.badge}
                    </Badge>
                  </div>
                </div>
                {selectedType === contract.id && (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 ml-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white"></div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <CardDescription className="text-xs sm:text-sm">
                {contract.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Professional Rental Form Dialog */}
      <ProfessionalRentalForm
        isOpen={showProfessionalRental}
        onClose={handleCloseForm}
        onContractGenerate={handleProfessionalContractGenerate}
      />
    </div>
  );
};
