
import jsPDF from 'jspdf';

interface PdfOptions {
  contractType: string;
  contractData: any;
  contract: string;
  template?: string;
}

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  text: string;
}

export class EnhancedPdfGenerator {
  private pdf: jsPDF;
  private colorSchemes: { [key: string]: ColorScheme } = {
    roommate: {
      primary: '#3B82F6', // Blue
      secondary: '#DBEAFE',
      accent: '#1E40AF',
      text: '#1F2937'
    },
    friendLoan: {
      primary: '#10B981', // Green
      secondary: '#D1FAE5',
      accent: '#059669',
      text: '#1F2937'
    },
    groupTrip: {
      primary: '#8B5CF6', // Purple
      secondary: '#EDE9FE',
      accent: '#7C3AED',
      text: '#1F2937'
    },
    eventHosting: {
      primary: '#F59E0B', // Amber
      secondary: '#FEF3C7',
      accent: '#D97706',
      text: '#1F2937'
    },
    sharedSubscription: {
      primary: '#EF4444', // Red
      secondary: '#FEE2E2',
      accent: '#DC2626',
      text: '#1F2937'
    },
    casualBorrowing: {
      primary: '#06B6D4', // Cyan
      secondary: '#CFFAFE',
      accent: '#0891B2',
      text: '#1F2937'
    },
    advanced: {
      primary: '#4F46E5', // Indigo
      secondary: '#E0E7FF',
      accent: '#3730A3',
      text: '#1F2937'
    },
    default: {
      primary: '#6366F1', // Indigo
      secondary: '#E0E7FF',
      accent: '#4F46E5',
      text: '#1F2937'
    }
  };

