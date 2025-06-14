
import { useContracts } from '@/hooks/use-contracts';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Navigate, Link } from 'react-router-dom';
import { FileText, Trash2, Eye, Plus, Download } from 'lucide-react';
import { format } from 'date-fns';

const Contracts = () => {
  const { user } = useAuth();
  const { contracts, loading, deleteContract } = useContracts();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleDownload = (contract: any) => {
    const blob = new Blob([contract.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contract.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">My Contracts</h1>
            <p className="text-blue-100">Manage your saved contracts</p>
          </div>
          <div className="flex gap-4">
            <Link to="/">
              <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30">
                <Plus className="w-4 h-4 mr-2" />
                Create New
              </Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-white/95 backdrop-blur-lg">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : contracts.length === 0 ? (
          <Card className="bg-white/95 backdrop-blur-lg text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">No contracts yet</h3>
              <p className="text-gray-600 mb-6">Create your first contract to get started</p>
              <Link to="/">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Contract
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contracts.map((contract) => (
              <Card key={contract.id} className="bg-white/95 backdrop-blur-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{contract.title}</CardTitle>
                      <Badge variant="secondary" className="mb-2">
                        {contract.contract_type}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Created {format(new Date(contract.created_at), 'MMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(contract)}
                      className="flex-1"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteContract(contract.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contracts;
