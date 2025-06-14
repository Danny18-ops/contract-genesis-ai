import { useState } from 'react';
import { ContractForm } from '@/components/ContractForm';
import { ContractPreview } from '@/components/ContractPreview';
import { Header } from '@/components/Header';
import { FileText, Sparkles, Download, Shield, Zap } from 'lucide-react';
import { generateDetailedContract } from '@/utils/detailedContractGenerator';

const Index = () => {
  const [generatedContract, setGeneratedContract] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contractData, setContractData] = useState<any>(null);

  const handleContractGenerate = (data: any) => {
    setContractData(data);
    setIsGenerating(true);
    
    // Generate comprehensive contract using the detailed generator
    setTimeout(() => {
      const detailedContract = generateDetailedContract(data);
      setGeneratedContract(detailedContract);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop&crop=center')`
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
        <Header />
        
        {/* Enhanced Hero Section */}
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6 rounded-full shadow-2xl backdrop-blur-sm border border-white/20">
                <FileText className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6 drop-shadow-2xl">
              GenContract
            </h1>
            <p className="text-xl text-white/90 max-w-4xl mx-auto mb-8 leading-relaxed drop-shadow-lg backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-white/10">
              Generate comprehensive, legally sound contracts in minutes using advanced AI. From NDAs to freelance agreements, 
              create professional contracts tailored to your specific needs with automated form filling and premium templates.
            </p>
            
            {/* Enhanced Feature highlights */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl border border-white/30 hover:shadow-3xl hover:bg-white/25 transition-all duration-300 hover:scale-105">
                <Sparkles className="w-6 h-6 text-yellow-300 drop-shadow-lg" />
                <span className="text-sm font-bold text-white drop-shadow-md">AI-Powered Generation</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl border border-white/30 hover:shadow-3xl hover:bg-white/25 transition-all duration-300 hover:scale-105">
                <Shield className="w-6 h-6 text-green-300 drop-shadow-lg" />
                <span className="text-sm font-bold text-white drop-shadow-md">Legally Compliant</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl border border-white/30 hover:shadow-3xl hover:bg-white/25 transition-all duration-300 hover:scale-105">
                <Download className="w-6 h-6 text-purple-300 drop-shadow-lg" />
                <span className="text-sm font-bold text-white drop-shadow-md">PDF Export</span>
              </div>
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-8 py-4 rounded-2xl shadow-2xl border border-white/30 hover:shadow-3xl hover:bg-white/25 transition-all duration-300 hover:scale-105">
                <Zap className="w-6 h-6 text-orange-300 drop-shadow-lg" />
                <span className="text-sm font-bold text-white drop-shadow-md">Auto-Fill Templates</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Contract Form */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden hover:shadow-3xl transition-all duration-300">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg">Contract Builder</h2>
                  <p className="text-blue-100 mt-3 text-lg drop-shadow-md">Fill in details or use quick templates to generate your contract</p>
                </div>
              </div>
              <div className="p-8 max-h-[800px] overflow-y-auto">
                <ContractForm 
                  onContractGenerate={handleContractGenerate}
                  isGenerating={isGenerating}
                />
              </div>
            </div>

            {/* Contract Preview */}
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden hover:shadow-3xl transition-all duration-300">
              <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-600/20 to-gray-800/20" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-white drop-shadow-lg">Contract Preview</h2>
                  <p className="text-gray-200 mt-3 text-lg drop-shadow-md">Your generated contract will appear here in Arial font</p>
                </div>
              </div>
              <div className="p-8 max-h-[800px] overflow-y-auto">
                <ContractPreview 
                  contract={generatedContract}
                  isGenerating={isGenerating}
                  contractData={contractData}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
