
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, DollarSign, FileText, Users, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface ProfessionalRentalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onContractGenerate: (contractData: any) => void;
}

export const ProfessionalRentalForm = ({ isOpen, onClose, onContractGenerate }: ProfessionalRentalFormProps) => {
  const { toast } = useToast();
  
  console.log('ProfessionalRentalForm rendering - isOpen:', isOpen);
  
  const [formData, setFormData] = useState({
    // Parties Involved
    landlordName: '',
    landlordEmail: '',
    landlordPhone: '',
    tenantName: '',
    tenantEmail: '',
    tenantPhone: '',
    
    // Property Details
    propertyAddress: '',
    unitNumber: '',
    leaseStartDate: '',
    leaseEndDate: '',
    monthlyRent: '',
    securityDeposit: '',
    rentDueDate: '1',
    
    // Utilities & Charges
    waterPaidBy: 'tenant',
    electricityPaidBy: 'tenant',
    gasPaidBy: 'tenant',
    internetPaidBy: 'tenant',
    parkingCharges: '',
    storageCharges: '',
    lateFeeAmount: '',
    
    // Terms & Conditions
    leaseType: 'fixed',
    petPolicy: false,
    maintenanceResponsibilities: '',
    moveOutNotice: '30',
    governingLaw: '',
    
    // Landlord Info
    landlordLogo: ''
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const required = [
      'landlordName', 'tenantName', 'propertyAddress', 
      'leaseStartDate', 'leaseEndDate', 'monthlyRent', 'securityDeposit'
    ];
    
    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const contractData = {
      contractType: 'professionalRental',
      template: 'professional',
      ...formData,
      organizationData: {
        name: formData.landlordName,
        email: formData.landlordEmail,
        phone: formData.landlordPhone,
        logo: formData.landlordLogo,
        address: formData.propertyAddress
      }
    };

    console.log('Generating contract with data:', contractData);
    onContractGenerate(contractData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="w-6 h-6 text-blue-600" />
            Professional Rental Agreement Builder
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Parties Involved */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="w-5 h-5 text-blue-600" />
                Parties Involved
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">Landlord Information</h4>
                  <div>
                    <Label htmlFor="landlordName">Landlord Name *</Label>
                    <Input
                      id="landlordName"
                      value={formData.landlordName}
                      onChange={(e) => handleInputChange('landlordName', e.target.value)}
                      placeholder="Enter landlord full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="landlordEmail">Email</Label>
                    <Input
                      id="landlordEmail"
                      type="email"
                      value={formData.landlordEmail}
                      onChange={(e) => handleInputChange('landlordEmail', e.target.value)}
                      placeholder="landlord@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="landlordPhone">Phone</Label>
                    <Input
                      id="landlordPhone"
                      value={formData.landlordPhone}
                      onChange={(e) => handleInputChange('landlordPhone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700">Tenant Information</h4>
                  <div>
                    <Label htmlFor="tenantName">Tenant Name *</Label>
                    <Input
                      id="tenantName"
                      value={formData.tenantName}
                      onChange={(e) => handleInputChange('tenantName', e.target.value)}
                      placeholder="Enter tenant full name"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="tenantEmail">Email</Label>
                    <Input
                      id="tenantEmail"
                      type="email"
                      value={formData.tenantEmail}
                      onChange={(e) => handleInputChange('tenantEmail', e.target.value)}
                      placeholder="tenant@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tenantPhone">Phone</Label>
                    <Input
                      id="tenantPhone"
                      value={formData.tenantPhone}
                      onChange={(e) => handleInputChange('tenantPhone', e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MapPin className="w-5 h-5 text-green-600" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="propertyAddress">Property Address *</Label>
                  <Input
                    id="propertyAddress"
                    value={formData.propertyAddress}
                    onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                    placeholder="123 Main Street, City, State 12345"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="unitNumber">Unit Number (Optional)</Label>
                  <Input
                    id="unitNumber"
                    value={formData.unitNumber}
                    onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                    placeholder="Apt 2B, Unit 5, etc."
                  />
                </div>
                <div>
                  <Label htmlFor="rentDueDate">Rent Due Date</Label>
                  <Select value={formData.rentDueDate} onValueChange={(value) => handleInputChange('rentDueDate', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 31 }, (_, i) => (
                        <SelectItem key={i + 1} value={String(i + 1)}>
                          {i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} of each month
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="leaseStartDate">Lease Start Date *</Label>
                  <Input
                    id="leaseStartDate"
                    type="date"
                    value={formData.leaseStartDate}
                    onChange={(e) => handleInputChange('leaseStartDate', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="leaseEndDate">Lease End Date *</Label>
                  <Input
                    id="leaseEndDate"
                    type="date"
                    value={formData.leaseEndDate}
                    onChange={(e) => handleInputChange('leaseEndDate', e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Terms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
                Financial Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="monthlyRent">Monthly Rent ($) *</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    placeholder="2000"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="securityDeposit">Security Deposit ($) *</Label>
                  <Input
                    id="securityDeposit"
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                    placeholder="2000"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Generate Professional Contract
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
