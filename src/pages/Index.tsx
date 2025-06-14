
import { useState } from 'react';
import { ContractForm } from '@/components/ContractForm';
import { ContractPreview } from '@/components/ContractPreview';
import { Header } from '@/components/Header';
import { FileText, Sparkles, Download, Shield, Zap } from 'lucide-react';

const Index = () => {
  const [generatedContract, setGeneratedContract] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contractData, setContractData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Enhanced Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-3xl shadow-2xl">
              <FileText className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            GenContract
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed">
            Generate comprehensive, legally sound contracts in minutes using advanced AI. From NDAs to freelance agreements, 
            create professional contracts tailored to your specific needs with automated form filling and premium templates.
          </p>
          
          {/* Enhanced Feature highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-700">AI-Powered Generation</span>
            </div>
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-gray-700">Legally Compliant</span>
            </div>
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <Download className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-semibold text-gray-700">PDF Export</span>
            </div>
            <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all">
              <Zap className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-semibold text-gray-700">Auto-Fill Templates</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Contract Form */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <h2 className="text-2xl font-bold text-white">Contract Builder</h2>
              <p className="text-blue-100 mt-2">Fill in details or use quick templates to generate your contract</p>
            </div>
            <div className="p-6 max-h-[800px] overflow-y-auto">
              <ContractForm 
                onGenerate={setGeneratedContract}
                onGenerating={setIsGenerating}
                onContractData={setContractData}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* Contract Preview */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden backdrop-blur-sm">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6">
              <h2 className="text-2xl font-bold text-white">Contract Preview</h2>
              <p className="text-gray-200 mt-2">Your generated contract will appear here in Arial font</p>
            </div>
            <div className="p-6 max-h-[800px] overflow-y-auto">
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
  );
};

export default Index;
