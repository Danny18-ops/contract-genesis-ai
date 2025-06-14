
export const generateDetailedContract = (data: any) => {
  const contractTemplates = {
    nda: generateNDAContract,
    freelance: generateFreelanceContract,
    rental: generateRentalContract,
    employment: generateEmploymentContract,
    partnership: generatePartnershipContract,
    consulting: generateConsultingContract,
    license: generateLicenseContract
  };

  const generator = contractTemplates[data.contractType as keyof typeof contractTemplates] || generateGenericContract;
  return generator(data);
};

const generateNDAContract = (data: any) => {
  return `
NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on ${data.startDate || '[DATE]'} by and between:

FIRST PARTY:
Name: ${data.party1Name}
Address: ${data.party1Address || '[ADDRESS]'}
Email: ${data.party1Email || '[EMAIL]'}
Role: ${data.party1Role || '[ROLE]'}

SECOND PARTY:
Name: ${data.party2Name}
Address: ${data.party2Address || '[ADDRESS]'}
Email: ${data.party2Email || '[EMAIL]'}
Role: ${data.party2Role || '[ROLE]'}

RECITALS

WHEREAS, the parties wish to engage in discussions regarding potential business opportunities, collaborations, or transactions; and

WHEREAS, in connection with such discussions, each party may disclose to the other certain confidential and proprietary information; and

WHEREAS, the parties desire to maintain the confidentiality of such information;

NOW, THEREFORE, in consideration of the mutual covenants contained herein, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION

For purposes of this Agreement, "Confidential Information" shall mean all non-public, proprietary, or confidential information disclosed by one party (the "Disclosing Party") to the other party (the "Receiving Party"), whether orally, in writing, electronically, or in any other form, including but not limited to:

a) Technical data, trade secrets, know-how, research, product plans, products, services, customers, customer lists, markets, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration information, marketing, finances, or other business information;

b) Information concerning the business, affairs, customers, clients, suppliers, plans, personnel, or finances of the Disclosing Party;

c) Any other information that a reasonable person would consider confidential or proprietary.

2. OBLIGATIONS OF RECEIVING PARTY

The Receiving Party agrees to:

a) Hold all Confidential Information in strict confidence;
b) Not disclose any Confidential Information to third parties without prior written consent;
c) Use Confidential Information solely for the purpose of evaluating potential business opportunities;
d) Take reasonable precautions to protect the confidentiality of such information;
e) Limit access to Confidential Information to employees or agents with a legitimate need to know.

3. EXCEPTIONS

The obligations set forth in Section 2 shall not apply to information that:

a) Is or becomes publicly available through no breach of this Agreement;
b) Was rightfully known by the Receiving Party prior to disclosure;
c) Is rightfully received by the Receiving Party from a third party without breach of any confidentiality obligation;
d) Is required to be disclosed by law or court order, provided that reasonable notice is given to the Disclosing Party.

4. RETURN OF MATERIALS

Upon termination of discussions or upon request by the Disclosing Party, the Receiving Party shall promptly return or destroy all documents, materials, and other tangible manifestations of Confidential Information.

5. NO LICENSE GRANTED

No license or other rights to Confidential Information are granted or implied by this Agreement.

6. TERM

This Agreement shall commence on the date first written above and shall continue for a period of ${data.duration || 'three (3) years'} unless earlier terminated by mutual consent of the parties.

7. REMEDIES

The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party, for which monetary damages would be inadequate. Therefore, the Disclosing Party shall be entitled to seek equitable relief, including injunction and specific performance.

8. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of ${data.jurisdiction || '[JURISDICTION]'}.

9. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior negotiations, representations, or agreements relating to such subject matter.

10. AMENDMENTS

This Agreement may only be amended in writing, signed by both parties.

11. SEVERABILITY

If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.

${data.additionalTerms ? `12. ADDITIONAL TERMS\n\n${data.additionalTerms}` : ''}

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

FIRST PARTY:                        SECOND PARTY:

_________________________          _________________________
${data.party1Name}                  ${data.party2Name}
${data.party1Role}                  ${data.party2Role}

Date: _________________            Date: _________________


NOTARIZATION

State of _________________
County of ________________

On this _____ day of __________, 20___, before me personally appeared ${data.party1Name} and ${data.party2Name}, who proved to me on the basis of satisfactory evidence to be the persons whose names are subscribed to the within instrument and acknowledged to me that they executed the same in their authorized capacities, and that by their signatures on the instrument the persons, or the entity upon behalf of which the persons acted, executed the instrument.

I certify under PENALTY OF PERJURY under the laws of ${data.jurisdiction || '[JURISDICTION]'} that the foregoing paragraph is true and correct.

WITNESS my hand and official seal.

_________________________
Notary Public

[NOTARY SEAL]

---
LEGAL DISCLAIMER: This contract is AI-generated for informational purposes only. 
Please consult with a qualified attorney before execution to ensure compliance with local laws and regulations.
Generated by GenContract AI on ${new Date().toLocaleDateString()}.
  `.trim();
};

