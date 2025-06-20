import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, DollarSign, MapPin, Tv, PartyPopper, Coffee, FileText } from 'lucide-react';
import { RoommateFlow } from './RoommateFlow';
import { FriendLoanFlow } from './FriendLoanFlow';
import { GroupTripFlow } from './GroupTripFlow';
import { SharedSubscriptionsFlow } from './SharedSubscriptionsFlow';
import { EventHostingFlow } from './EventHostingFlow';
import { CasualBorrowingFlow } from './CasualBorrowingFlow';
import { FlexibleContractBuilder } from './FlexibleContractBuilder';
import { useState } from 'react';

interface GenZSectionProps {
  onQuickContract: (data: any) => void;
}

const genZTemplates = [
  {
    id: 'roommate',
    title: 'Roommate Agreement',
    description: 'Chores, bills, rent split — keep it fair and drama-free 🏠',
    icon: Users,
    gradient: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-50',
    example: 'Roommate owes $200 for WiFi? That\'s contract-worthy.',
    contractType: 'roommate'
  },
  {
    id: 'friendLoan',
    title: 'Friend Loan Contract',
    description: 'Lending/borrowing money between friends — no awkwardness 💰',
    icon: DollarSign,
    gradient: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-50',
    example: 'Lend your charger — get it back (contract optional, kind of).',
    contractType: 'friendLoan'
  },
  {
    id: 'groupTrip',
    title: 'Group Trip Contract',
    description: 'Who pays what, when — perfect for trips with friends ✈️',
    icon: MapPin,
    gradient: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-50',
    example: 'Group trip with 5 people and 1 flaky friend? Make a trip contract.',
    contractType: 'groupTrip'
  },
  {
    id: 'sharedSubscriptions',
    title: 'Shared Subscriptions',
    description: 'Netflix/Spotify/Hotstar splits — everyone pays their share 📺',
    icon: Tv,
    gradient: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-50',
    example: 'Split Spotify Premium but they ghosted? Add your name to the contract.',
    contractType: 'sharedSubscriptions'
  },
  {
    id: 'eventHosting',
    title: 'Event Hosting Rules',
    description: 'Host parties/events with clear rules and cost splits 🎉',
    icon: PartyPopper,
    gradient: 'from-yellow-500 to-amber-500',
    bgColor: 'bg-yellow-50',
    example: 'Hosting a party? Set the rules and split costs upfront.',
    contractType: 'eventHosting'
  },
  {
    id: 'casualBorrowing',
    title: 'Casual Borrowing',
    description: 'Books, gadgets, clothes — get your stuff back on time 📱',
    icon: Coffee,
    gradient: 'from-indigo-500 to-blue-500',
    bgColor: 'bg-indigo-50',
    example: 'Borrowed laptop for a week? Make it official.',
    contractType: 'casualBorrowing'
  }
];

