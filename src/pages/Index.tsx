import { useState } from 'react';
import { ContractForm } from '@/components/ContractForm';
import { ContractPreview } from '@/components/ContractPreview';
import { FileText, Sparkles, Download, Shield, Zap, Briefcase, Home, Car, Package, User, Users, Award, Handshake } from 'lucide-react';
import { generateDetailedContract } from '@/utils/detailedContractGenerator';
import { GenZSection } from '@/components/GenZSection';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Index = () => {
  const [generatedContract, setGeneratedContract] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contractData, setContractData] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [showProfessionalTemplates, setShowProfessionalTemplates] = useState(false);

  const handleContractGenerate = (data: any) => {
    console.log('handleContractGenerate called with:', data);
    setContractData(data);
    setIsGenerating(true);
    setSelectedTemplate(data.template || 'modern');

    // Generate comprehensive contract using the detailed generator
    setTimeout(() => {
      console.log('Generating contract with data:', data);
      const detailedContract = generateDetailedContract(data);
      console.log('Generated contract:', detailedContract);
      setGeneratedContract(detailedContract);
      setIsGenerating(false);
    }, 2000);
  };

  const professionalTemplates = [
    {
      id: 'rental',
      title: 'Rental Agreement',
      description: 'Professional property lease agreements with comprehensive terms',
      icon: Home,
      gradient: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      contractType: 'rental'
    },
    {
      id: 'jobOffer',
      title: 'Job Offer Letter',
      description: 'Employment contracts with salary, benefits, and terms',
      icon: Briefcase,
      gradient: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      contractType: 'jobOffer'
    },
    {
      id: 'carRental',
      title: 'Car Rental Contract',
      description: 'Vehicle lease agreements with insurance and liability terms',
      icon: Car,
      gradient: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50',
      contractType: 'carRental'
    },
    {
      id: 'business',
      title: 'Business Agreement',
      description: 'Professional business partnerships and service contracts',
      icon: Handshake,
      gradient: 'from-orange-500 to-amber-500',
      bgColor: 'bg-orange-50',
      contractType: 'business'
    },
    {
      id: 'storage',
      title: 'Storage Container Lease',
      description: 'Storage facility agreements with access and payment terms',
      icon: Package,
      gradient: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      contractType: 'storage'
    },
    {
      id: 'consulting',
      title: 'Consulting Agreement',
      description: 'Professional consulting services with deliverables and timelines',
      icon: Award,
      gradient: 'from-cyan-500 to-teal-500',
      bgColor: 'bg-cyan-50',
      contractType: 'consulting'
    }
  ];

  const handleProfessionalTemplate = (template: any) => {
    console.log('Professional template clicked:', template.contractType);
    
    // Create properly structured data for professional contracts
    const professionalData = {
      contractType: template.contractType,
      template: 'professional',
      organizationData: {
        name: 'Your Organization Name',
        address: '123 Business Street, City, State 12345',
        email: 'contact@yourcompany.com',
        phone: '(555) 123-4567',
        logo: ''
      },
      dynamicFields: {
        // Common fields for all contract types
        party2: 'Client/Partner Name',
        jurisdiction: 'State of California, USA',
        
        // Rental specific fields
        ...(template.contractType === 'rental' && {
          tenant: 'Tenant Name',
          propertyAddress: '456 Rental Property Ave, City, State 12345',
          monthlyRent: '2000',
          securityDeposit: '2000',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
          lateFee: '50',
          state: 'California'
        }),
        
        // Job Offer specific fields
        ...(template.contractType === 'jobOffer' && {
          candidate: 'Candidate Name',
          jobTitle: 'Software Engineer',
          department: 'Engineering',
          salary: '85000',
          startDate: new Date(new Date().setDate(new Date().getDate() + 14)).toISOString().split('T')[0],
          employmentType: 'Full-time',
          supervisor: 'Hiring Manager',
          workLocation: 'Office/Remote Hybrid'
        }),
        
        // Car Rental specific fields
        ...(template.contractType === 'carRental' && {
          renter: 'Renter Name',
          carMake: 'Toyota',
          carModel: 'Camry',
          carYear: '2023',
          dailyRate: '45',
          pickupDate: new Date().toISOString().split('T')[0],
          returnDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0],
          securityDeposit: '300'
        }),
        
        // Business Agreement specific fields
        ...(template.contractType === 'business' && {
          businessPurpose: 'Strategic partnership and collaboration',
          party1Responsibilities: '• Provide technical expertise\n• Deliver project milestones\n• Maintain quality standards',
          party2Responsibilities: '• Provide project requirements\n• Timely feedback and approvals\n• Payment as agreed',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0]
        }),
        
        // Storage specific fields
        ...(template.contractType === 'storage' && {
          customer: 'Customer Name',
          unitNumber: 'A-123',
          unitSize: '10x10 feet',
          monthlyRate: '150',
          securityDeposit: '150',
          startDate: new Date().toISOString().split('T')[0]
        }),
        
        // Consulting specific fields
        ...(template.contractType === 'consulting' && {
          consultant: 'Consultant Name',
          consultingServices: 'Business strategy consulting and implementation guidance',
          hourlyRate: '150',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]
        })
      },
      language: 'en',
      footerText: 'Generated by GenContract - Professional Contract Solutions'
    };
    
    console.log('Sending professional contract data:', professionalData);
    handleContractGenerate(professionalData);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1472396961693-142e6e269027?w=1920&h=1080&fit=crop&crop=center')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-purple-900/95" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Simple Header */}
        <header className="relative z-20 bg-white/10 backdrop-blur-md border-b border-white/20">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-white" />
                <span className="text-2xl font-bold">
                  <span className="text-white">Gen</span>
                  <span className="text-pink-400">Contract</span>
                </span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Enhanced Hero Section */}
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 rounded-full shadow-2xl backdrop-blur-sm border border-white/20">
                <FileText className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-2xl">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">Gen</span>
              <span className="bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 bg-clip-text text-transparent">Contract</span>
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 drop-shadow-lg">
              Whether it's a party or a property lease, make your agreements official in minutes.
            </h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed drop-shadow-lg backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
              From roommates to road trips, GenContract covers it all. Create smart, simple contracts for everyday life — 
              because some agreements are too important to forget, even the casual ones.
            </p>
            
            {/* Enhanced Feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl border border-white/30 hover:shadow-3xl hover:bg-white/25 transition-all duration-300 hover:scale-105">
                <Sparkles className="w-6 h-6 text-yellow-300 drop-shadow-lg" />
                <span className="text-sm font-bold text-white drop-shadow-md">AI-Powered Generation</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl border border-white/30 hover:shadow-3xl hover:bg-white/25 transition-all duration-300 hover:scale-105">
                <Shield className="w-6 h-6 text-green-300 drop-shadow-lg" />
                <span className="text-sm font-bold text-white drop-shadow-md">Legally Sound</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl border border-white/30 hover:shadow-3xl hover:bg-white/25 transition-all duration-300 hover:scale-105">
                <Download className="w-6 h-6 text-purple-300 drop-shadow-lg" />
                <span className="text-sm font-bold text-white drop-shadow-md">PDF Export</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl border border-white/30 hover:shadow-3xl hover:bg-white/25 transition-all duration-300 hover:scale-105">
                <Zap className="w-6 h-6 text-orange-300 drop-shadow-lg" />
                <span className="text-sm font-bold text-white drop-shadow-md">Quick Templates</span>
              </div>
            </div>
          </div>

          {/* Template Toggle */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 flex items-center gap-4">
              <Label className="text-white font-medium">Gen Z Templates</Label>
              <Switch
                checked={showProfessionalTemplates}
                onCheckedChange={setShowProfessionalTemplates}
                className="data-[state=checked]:bg-blue-500"
              />
              <Label className="text-white font-medium">Professional Templates</Label>
            </div>
          </div>

          {/* Templates for Everyone Section */}
          {showProfessionalTemplates ? (
            <div className="mb-16">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <Briefcase className="w-12 h-12 text-white drop-shadow-lg" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Templates for Everyone
                </h2>
                <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
                  Professional contract templates for business, employment, and legal agreements
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {professionalTemplates.map((template) => (
                  <Card key={template.id} className={`${template.bgColor} border-white/20 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                    <CardContent className="p-0">
                      <div className={`bg-gradient-to-r ${template.gradient} p-6 text-white relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                        <div className="relative z-10 flex items-center gap-3 mb-3">
                          <template.icon className="w-8 h-8" />
                          <h3 className="text-xl font-bold">{template.title}</h3>
                        </div>
                        <p className="text-white/90 text-sm leading-relaxed">{template.description}</p>
                      </div>
                      
                      <div className="p-6">
                        <Button 
                          onClick={() => handleProfessionalTemplate(template)}
                          className={`w-full bg-gradient-to-r ${template.gradient} hover:opacity-90 text-white font-semibold`}
                        >
                          Create Professional Contract
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <GenZSection onQuickContract={handleContractGenerate} />
          )}

          {/* Footer Credit */}
          <div className="text-center mt-16 py-8 border-t border-white/20">
            <p className="text-white/80 text-sm backdrop-blur-sm bg-white/5 inline-block px-6 py-2 rounded-full border border-white/10">
              Designed and idea by <span className="font-semibold text-white">Dnyaneshwari Raut</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
