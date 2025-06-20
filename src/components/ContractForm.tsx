import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Organization } from '@/types';
import { useOrganization } from '@/hooks/use-organization';
import { TemplateSelector } from './TemplateSelector';
import { Languages } from '@/constants';
import { validateOrganizationData, validateNameField, validateContractDuration } from '@/utils/validation';
import { EnhancedContractTypeSelector } from './EnhancedContractTypeSelector';
import { FormAutomation } from './FormAutomation';

interface ContractFormProps {
  onContractGenerate: (contractData: any) => void;
  isGenerating: boolean;
}

export const ContractForm = ({ onContractGenerate, isGenerating }: ContractFormProps) => {
  const [contractType, setContractType] = useState<string>('');
  const [dynamicFields, setDynamicFields] = useState<{ [key: string]: string }>({});
  const [language, setLanguage] = useState<string>('en');
  const [template, setTemplate] = useState<string>('modern');
  const [footerText, setFooterText] = useState<string>('Generated by GenContract AI');
  const [savedOrgData, setSavedOrgData] = useState<Organization | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showDateValidationDialog, setShowDateValidationDialog] = useState(false);
  const [addressValid, setAddressValid] = useState(true);
  const { organization, saveOrganization, clearOrganization } = useOrganization();
  const { toast } = useToast();

  const [organizationData, setOrganizationData] = useState<Organization>({
    name: '',
    address: '',
    email: '',
    phone: '',
    logo: '',
  });

  useEffect(() => {
    if (organization) {
      setOrganizationData(organization);
      setSavedOrgData(organization);
    }
  }, [organization]);

  const handleAutoFill = (data: any) => {
    setContractType(data.contractType);
    setOrganizationData({
      name: data.party1Name || '',
      address: data.party1Address || '',
      email: data.party1Email || '',
      phone: '',
      logo: ''
    });
    
    const newDynamicFields: { [key: string]: string } = {};
    Object.keys(data).forEach(key => {
      if (key !== 'contractType' && !key.startsWith('party1')) {
        newDynamicFields[key] = data[key];
      }
    });
    
    setDynamicFields(newDynamicFields);
    
    toast({
      title: "Sample Data Loaded",
      description: "The form has been filled with sample data for testing purposes.",
    });
  };

  const handleDynamicFieldChange = (field: string, value: string) => {
    // Validate name fields to only allow letters and spaces
    if ((field === 'tenant' || field === 'candidate' || field === 'party2' || field === 'renter') && value) {
      if (!validateNameField(value)) {
        toast({
          title: "Invalid Input",
          description: "Names should only contain letters and spaces",
          variant: "destructive"
        });
        return;
      }
    }
    
    setDynamicFields(prev => ({ ...prev, [field]: value }));
  };

  const handleOrgDataChange = (field: keyof Organization, value: string) => {
    // Validate name field
    if (field === 'name' && value && !validateNameField(value)) {
      toast({
        title: "Invalid Input",
        description: "Organization name should only contain letters and spaces",
        variant: "destructive"
      });
      return;
    }
    // Validate phone number format
    if (field === 'phone' && value && !/^\d*$/.test(value)) {
      toast({
        title: "Invalid Input",
        description: "Phone number should only contain digits",
        variant: "destructive"
      });
      return;
    }
    // Validate address contains 'USA' (case-insensitive)
    if (field === 'address') {
      const isUSA = /usa/i.test(value);
      setAddressValid(isUSA || value.trim() === "");
      if (!isUSA && value.trim() !== "") {
        toast({
          title: "Invalid Address",
          description: "For security, the entered address must be in the USA.",
          variant: "destructive"
        });
      }
    }
    setOrganizationData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveOrgInfo = async () => {
    try {
      await saveOrganization(organizationData);
      toast({
        title: "Organization Info Saved",
        description: "Your organization information has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save organization information.",
        variant: "destructive"
      });
    }
  };

  const handleClearOrgInfo = async () => {
    try {
      await clearOrganization();
      setOrganizationData({ name: '', address: '', email: '', phone: '', logo: '' });
      setSavedOrgData(null);
      toast({
        title: "Organization Info Cleared",
        description: "Your organization information has been cleared.",
      });
    } catch (error) {
      toast({
        title: "Clear Failed",
        description: "Failed to clear organization information.",
        variant: "destructive"
      });
    }
  };

  const validateRentalDates = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return true;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    
    return diffMonths >= 6;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: string[] = [];
    
    if (!contractType) {
      errors.push("Please select a contract type");
    }

    // Validate organization data
    const orgValidation = validateOrganizationData(organizationData);
    if (!orgValidation.isValid) {
      errors.push(...orgValidation.errors);
    }

    // Validate dynamic fields based on contract type
    if (contractType === 'rental') {
      if (!dynamicFields.tenant) {
        errors.push("Tenant name is required");
      }
      if (!dynamicFields.propertyAddress) {
        errors.push("Property address is required");
      }
      if (!dynamicFields.monthlyRent) {
        errors.push("Monthly rent amount is required");
      }
      if (!dynamicFields.securityDeposit) {
        errors.push("Security deposit amount is required");
      }
      
      // Check 6-month minimum for rental contracts
      if (dynamicFields.startDate && dynamicFields.endDate) {
        if (!validateRentalDates(dynamicFields.startDate, dynamicFields.endDate)) {
          setShowDateValidationDialog(true);
          return;
        }
      }
    }
    
    if (contractType === 'jobOffer' && !dynamicFields.candidate) {
      errors.push("Candidate name is required");
    }
    if (contractType === 'business' && !dynamicFields.party2) {
      errors.push("Second party name is required");
    }
    if (contractType === 'carRental' && !dynamicFields.renter) {
      errors.push("Renter name is required");
    }

    // Validate contract dates if present (for non-rental contracts)
    if (contractType !== 'rental' && dynamicFields.startDate && dynamicFields.endDate) {
      if (!validateContractDuration(dynamicFields.startDate, dynamicFields.endDate)) {
        errors.push("End date must be after start date");
      }
    }

    // Check address validity
    if (!organizationData.address || !/usa/i.test(organizationData.address)) {
      errors.push("Organization address must be in the USA.");
      setAddressValid(false);
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      toast({
        title: "Validation Failed",
        description: "Please fix the errors below and try again",
        variant: "destructive"
      });
      return;
    }

    setValidationErrors([]);
    
    const contractData = {
      contractType,
      organizationData,
      dynamicFields,
      language,
      template,
      footerText,
      reusedOrgInfo: !!savedOrgData
    };

    console.log('Contract data being sent:', contractData);
    onContractGenerate(contractData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quick Start Templates */}
        <FormAutomation onAutoFill={handleAutoFill} />

        {/* Validation Errors Display */}
        {validationErrors.length > 0 && (
          <Alert variant="destructive">
            <AlertDescription>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Enhanced Contract Type Selector */}
        <EnhancedContractTypeSelector 
          onContractTypeChange={setContractType}
          selectedType={contractType}
          onContractGenerate={onContractGenerate}
        />

        {/* Dynamic Fields - based on contract type */}
        {contractType === 'rental' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="tenant" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Tenant Name *
              </Label>
              <Input
                type="text"
                id="tenant"
                placeholder="Enter tenant name (letters only)"
                value={dynamicFields.tenant || ''}
                onChange={(e) => handleDynamicFieldChange('tenant', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="propertyAddress" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Property Address *
              </Label>
              <Input
                type="text"
                id="propertyAddress"
                placeholder="Enter property address"
                value={dynamicFields.propertyAddress || ''}
                onChange={(e) => handleDynamicFieldChange('propertyAddress', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="monthlyRent" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Monthly Rent Amount ($) *
              </Label>
              <Input
                type="number"
                id="monthlyRent"
                placeholder="Enter monthly rent amount"
                value={dynamicFields.monthlyRent || ''}
                onChange={(e) => handleDynamicFieldChange('monthlyRent', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="securityDeposit" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Security Deposit ($) *
              </Label>
              <Input
                type="number"
                id="securityDeposit"
                placeholder="Enter security deposit amount"
                value={dynamicFields.securityDeposit || ''}
                onChange={(e) => handleDynamicFieldChange('securityDeposit', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Contract Start Date
              </Label>
              <Input
                type="date"
                id="startDate"
                value={dynamicFields.startDate || ''}
                onChange={(e) => handleDynamicFieldChange('startDate', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Contract End Date
              </Label>
              <Input
                type="date"
                id="endDate"
                value={dynamicFields.endDate || ''}
                onChange={(e) => handleDynamicFieldChange('endDate', e.target.value)}
              />
            </div>
          </div>
        )}

        {contractType === 'jobOffer' && (
          <div className="space-y-2">
            <Label htmlFor="candidate" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              Candidate Name *
            </Label>
            <Input
              type="text"
              id="candidate"
              placeholder="Enter candidate name (letters only)"
              value={dynamicFields.candidate || ''}
              onChange={(e) => handleDynamicFieldChange('candidate', e.target.value)}
            />
          </div>
        )}

        {contractType === 'business' && (
          <div className="space-y-2">
            <Label htmlFor="party2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              Second Party Name *
            </Label>
            <Input
              type="text"
              id="party2"
              placeholder="Enter second party name (letters only)"
              value={dynamicFields.party2 || ''}
              onChange={(e) => handleDynamicFieldChange('party2', e.target.value)}
            />
          </div>
        )}

        {contractType === 'carRental' && (
          <div className="space-y-2">
            <Label htmlFor="renter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
              Renter Name *
            </Label>
            <Input
              type="text"
              id="renter"
              placeholder="Enter renter name (letters only)"
              value={dynamicFields.renter || ''}
              onChange={(e) => handleDynamicFieldChange('renter', e.target.value)}
            />
          </div>
        )}

        {/* Universal Contract Fields */}
        {contractType && (
          <div className="space-y-4 border rounded-md p-4 bg-gray-50">
            <h4 className="text-sm font-semibold mb-3">Contract Details</h4>
            
            {/* Scope of Work */}
            <div>
              <Label htmlFor="scopeOfWork" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Scope of Work
              </Label>
              <Textarea
                id="scopeOfWork"
                placeholder="Describe in detail the work, services, or subject matter of this contract. Include specific responsibilities, expectations, and requirements..."
                rows={4}
                value={dynamicFields.scopeOfWork || ''}
                onChange={(e) => handleDynamicFieldChange('scopeOfWork', e.target.value)}
              />
            </div>

            {/* Deliverables & Milestones */}
            <div>
              <Label htmlFor="deliverables" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Deliverables & Milestones
              </Label>
              <Textarea
                id="deliverables"
                placeholder="List specific deliverables, milestones, deadlines, and performance metrics..."
                rows={3}
                value={dynamicFields.deliverables || ''}
                onChange={(e) => handleDynamicFieldChange('deliverables', e.target.value)}
              />
            </div>

            {/* Governing Jurisdiction */}
            <div>
              <Label htmlFor="jurisdiction" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Governing Jurisdiction
              </Label>
              <Input
                type="text"
                id="jurisdiction"
                placeholder="e.g., State of California, USA"
                value={dynamicFields.jurisdiction || ''}
                onChange={(e) => handleDynamicFieldChange('jurisdiction', e.target.value)}
              />
            </div>

            {/* Termination Conditions */}
            <div>
              <Label htmlFor="terminationConditions" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Termination Conditions
              </Label>
              <Textarea
                id="terminationConditions"
                placeholder="Specify conditions under which this contract can be terminated..."
                rows={3}
                value={dynamicFields.terminationConditions || ''}
                onChange={(e) => handleDynamicFieldChange('terminationConditions', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Organization Information */}
        <div className="border rounded-md p-4 bg-gray-50">
          <h4 className="text-sm font-semibold mb-3">Organization Information</h4>
          <div className="space-y-3">
            <div>
              <Label htmlFor="orgName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Organization Name *
              </Label>
              <Input
                type="text"
                id="orgName"
                placeholder="Enter organization name (letters only)"
                value={organizationData.name}
                onChange={(e) => handleOrgDataChange('name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="orgAddress" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Address <span className="text-red-600">*</span>
              </Label>
              <Input
                type="text"
                id="orgAddress"
                placeholder="Enter address (must be USA)"
                value={organizationData.address}
                onChange={(e) => handleOrgDataChange('address', e.target.value)}
                className={!addressValid ? 'border-red-500' : ''}
              />
              {/* Warning if address isn't US based */}
              {!addressValid && organizationData.address && (
                <div className="mt-2 text-xs text-red-600 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-.011-.011L12 15m0-12a9 9 0 110 18 9 9 0 010-18zm0 5v4" /></svg>
                  For security, the entered address must be in the USA.
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="orgEmail" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Email
              </Label>
              <Input
                type="email"
                id="orgEmail"
                placeholder="Enter email"
                value={organizationData.email}
                onChange={(e) => handleOrgDataChange('email', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="orgPhone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Phone (10 digits)
              </Label>
              <Input
                type="tel"
                id="orgPhone"
                placeholder="Enter 10-digit phone number"
                maxLength={10}
                value={organizationData.phone}
                onChange={(e) => handleOrgDataChange('phone', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="orgLogo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Logo URL
              </Label>
              <Input
                type="url"
                id="orgLogo"
                placeholder="Enter logo URL"
                value={organizationData.logo}
                onChange={(e) => handleOrgDataChange('logo', e.target.value)}
              />
              {organizationData.logo && (
                <div className="mt-2">
                  <img 
                    src={organizationData.logo} 
                    alt="Organization Logo" 
                    className="max-w-24 max-h-16 object-contain border rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            {savedOrgData ? (
              <Button type="button" variant="destructive" size="sm" onClick={handleClearOrgInfo}>
                Clear Info
              </Button>
            ) : (
              <Button type="button" variant="secondary" size="sm" onClick={handleSaveOrgInfo}>
                Save Info
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <Label htmlFor="reuseOrgInfo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                Reuse Info
              </Label>
              <Switch id="reuseOrgInfo" checked={!!savedOrgData} disabled />
            </div>
          </div>
        </div>

        {/* Language Selection */}
        <div>
          <Label htmlFor="language" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Contract Language *
          </Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {Languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-600 mt-1">
            The entire contract will be generated in the selected language
          </p>
        </div>

        {/* Template Selection */}
        <div>
          <TemplateSelector onTemplateChange={setTemplate} selectedTemplate={template} />
        </div>

        {/* Footer Text */}
        <div>
          <Label htmlFor="footerText" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
            Footer Text
          </Label>
          <Textarea
            id="footerText"
            placeholder="Enter footer text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
          />
        </div>

        {/* Submit Button - only change the button text */}
        <Button disabled={isGenerating} className="w-full bg-blue-500 hover:bg-blue-700 text-white font-semibold py-3 rounded">
          {isGenerating ? 'Generating Contract...' : 'Let\'s Make It Official 📝'}
        </Button>
      </form>

      {/* Date Validation Dialog */}
      <Dialog open={showDateValidationDialog} onOpenChange={setShowDateValidationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invalid Lease Duration</DialogTitle>
            <DialogDescription>
              For rental agreements, the lease duration must be at least 6 months. Please adjust your start and end dates to meet this requirement.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => setShowDateValidationDialog(false)}>
            Understood
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
