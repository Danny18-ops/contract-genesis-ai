
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
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
            Professional Rental Agreement Builder
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 py-4">
            {/* Parties Involved */}
            <Card>
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  Parties Involved
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Landlord Information</h4>
                    <div>
                      <Label htmlFor="landlordName" className="text-sm">Landlord Name *</Label>
                      <Input
                        id="landlordName"
                        value={formData.landlordName}
                        onChange={(e) => handleInputChange('landlordName', e.target.value)}
                        placeholder="Enter landlord full name"
                        required
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="landlordEmail" className="text-sm">Email</Label>
                      <Input
                        id="landlordEmail"
                        type="email"
                        value={formData.landlordEmail}
                        onChange={(e) => handleInputChange('landlordEmail', e.target.value)}
                        placeholder="landlord@example.com"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="landlordPhone" className="text-sm">Phone</Label>
                      <Input
                        id="landlordPhone"
                        value={formData.landlordPhone}
                        onChange={(e) => handleInputChange('landlordPhone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className="text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-700 text-sm sm:text-base">Tenant Information</h4>
                    <div>
                      <Label htmlFor="tenantName" className="text-sm">Tenant Name *</Label>
                      <Input
                        id="tenantName"
                        value={formData.tenantName}
                        onChange={(e) => handleInputChange('tenantName', e.target.value)}
                        placeholder="Enter tenant full name"
                        required
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tenantEmail" className="text-sm">Email</Label>
                      <Input
                        id="tenantEmail"
                        type="email"
                        value={formData.tenantEmail}
                        onChange={(e) => handleInputChange('tenantEmail', e.target.value)}
                        placeholder="tenant@example.com"
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tenantPhone" className="text-sm">Phone</Label>
                      <Input
                        id="tenantPhone"
                        value={formData.tenantPhone}
                        onChange={(e) => handleInputChange('tenantPhone', e.target.value)}
                        placeholder="(555) 123-4567"
                        className="text-sm"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Label htmlFor="propertyAddress" className="text-sm">Property Address *</Label>
                    <Input
                      id="propertyAddress"
                      value={formData.propertyAddress}
                      onChange={(e) => handleInputChange('propertyAddress', e.target.value)}
                      placeholder="123 Main Street, City, State 12345"
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitNumber" className="text-sm">Unit Number (Optional)</Label>
                    <Input
                      id="unitNumber"
                      value={formData.unitNumber}
                      onChange={(e) => handleInputChange('unitNumber', e.target.value)}
                      placeholder="Apt 2B, Unit 5, etc."
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="rentDueDate" className="text-sm">Rent Due Date</Label>
                    <Select value={formData.rentDueDate} onValueChange={(value) => handleInputChange('rentDueDate', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-48 overflow-y-auto">
                        {Array.from({ length: 31 }, (_, i) => (
                          <SelectItem key={i + 1} value={String(i + 1)} className="text-sm">
                            {i + 1}{i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'} of each month
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="leaseStartDate" className="text-sm">Lease Start Date *</Label>
                    <Input
                      id="leaseStartDate"
                      type="date"
                      value={formData.leaseStartDate}
                      onChange={(e) => handleInputChange('leaseStartDate', e.target.value)}
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leaseEndDate" className="text-sm">Lease End Date *</Label>
                    <Input
                      id="leaseEndDate"
                      type="date"
                      value={formData.leaseEndDate}
                      onChange={(e) => handleInputChange('leaseEndDate', e.target.value)}
                      required
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Terms */}
            <Card>
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                  Financial Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="monthlyRent" className="text-sm">Monthly Rent ($) *</Label>
                    <Input
                      id="monthlyRent"
                      type="number"
                      value={formData.monthlyRent}
                      onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                      placeholder="2000"
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="securityDeposit" className="text-sm">Security Deposit ($) *</Label>
                    <Input
                      id="securityDeposit"
                      type="number"
                      value={formData.securityDeposit}
                      onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                      placeholder="2000"
                      required
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lateFeeAmount" className="text-sm">Late Fee Amount ($)</Label>
                    <Input
                      id="lateFeeAmount"
                      type="number"
                      value={formData.lateFeeAmount}
                      onChange={(e) => handleInputChange('lateFeeAmount', e.target.value)}
                      placeholder="50"
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Utilities & Additional Charges */}
            <Card>
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                  Utilities & Additional Charges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { field: 'waterPaidBy', label: 'Water' },
                    { field: 'electricityPaidBy', label: 'Electricity' },
                    { field: 'gasPaidBy', label: 'Gas' },
                    { field: 'internetPaidBy', label: 'Internet' }
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <Label className="text-sm">{label} paid by:</Label>
                      <Select 
                        value={formData[field as keyof typeof formData] as string} 
                        onValueChange={(value) => handleInputChange(field, value)}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tenant" className="text-sm">Tenant</SelectItem>
                          <SelectItem value="landlord" className="text-sm">Landlord</SelectItem>
                          <SelectItem value="shared" className="text-sm">Shared</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <Label htmlFor="parkingCharges" className="text-sm">Parking Charges ($)</Label>
                    <Input
                      id="parkingCharges"
                      type="number"
                      value={formData.parkingCharges}
                      onChange={(e) => handleInputChange('parkingCharges', e.target.value)}
                      placeholder="0"
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="storageCharges" className="text-sm">Storage Charges ($)</Label>
                    <Input
                      id="storageCharges"
                      type="number"
                      value={formData.storageCharges}
                      onChange={(e) => handleInputChange('storageCharges', e.target.value)}
                      placeholder="0"
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms & Conditions */}
            <Card>
              <CardHeader className="pb-3 px-4 sm:px-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                  Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Lease Type</Label>
                    <Select value={formData.leaseType} onValueChange={(value) => handleInputChange('leaseType', value)}>
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed" className="text-sm">Fixed Term</SelectItem>
                        <SelectItem value="month-to-month" className="text-sm">Month-to-Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="moveOutNotice" className="text-sm">Move-out Notice Period (days)</Label>
                    <Input
                      id="moveOutNotice"
                      type="number"
                      value={formData.moveOutNotice}
                      onChange={(e) => handleInputChange('moveOutNotice', e.target.value)}
                      placeholder="30"
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="governingLaw" className="text-sm">Governing Law</Label>
                  <Input
                    id="governingLaw"
                    value={formData.governingLaw}
                    onChange={(e) => handleInputChange('governingLaw', e.target.value)}
                    placeholder="State of California, USA"
                    className="text-sm"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="petPolicy"
                    checked={formData.petPolicy}
                    onCheckedChange={(checked) => handleInputChange('petPolicy', checked as boolean)}
                  />
                  <Label htmlFor="petPolicy" className="text-sm">Pets allowed</Label>
                </div>
                
                <div>
                  <Label htmlFor="maintenanceResponsibilities" className="text-sm">Maintenance Responsibilities</Label>
                  <Textarea
                    id="maintenanceResponsibilities"
                    value={formData.maintenanceResponsibilities}
                    onChange={(e) => handleInputChange('maintenanceResponsibilities', e.target.value)}
                    placeholder="Describe maintenance responsibilities for both parties..."
                    className="text-sm min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </div>

        <Separator />

        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 p-4 sm:p-6 flex-shrink-0">
          <Button type="button" variant="outline" onClick={onClose} className="text-sm">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-sm">
            Generate Professional Contract
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
