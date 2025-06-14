
import { useState, useEffect } from 'react';
import { Organization } from '@/types';

export const useOrganization = () => {
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('organization');
    if (saved) {
      try {
        setOrganization(JSON.parse(saved));
      } catch (error) {
        console.error('Error parsing saved organization:', error);
      }
    }
  }, []);

  const saveOrganization = async (orgData: Organization) => {
    localStorage.setItem('organization', JSON.stringify(orgData));
    setOrganization(orgData);
  };

  const clearOrganization = async () => {
    localStorage.removeItem('organization');
    setOrganization(null);
  };

  return {
    organization,
    saveOrganization,
    clearOrganization
  };
};
