import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, FileText, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { useContracts } from '@/hooks/use-contracts';
import { useAuth } from '@/contexts/AuthContext';
import { ContractPreview } from '@/components/ContractPreview';

const Contracts = () => {
  const { contracts, loading, deleteContract } = useContracts();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedContract, setSelectedContract] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md py-4">
        <div className="container mx-auto px-6">
          <h1 className="text-2xl font-semibold text-gray-900">My Contracts</h1>
        </div>
      </header>
      
      <div className="container mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your contracts...</p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Contracts Yet</h3>
            <p className="text-gray-600 mb-6">Create your first contract to get started</p>
            <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
              Create Contract
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {selectedContract ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button 
                    onClick={() => setSelectedContract(null)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Contracts
                  </Button>
                  <div className="flex items-center gap-2">
                    {selectedContract.signing_status && (
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedContract.signing_status === 'fully_signed' 
                          ? 'bg-green-100 text-green-800'
                          : selectedContract.signing_status === 'pending_signatures'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedContract.signing_status === 'fully_signed' && 'Fully Signed'}
                        {selectedContract.signing_status === 'pending_signatures' && 'Pending Signatures'}
                        {selectedContract.signing_status === 'draft' && 'Draft'}
                      </span>
                    )}
                    <Button
                      onClick={() => deleteContract(selectedContract.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <ContractPreview
                  contract={selectedContract.content}
                  isGenerating={false}
                  contractData={selectedContract.contract_data}
                  contractId={selectedContract.id}
                  showSigningOption={selectedContract.signing_status !== 'fully_signed'}
                />
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {contracts.map((contract) => (
                  <Card key={contract.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                            {contract.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-gray-500 capitalize">
                              {contract.contract_type.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            {contract.signing_status && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                contract.signing_status === 'fully_signed' 
                                  ? 'bg-green-100 text-green-800'
                                  : contract.signing_status === 'pending_signatures'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {contract.signing_status === 'fully_signed' && 'Signed'}
                                {contract.signing_status === 'pending_signatures' && 'Pending'}
                                {contract.signing_status === 'draft' && 'Draft'}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Created {format(new Date(contract.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                        
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteContract(contract.id);
                          }}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <div className="space-y-2">
                        <Button
                          onClick={() => setSelectedContract(contract)}
                          className="w-full"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Contract
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contracts;
