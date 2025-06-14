
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateDetailedContract } from '@/utils/contractGenerator';
import { FormAutomation } from './FormAutomation';
import { OrganizationInfo } from './OrganizationInfo';
import { LanguageSelector } from './LanguageSelector';
import { TemplateSelector } from './TemplateSelector';
import { EnhancedContractTypeSelector } from './EnhancedContractTypeSelector';
import { FooterCustomization } from './FooterCustomization';

interface ContractFormProps {
  onGenerate: (contract: string) => void;
  onGenerating: (generating: boolean) => void;
  onContractData: (data: any) => void;
  isGenerating: boolean;
}

interface OrganizationData {
  name: string;
  address: string;
  email: string;
  phone: string;
  logo: string | null;
}

export const ContractForm = ({ onGenerate, onGenerating, onContractData, isGenerating }: ContractFormProps) => {
  const [contractType, setContractType] = useState('');
  const [language, setLanguage] = useState('english');
  const [template, setTemplate] = useState('modern');
  const [footerText, setFooterText] = useState('');
  const [organizationData, setOrganizationData] = useState<OrganizationData>({
    name: '',
    address: '',
    email: '',
    phone: '',
    logo: null
  });

  // Dynamic form fields based on contract type
  const [dynamicFields, setDynamicFields] = useState<{ [key: string]: string }>({});

  const { toast } = useToast();

  const getFieldsForContractType = (type: string): { [key: string]: string } => {
    const fieldMaps: { [key: string]: { [key: string]: string } } = {
      rental: {
        tenant: 'Tenant/Renter Name',
        landlord: 'Landlord/Property Owner',
        propertyAddress: 'Rental Property Address',
        monthlyRent: 'Monthly Rent Amount',
        securityDeposit: 'Security Deposit',
        leaseStartDate: 'Lease Start Date',
        leaseEndDate: 'Lease End Date',
        leaseTerm: 'Lease Duration'
      },
      jobOffer: {
        candidate: 'Candidate Name',
        position: 'Job Position/Title',
        department: 'Department',
        startDate: 'Employment Start Date',
        salary: 'Annual Salary',
        benefits: 'Benefits Package',
        reportingManager: 'Reporting Manager'
      },
      business: {
        party1: 'First Business Party',
        party2: 'Second Business Party',
        businessPurpose: 'Business Purpose/Objective',
        agreementValue: 'Total Agreement Value',
        deliverables: 'Key Deliverables',
        timeline: 'Project Timeline'
      },
      carRental: {
        renter: 'Car Renter Name',
        driverLicense: 'Driver License Number',
        vehicleDetails: 'Vehicle Make/Model/Year',
        rentalPeriod: 'Rental Period',
        dailyRate: 'Daily Rental Rate',
        mileageLimit: 'Mileage Limit',
        pickupLocation: 'Pickup Location'
      },
      storage: {
        tenant: 'Storage Tenant Name',
        unitNumber: 'Storage Unit Number',
        unitSize: 'Unit Size/Dimensions',
        monthlyFee: 'Monthly Storage Fee',
        accessHours: 'Access Hours',
        storageLocation: 'Storage Facility Address',
        rentalDuration: 'Rental Duration'
      }
    };

    return fieldMaps[type] || {};
  };

  const handleContractTypeChange = (type: string) => {
    setContractType(type);
    const fields = getFieldsForContractType(type);
    const resetFields: { [key: string]: string } = {};
    Object.keys(fields).forEach(key => {
      resetFields[key] = '';
    });
    setDynamicFields(resetFields);
  };

  const handleDynamicFieldChange = (field: string, value: string) => {
    setDynamicFields(prev => ({ ...prev, [field]: value }));
  };

  const handleAutoFill = (data: any) => {
    // Handle auto-fill for dynamic fields based on contract type
    const fields = getFieldsForContractType(contractType);
    const autoFilledFields: { [key: string]: string } = {};
    
    // Map sample data to dynamic fields
    if (contractType === 'rental') {
      autoFilledFields.tenant = 'John Smith';
      autoFilledFields.landlord = organizationData.name || 'Property Management LLC';
      autoFilledFields.propertyAddress = '123 Main Street, Apt 2B, Cityville, ST 12345';
      autoFilledFields.monthlyRent = '1500';
      autoFilledFields.securityDeposit = '2250';
      autoFilledFields.leaseStartDate = '2024-01-01';
      autoFilledFields.leaseEndDate = '2024-12-31';
      autoFilledFields.leaseTerm = '12 months';
    }
    
    setDynamicFields(autoFilledFields);
    toast({
      title: "Form Auto-filled!",
      description: "Sample data has been loaded for the selected contract type.",
    });
  };

  const generateContract = async () => {
    if (!contractType || !organizationData.name) {
      toast({
        title: "Missing Information",
        description: "Please fill in the contract type and organization name.",
        variant: "destructive"
      });
      return;
    }

    onGenerating(true);
    
    const contractData = {
      contractType,
      language,
      template,
      footerText,
      organizationData,
      dynamicFields,
      ...dynamicFields
    };
    
    onContractData(contractData);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const contract = generateDetailedContract(contractData);
      onGenerate(contract);
      
      toast({
        title: "Contract Generated!",
        description: "Your professional contract has been successfully generated.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive"
      });
    } finally {
      onGenerating(false);
    }
  };

  const fields = getFieldsForContractType(contractType);

  return (
    <div className="space-y-6">
      {/* Organization Information */}
      <OrganizationInfo
        onOrganizationChange={setOrganizationData}
        initialData={organizationData}
      />

      {/* Contract Configuration */}
      <div className="grid md:grid-cols-2 gap-4">
        <LanguageSelector
          onLanguageChange={setLanguage}
          selectedLanguage={language}
        />
        <FooterCustomization
          onFooterChange={setFooterText}
          footerText={footerText}
        />
      </div>

      {/* Template Selection */}
      <TemplateSelector
        onTemplateChange={setTemplate}
        selectedTemplate={template}
      />

      {/* Automation Section */}
      <FormAutomation onAutoFill={handleAutoFill} />

      {/* Contract Type Selection */}
      <EnhancedContractTypeSelector
        onContractTypeChange={handleContractTypeChange}
        selectedType={contractType}
      />

      {/* Dynamic Fields Based on Contract Type */}
      {contractType && Object.keys(fields).length > 0 && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <Label className="font-semibold text-gray-900 mb-3 block">
              {contractType.charAt(0).toUpperCase() + contractType.slice(1)} Details
            </Label>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(fields).map(([key, label]) => {
                const labelString = String(label);
                return (
                  <div key={key}>
                    <Label className="text-sm text-gray-600 mb-1 block">{labelString}</Label>
                    {key.includes('Date') ? (
                      <Input
                        type="date"
                        value={dynamicFields[key] || ''}
                        onChange={(e) => handleDynamicFieldChange(key, e.target.value)}
                        className="bg-white"
                      />
                    ) : key.includes('Purpose') || key.includes('deliverables') || key.includes('benefits') ? (
                      <Textarea
                        placeholder={`Enter ${labelString.toLowerCase()}...`}
                        value={dynamicFields[key] || ''}
                        onChange={(e) => handleDynamicFieldChange(key, e.target.value)}
                        className="bg-white min-h-[80px]"
                      />
                    ) : (
                      <Input
                        placeholder={`Enter ${labelString.toLowerCase()}...`}
                        value={dynamicFields[key] || ''}
                        onChange={(e) => handleDynamicFieldChange(key, e.target.value)}
                        className="bg-white"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <Button 
        onClick={generateContract}
        disabled={isGenerating}
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 text-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating Professional Contract...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Professional Contract
          </>
        )}
      </Button>
    </div>
  );
};
