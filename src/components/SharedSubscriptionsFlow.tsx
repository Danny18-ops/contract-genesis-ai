
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tv, Music, Shield, Plus, Trash2, Users, DollarSign, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';

interface Member {
  id: string;
  name: string;
  profileName: string;
  monthlyShare: number;
  paymentMethod: string;
  signature: string;
}

interface SharedSubscriptionsFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SharedSubscriptionsFlow = ({ isOpen, onClose }: SharedSubscriptionsFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Organizer Details
  const [organizerName, setOrganizerName] = useState('');
  const [organizerEmail, setOrganizerEmail] = useState('');
  
  // Step 2: Subscription Info
  const [platform, setPlatform] = useState('');
  const [planType, setPlanType] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [splitType, setSplitType] = useState('equal');
  
  // Step 3: Members
  const [members, setMembers] = useState<Member[]>([
    { id: '1', name: '', profileName: '', monthlyShare: 0, paymentMethod: '', signature: '' }
  ]);
  
  // Step 4: Agreement Terms
  const [customRules, setCustomRules] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(false);

  const platforms = [
    { value: 'netflix', label: '📺 Netflix', icon: Tv },
    { value: 'spotify', label: '🎶 Spotify', icon: Music },
    { value: 'disney', label: '🏰 Disney+', icon: Tv },
    { value: 'hotstar', label: '⭐ Hotstar', icon: Tv },
    { value: 'youtube', label: '📹 YouTube Premium', icon: Tv },
    { value: 'amazon', label: '📦 Amazon Prime', icon: Tv },
    { value: 'other', label: '🔧 Other', icon: Shield }
  ];

  const paymentMethods = ['UPI', 'Venmo', 'Cash', 'Bank Transfer', 'PayPal', 'Zelle'];

  const addMember = () => {
    const newMember: Member = {
      id: Date.now().toString(),
      name: '',
      profileName: '',
      monthlyShare: splitType === 'equal' ? parseFloat(totalCost) / (members.length + 1) : 0,
      paymentMethod: '',
      signature: ''
    };
    setMembers([...members, newMember]);
    
    // Recalculate equal split if needed
    if (splitType === 'equal' && totalCost) {
      const equalShare = parseFloat(totalCost) / (members.length + 1);
      setMembers(prev => prev.map(member => ({ ...member, monthlyShare: equalShare })));
    }
  };

  const removeMember = (id: string) => {
    const newMembers = members.filter(member => member.id !== id);
    setMembers(newMembers);
    
    // Recalculate equal split if needed
    if (splitType === 'equal' && totalCost && newMembers.length > 0) {
      const equalShare = parseFloat(totalCost) / newMembers.length;
      setMembers(newMembers.map(member => ({ ...member, monthlyShare: equalShare })));
    }
  };

  const updateMember = (id: string, field: keyof Member, value: string | number) => {
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleSplitTypeChange = (type: string) => {
    setSplitType(type);
    if (type === 'equal' && totalCost) {
      const equalShare = parseFloat(totalCost) / members.length;
      setMembers(prev => prev.map(member => ({ ...member, monthlyShare: equalShare })));
    }
  };

  const handleTotalCostChange = (cost: string) => {
    setTotalCost(cost);
    if (splitType === 'equal' && cost) {
      const equalShare = parseFloat(cost) / members.length;
      setMembers(prev => prev.map(member => ({ ...member, monthlyShare: equalShare })));
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const selectedPlatform = platforms.find(p => p.value === platform);
    
    // Header
    doc.setFontSize(20);
    doc.text('SHARED SUBSCRIPTION AGREEMENT', 20, 30);
    doc.setFontSize(12);
    doc.text(`${selectedPlatform?.label || platform} - ${planType}`, 20, 40);
    
    let yPosition = 60;
    
    // Organizer info
    doc.setFontSize(14);
    doc.text('Plan Organizer:', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text(`Name: ${organizerName}`, 30, yPosition);
    yPosition += 8;
    if (organizerEmail) {
      doc.text(`Email: ${organizerEmail}`, 30, yPosition);
      yPosition += 8;
    }
    
    yPosition += 10;
    
    // Subscription details
    doc.setFontSize(14);
    doc.text('Subscription Details:', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(12);
    doc.text(`Platform: ${selectedPlatform?.label || platform}`, 30, yPosition);
    yPosition += 8;
    doc.text(`Plan Type: ${planType}`, 30, yPosition);
    yPosition += 8;
    doc.text(`Total Monthly Cost: $${totalCost}`, 30, yPosition);
    yPosition += 8;
    doc.text(`Split Type: ${splitType === 'equal' ? 'Equal Split' : 'Custom Split'}`, 30, yPosition);
    
    yPosition += 15;
    
    // Members table
    doc.setFontSize(14);
    doc.text('Members & Contributions:', 20, yPosition);
    yPosition += 15;
    
    // Table headers
    doc.setFontSize(10);
    doc.text('Name', 20, yPosition);
    doc.text('Monthly Share', 80, yPosition);
    doc.text('Payment Method', 130, yPosition);
    yPosition += 8;
    
    // Draw line under headers
    doc.line(20, yPosition, 180, yPosition);
    yPosition += 8;
    
    // Member rows
    members.forEach(member => {
      if (member.name.trim()) {
        doc.text(member.name, 20, yPosition);
        doc.text(`$${member.monthlyShare.toFixed(2)}`, 80, yPosition);
        doc.text(member.paymentMethod || 'TBD', 130, yPosition);
        yPosition += 8;
      }
    });
    
    yPosition += 15;
    
    // Agreement terms
    doc.setFontSize(14);
    doc.text('Agreement Terms:', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(10);
    
    const terms = [
      '• Everyone agrees to pay by the 1st of each month',
      '• Organizer reserves the right to remove members if unpaid',
      '• Ghosting = contract termination ☠️',
      '• No changing password without notice'
    ];
    
    terms.forEach(term => {
      doc.text(term, 30, yPosition);
      yPosition += 8;
    });
    
    if (customRules.trim()) {
      yPosition += 5;
      doc.text('Additional Rules:', 30, yPosition);
      yPosition += 8;
      const lines = doc.splitTextToSize(customRules, 150);
      lines.forEach((line: string) => {
        doc.text(line, 40, yPosition);
        yPosition += 6;
      });
    }
    
    // Footer
    yPosition += 20;
    doc.setFontSize(12);
    doc.text('Because premium means everyone pays. 💰', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(8);
    doc.text(`Generated on ${new Date().toLocaleDateString()}`, 20, yPosition);
    
    doc.save(`${selectedPlatform?.label || platform}_subscription_agreement.pdf`);
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const totalMemberShare = members.reduce((sum, member) => sum + member.monthlyShare, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full">
              <Tv className="w-6 h-6 text-white" />
            </div>
            Shared Subscription Agreement
          </DialogTitle>
        </DialogHeader>

        <div className="grid lg:grid-cols-2 gap-6 h-full overflow-hidden">
          {/* Form Section */}
          <div className="space-y-6 overflow-y-auto pr-4">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-6">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 4 && (
                    <div className={`w-12 h-1 mx-2 ${
                      currentStep > step ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            {/* Step 1: Organizer Details */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Plan Organizer Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="organizerName">Your Name *</Label>
                    <Input
                      id="organizerName"
                      value={organizerName}
                      onChange={(e) => setOrganizerName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="organizerEmail">Your Email (Optional)</Label>
                    <Input
                      id="organizerEmail"
                      type="email"
                      value={organizerEmail}
                      onChange={(e) => setOrganizerEmail(e.target.value)}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Subscription Info */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tv className="w-5 h-5" />
                    Subscription Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="platform">Platform *</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose streaming platform" />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((p) => (
                          <SelectItem key={p.value} value={p.value}>
                            {p.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="planType">Plan Type *</Label>
                    <Input
                      id="planType"
                      value={planType}
                      onChange={(e) => setPlanType(e.target.value)}
                      placeholder="e.g., Family, Premium, Student"
                    />
                  </div>
                  <div>
                    <Label htmlFor="totalCost">Monthly Total Cost ($) *</Label>
                    <Input
                      id="totalCost"
                      type="number"
                      step="0.01"
                      value={totalCost}
                      onChange={(e) => handleTotalCostChange(e.target.value)}
                      placeholder="15.99"
                    />
                  </div>
                  <div>
                    <Label>Split Type</Label>
                    <RadioGroup value={splitType} onValueChange={handleSplitTypeChange}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="equal" id="equal" />
                        <Label htmlFor="equal">Equal for all members</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom">Custom per member</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Members */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Group Members & Contributions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {members.map((member, index) => (
                    <div key={member.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Member {index + 1}</h4>
                        {members.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMember(member.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Name *</Label>
                          <Input
                            value={member.name}
                            onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                            placeholder="Member name"
                          />
                        </div>
                        <div>
                          <Label>Platform Profile/Email</Label>
                          <Input
                            value={member.profileName}
                            onChange={(e) => updateMember(member.id, 'profileName', e.target.value)}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Monthly Share ($)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={member.monthlyShare}
                            onChange={(e) => updateMember(member.id, 'monthlyShare', parseFloat(e.target.value) || 0)}
                            disabled={splitType === 'equal'}
                          />
                        </div>
                        <div>
                          <Label>Payment Method</Label>
                          <Select 
                            value={member.paymentMethod} 
                            onValueChange={(value) => updateMember(member.id, 'paymentMethod', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Choose method" />
                            </SelectTrigger>
                            <SelectContent>
                              {paymentMethods.map((method) => (
                                <SelectItem key={method} value={method}>
                                  {method}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-between items-center">
                    <Button onClick={addMember} variant="outline" className="flex items-center gap-2">
                      <Plus className="w-4 h-4" />
                      Add Member
                    </Button>
                    <div className="text-sm text-gray-600">
                      Total: ${totalMemberShare.toFixed(2)} / ${totalCost || '0'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Agreement Terms */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Agreement Terms & Signatures
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Standard Terms (Cannot be modified)</Label>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                      <div>✅ Everyone agrees to pay by the 1st of each month</div>
                      <div>✅ Organizer reserves the right to remove members if unpaid</div>
                      <div>✅ Ghosting = contract termination ☠️</div>
                      <div>✅ No changing password without notice</div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="customRules">Additional Friend Rules (Optional)</Label>
                    <Textarea
                      id="customRules"
                      value={customRules}
                      onChange={(e) => setCustomRules(e.target.value)}
                      placeholder="Add any custom rules for your group..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label>Digital Signatures</Label>
                    {members.filter(m => m.name.trim()).map((member) => (
                      <div key={member.id} className="border rounded-lg p-3">
                        <Label className="text-sm font-medium">{member.name}</Label>
                        <Input
                          value={member.signature}
                          onChange={(e) => updateMember(member.id, 'signature', e.target.value)}
                          placeholder="Type your signature here"
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                Previous
              </Button>
              {currentStep < 4 ? (
                <Button onClick={nextStep} disabled={!organizerName || (currentStep === 2 && (!platform || !planType || !totalCost))}>
                  Next
                </Button>
              ) : (
                <Button onClick={generatePDF} className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Generate PDF
                </Button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="bg-gray-50 rounded-lg p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Contract Preview
            </h3>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">SHARED SUBSCRIPTION AGREEMENT</h2>
                {platform && (
                  <p className="text-gray-600 mt-2">
                    {platforms.find(p => p.value === platform)?.label || platform} - {planType}
                  </p>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Plan Organizer:</h4>
                  <p>{organizerName || 'Your Name'}</p>
                  {organizerEmail && <p className="text-sm text-gray-600">{organizerEmail}</p>}
                </div>

                {platform && (
                  <div>
                    <h4 className="font-semibold">Subscription Details:</h4>
                    <div className="text-sm space-y-1">
                      <p>Platform: {platforms.find(p => p.value === platform)?.label || platform}</p>
                      <p>Plan: {planType}</p>
                      <p>Monthly Cost: ${totalCost}</p>
                      <p>Split: {splitType === 'equal' ? 'Equal Split' : 'Custom Split'}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold">Members & Contributions:</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse border border-gray-300 mt-2">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-2 text-left">Name</th>
                          <th className="border border-gray-300 p-2 text-left">Monthly Share</th>
                          <th className="border border-gray-300 p-2 text-left">Payment</th>
                        </tr>
                      </thead>
                      <tbody>
                        {members.filter(m => m.name.trim()).map((member) => (
                          <tr key={member.id}>
                            <td className="border border-gray-300 p-2">{member.name}</td>
                            <td className="border border-gray-300 p-2">${member.monthlyShare.toFixed(2)}</td>
                            <td className="border border-gray-300 p-2">{member.paymentMethod || 'TBD'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold">Agreement Terms:</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Everyone agrees to pay by the 1st of each month</li>
                    <li>Organizer reserves the right to remove members if unpaid</li>
                    <li>Ghosting = contract termination ☠️</li>
                    <li>No changing password without notice</li>
                  </ul>
                  {customRules.trim() && (
                    <div className="mt-3">
                      <p className="font-medium">Additional Rules:</p>
                      <p className="text-sm">{customRules}</p>
                    </div>
                  )}
                </div>

                {members.some(m => m.signature.trim()) && (
                  <div>
                    <h4 className="font-semibold">Signatures:</h4>
                    <div className="space-y-2">
                      {members.filter(m => m.name.trim() && m.signature.trim()).map((member) => (
                        <div key={member.id} className="text-sm">
                          <strong>{member.name}:</strong> {member.signature}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <Separator className="my-4" />
              
              <div className="text-center text-sm text-gray-600">
                <p className="font-medium">Because premium means everyone pays. 💰</p>
                <p className="mt-2">Generated on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
