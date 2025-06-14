
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Upload, Building2, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrganizationData {
  name: string;
  address: string;
  email: string;
  phone: string;
  logo: string | null;
}

interface OrganizationInfoProps {
  onOrganizationChange: (data: OrganizationData) => void;
  initialData?: OrganizationData;
}

export const OrganizationInfo = ({ onOrganizationChange, initialData }: OrganizationInfoProps) => {
  const [orgData, setOrgData] = useState<OrganizationData>({
    name: '',
    address: '',
    email: '',
    phone: '',
    logo: null,
    ...initialData
  });
  const { toast } = useToast();

  useEffect(() => {
    // Load saved organization data
    const savedOrgData = localStorage.getItem('gencontract_org_data');
    if (savedOrgData) {
      const parsed = JSON.parse(savedOrgData);
      setOrgData(parsed);
      onOrganizationChange(parsed);
    }
  }, [onOrganizationChange]);

  const handleInputChange = (field: keyof OrganizationData, value: string) => {
    const updatedData = { ...orgData, [field]: value };
    setOrgData(updatedData);
    onOrganizationChange(updatedData);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please upload a JPG or PNG image file.",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = e.target?.result as string;
        const updatedData = { ...orgData, logo: logoData };
        setOrgData(updatedData);
        onOrganizationChange(updatedData);
        toast({
          title: "Logo Uploaded",
          description: "Organization logo has been uploaded successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const saveOrgData = () => {
    localStorage.setItem('gencontract_org_data', JSON.stringify(orgData));
    toast({
      title: "Organization Info Saved",
      description: "Your organization details have been saved for future use.",
    });
  };

  const reuseOrgData = () => {
    const savedOrgData = localStorage.getItem('gencontract_org_data');
    if (savedOrgData) {
      const parsed = JSON.parse(savedOrgData);
      setOrgData(parsed);
      onOrganizationChange(parsed);
      toast({
        title: "Organization Info Loaded",
        description: "Previously saved organization details have been loaded.",
      });
    } else {
      toast({
        title: "No Saved Data",
        description: "No previously saved organization data found.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="border-blue-100 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <Building2 className="w-5 h-5" />
          Organization Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Logo Upload */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Organization Logo (Optional)</Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                onChange={handleLogoUpload}
                className="bg-white"
              />
            </div>
            {orgData.logo && (
              <div className="w-16 h-16 border rounded-lg overflow-hidden bg-white">
                <img
                  src={orgData.logo}
                  alt="Organization Logo"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>
          <p className="text-xs text-gray-500">Upload JPG or PNG file (recommended: 200x200px)</p>
        </div>

        {/* Organization Details */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium">Organization Name *</Label>
            <Input
              placeholder="e.g., ABC Legal Services"
              value={orgData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="bg-white"
            />
          </div>
          <div>
            <Label className="text-sm font-medium">Phone Number</Label>
            <Input
              placeholder="e.g., +1 (555) 123-4567"
              value={orgData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="bg-white"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Complete Address</Label>
          <Input
            placeholder="e.g., 123 Business St, City, State 12345"
            value={orgData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="bg-white"
          />
        </div>

        <div>
          <Label className="text-sm font-medium">Email Address</Label>
          <Input
            type="email"
            placeholder="e.g., contracts@organization.com"
            value={orgData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="bg-white"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={saveOrgData}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Info
          </Button>
          <Button
            onClick={reuseOrgData}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reuse Saved Info
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
