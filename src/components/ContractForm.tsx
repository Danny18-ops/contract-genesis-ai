
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
      {/* Contract Type Selection */}
      <Card className="border-blue-100 bg-blue-50/30">
        <CardContent className="p-4">
          <Label className="text-base font-semibold text-gray-900 mb-3 block">
            Contract Type *
          </Label>
          <Select value={formData.contractType} onValueChange={(value) => handleInputChange('contractType', value)}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Select contract type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nda">Non-Disclosure Agreement (NDA)</SelectItem>
              <SelectItem value="freelance">Freelance/Service Agreement</SelectItem>
              <SelectItem value="rental">Rental Agreement</SelectItem>
              <SelectItem value="employment">Employment Contract</SelectItem>
              <SelectItem value="partnership">Partnership Agreement</SelectItem>
              <SelectItem value="consulting">Consulting Agreement</SelectItem>
              <SelectItem value="license">License Agreement</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Party Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
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

        <Card>
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
      <Card>
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
      <Card>
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
      <Card>
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

      <Card>
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
      <Card>
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
      <Card>
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
        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 text-lg font-semibold shadow-lg"
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
