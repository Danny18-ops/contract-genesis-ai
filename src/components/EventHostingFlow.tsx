import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Clock, MapPin, Users, DollarSign, Music, Wine, Ban, PhoneOff, Trash2, X, Plus, PartyPopper, Download, Mail } from 'lucide-react';
import jsPDF from 'jspdf';

interface EventHostingFlowProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Guest {
  name: string;
  contribution: string;
  responsibility: string;
}

interface EventRules {
  musicVolume: boolean;
  byob: 'host' | 'guests';
  noSmoking: boolean;
  phonesOff: boolean;
  cleanupDuty: boolean;
  customRules: string;
}

export const EventHostingFlow = ({ isOpen, onClose }: EventHostingFlowProps) => {
  const [step, setStep] = useState(1);
  const [hostName, setHostName] = useState('');
  const [hostContact, setHostContact] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [estimatedGuests, setEstimatedGuests] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [guestsContributing, setGuestsContributing] = useState<'yes' | 'no'>('no');
  const [guests, setGuests] = useState<Guest[]>([{ name: '', contribution: '', responsibility: '' }]);
  const [splitType, setSplitType] = useState<'equal' | 'custom'>('equal');
  const [eventRules, setEventRules] = useState<EventRules>({
    musicVolume: false,
    byob: 'host',
    noSmoking: false,
    phonesOff: false,
    cleanupDuty: false,
    customRules: ''
  });
  const [hostSignature, setHostSignature] = useState('');
  const [guestSignatures, setGuestSignatures] = useState<{ [key: string]: string }>({});

  const addGuest = () => {
    setGuests([...guests, { name: '', contribution: '', responsibility: '' }]);
  };

  const removeGuest = (index: number) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index));
    }
  };

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    const updatedGuests = guests.map((guest, i) => 
      i === index ? { ...guest, [field]: value } : guest
    );
    setGuests(updatedGuests);
  };

  const calculateEqualSplit = () => {
    if (totalCost && guests.length > 0) {
      const splitAmount = (parseFloat(totalCost) / guests.length).toFixed(2);
      const updatedGuests = guests.map(guest => ({ ...guest, contribution: splitAmount }));
      setGuests(updatedGuests);
    }
  };

  const generateContract = () => {
    const currentDate = new Date().toLocaleDateString();
    const totalContributions = guests.reduce((sum, guest) => sum + parseFloat(guest.contribution || '0'), 0);
    
    return `EVENT HOSTING AGREEMENT

We Came. We Agreed. We Partied. 🎉

This Event Hosting Agreement is entered into on ${currentDate} for the event organized by ${hostName || '[HOST NAME]'}.

EVENT DETAILS
Event Title: ${eventTitle || '[EVENT TITLE]'}
Date: ${eventDate || '[EVENT DATE]'}
Time: ${eventTime || '[EVENT TIME]'}
Location: ${location || '[LOCATION]'}
Estimated Guests: ${estimatedGuests || '[NUMBER]'} people
Host Contact: ${hostContact || '[CONTACT INFO]'}

COST BREAKDOWN
Total Event Cost: $${totalCost || '0'}
${guestsContributing === 'yes' ? `
Guest Contributions:
${guests.map(guest => `• ${guest.name || '[NAME]'}: $${guest.contribution || '0'} - ${guest.responsibility || 'General contribution'}`).join('\n')}

Total Guest Contributions: $${totalContributions.toFixed(2)}
Host Responsibility: $${(parseFloat(totalCost || '0') - totalContributions).toFixed(2)}
` : 'Host covers all costs'}

EVENT RULES & AGREEMENTS
${eventRules.musicVolume ? '🎶 Music volume: Respect quiet hours after 10 PM' : ''}
${eventRules.byob === 'guests' ? '🍾 BYOB - Guests bring their own beverages' : '🍾 Host provides all beverages'}
${eventRules.noSmoking ? '🚭 No smoking inside the venue' : ''}
${eventRules.phonesOff ? '📵 Phones off during games/speeches for full engagement' : ''}
${eventRules.cleanupDuty ? '🧹 All guests help with cleanup after the event' : ''}
${eventRules.customRules ? `\nCustom House Rules:\n${eventRules.customRules}` : ''}

SIGNATURES
Host: ${hostSignature || '[HOST SIGNATURE REQUIRED]'}
Date: ${currentDate}

${Object.keys(guestSignatures).length > 0 ? `
Guest Signatures:
${Object.entries(guestSignatures).map(([name, signature]) => `${name}: ${signature}`).join('\n')}
` : 'Guest signatures can be added digitally'}

This agreement ensures clarity, fairness, and friendship for an amazing event experience!

Generated by GenContract AI — Make It Official! 🎉📝`;
  };

  const handleDownloadPDF = () => {
    const contract = generateContract();
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('EVENT HOSTING AGREEMENT', 20, 20);
    
    doc.setFontSize(14);
    doc.text('We Came. We Agreed. We Partied. 🎉', 20, 35);
    
    // Contract content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const lines = doc.splitTextToSize(contract, 170);
    let y = 50;
    
    lines.forEach((line: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 20, y);
      y += 5;
    });
    
    doc.save(`event-hosting-agreement-${eventTitle || 'party'}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <PartyPopper className="w-16 h-16 text-purple-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-purple-700 mb-2">Let's Plan Your Epic Event! 🎉</h3>
              <p className="text-gray-600">Tell us about your party and who's hosting</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hostName" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Host's Name *
                </Label>
                <Input
                  id="hostName"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  placeholder="Your name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="hostContact" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Contact (Optional)
                </Label>
                <Input
                  id="hostContact"
                  value={hostContact}
                  onChange={(e) => setHostContact(e.target.value)}
                  placeholder="Email or phone"
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="eventTitle" className="flex items-center gap-2">
                  <PartyPopper className="w-4 h-4" />
                  Event Title
                </Label>
                <Input
                  id="eventTitle"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="e.g., 'Diwali Bash 2025', 'BYOB Game Night'"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <CalendarIcon className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-blue-700 mb-2">Event Details 🗓️</h3>
              <p className="text-gray-600">When and where is this happening?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="eventDate" className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  Date *
                </Label>
                <Input
                  id="eventDate"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="eventTime" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Time *
                </Label>
                <Input
                  id="eventTime"
                  type="time"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location *
                </Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Full address or venue name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="estimatedGuests" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Estimated Guests
                </Label>
                <Input
                  id="estimatedGuests"
                  type="number"
                  value={estimatedGuests}
                  onChange={(e) => setEstimatedGuests(e.target.value)}
                  placeholder="How many people?"
                  className="mt-1"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <DollarSign className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-700 mb-2">Cost Splits 💰</h3>
              <p className="text-gray-600">Who's paying for what?</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="totalCost" className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Total Estimated Event Cost
                </Label>
                <Input
                  id="totalCost"
                  type="number"
                  value={totalCost}
                  onChange={(e) => setTotalCost(e.target.value)}
                  placeholder="Enter total amount"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-base font-medium">Are guests contributing?</Label>
                <Select value={guestsContributing} onValueChange={(value) => setGuestsContributing(value as 'yes' | 'no')}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no">No, host covers everything</SelectItem>
                    <SelectItem value="yes">Yes, guests contribute</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {guestsContributing === 'yes' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-medium">Guest Contributions</Label>
                    <div className="space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={calculateEqualSplit}
                        disabled={!totalCost}
                      >
                        Equal Split
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addGuest}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Guest
                      </Button>
                    </div>
                  </div>

                  {guests.map((guest, index) => (
                    <Card key={index} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Input
                          placeholder="Guest name"
                          value={guest.name}
                          onChange={(e) => updateGuest(index, 'name', e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="$ Amount"
                          value={guest.contribution}
                          onChange={(e) => updateGuest(index, 'contribution', e.target.value)}
                        />
                        <div className="flex gap-2">
                          <Input
                            placeholder="What they're paying for"
                            value={guest.responsibility}
                            onChange={(e) => updateGuest(index, 'responsibility', e.target.value)}
                          />
                          {guests.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeGuest(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <PartyPopper className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-orange-700 mb-2">Event Rules & Signatures 📋</h3>
              <p className="text-gray-600">Set the ground rules for an amazing time</p>
            </div>

            <Card className="p-4">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <PartyPopper className="w-5 h-5" />
                  Event Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="musicVolume"
                    checked={eventRules.musicVolume}
                    onCheckedChange={(checked) => setEventRules({...eventRules, musicVolume: checked as boolean})}
                  />
                  <Label htmlFor="musicVolume" className="flex items-center gap-2">
                    <Music className="w-4 h-4" />
                    Respect quiet hours after 10 PM
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Wine className="w-4 h-4" />
                    Beverages
                  </Label>
                  <Select value={eventRules.byob} onValueChange={(value) => setEventRules({...eventRules, byob: value as 'host' | 'guests'})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="host">Host provides all beverages</SelectItem>
                      <SelectItem value="guests">BYOB - Guests bring their own</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="noSmoking"
                    checked={eventRules.noSmoking}
                    onCheckedChange={(checked) => setEventRules({...eventRules, noSmoking: checked as boolean})}
                  />
                  <Label htmlFor="noSmoking" className="flex items-center gap-2">
                    <Ban className="w-4 h-4" />
                    No smoking inside
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="phonesOff"
                    checked={eventRules.phonesOff}
                    onCheckedChange={(checked) => setEventRules({...eventRules, phonesOff: checked as boolean})}
                  />
                  <Label htmlFor="phonesOff" className="flex items-center gap-2">
                    <PhoneOff className="w-4 h-4" />
                    Phones off during games/speeches
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="cleanupDuty"
                    checked={eventRules.cleanupDuty}
                    onCheckedChange={(checked) => setEventRules({...eventRules, cleanupDuty: checked as boolean})}
                  />
                  <Label htmlFor="cleanupDuty" className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Everyone helps with cleanup
                  </Label>
                </div>

                <div>
                  <Label htmlFor="customRules">Custom House Rules or Notes</Label>
                  <Textarea
                    id="customRules"
                    value={eventRules.customRules}
                    onChange={(e) => setEventRules({...eventRules, customRules: e.target.value})}
                    placeholder="Add any special rules or notes for your event..."
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="p-4">
              <CardHeader>
                <CardTitle className="text-lg">Digital Signatures</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hostSignature">Host Signature (Required) *</Label>
                  <Input
                    id="hostSignature"
                    value={hostSignature}
                    onChange={(e) => setHostSignature(e.target.value)}
                    placeholder="Type your name or signature"
                    className="mt-1"
                  />
                </div>

                {guests.some(guest => guest.name) && (
                  <div>
                    <Label className="text-base font-medium">Guest Signatures (Optional)</Label>
                    {guests.filter(guest => guest.name).map((guest, index) => (
                      <div key={index} className="mt-2">
                        <Label htmlFor={`guestSig${index}`}>{guest.name}</Label>
                        <Input
                          id={`guestSig${index}`}
                          value={guestSignatures[guest.name] || ''}
                          onChange={(e) => setGuestSignatures({...guestSignatures, [guest.name]: e.target.value})}
                          placeholder="Digital signature"
                          className="mt-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center flex items-center justify-center gap-2">
            <PartyPopper className="w-6 h-6 text-purple-500" />
            Event Hosting Agreement
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Progress Steps */}
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4].map((stepNum) => (
                <div
                  key={stepNum}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNum}
                </div>
              ))}
            </div>

            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
              >
                Previous
              </Button>
              
              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={step === 1 && !hostName}
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  Next
                </Button>
              ) : (
                <div className="space-x-2">
                  <Button
                    onClick={handleDownloadPDF}
                    disabled={!hostSignature}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Generate PDF
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-4 text-center">Live Contract Preview</h3>
            <div className="bg-white p-4 rounded border text-sm max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                {generateContract()}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
