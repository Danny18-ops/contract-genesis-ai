
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, X, FileText, Users, Calendar, DollarSign, Package, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FlexibleContractBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onContractGenerate: (data: any) => void;
}

interface CustomSection {
  id: string;
  title: string;
  content: string;
  emoji: string;
}

interface TableRow {
  id: string;
  item: string;
  description: string;
  amount: string;
  date: string;
}

export const FlexibleContractBuilder = ({ isOpen, onClose, onContractGenerate }: FlexibleContractBuilderProps) => {
  const { toast } = useToast();
  
  // Parties Involved
  const [yourName, setYourName] = useState('');
  const [yourEmail, setYourEmail] = useState('');
  const [otherPartyName, setOtherPartyName] = useState('');
  const [otherPartyEmail, setOtherPartyEmail] = useState('');
  
  // Contract Title & Purpose
  const [contractTitle, setContractTitle] = useState('');
  const [contractPurpose, setContractPurpose] = useState('');
  
  // Custom Sections
  const [customSections, setCustomSections] = useState<CustomSection[]>([
    { id: '1', title: 'Payment Details', content: '', emoji: '💸' },
    { id: '2', title: 'Deadlines & Timeframes', content: '', emoji: '🗓️' },
    { id: '3', title: 'Deliverables & Responsibilities', content: '', emoji: '📦' },
    { id: '4', title: 'Rules & Expectations', content: '', emoji: '✅' },
    { id: '5', title: 'Consequences for Non-Compliance', content: '', emoji: '🚨' }
  ]);
  
  // Optional Table
  const [includeTable, setIncludeTable] = useState(false);
  const [tableTitle, setTableTitle] = useState('Payment Breakdown');
  const [tableRows, setTableRows] = useState<TableRow[]>([
    { id: '1', item: '', description: '', amount: '', date: '' }
  ]);
  
  // Signatures
  const [enableSignatures, setEnableSignatures] = useState(true);
  const [yourSignature, setYourSignature] = useState('');
  const [otherPartySignature, setOtherPartySignature] = useState('');

  const addCustomSection = () => {
    const newSection: CustomSection = {
      id: Date.now().toString(),
      title: 'New Section',
      content: '',
      emoji: '📝'
    };
    setCustomSections([...customSections, newSection]);
  };

  const updateCustomSection = (id: string, field: keyof CustomSection, value: string) => {
    setCustomSections(customSections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const removeCustomSection = (id: string) => {
    setCustomSections(customSections.filter(section => section.id !== id));
  };

  const addTableRow = () => {
    const newRow: TableRow = {
      id: Date.now().toString(),
      item: '',
      description: '',
      amount: '',
      date: ''
    };
    setTableRows([...tableRows, newRow]);
  };

  const updateTableRow = (id: string, field: keyof TableRow, value: string) => {
    setTableRows(tableRows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const removeTableRow = (id: string) => {
    if (tableRows.length > 1) {
      setTableRows(tableRows.filter(row => row.id !== id));
    }
  };

  const handleSubmit = () => {
    // Validation
    if (!yourName || !otherPartyName || !contractTitle || !contractPurpose) {
      toast({
        title: "Missing Information",
        description: "Please fill in at least the basic contract information",
        variant: "destructive"
      });
      return;
    }

    // Generate contract data
    const contractData = {
      contractType: 'flexible',
      template: 'modern',
      organizationData: {
        name: yourName,
        address: 'USA', // Default for validation
        email: yourEmail,
        phone: '',
        logo: ''
      },
      dynamicFields: {
        party2: otherPartyName,
        party2Email: otherPartyEmail,
        contractTitle,
        contractPurpose,
        customSections: customSections.filter(section => section.content.trim()),
        includeTable,
        tableTitle: includeTable ? tableTitle : '',
        tableRows: includeTable ? tableRows.filter(row => row.item.trim()) : [],
        enableSignatures,
        yourSignature: enableSignatures ? yourSignature : '',
        otherPartySignature: enableSignatures ? otherPartySignature : '',
        scopeOfWork: contractPurpose,
        deliverables: customSections.find(s => s.title.includes('Deliverables'))?.content || 'As specified in this agreement',
        jurisdiction: 'State of California, USA',
        terminationConditions: customSections.find(s => s.title.includes('Consequences'))?.content || 'Either party can terminate with reasonable notice'
      },
      language: 'en',
      footerText: 'Created with GenContract — Make It Official! 📝'
    };

    console.log('Flexible contract data:', contractData);
    onContractGenerate(contractData);
    onClose();

    toast({
      title: "Contract Generated! 🎉",
      description: "Your custom contract has been created successfully",
    });
  };

  const resetForm = () => {
    setYourName('');
    setYourEmail('');
    setOtherPartyName('');
    setOtherPartyEmail('');
    setContractTitle('');
    setContractPurpose('');
    setCustomSections([
      { id: '1', title: 'Payment Details', content: '', emoji: '💸' },
      { id: '2', title: 'Deadlines & Timeframes', content: '', emoji: '🗓️' },
      { id: '3', title: 'Deliverables & Responsibilities', content: '', emoji: '📦' },
      { id: '4', title: 'Rules & Expectations', content: '', emoji: '✅' },
      { id: '5', title: 'Consequences for Non-Compliance', content: '', emoji: '🚨' }
    ]);
    setIncludeTable(false);
    setTableTitle('Payment Breakdown');
    setTableRows([{ id: '1', item: '', description: '', amount: '', date: '' }]);
    setEnableSignatures(true);
    setYourSignature('');
    setOtherPartySignature('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="w-6 h-6 text-blue-600" />
            Flexible Contract Builder 🚀
          </DialogTitle>
          <p className="text-gray-600">Build any type of agreement with guided sections</p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Parties Involved */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                🧑‍💼 Parties Involved
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yourName">Your Name *</Label>
                  <Input
                    id="yourName"
                    placeholder="Enter your name"
                    value={yourName}
                    onChange={(e) => setYourName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="yourEmail">Your Email (optional)</Label>
                  <Input
                    id="yourEmail"
                    type="email"
                    placeholder="your@email.com"
                    value={yourEmail}
                    onChange={(e) => setYourEmail(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="otherPartyName">Other Party's Name *</Label>
                  <Input
                    id="otherPartyName"
                    placeholder="Enter their name"
                    value={otherPartyName}
                    onChange={(e) => setOtherPartyName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="otherPartyEmail">Their Email (optional)</Label>
                  <Input
                    id="otherPartyEmail"
                    type="email"
                    placeholder="their@email.com"
                    value={otherPartyEmail}
                    onChange={(e) => setOtherPartyEmail(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contract Title & Purpose */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                📝 Contract Title & Purpose
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="contractTitle">Contract Title *</Label>
                <Input
                  id="contractTitle"
                  placeholder="e.g., 'Study Collab Agreement', 'Startup Deal', 'Freelance Task'"
                  value={contractTitle}
                  onChange={(e) => setContractTitle(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="contractPurpose">What is this contract for? *</Label>
                <Textarea
                  id="contractPurpose"
                  placeholder="Briefly describe the purpose and main goals of this agreement..."
                  rows={3}
                  value={contractPurpose}
                  onChange={(e) => setContractPurpose(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Custom Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                📋 Terms & Conditions
              </CardTitle>
              <p className="text-sm text-gray-600">Add custom sections to build your contract</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {customSections.map((section) => (
                <div key={section.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Section emoji"
                      value={section.emoji}
                      onChange={(e) => updateCustomSection(section.id, 'emoji', e.target.value)}
                      className="w-16"
                    />
                    <Input
                      placeholder="Section title"
                      value={section.title}
                      onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCustomSection(section.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Enter the details for this section..."
                    value={section.content}
                    onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                    rows={3}
                  />
                </div>
              ))}
              <Button variant="outline" onClick={addCustomSection} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Section
              </Button>
            </CardContent>
          </Card>

          {/* Optional Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                🧾 Optional Table
              </CardTitle>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="includeTable"
                  checked={includeTable}
                  onChange={(e) => setIncludeTable(e.target.checked)}
                />
                <Label htmlFor="includeTable">Include a table for itemized details</Label>
              </div>
            </CardHeader>
            {includeTable && (
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="tableTitle">Table Title</Label>
                  <Input
                    id="tableTitle"
                    placeholder="e.g., Payment Breakdown, Item List, Timeline"
                    value={tableTitle}
                    onChange={(e) => setTableTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-3">
                  {tableRows.map((row) => (
                    <div key={row.id} className="grid grid-cols-4 gap-2 items-center">
                      <Input
                        placeholder="Item"
                        value={row.item}
                        onChange={(e) => updateTableRow(row.id, 'item', e.target.value)}
                      />
                      <Input
                        placeholder="Description"
                        value={row.description}
                        onChange={(e) => updateTableRow(row.id, 'description', e.target.value)}
                      />
                      <Input
                        placeholder="Amount/Value"
                        value={row.amount}
                        onChange={(e) => updateTableRow(row.id, 'amount', e.target.value)}
                      />
                      <div className="flex gap-1">
                        <Input
                          placeholder="Date"
                          value={row.date}
                          onChange={(e) => updateTableRow(row.id, 'date', e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTableRow(row.id)}
                          disabled={tableRows.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" onClick={addTableRow} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Row
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Signatures */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                🖊️ Signatures
              </CardTitle>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="enableSignatures"
                  checked={enableSignatures}
                  onChange={(e) => setEnableSignatures(e.target.checked)}
                />
                <Label htmlFor="enableSignatures">Include signature section</Label>
              </div>
            </CardHeader>
            {enableSignatures && (
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="yourSignature">Your Signature (type your name)</Label>
                  <Input
                    id="yourSignature"
                    placeholder="Type your full name as signature"
                    value={yourSignature}
                    onChange={(e) => setYourSignature(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="otherPartySignature">Other Party's Signature (optional)</Label>
                  <Input
                    id="otherPartySignature"
                    placeholder="They can sign later or type their name"
                    value={otherPartySignature}
                    onChange={(e) => setOtherPartySignature(e.target.value)}
                  />
                </div>
              </CardContent>
            )}
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6">
            <Button onClick={handleSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Generate Contract 📄
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Reset Form
            </Button>
            <Button variant="outline" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
