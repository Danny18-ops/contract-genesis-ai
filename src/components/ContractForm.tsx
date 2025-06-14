
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateDetailedContract } from '@/utils/contractGenerator';
import { FormAutomation } from './FormAutomation';
import { ContractTypeIcon, getContractTypeGradient, getContractTypeImage } from './ContractTypeIcon';

interface ContractFormProps {
  onGenerate: (contract: string) => void;
  onGenerating: (generating: boolean) => void;
  onContractData: (data: any) => void;
  isGenerating: boolean;
}

export const ContractForm = ({ onGenerate, onGenerating, onContractData, isGenerating }: ContractFormProps) => {
  const [formData, setFormData] = useState({
    contractType: '',
    party1Name: '',
    party1Address: '',
    party1Email: '',
    party1Role: '',
    party2Name: '',
    party2Address: '',
    party2Email: '',
    party2Role: '',
    paymentAmount: '',
    paymentTerms: '',
    duration: '',
    startDate: '',
    endDate: '',
    scope: '',
    deliverables: '',
    additionalTerms: '',
    jurisdiction: '',
    terminationClause: ''
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAutoFill = (data: any) => {
    setFormData(data);
    toast({
      title: "Form Auto-filled!",
      description: "Sample data has been loaded. You can modify any fields before generating.",
    });
  };

  const generateContract = async () => {
    if (!formData.contractType || !formData.party1Name || !formData.party2Name) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the contract type and party names.",
        variant: "destructive"
      });
      return;
    }

    onGenerating(true);
    onContractData(formData);

    try {
      // Simulate API call - In real implementation, this would call OpenAI API
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      const contract = generateDetailedContract(formData);
      onGenerate(contract);
      
      toast({
        title: "Contract Generated!",
        description: "Your detailed contract has been successfully generated.",
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

  return (
    <div className="space-y-6">
      {/* Automation Section */}
      <FormAutomation onAutoFill={handleAutoFill} />

      {/* Contract Type Selection with Enhanced UI */}
      <Card className="border-blue-100 bg-blue-50/30 overflow-hidden">
        <CardContent className="p-0">
          {formData.contractType && (
            <div className="h-32 relative overflow-hidden">
              <img
                src={getContractTypeImage(formData.contractType)}
                alt={`${formData.contractType} contract`}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${getContractTypeGradient(formData.contractType)} opacity-75`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <ContractTypeIcon contractType={formData.contractType} className="w-8 h-8 mx-auto mb-2" />
                  <h3 className="font-bold text-lg capitalize">{formData.contractType.replace(/([A-Z])/g, ' $1')} Contract</h3>
                </div>
              </div>
            </div>
          )}
          <div className="p-4">
            <Label className="text-base font-semibold text-gray-900 mb-3 block">
              Contract Type *
            </Label>
            <Select value={formData.contractType} onValueChange={(value) => handleInputChange('contractType', value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select contract type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nda">🛡️ Non-Disclosure Agreement (NDA)</SelectItem>
                <SelectItem value="freelance">👤 Freelance/Service Agreement</SelectItem>
                <SelectItem value="rental">🏠 Rental Agreement</SelectItem>
                <SelectItem value="employment">💼 Employment Contract</SelectItem>
                <SelectItem value="partnership">👥 Partnership Agreement</SelectItem>
                <SelectItem value="consulting">🏆 Consulting Agreement</SelectItem>
                <SelectItem value="license">📄 License Agreement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Party Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <Label className="font-semibold text-gray-900 mb-2 block">Party 1 (First Party) *</Label>
            <div className="space-y-3">
              <Input
                placeholder="Full Legal Name"
                value={formData.party1Name}
                onChange={(e) => handleInputChange('party1Name', e.target.value)}
                className="bg-white"
              />
              <Input
                placeholder="Complete Address"
                value={formData.party1Address}
                onChange={(e) => handleInputChange('party1Address', e.target.value)}
                className="bg-white"
              />
              <Input
                placeholder="Email Address"
                type="email"
                value={formData.party1Email}
                onChange={(e) => handleInputChange('party1Email', e.target.value)}
                className="bg-white"
              />
              <Input
                placeholder="Role/Title/Company"
                value={formData.party1Role}
                onChange={(e) => handleInputChange('party1Role', e.target.value)}
                className="bg-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <Label className="font-semibold text-gray-900 mb-2 block">Party 2 (Second Party) *</Label>
            <div className="space-y-3">
              <Input
                placeholder="Full Legal Name"
                value={formData.party2Name}
                onChange={(e) => handleInputChange('party2Name', e.target.value)}
                className="bg-white"
              />
              <Input
                placeholder="Complete Address"
                value={formData.party2Address}
                onChange={(e) => handleInputChange('party2Address', e.target.value)}
                className="bg-white"
              />
              <Input
                placeholder="Email Address"
                type="email"
                value={formData.party2Email}
                onChange={(e) => handleInputChange('party2Email', e.target.value)}
                className="bg-white"
              />
              <Input
                placeholder="Role/Title/Company"
                value={formData.party2Role}
                onChange={(e) => handleInputChange('party2Role', e.target.value)}
                className="bg-white"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card className="border-l-4 border-l-purple-500">
        <CardContent className="p-4">
          <Label className="font-semibold text-gray-900 mb-3 block">Contract Timeline</Label>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-gray-600 mb-1 block">Duration</Label>
              <Input
                placeholder="e.g., 12 months"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                className="bg-white"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600 mb-1 block">Start Date</Label>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="bg-white"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600 mb-1 block">End Date</Label>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financial Terms */}
      <Card className="border-l-4 border-l-yellow-500">
        <CardContent className="p-4">
          <Label className="font-semibold text-gray-900 mb-3 block">Financial Terms</Label>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-gray-600 mb-1 block">Total Payment Amount</Label>
              <Input
                placeholder="e.g., 50000"
                value={formData.paymentAmount}
                onChange={(e) => handleInputChange('paymentAmount', e.target.value)}
                className="bg-white"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600 mb-1 block">Payment Schedule</Label>
              <Input
                placeholder="e.g., Monthly, Net 30 days"
                value={formData.paymentTerms}
                onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                className="bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Work Details */}
      <Card className="border-l-4 border-l-indigo-500">
        <CardContent className="p-4">
          <Label className="font-semibold text-gray-900 mb-2 block">Scope of Work</Label>
          <Textarea
            placeholder="Describe in detail the work, services, or subject matter of this contract. Include specific responsibilities, expectations, and requirements..."
            value={formData.scope}
            onChange={(e) => handleInputChange('scope', e.target.value)}
            className="bg-white min-h-[120px]"
          />
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-teal-500">
        <CardContent className="p-4">
          <Label className="font-semibold text-gray-900 mb-2 block">Deliverables & Milestones</Label>
          <Textarea
            placeholder="List specific deliverables, milestones, deadlines, and performance metrics..."
            value={formData.deliverables}
            onChange={(e) => handleInputChange('deliverables', e.target.value)}
            className="bg-white min-h-[100px]"
          />
        </CardContent>
      </Card>

      {/* Legal Terms */}
      <Card className="border-l-4 border-l-red-500">
        <CardContent className="p-4">
          <Label className="font-semibold text-gray-900 mb-3 block">Legal Terms</Label>
          <div className="space-y-4">
            <div>
              <Label className="text-sm text-gray-600 mb-1 block">Governing Jurisdiction</Label>
              <Input
                placeholder="e.g., State of California, USA"
                value={formData.jurisdiction}
                onChange={(e) => handleInputChange('jurisdiction', e.target.value)}
                className="bg-white"
              />
            </div>
            <div>
              <Label className="text-sm text-gray-600 mb-1 block">Termination Conditions</Label>
              <Textarea
                placeholder="Specify conditions under which this contract can be terminated..."
                value={formData.terminationClause}
                onChange={(e) => handleInputChange('terminationClause', e.target.value)}
                className="bg-white min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Terms */}
      <Card className="border-l-4 border-l-gray-500">
        <CardContent className="p-4">
          <Label className="font-semibold text-gray-900 mb-2 block">Additional Terms & Conditions</Label>
          <Textarea
            placeholder="Any additional clauses, special conditions, confidentiality terms, dispute resolution, intellectual property rights, etc..."
            value={formData.additionalTerms}
            onChange={(e) => handleInputChange('additionalTerms', e.target.value)}
            className="bg-white min-h-[100px]"
          />
        </CardContent>
      </Card>

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
            Generating Detailed Contract...
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
