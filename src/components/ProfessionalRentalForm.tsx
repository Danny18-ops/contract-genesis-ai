
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

    onContractGenerate(contractData);
    onClose();
  };

  const stateOptions = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];

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
                  <div>
                    <Label htmlFor="landlordLogo">Landlord Logo URL (Optional)</Label>
                    <Input
                      id="landlordLogo"
                      value={formData.landlordLogo}
                      onChange={(e) => handleInputChange('landlordLogo', e.target.value)}
                      placeholder="https://example.com/logo.png"
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
                  />
                </div>
                <div>
                  <Label htmlFor="leaseEndDate">Lease End Date *</Label>
                  <Input
                    id="leaseEndDate"
                    type="date"
                    value={formData.leaseEndDate}
                    onChange={(e) => handleInputChange('leaseEndDate', e.target.value)}
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="monthlyRent">Monthly Rent *</Label>
                  <Input
                    id="monthlyRent"
                    type="number"
                    value={formData.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    placeholder="2000"
                  />
                </div>
                <div>
                  <Label htmlFor="securityDeposit">Security Deposit *</Label>
                  <Input
                    id="securityDeposit"
                    type="number"
                    value={formData.securityDeposit}
                    onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                    placeholder="2000"
                  />
                </div>
                <div>
                  <Label htmlFor="lateFeeAmount">Late Fee Amount (Optional)</Label>
                  <Input
                    id="lateFeeAmount"
                    type="number"
                    value={formData.lateFeeAmount}
                    onChange={(e) => handleInputChange('lateFeeAmount', e.target.value)}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label htmlFor="parkingCharges">Parking Charges (Optional)</Label>
                  <Input
                    id="parkingCharges"
                    type="number"
                    value={formData.parkingCharges}
                    onChange={(e) => handleInputChange('parkingCharges', e.target.value)}
                    placeholder="100"
                  />
                </div>
                <div>
                  <Label htmlFor="storageCharges">Storage Charges (Optional)</Label>
                  <Input
                    id="storageCharges"
                    type="number"
                    value={formData.storageCharges}
                    onChange={(e) => handleInputChange('storageCharges', e.target.value)}
                    placeholder="25"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Utilities & Charges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="w-5 h-5 text-yellow-600" />
                Utilities & Responsibilities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: 'waterPaidBy', label: 'Water' },
                  { key: 'electricityPaidBy', label: 'Electricity' },
                  { key: 'gasPaidBy', label: 'Gas' },
                  { key: 'internetPaidBy', label: 'Internet' }
                ].map(({ key, label }) => (
                  <div key={key}>
                    <Label>{label} paid by:</Label>
                    <Select value={formData[key as keyof typeof formData] as string} onValueChange={(value) => handleInputChange(key, value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tenant">Tenant</SelectItem>
                        <SelectItem value="landlord">Landlord</SelectItem>
                        <SelectItem value="shared">Shared</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Terms & Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="w-5 h-5 text-red-600" />
                Terms & Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Lease Type</Label>
                  <Select value={formData.leaseType} onValueChange={(value) => handleInputChange('leaseType', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Term</SelectItem>
                      <SelectItem value="month-to-month">Month-to-Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Move-out Notice Period</Label>
                  <Select value={formData.moveOutNotice} onValueChange={(value) => handleInputChange('moveOutNotice', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Governing Law (State)</Label>
                  <Select value={formData.governingLaw} onValueChange={(value) => handleInputChange('governingLaw', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateOptions.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="petPolicy"
                    checked={formData.petPolicy}
                    onCheckedChange={(checked) => handleInputChange('petPolicy', !!checked)}
                  />
                  <Label htmlFor="petPolicy">Pets Allowed</Label>
                </div>
              </div>
              <div>
                <Label htmlFor="maintenanceResponsibilities">Maintenance Responsibilities (Optional)</Label>
                <Textarea
                  id="maintenanceResponsibilities"
                  value={formData.maintenanceResponsibilities}
                  onChange={(e) => handleInputChange('maintenanceResponsibilities', e.target.value)}
                  placeholder="Specify who is responsible for lawn care, minor repairs, etc."
                  rows={3}
                />
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