  constructor() {
    this.pdf = new jsPDF();
  }

  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  }

  private setColor(hex: string) {
    const [r, g, b] = this.hexToRgb(hex);
    this.pdf.setTextColor(r, g, b);
  }

  private setFillColor(hex: string) {
    const [r, g, b] = this.hexToRgb(hex);
    this.pdf.setFillColor(r, g, b);
  }

  private addLotusLogo(x: number, y: number, size: number = 20) {
    // Draw a stylized lotus logo using geometric shapes
    this.pdf.setFillColor(255, 123, 89); // Orange-red gradient start
    
    // Create lotus petals using circles and curves
    const centerX = x + size/2;
    const centerY = y + size/2;
    const petalSize = size * 0.3;
    
    // Draw multiple petals in a circular pattern
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const petalX = centerX + Math.cos(angle) * petalSize * 0.5;
      const petalY = centerY + Math.sin(angle) * petalSize * 0.5;
      
      // Gradient effect by varying opacity/color
      const intensity = 255 - (i * 20);
      this.pdf.setFillColor(intensity, 80 + (i * 10), 120 + (i * 15));
      
      // Draw petal as a circle instead of ellipse
      this.pdf.circle(petalX, petalY, petalSize * 0.4, 'F');
    }
    
    // Center circle
    this.pdf.setFillColor(255, 200, 100);
    this.pdf.circle(centerX, centerY, petalSize * 0.2, 'F');
  }

  private addHeader(contractType: string, title: string) {
    const colors = this.colorSchemes[contractType] || this.colorSchemes.default;
    
    // Header background
    this.setFillColor(colors.primary);
    this.pdf.rect(0, 0, 210, 35, 'F');
    
    // Add lotus logo on the right side
    this.addLotusLogo(160, 8, 18);
    
    // Title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(20);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, 20, 22);
    
    // Subtitle line
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Professional Contract Agreement', 20, 28);
    
    return 45; // Return next Y position
  }

  private addSection(title: string, content: string, y: number, contractType: string): number {
    const colors = this.colorSchemes[contractType] || this.colorSchemes.default;
    const margin = 20;
    const maxWidth = 170;
    
    // Section background
    this.setFillColor(colors.secondary);
    this.pdf.rect(margin - 5, y - 5, maxWidth + 10, 15, 'F');
    
    // Section border
    this.setColor(colors.primary);
    this.pdf.setLineWidth(0.5);
    this.pdf.rect(margin - 5, y - 5, maxWidth + 10, 15, 'S');
    
    // Section title
    this.setColor(colors.accent);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, margin, y + 5);
    
    y += 20;
    
    // Section content
    this.setColor(colors.text);
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    
    const lines = this.pdf.splitTextToSize(content, maxWidth);
    let currentY = y;
    
    lines.forEach((line: string) => {
      if (currentY > 250) {
        this.pdf.addPage();
        currentY = 30;
      }
      this.pdf.text(line, margin, currentY);
      currentY += 6;
    });
    
    return currentY + 10;
  }

  private addSignatureSection(contractType: string, parties: string[], y: number): number {
    const colors = this.colorSchemes[contractType] || this.colorSchemes.default;
    const margin = 20;
    
    // Signature section header
    this.setColor(colors.primary);
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('DIGITAL SIGNATURES', margin, y);
    
    y += 15;
    
    parties.forEach((party, index) => {
      if (y > 240) {
        this.pdf.addPage();
        y = 30;
      }
      
      // Signature box
      this.pdf.setLineWidth(0.5);
      this.setColor(colors.primary);
      this.pdf.rect(margin, y, 80, 20, 'S');
      
      // Party name
      this.setColor(colors.text);
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(party, margin, y - 3);
      
      // Date box
      this.pdf.rect(margin + 90, y, 50, 20, 'S');
      this.pdf.text('Date:', margin + 92, y - 3);
      
      y += 35;
    });
    
    return y;
  }

  private addFooter(contractType: string, pageNum: number = 1) {
    const colors = this.colorSchemes[contractType] || this.colorSchemes.default;
    
    // Footer line
    this.setColor(colors.primary);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(20, 275, 190, 275);
    
    // Footer text with Arial font
    this.setColor(colors.text);
    this.pdf.setFontSize(8);
    this.pdf.setFont('arial', 'normal');
    this.pdf.text('Generated by GenContract', 20, 285);
    
    // Page number
    this.pdf.text(`Page ${pageNum}`, 180, 285);
  }

  private parseContractSections(contract: string, contractType: string) {
    const sections: { title: string; content: string }[] = [];
    
    // Split by common section headers
    const lines = contract.split('\n');
    let currentSection = { title: '', content: '' };
    
    lines.forEach(line => {
      const trimmed = line.trim();
      
      // Check if line is a section header (all caps or ends with colon)
      if (trimmed.match(/^[A-Z\s&:-]+:$/) || trimmed.match(/^[A-Z\s&-]+$/)) {
        if (currentSection.title && currentSection.content) {
          sections.push({ ...currentSection });
        }
        currentSection = { title: trimmed.replace(':', ''), content: '' };
      } else if (trimmed) {
        currentSection.content += (currentSection.content ? '\n' : '') + trimmed;
      }
    });
    
    // Add final section
    if (currentSection.title && currentSection.content) {
      sections.push(currentSection);
    }
    
    return sections;
  }

  public generateEnhancedPdf(options: PdfOptions): jsPDF {
    const { contractType, contractData, contract } = options;
    
    // Determine contract title
    const titles: { [key: string]: string } = {
      roommate: 'ROOMMATE AGREEMENT',
      friendLoan: 'FRIEND LOAN AGREEMENT',
      groupTrip: 'GROUP TRIP AGREEMENT',
      eventHosting: 'EVENT HOSTING AGREEMENT',
      sharedSubscription: 'SHARED SUBSCRIPTION AGREEMENT',
      casualBorrowing: 'CASUAL BORROWING AGREEMENT',
      advanced: 'PROFESSIONAL CONTRACT'
    };
    
    const title = titles[contractType] || 'CONTRACT AGREEMENT';
    
    // Add header
    let currentY = this.addHeader(contractType, title);
    currentY += 10;
    
    // Parse and add sections
    const sections = this.parseContractSections(contract, contractType);
    
    sections.forEach(section => {
      if (currentY > 230) {
        this.pdf.addPage();
        currentY = 30;
      }
      currentY = this.addSection(section.title, section.content, currentY, contractType);
    });
    
    // Add signature section
    const parties = this.extractParties(contractData, contractType);
    if (parties.length > 0) {
      if (currentY > 200) {
        this.pdf.addPage();
        currentY = 30;
      }
      currentY = this.addSignatureSection(contractType, parties, currentY + 10);
    }
    
    // Add footer
    this.addFooter(contractType);
    
    return this.pdf;
  }

  private extractParties(contractData: any, contractType: string): string[] {
    const parties: string[] = [];
    
    switch (contractType) {
      case 'roommate':
        if (contractData?.user1Name) parties.push(contractData.user1Name);
        if (contractData?.user2Name) parties.push(contractData.user2Name);
        break;
      case 'friendLoan':
        if (contractData?.lenderName) parties.push(contractData.lenderName);
        if (contractData?.borrowerName) parties.push(contractData.borrowerName);
        break;
      case 'groupTrip':
        if (contractData?.organizerName) parties.push(contractData.organizerName);
        if (contractData?.members) {
          contractData.members.forEach((member: any) => {
            if (member.name) parties.push(member.name);
          });
        }
        break;
      case 'eventHosting':
        if (contractData?.hostName) parties.push(contractData.hostName);
        if (contractData?.attendees) {
          contractData.attendees.forEach((attendee: any) => {
            if (attendee.name) parties.push(attendee.name);
          });
        }
        break;
      case 'sharedSubscription':
        if (contractData?.organizerName) parties.push(contractData.organizerName);
        if (contractData?.members) {
          contractData.members.forEach((member: any) => {
            if (member.name) parties.push(member.name);
          });
        }
        break;
      case 'casualBorrowing':
        if (contractData?.ownerName) parties.push(contractData.ownerName);
        if (contractData?.borrowerName) parties.push(contractData.borrowerName);
        break;
      case 'advanced':
        if (contractData?.dynamicFields?.parties) {
          contractData.dynamicFields.parties.forEach((party: any) => {
            if (party.name) parties.push(party.name);
          });
        }
        break;
      default:
        if (contractData?.organizationData?.name) parties.push(contractData.organizationData.name);
        if (contractData?.dynamicFields?.party2) parties.push(contractData.dynamicFields.party2);
        break;
    }
    
    return parties.filter(Boolean);
  }
}

export const generateEnhancedPdf = (options: PdfOptions): jsPDF => {
  const generator = new EnhancedPdfGenerator();
  return generator.generateEnhancedPdf(options);
};
