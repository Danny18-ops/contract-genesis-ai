
import { useState } from 'react';
import { ContractForm } from '@/components/ContractForm';
import { ContractPreview } from '@/components/ContractPreview';
import { Header } from '@/components/Header';
import { FileText, Sparkles, Download } from 'lucide-react';

const Index = () => {
  const [generatedContract, setGeneratedContract] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [contractData, setContractData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Header />
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            GenContract
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Generate legally sound contracts in minutes using AI. From NDAs to freelance agreements, 
            create professional contracts tailored to your needs.
          </p>
          
          {/* Feature highlights */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Legally Sound</span>
            </div>
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
              <Download className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">PDF Export</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Contract Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
              <h2 className="text-2xl font-bold text-white">Contract Details</h2>
              <p className="text-blue-100 mt-2">Fill in the information below to generate your contract</p>
            </div>
            <div className="p-6">
              <ContractForm 
                onGenerate={setGeneratedContract}
                onGenerating={setIsGenerating}
                onContractData={setContractData}
                isGenerating={isGenerating}
              />
            </div>
          </div>

          {/* Contract Preview */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-6">
              <h2 className="text-2xl font-bold text-white">Contract Preview</h2>
              <p className="text-gray-200 mt-2">Generated contract will appear here</p>
            </div>
            <div className="p-6">
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