export const GenZSection = ({ onQuickContract }: GenZSectionProps) => {
  const [showRoommateFlow, setShowRoommateFlow] = useState(false);
  const [showFriendLoanFlow, setShowFriendLoanFlow] = useState(false);
  const [showGroupTripFlow, setShowGroupTripFlow] = useState(false);
  const [showSharedSubscriptionsFlow, setShowSharedSubscriptionsFlow] = useState(false);
  const [showEventHostingFlow, setShowEventHostingFlow] = useState(false);
  const [showCasualBorrowingFlow, setShowCasualBorrowingFlow] = useState(false);
  const [showFlexibleBuilder, setShowFlexibleBuilder] = useState(false);

  const handleQuickTemplate = (template: any) => {
    console.log('Quick template clicked:', template.contractType);
    
    // Open custom flow for roommate agreements
    if (template.contractType === 'roommate') {
      setShowRoommateFlow(true);
      return;
    }
    
    // Open custom flow for friend loan agreements
    if (template.contractType === 'friendLoan') {
      setShowFriendLoanFlow(true);
      return;
    }
    
    // Open custom flow for group trip agreements
    if (template.contractType === 'groupTrip') {
      setShowGroupTripFlow(true);
      return;
    }
    
    // Open custom flow for shared subscriptions
    if (template.contractType === 'sharedSubscriptions') {
      setShowSharedSubscriptionsFlow(true);
      return;
    }
    
    // Open custom flow for event hosting
    if (template.contractType === 'eventHosting') {
      setShowEventHostingFlow(true);
      return;
    }
    
    // Open custom flow for casual borrowing
    if (template.contractType === 'casualBorrowing') {
      setShowCasualBorrowingFlow(true);
      return;
    }
    
    const quickData = {
      contractType: template.contractType,
      template: 'modern',
      organizationData: {
        name: 'Your Organization',
        address: 'Your Address, USA',
        email: 'your@email.com',
        phone: '',
        logo: ''
      },
      dynamicFields: {
        party2: 'Friend Name',
        scopeOfWork: `Quick ${template.title.toLowerCase()} agreement generated from template`,
        deliverables: 'As agreed between both parties',
        jurisdiction: 'State of California, USA',
        terminationConditions: 'Either party can terminate with 7 days notice'
      },
      language: 'en',
      footerText: 'Generated by GenContract AI — Make It Official! 📝'
    };
    
    console.log('Sending quick contract data:', quickData);
    onQuickContract(quickData);
  };

  const handleCreateYourOwn = () => {
    setShowFlexibleBuilder(true);
  };

  return (
    <>
      <div className="mb-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Why Gen Z Uses GenContract
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
            Keep it real, funny, and helpful — because life's too short for unresolved agreements
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto mb-12">
          {genZTemplates.map((template) => (
            <Card key={template.id} className={`${template.bgColor} border-white/20 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group`}>
              <CardContent className="p-0">
                {/* Header with Gradient */}
                <div className={`bg-gradient-to-r ${template.gradient} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                  <div className="relative z-10 flex items-center gap-3 mb-3">
                    <template.icon className="w-8 h-8" />
                    <h3 className="text-xl font-bold">{template.title}</h3>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">{template.description}</p>
                </div>
                
                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm italic mb-4 leading-relaxed">
                    "{template.example}"
                  </p>
                  <Button 
                    onClick={() => handleQuickTemplate(template)}
                    className={`w-full bg-gradient-to-r ${template.gradient} hover:opacity-90 text-white font-semibold`}
                  >
                    Let's Make It Official 📝
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Create Your Own Contract Button */}
        <div className="text-center mb-12">
          <Button 
            onClick={handleCreateYourOwn}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold px-8 py-3 text-lg"
          >
            Create Your Own Contract 🚀
          </Button>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4 drop-shadow-lg">
              Ready to Make Any Agreement Official?
            </h3>
            <p className="text-white/90 mb-6 drop-shadow-md">
              Use our flexible contract builder above for custom agreements, or choose a quick template.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 px-6 py-3 rounded-xl text-white font-medium">
                ✅ No legal jargon
              </div>
              <div className="bg-white/20 px-6 py-3 rounded-xl text-white font-medium">
                ✅ Friend-tested
              </div>
              <div className="bg-white/20 px-6 py-3 rounded-xl text-white font-medium">
                ✅ Actually enforceable
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Flow Modals */}
      <RoommateFlow 
        isOpen={showRoommateFlow}
        onClose={() => setShowRoommateFlow(false)}
      />

      <FriendLoanFlow 
        isOpen={showFriendLoanFlow}
        onClose={() => setShowFriendLoanFlow(false)}
      />

      <GroupTripFlow 
        isOpen={showGroupTripFlow}
        onClose={() => setShowGroupTripFlow(false)}
      />

      <SharedSubscriptionsFlow 
        isOpen={showSharedSubscriptionsFlow}
        onClose={() => setShowSharedSubscriptionsFlow(false)}
      />

      <EventHostingFlow 
        isOpen={showEventHostingFlow}
        onClose={() => setShowEventHostingFlow(false)}
      />

      <CasualBorrowingFlow 
        isOpen={showCasualBorrowingFlow}
        onClose={() => setShowCasualBorrowingFlow(false)}
      />

      {/* Flexible Contract Builder Modal */}
      <FlexibleContractBuilder 
        isOpen={showFlexibleBuilder}
        onClose={() => setShowFlexibleBuilder(false)}
        onContractGenerate={onQuickContract}
      />
    </>
  );
};