const generateFreelanceContract = (data: any) => {
  return `
FREELANCE SERVICE AGREEMENT

This Freelance Service Agreement ("Agreement") is entered into on ${data.startDate || '[DATE]'} by and between:

CLIENT:
Name: ${data.party1Name}
Address: ${data.party1Address || '[ADDRESS]'}
Email: ${data.party1Email || '[EMAIL]'}
${data.party1Role ? `Company/Title: ${data.party1Role}` : ''}

CONTRACTOR:
Name: ${data.party2Name}
Address: ${data.party2Address || '[ADDRESS]'}
Email: ${data.party2Email || '[EMAIL]'}
${data.party2Role ? `Professional Title: ${data.party2Role}` : ''}

AGREEMENT

WHEREAS, Client desires to engage Contractor to provide certain services; and
WHEREAS, Contractor represents that they have the qualifications, experience, and ability to provide such services;

NOW, THEREFORE, the parties agree as follows:

1. SERVICES TO BE PROVIDED

Contractor agrees to provide the following services ("Services"):

${data.scope || '[DETAILED DESCRIPTION OF SERVICES]'}

2. DELIVERABLES AND MILESTONES

The following deliverables shall be provided according to the specified timeline:

${data.deliverables || '[LIST OF SPECIFIC DELIVERABLES WITH DEADLINES]'}

3. COMPENSATION

a) Total Contract Value: $${data.paymentAmount || '[AMOUNT]'}
b) Payment Terms: ${data.paymentTerms || '[PAYMENT SCHEDULE]'}
c) Payment Method: [Bank transfer, Check, PayPal, etc.]
d) Late Payment: Interest of 1.5% per month may be charged on overdue amounts

4. TERM AND TERMINATION

a) Effective Date: ${data.startDate || '[START DATE]'}
b) Completion Date: ${data.endDate || '[END DATE]'}
c) Duration: ${data.duration || '[CONTRACT DURATION]'}

d) Termination Conditions:
${data.terminationClause || 'Either party may terminate this agreement with 30 days written notice. In case of material breach, immediate termination is permitted after 7 days written notice and opportunity to cure.'}

5. INDEPENDENT CONTRACTOR STATUS

Contractor is an independent contractor and not an employee of Client. Contractor shall:
a) Be responsible for all applicable taxes, insurance, and benefits
b) Provide own equipment and workspace unless otherwise specified
c) Have the right to control the manner and means of performing Services
d) Not be entitled to employee benefits

6. INTELLECTUAL PROPERTY

a) Work Product: All work products, deliverables, and materials created under this Agreement shall be owned by Client
b) Pre-existing IP: Contractor retains ownership of pre-existing intellectual property
c) License Grant: Contractor grants Client a perpetual, worldwide license to use the work product

7. CONFIDENTIALITY

Contractor agrees to maintain confidentiality of all proprietary information received from Client and shall not disclose such information to third parties without prior written consent.

8. WARRANTIES AND REPRESENTATIONS

Contractor warrants that:
a) Services will be performed in a professional and workmanlike manner
b) Services will conform to industry standards
c) Work will be original and will not infringe on third-party rights
d) Contractor has the right and authority to enter into this Agreement

9. LIMITATION OF LIABILITY

Contractor's total liability under this Agreement shall not exceed the total amount paid by Client under this Agreement.

10. INDEMNIFICATION

Each party agrees to indemnify and hold harmless the other party from claims arising out of their own negligent acts or omissions.

11. GOVERNING LAW AND DISPUTE RESOLUTION

a) Governing Law: This Agreement shall be governed by the laws of ${data.jurisdiction || '[JURISDICTION]'}
b) Dispute Resolution: Any disputes shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association

12. FORCE MAJEURE

Neither party shall be liable for delays or failures in performance resulting from acts beyond their reasonable control.

13. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements.

${data.additionalTerms ? `14. ADDITIONAL TERMS AND CONDITIONS\n\n${data.additionalTerms}` : ''}

15. AMENDMENTS

This Agreement may only be modified in writing, signed by both parties.

16. SEVERABILITY

If any provision is found to be unenforceable, the remainder of the Agreement shall remain in full force and effect.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT:                             CONTRACTOR:

_________________________          _________________________
${data.party1Name}                  ${data.party2Name}
${data.party1Role || 'Client'}      ${data.party2Role || 'Contractor'}

Date: _________________            Date: _________________

Print Name: __________________     Print Name: __________________

---
LEGAL DISCLAIMER: This contract is AI-generated for informational purposes only. 
Please consult with a qualified attorney before execution to ensure compliance with local laws and regulations.
Generated by GenContract AI on ${new Date().toLocaleDateString()}.
  `.trim();
};

const generateGenericContract = (data: any) => {
  return `
SERVICE AGREEMENT

This Service Agreement ("Agreement") is entered into on ${data.startDate || '[DATE]'} between ${data.party1Name} and ${data.party2Name}.

[Contract content would be generated based on the contract type and provided information...]

TERMS: ${data.duration || '[DURATION]'}
PAYMENT: $${data.paymentAmount || '[AMOUNT]'}
SCOPE: ${data.scope || '[SCOPE OF WORK]'}

[Additional legal terms and conditions...]

${data.additionalTerms || ''}

SIGNATURES:

_________________                    _________________
${data.party1Name}                   ${data.party2Name}

Date: ___________                    Date: ___________

---
Generated by GenContract AI on ${new Date().toLocaleDateString()}.
  `.trim();
};

// Placeholder functions for other contract types
const generateRentalContract = (data: any) => generateGenericContract(data);
const generateEmploymentContract = (data: any) => generateGenericContract(data);
const generatePartnershipContract = (data: any) => generateGenericContract(data);
const generateConsultingContract = (data: any) => generateGenericContract(data);
const generateLicenseContract = (data: any) => generateGenericContract(data);
