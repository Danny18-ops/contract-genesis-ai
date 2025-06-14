
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Zap, FileText, Home, Users } from 'lucide-react';

interface FormAutomationProps {
  onAutoFill: (data: any) => void;
}

export const FormAutomation = ({ onAutoFill }: FormAutomationProps) => {
  const sampleData = {
    nda: {
      contractType: 'nda',
      party1Name: 'TechCorp Industries',
      party1Address: '123 Innovation Drive, San Francisco, CA 94105',
      party1Email: 'legal@techcorp.com',
      party1Role: 'Technology Company',
      party2Name: 'Sarah Johnson',
      party2Address: '456 Oak Street, Palo Alto, CA 94301',
      party2Email: 'sarah.johnson@email.com',
      party2Role: 'Software Consultant',
      duration: '5 years',
      scope: 'Confidential information sharing for potential software development collaboration, including proprietary algorithms, client data, and business strategies.',
      jurisdiction: 'State of California, USA',
      additionalTerms: 'This agreement covers all forms of communication including digital, verbal, and written exchanges.'
    },
    freelance: {
      contractType: 'freelance',
      party1Name: 'Digital Marketing Agency LLC',
      party1Address: '789 Business Plaza, New York, NY 10001',
      party1Email: 'contracts@digitalagency.com',
      party1Role: 'Marketing Agency',
      party2Name: 'Alex Rodriguez',
      party2Address: '321 Freelancer Avenue, Brooklyn, NY 11201',
      party2Email: 'alex.rodriguez@freelancer.com',
      party2Role: 'Web Developer',
      paymentAmount: '75000',
      paymentTerms: 'Monthly payments, Net 15 days',
      duration: '12 months',
      startDate: '2024-07-01',
      endDate: '2025-06-30',
      scope: 'Complete website redesign and development including responsive design, e-commerce functionality, SEO optimization, and content management system integration.',
      deliverables: 'Phase 1: Wireframes and design mockups (Month 1)\nPhase 2: Frontend development (Months 2-3)\nPhase 3: Backend integration (Months 4-5)\nPhase 4: Testing and deployment (Month 6)',
      jurisdiction: 'State of New York, USA'
    },
    rental: {
      contractType: 'rental',
      party1Name: 'Premium Properties LLC',
      party1Address: '555 Landlord Street, Austin, TX 78701',
      party1Email: 'leasing@premiumproperties.com',
      party1Role: 'Property Management Company',
      party2Name: 'Emily Chen',
      party2Address: '777 Current Address, Dallas, TX 75201',
      party2Email: 'emily.chen@email.com',
      party2Role: 'Software Engineer',
      paymentAmount: '2800',
      paymentTerms: 'Monthly rent due on 1st of each month',
      duration: '12 months',
      startDate: '2024-08-01',
      endDate: '2025-07-31',
      scope: 'Two-bedroom, two-bathroom apartment with balcony, parking space, and access to building amenities including gym and pool.',
      jurisdiction: 'State of Texas, USA',
      additionalTerms: 'Pet-friendly with additional deposit. Utilities included except electricity and internet.'
    }
  };

  return (
    <Card className="border-purple-100 bg-purple-50/30 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-purple-900">Quick Start Templates</h3>
        </div>
        <p className="text-sm text-purple-700 mb-4">
          Skip manual entry with pre-filled sample data for testing and demonstration purposes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAutoFill(sampleData.nda)}
            className="flex items-center gap-2 bg-white hover:bg-purple-50"
          >
            <FileText className="w-4 h-4" />
            NDA Sample
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAutoFill(sampleData.freelance)}
            className="flex items-center gap-2 bg-white hover:bg-purple-50"
          >
            <Users className="w-4 h-4" />
            Freelance Sample
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAutoFill(sampleData.rental)}
            className="flex items-center gap-2 bg-white hover:bg-purple-50"
          >
            <Home className="w-4 h-4" />
            Rental Sample
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
