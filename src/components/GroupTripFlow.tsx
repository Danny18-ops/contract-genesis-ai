import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ArrowRight, Download, MapPin, Users, Calendar, FileText, Plane, Plus, Trash2, Upload } from 'lucide-react';
import { DigitalSignature } from './DigitalSignature';
import { generateEnhancedPdf } from '@/utils/enhancedPdfGenerator';
import { useToast } from '@/hooks/use-toast';

interface GroupTripFlowProps {
  onClose: () => void;
  isOpen: boolean;
}

interface TripMember {
  name: string;
  contribution: string;
  responsibilities: string;
}

interface TripData {
  organizerName: string;
  organizerContact: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  totalBudget: string;
  members: TripMember[];
  autoSplit: boolean;
  rules: {
    noGhosting: boolean;
    refundPolicy: boolean;
    confirmPayment: boolean;
  };
  refundDays: string;
  additionalRules: string;
  tripBanner: string;
}

export const GroupTripFlow = ({ onClose, isOpen }: GroupTripFlowProps) => {
  const [step, setStep] = useState(1);
  const [signatures, setSignatures] = useState<{ [key: string]: string }>({});
  const [showSignature, setShowSignature] = useState(false);
  const { toast } = useToast();

  const [data, setData] = useState<TripData>({
    organizerName: '',
    organizerContact: '',
    tripName: '',
    destination: '',
    startDate: '',
    endDate: '',
    totalBudget: '',
    members: [{ name: '', contribution: '', responsibilities: '' }],
    autoSplit: false,
    rules: {
      noGhosting: false,
      refundPolicy: false,
      confirmPayment: false,
    },
    refundDays: '7',
    additionalRules: '',
    tripBanner: ''
  });

  const updateData = (field: keyof TripData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const addMember = () => {
    updateData('members', [...data.members, { name: '', contribution: '', responsibilities: '' }]);
  };

  const removeMember = (index: number) => {
    if (data.members.length > 1) {
      const newMembers = data.members.filter((_, i) => i !== index);
      updateData('members', newMembers);
    }
  };

  const updateMember = (index: number, field: keyof TripMember, value: string) => {
    const newMembers = [...data.members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    updateData('members', newMembers);
  };

  const calculateEvenSplit = () => {
    if (data.totalBudget && data.members.length > 0) {
      const splitAmount = (parseFloat(data.totalBudget) / data.members.length).toFixed(2);
      const newMembers = data.members.map(member => ({
        ...member,
        contribution: splitAmount
      }));
      updateData('members', newMembers);
    }
  };

  const generateContract = () => {
    const membersList = data.members
      .filter(member => member.name)
      .map((member, index) => 
        `${index + 1}. ${member.name} - $${member.contribution || '0'} (${member.responsibilities || 'General expenses'})`
      ).join('\n');

    const totalContributions = data.members
      .filter(member => member.contribution)
      .reduce((sum, member) => sum + parseFloat(member.contribution || '0'), 0);

    const rulesText = [
      data.rules.noGhosting && '• No ghosting after booking - all members must honor their commitment',
      data.rules.refundPolicy && `• Refunds only available if trip is canceled ${data.refundDays || '7'} days before departure`,
      data.rules.confirmPayment && '• All members must confirm payment before travel date'
    ].filter(Boolean).join('\n');

    return `
🧳 GROUP TRIP AGREEMENT ✈️

${data.tripBanner ? '[TRIP BANNER/LOGO]' : ''}

Trip: ${data.tripName || '[TRIP NAME]'}
Destination: ${data.destination || '[DESTINATION]'} 🗺️
Dates: ${data.startDate || '[START DATE]'} to ${data.endDate || '[END DATE]'} 📅
Trip Organizer: ${data.organizerName || '[ORGANIZER NAME]'}
${data.organizerContact ? `Contact: ${data.organizerContact}` : ''}

TRIP PARTICIPANTS & CONTRIBUTIONS:
${membersList || '1. [MEMBER NAME] - $[AMOUNT] ([RESPONSIBILITY])'}

${data.totalBudget ? `Total Trip Budget: $${data.totalBudget}` : ''}
${totalContributions > 0 ? `Total Contributions: $${totalContributions.toFixed(2)}` : ''}

TRIP GROUND RULES:
${rulesText || '• Rules will be discussed and agreed upon by all participants'}

${data.additionalRules ? `ADDITIONAL AGREEMENTS:\n${data.additionalRules}\n` : ''}

TERMS & CONDITIONS:
1. All participants agree to the financial contributions outlined above.
2. Each member is responsible for their assigned expenses and contributions.
3. Changes to the trip plan require agreement from all participants.
4. Any disputes will be resolved through open discussion among group members.
5. This agreement ensures clarity, fairness, and friendship throughout our journey.

SIGNATURES:
By signing below, all participants agree to honor this trip agreement and their individual commitments.

${data.members.filter(m => m.name).map(member => 
  `${member.name}: _________________ Date: ___________`
).join('\n\n')}

Organizer: ${data.organizerName || '[ORGANIZER NAME]'} _________________ Date: ___________

This trip agreement ensures clarity, fairness, and friendship. 🌟
Generated by GenContract AI — Make It Official! 📝
    `.trim();
  };

  const handleDownloadPDF = () => {
    const contract = generateContract();
    
    // Use enhanced PDF generator
    const pdf = generateEnhancedPdf({
      contractType: 'groupTrip',
      contractData: data,
      contract,
      template: 'modern'
    });
    
    pdf.save(`Group_Trip_Agreement_${data.tripName || 'Trip'}_${new Date().toISOString().split('T')[0]}.pdf`);
    
    toast({
      title: "Enhanced PDF Downloaded",
      description: "Your beautifully styled group trip agreement has been downloaded! ✈️",
    });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return data.organizerName && data.destination;
      case 2:
        return data.members.some(member => member.name);
      case 3:
        return true; // Optional step
      default:
        return true;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <Plane className="w-6 h-6" />
            Group Trip Agreement Builder ✈️
          </CardTitle>
          <Button variant="ghost" onClick={onClose}>✕</Button>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= s ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 4 && <div className={`w-12 h-1 mx-2 ${step > s ? 'bg-purple-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>

          {/* Step 1: Trip Organizer & Trip Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trip Details 🗺️</h3>
                <p className="text-gray-600">Tell us about your amazing trip!</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold text-purple-600 border-b pb-2">🧳 Trip Organizer Info</h4>
                  <div>
                    <Label htmlFor="organizerName">Organizer's Name *</Label>
                    <Input
                      id="organizerName"
                      placeholder="Your name"
                      value={data.organizerName}
                      onChange={(e) => updateData('organizerName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="organizerContact">Email or Phone (Optional)</Label>
                    <Input
                      id="organizerContact"
                      placeholder="your@email.com or +1234567890"
                      value={data.organizerContact}
                      onChange={(e) => updateData('organizerContact', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tripBanner">Trip Banner/Logo URL (Optional)</Label>
                    <Input
                      id="tripBanner"
                      placeholder="https://your-trip-photo.com/banner.jpg"
                      value={data.tripBanner}
                      onChange={(e) => updateData('tripBanner', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold text-blue-600 border-b pb-2">🗺️ Trip Information</h4>
                  <div>
                    <Label htmlFor="tripName">Trip Name (Optional)</Label>
                    <Input
                      id="tripName"
                      placeholder="Goa Getaway 2025"
                      value={data.tripName}
                      onChange={(e) => updateData('tripName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="destination">Destination *</Label>
                    <Input
                      id="destination"
                      placeholder="Goa, India"
                      value={data.destination}
                      onChange={(e) => updateData('destination', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={data.startDate}
                        onChange={(e) => updateData('startDate', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={data.endDate}
                        onChange={(e) => updateData('endDate', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="totalBudget">Overall Trip Budget ($) (Optional)</Label>
                    <Input
                      id="totalBudget"
                      type="number"
                      placeholder="2000"
                      value={data.totalBudget}
                      onChange={(e) => updateData('totalBudget', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Group Members */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Group Members 👥</h3>
                <p className="text-gray-600">Add everyone who's joining the trip</p>
              </div>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="autoSplit"
                    checked={data.autoSplit}
                    onCheckedChange={(checked) => updateData('autoSplit', checked)}
                  />
                  <Label htmlFor="autoSplit">Auto-calculate even split</Label>
                </div>
                {data.autoSplit && data.totalBudget && (
                  <Button 
                    onClick={calculateEvenSplit}
                    size="sm"
                    variant="outline"
                  >
                    Calculate Split
                  </Button>
                )}
              </div>
              
              <div className="space-y-4">
                {data.members.map((member, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Member {index + 1}</h4>
                      {data.members.length > 1 && (
                        <Button
                          onClick={() => removeMember(index)}
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div>
                        <Label>Name</Label>
                        <Input
                          placeholder="Member name"
                          value={member.name}
                          onChange={(e) => updateMember(index, 'name', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Contribution ($)</Label>
                        <Input
                          type="number"
                          placeholder="500"
                          value={member.contribution}
                          onChange={(e) => updateMember(index, 'contribution', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Paying for</Label>
                        <Input
                          placeholder="Hotel, flights, food..."
                          value={member.responsibilities}
                          onChange={(e) => updateMember(index, 'responsibilities', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button 
                  onClick={addMember}
                  variant="outline"
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Another Member
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Rules & Agreements */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <FileText className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Trip Ground Rules 📋</h3>
                <p className="text-gray-600">Set clear expectations for everyone</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold">Standard Trip Rules (Check all that apply):</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="noGhosting"
                      checked={data.rules.noGhosting}
                      onCheckedChange={(checked) => updateData('rules', { ...data.rules, noGhosting: checked })}
                    />
                    <Label htmlFor="noGhosting">🚫 "No ghosting after booking"</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="refundPolicy"
                      checked={data.rules.refundPolicy}
                      onCheckedChange={(checked) => updateData('rules', { ...data.rules, refundPolicy: checked })}
                    />
                    <Label htmlFor="refundPolicy">💰 "Refund only if canceled X days before"</Label>
                  </div>
                  
                  {data.rules.refundPolicy && (
                    <div className="ml-6">
                      <Label htmlFor="refundDays">Days before trip for refund eligibility</Label>
                      <Input
                        id="refundDays"
                        type="number"
                        placeholder="7"
                        value={data.refundDays}
                        onChange={(e) => updateData('refundDays', e.target.value)}
                        className="w-24"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="confirmPayment"
                      checked={data.rules.confirmPayment}
                      onCheckedChange={(checked) => updateData('rules', { ...data.rules, confirmPayment: checked })}
                    />
                    <Label htmlFor="confirmPayment">✅ "Everyone confirms payment before travel date"</Label>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <Label htmlFor="additionalRules">Additional Trip Rules (Optional)</Label>
                  <Textarea
                    id="additionalRules"
                    placeholder="e.g., No smoking in shared rooms, Respect quiet hours after 11 PM, Share photos in group chat..."
                    rows={4}
                    value={data.additionalRules}
                    onChange={(e) => updateData('additionalRules', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preview & Signatures */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <FileText className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Review & Sign 🖊️</h3>
                <p className="text-gray-600">Final review of your group trip agreement</p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border max-h-96 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                  {generateContract()}
                </pre>
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={() => setShowSignature(true)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700"
                >
                  🖊️ Add Digital Signatures
                </Button>
                <Button
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700"
                >
                  <Download className="w-4 h-4" />
                  Generate Enhanced PDF
                </Button>
              </div>
              
              {Object.keys(signatures).length > 0 && (
                <div className="text-center text-purple-600 font-medium">
                  ✓ Signatures collected: {Object.keys(signatures).length}/{data.members.filter(m => m.name).length + 1}
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              onClick={prevStep}
              variant="outline"
              disabled={step === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={onClose}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Complete Agreement ✓
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Digital Signature Modal */}
      <DigitalSignature
        isOpen={showSignature}
        onClose={() => setShowSignature(false)}
        parties={[data.organizerName, ...data.members.filter(m => m.name).map(m => m.name)].filter(Boolean)}
        onSignatureChange={setSignatures}
      />
    </div>
  );
};
