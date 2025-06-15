
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, X, FileText, Users, Calendar, DollarSign, Package, Upload, Edit, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdvancedContractBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onContractGenerate: (data: any) => void;
}

interface Party {
  id: string;
  name: string;
  role: string;
  email: string;
  address: string;
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

interface ContractTable {
  id: string;
  title: string;
  rows: TableRow[];
}

export const AdvancedContractBuilder = ({ isOpen, onClose, onContractGenerate }: AdvancedContractBuilderProps) => {
  const { toast } = useToast();
  
  // Section 1: Basic Setup
  const [contractTitle, setContractTitle] = useState('');
  const [agreementDate, setAgreementDate] = useState(new Date().toISOString().split('T')[0]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  
  // Section 2: Parties Involved
  const [parties, setParties] = useState<Party[]>([
    { id: '1', name: '', role: 'Client', email: '', address: '' },
    { id: '2', name: '', role: 'Service Provider', email: '', address: '' }
  ]);
  
  // Section 3: Custom Sections
  const [customSections, setCustomSections] = useState<CustomSection[]>([
    { id: '1', title: 'Introduction / Scope of Agreement', content: '', emoji: '💼' },
    { id: '2', title: 'Term & Termination', content: '', emoji: '🗓️' },
    { id: '3', title: 'Payment Terms', content: '', emoji: '💰' },
    { id: '4', title: 'Deliverables or Services', content: '', emoji: '📦' },
    { id: '5', title: 'Legal Clauses', content: '', emoji: '📜' }
  ]);
  
  const [contractTables, setContractTables] = useState<ContractTable[]>([]);
  
  // Section 4: Signature
  const [signatureMethod, setSignatureMethod] = useState<'type' | 'draw' | 'upload'>('type');
  const [signatures, setSignatures] = useState<{[key: string]: string}>({});
  
  // Output Settings
  const [fontStyle, setFontStyle] = useState<'serif' | 'sans-serif'>('serif');
  const [accentColor, setAccentColor] = useState('#3B82F6');
  const [customFooter, setCustomFooter] = useState('');

  const addParty = () => {
    const newParty: Party = {
      id: Date.now().toString(),
      name: '',
      role: 'Party',
      email: '',
      address: ''
    };
    setParties([...parties, newParty]);
  };

  const updateParty = (id: string, field: keyof Party, value: string) => {
    setParties(parties.map(party => 
      party.id === id ? { ...party, [field]: value } : party
    ));
  };

  const removeParty = (id: string) => {
    if (parties.length > 2) {
      setParties(parties.filter(party => party.id !== id));
    }
  };

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

  const addTable = () => {
    const newTable: ContractTable = {
      id: Date.now().toString(),
      title: 'New Table',
      rows: [{ id: '1', item: '', description: '', amount: '', date: '' }]
    };
    setContractTables([...contractTables, newTable]);
  };

  const updateTable = (tableId: string, field: 'title', value: string) => {
    setContractTables(contractTables.map(table => 
      table.id === tableId ? { ...table, [field]: value } : table
    ));
  };

  const addTableRow = (tableId: string) => {
    setContractTables(contractTables.map(table => 
      table.id === tableId 
        ? { ...table, rows: [...table.rows, { id: Date.now().toString(), item: '', description: '', amount: '', date: '' }] }
        : table
    ));
  };

  const updateTableRow = (tableId: string, rowId: string, field: keyof TableRow, value: string) => {
    setContractTables(contractTables.map(table => 
      table.id === tableId 
        ? { 
            ...table, 
            rows: table.rows.map(row => 
              row.id === rowId ? { ...row, [field]: value } : row
            )
          }
        : table
    ));
  };

  const removeTable = (tableId: string) => {
    setContractTables(contractTables.filter(table => table.id !== tableId));
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const handleSubmit = () => {
    if (!contractTitle || parties.some(p => !p.name)) {
      toast({
        title: "Missing Information",
        description: "Please fill in the contract title and all party names",
        variant: "destructive"
      });
      return;
    }

    const contractData = {
      contractType: 'advanced',
      template: 'professional',
      organizationData: {
        name: parties[0].name,
        address: parties[0].address,
        email: parties[0].email,
        phone: '',
        logo: logoFile ? URL.createObjectURL(logoFile) : ''
      },
      dynamicFields: {
        contractTitle,
        agreementDate,
        parties: parties.slice(1),
        customSections: customSections.filter(section => section.content.trim()),
        contractTables,
        signatures,
        fontStyle,
        accentColor,
        customFooter,
        jurisdiction: 'As specified in this agreement',
        scopeOfWork: customSections.find(s => s.title.includes('Scope'))?.content || 'As defined in this agreement',
        deliverables: customSections.find(s => s.title.includes('Deliverables'))?.content || 'As specified in this agreement'
      },
      language: 'en',
      footerText: customFooter || 'Generated with GenContract — Professional Contract Solutions'
    };

    console.log('Advanced contract data:', contractData);
    onContractGenerate(contractData);
    onClose();

    toast({
      title: "Professional Contract Generated! 🎉",
      description: "Your custom professional contract has been created successfully",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="w-6 h-6 text-pink-600" />
            Advanced Professional Contract Builder ✨
          </DialogTitle>
          <p className="text-gray-600">Design a professional contract from scratch with full control</p>
        </DialogHeader>

        <div className="space-y-8">
          {/* Section 1: Basic Setup */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🔧 Basic Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contractTitle">Contract Title *</Label>
                  <Input
                    id="contractTitle"
                    placeholder="e.g., Service Agreement, Partnership Terms"
                    value={contractTitle}
                    onChange={(e) => setContractTitle(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="agreementDate">Date of Agreement</Label>
                  <Input
                    id="agreementDate"
                    type="date"
                    value={agreementDate}
                    onChange={(e) => setAgreementDate(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="logo">Logo Upload (optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="flex-1"
                  />
                  <Upload className="w-5 h-5 text-gray-500" />
                </div>
                {logoFile && <p className="text-sm text-green-600">✓ {logoFile.name} uploaded</p>}
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Parties Involved */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                👤 Parties Involved
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parties.map((party, index) => (
                <div key={party.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Party {index + 1}</h4>
                    {parties.length > 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeParty(party.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div>
                      <Label>Name *</Label>
                      <Input
                        placeholder="Full name"
                        value={party.name}
                        onChange={(e) => updateParty(party.id, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        placeholder="e.g., Client, Consultant, Tenant"
                        value={party.role}
                        onChange={(e) => updateParty(party.id, 'role', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Email (optional)</Label>
                      <Input
                        type="email"
                        placeholder="email@example.com"
                        value={party.email}
                        onChange={(e) => updateParty(party.id, 'email', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Address</Label>
                      <Input
                        placeholder="Full address"
                        value={party.address}
                        onChange={(e) => updateParty(party.id, 'address', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" onClick={addParty} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Another Party
              </Button>
            </CardContent>
          </Card>

          {/* Section 3: Custom Sections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                📋 Custom Sections (Modular)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {customSections.map((section) => (
                <div key={section.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="📝"
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
                    placeholder="Enter the content for this section..."
                    value={section.content}
                    onChange={(e) => updateCustomSection(section.id, 'content', e.target.value)}
                    rows={4}
                  />
                </div>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" onClick={addCustomSection} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
                <Button variant="outline" onClick={addTable} className="flex-1">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Table
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tables Section */}
          {contractTables.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>📊 Contract Tables</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contractTables.map((table) => (
                  <div key={table.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="Table title"
                        value={table.title}
                        onChange={(e) => updateTable(table.id, 'title', e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTable(table.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-2 text-sm font-medium text-gray-600">
                        <div>Item</div>
                        <div>Description</div>
                        <div>Amount</div>
                        <div>Date</div>
                      </div>
                      {table.rows.map((row) => (
                        <div key={row.id} className="grid grid-cols-4 gap-2">
                          <Input
                            placeholder="Item name"
                            value={row.item}
                            onChange={(e) => updateTableRow(table.id, row.id, 'item', e.target.value)}
                          />
                          <Input
                            placeholder="Description"
                            value={row.description}
                            onChange={(e) => updateTableRow(table.id, row.id, 'description', e.target.value)}
                          />
                          <Input
                            placeholder="$0.00"
                            value={row.amount}
                            onChange={(e) => updateTableRow(table.id, row.id, 'amount', e.target.value)}
                          />
                          <Input
                            type="date"
                            value={row.date}
                            onChange={(e) => updateTableRow(table.id, row.id, 'date', e.target.value)}
                          />
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addTableRow(table.id)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Row
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Section 4: Signature */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                🖊️ Signature Fields
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Signature Method</Label>
                <Select value={signatureMethod} onValueChange={(value: 'type' | 'draw' | 'upload') => setSignatureMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="type">🔡 Type Name</SelectItem>
                    <SelectItem value="draw">✍️ Draw Signature</SelectItem>
                    <SelectItem value="upload">📎 Upload Image</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {parties.map((party) => (
                <div key={party.id} className="border rounded-lg p-3">
                  <Label>{party.name || `Party ${parties.indexOf(party) + 1}`} Signature</Label>
                  <Input
                    placeholder={`${party.name || 'Party'} signature`}
                    value={signatures[party.id] || ''}
                    onChange={(e) => setSignatures({ ...signatures, [party.id]: e.target.value })}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Output Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📄 Output Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Font Style</Label>
                  <Select value={fontStyle} onValueChange={(value: 'serif' | 'sans-serif') => setFontStyle(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="serif">Serif (Traditional)</SelectItem>
                      <SelectItem value="sans-serif">Sans-serif (Modern)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Accent Color</Label>
                  <Input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Custom Footer</Label>
                  <Input
                    placeholder="e.g., Confidential - ABC Corp"
                    value={customFooter}
                    onChange={(e) => setCustomFooter(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate Section */}
          <div className="flex gap-3 pt-6">
            <Button onClick={handleSubmit} className="flex-1 bg-pink-600 hover:bg-pink-700">
              <FileText className="w-4 h-4 mr-2" />
              Generate Professional Contract 📄
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
