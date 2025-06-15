
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Contract {
  id: string;
  title: string;
  contract_type: string;
  content: string;
  contract_data: any;
  signing_status?: string;
  created_at: string;
  updated_at: string;
}

export const useContracts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContracts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContracts(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching contracts",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveContract = async (
    title: string,
    contractType: string,
    content: string,
    contractData: any
  ) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('contracts')
        .insert({
          user_id: user.id,
          title,
          contract_type: contractType,
          content,
          contract_data: contractData,
          signing_status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      setContracts(prev => [data, ...prev]);
      toast({
        title: "Contract saved",
        description: "Your contract has been saved successfully."
      });
      return data;
    } catch (error: any) {
      toast({
        title: "Error saving contract",
        description: error.message,
        variant: "destructive"
      });
      throw error;
    }
  };

  const deleteContract = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setContracts(prev => prev.filter(c => c.id !== id));
      toast({
        title: "Contract deleted",
        description: "The contract has been deleted successfully."
      });
    } catch (error: any) {
      toast({
        title: "Error deleting contract",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchContracts();
  }, [user]);

  return {
    contracts,
    loading,
    saveContract,
    deleteContract,
    refetch: fetchContracts
  };
};
