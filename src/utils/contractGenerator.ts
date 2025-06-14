
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

const getCurrentDate = () => {
  return new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const generateRentalContract = (data: any) => {
  return `
RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement ("Agreement") is entered into on ${data.startDate || getCurrentDate()}, by and between:

LANDLORD/LESSOR:
Name: ${data.party1Name}
Address: ${data.party1Address || '[COMPLETE ADDRESS]'}
Phone: ${data.party1Email || '[PHONE NUMBER]'}
${data.party1Role ? `Company: ${data.party1Role}` : ''}

TENANT/LESSEE:
Name: ${data.party2Name}
Address: ${data.party2Address || '[CURRENT ADDRESS]'}
Phone: ${data.party2Email || '[PHONE NUMBER]'}
${data.party2Role ? `Emergency Contact: ${data.party2Role}` : ''}

RENTAL PROPERTY:
Property Address: ${data.party1Address || '[RENTAL PROPERTY ADDRESS]'}
Unit Number: ${data.additionalTerms?.includes('unit') ? '[UNIT NUMBER]' : 'N/A'}
Type: ${data.scope || 'Residential Dwelling'}

TERMS AND CONDITIONS

1. LEASE TERM
   Start Date: ${data.startDate || '[START DATE]'}
   End Date: ${data.endDate || '[END DATE]'}
   Total Term: ${data.duration || '12 months'}

2. RENT AND PAYMENT TERMS
   Monthly Rent: $${data.paymentAmount || '[AMOUNT]'}
   Payment Due: ${data.paymentTerms || 'First day of each month'}
   Late Fee: $50.00 after 5-day grace period
   Security Deposit: $${data.paymentAmount ? (parseInt(data.paymentAmount) * 1.5).toString() : '[DEPOSIT AMOUNT]'}
   
   Payment Methods: Check, money order, or electronic transfer
   Payable to: ${data.party1Name}
   Payment Address: ${data.party1Address || '[PAYMENT ADDRESS]'}

3. USE OF PREMISES
   The premises shall be used solely as a private residential dwelling by the Tenant(s) named above.
   Maximum occupancy: [NUMBER] persons
   No commercial activities without written consent
   Pets: ${data.additionalTerms?.includes('pets') ? 'Allowed with additional deposit' : 'Not permitted without prior written consent'}

4. MAINTENANCE AND REPAIRS
   Landlord Responsibilities:
   • Maintain structural integrity of the property
   • Ensure all major systems (plumbing, electrical, HVAC) are in working order
   • Comply with all local housing codes and regulations
   • Maintain common areas (if applicable)

   Tenant Responsibilities:
   • Keep premises clean and sanitary
   • Report maintenance issues promptly
   • Replace light bulbs and batteries in smoke detectors
   • Prevent damage beyond normal wear and tear

5. UTILITIES AND SERVICES
   Landlord Pays: [LIST UTILITIES]
   Tenant Pays: [LIST UTILITIES]
   Service Setup: Tenant responsible for transferring utilities to their name

6. RULES AND REGULATIONS
   • No smoking inside the premises
   • Quiet hours: 10:00 PM to 8:00 AM
   • No illegal activities on the premises
   • Comply with all HOA rules (if applicable)
   • Proper waste disposal and recycling

7. ENTRY AND INSPECTION
   Landlord may enter premises with 24-hour written notice for:
   • Routine inspections (maximum twice per year)
   • Necessary repairs or maintenance
   • Showing to prospective tenants (last 30 days of lease)
   • Emergency situations (immediate entry permitted)

8. ALTERATIONS AND IMPROVEMENTS
   No alterations, additions, or improvements without written consent
   Any unauthorized changes may result in restoration costs
   Tenant improvements become property of Landlord unless otherwise agreed

9. ASSIGNMENT AND SUBLETTING
   Tenant may not assign lease or sublet without written consent
   Consent will not be unreasonably withheld
   All occupants must be approved by Landlord

10. TERMINATION
    ${data.terminationClause || 'Either party may terminate with 30 days written notice. Early termination by Tenant may result in forfeiture of security deposit and additional penalties.'}
    
    Grounds for immediate termination:
    • Non-payment of rent after 3-day notice
    • Violation of lease terms after opportunity to cure
    • Illegal activities on premises
    • Damage to property beyond normal wear and tear

11. SECURITY DEPOSIT
    Security deposit will be held in accordance with state law
    Deposit will be returned within 30 days after lease termination
    Deductions may be made for:
    • Unpaid rent or fees
    • Cleaning beyond normal wear and tear
    • Repairs for tenant-caused damage
    • Unreturned keys

12. DISCLOSURES AND NOTICES

    LEAD-BASED PAINT DISCLOSURE (Pre-1978 Properties):
    ${data.jurisdiction?.includes('California') ? 'California law requires disclosure of known lead-based paint hazards.' : 'Federal law requires disclosure of known lead-based paint hazards.'}

    ENVIRONMENTAL HAZARDS:
    • Tenant acknowledges receipt of environmental disclosure information
    • Property may contain substances known to cause cancer or reproductive harm
    • Tenant should review all provided safety information

    PEST CONTROL:
    Regular pest control services will be provided quarterly
    Tenant must provide access for scheduled treatments
    Additional treatments may be charged to Tenant if caused by Tenant actions

13. INSURANCE
    Landlord maintains property insurance covering the structure
    Tenant is strongly encouraged to obtain renter's insurance
    Landlord not liable for Tenant's personal property loss or damage

14. DISPUTE RESOLUTION
    Governing Law: ${data.jurisdiction || 'State of [STATE]'}
    Any disputes will be resolved through:
    1. Good faith negotiation
    2. Mediation through local housing authority
    3. Binding arbitration if mediation fails
    4. Court action as last resort

15. ADDITIONAL TERMS AND CONDITIONS
    ${data.additionalTerms || 'None specified.'}

16. ENTIRE AGREEMENT
    This Agreement constitutes the entire agreement between parties
    No oral agreements or representations are binding
    Modifications must be in writing and signed by both parties

17. SEVERABILITY
    If any provision is deemed invalid, remaining provisions remain in effect

18. FAIR HOUSING STATEMENT
    This property is offered in compliance with federal, state, and local fair housing laws
    No discrimination based on race, color, religion, sex, national origin, disability, or familial status

ACKNOWLEDGMENT OF RECEIPT
Tenant acknowledges receipt of:
☐ Copy of this signed lease agreement
☐ Lead-based paint disclosure (if applicable)
☐ Environmental hazard disclosures
☐ Tenant rights information
☐ Property rules and regulations
☐ Emergency contact information

SIGNATURES

LANDLORD:                          DATE: ______________
_________________________________
${data.party1Name}
Print Name: ${data.party1Name}

TENANT:                            DATE: ______________
_________________________________
${data.party2Name}
Print Name: ${data.party2Name}

WITNESS/NOTARY:                    DATE: ______________
_________________________________
Print Name: ______________________

State of ${data.jurisdiction?.split(' ')[0] || '_______'}
County of ________________

On this _____ day of __________, 20___, before me personally appeared ${data.party1Name} and ${data.party2Name}, who proved to me on the basis of satisfactory evidence to be the persons whose names are subscribed to the within instrument and acknowledged to me that they executed the same.

_________________________________
Notary Public Signature

[NOTARY SEAL]

---
LEGAL DISCLAIMER: This rental agreement is AI-generated for informational purposes only. 
It must be reviewed by a qualified attorney to ensure compliance with local, state, and federal laws.
Local rent control ordinances, tenant protection laws, and housing regulations may apply.
Generated by GenContract AI on ${getCurrentDate()}.

PAGE 1 OF 3
  `.trim();
};

const generateNDAContract = (data: any) => {
  return `
MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement ("Agreement") is entered into on ${data.startDate || getCurrentDate()} by and between:

FIRST PARTY (Disclosing Party):
Company/Individual: ${data.party1Name}
Address: ${data.party1Address || '[COMPLETE ADDRESS]'}
Contact: ${data.party1Email || '[EMAIL/PHONE]'}
Title/Role: ${data.party1Role || '[TITLE/ROLE]'}

SECOND PARTY (Receiving Party):
Company/Individual: ${data.party2Name}
Address: ${data.party2Address || '[COMPLETE ADDRESS]'}
Contact: ${data.party2Email || '[EMAIL/PHONE]'}
Title/Role: ${data.party2Role || '[TITLE/ROLE]'}

RECITALS

WHEREAS, the parties wish to explore potential business opportunities, collaborations, partnerships, or other mutually beneficial relationships;

WHEREAS, in the course of such discussions, each party may disclose to the other certain confidential, proprietary, or trade secret information;

WHEREAS, both parties desire to protect such confidential information and maintain its secrecy;

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, the parties agree as follows:

1. DEFINITION OF CONFIDENTIAL INFORMATION

"Confidential Information" means any and all non-public, proprietary, or confidential information disclosed by either party to the other, whether orally, in writing, electronically, or in any other form, including but not limited to:

a) Technical Information: Trade secrets, know-how, research data, product plans, products, services, software, developments, inventions, processes, formulas, technology, designs, drawings, engineering, hardware configuration, marketing plans, or other business information;

b) Business Information: Customer lists, supplier information, pricing data, financial information, business plans, marketing strategies, sales data, or operational procedures;

c) Personal Information: Employee data, contractor information, or any personally identifiable information;

d) Strategic Information: Business development plans, merger and acquisition discussions, partnership negotiations, or competitive analysis;

e) Any other information that a reasonable person would consider confidential, proprietary, or trade secret in nature.

2. OBLIGATIONS OF RECEIVING PARTY

Each party, as a Receiving Party, agrees to:

a) Hold all Confidential Information received from the Disclosing Party in strict confidence;

b) Use the same degree of care to protect Confidential Information as it uses to protect its own confidential information, but in no event less than reasonable care;

c) Not disclose Confidential Information to any third parties without the prior written consent of the Disclosing Party;

d) Use Confidential Information solely for the purpose of evaluating potential business opportunities between the parties;

e) Limit access to Confidential Information to employees, agents, or advisors who have a legitimate need to know and who are bound by confidentiality obligations at least as restrictive as those contained herein;

f) Not reverse engineer, disassemble, or decompile any software, hardware, or other materials containing Confidential Information;

g) Not use Confidential Information to develop competing products or services.

3. EXCEPTIONS TO CONFIDENTIALITY

The obligations set forth in Section 2 shall not apply to information that:

a) Is or becomes publicly available through no breach of this Agreement by the Receiving Party;

b) Was rightfully known to the Receiving Party prior to disclosure, as evidenced by written documentation;

c) Is rightfully received by the Receiving Party from a third party without breach of any confidentiality obligation;

d) Is independently developed by the Receiving Party without use of or reference to Confidential Information;

e) Is required to be disclosed by law, regulation, or court order, provided that the Receiving Party gives reasonable advance notice to the Disclosing Party to enable them to seek protective relief.

4. RETURN OR DESTRUCTION OF MATERIALS

Upon termination of discussions, or upon written request by the Disclosing Party, the Receiving Party shall promptly:

a) Return all documents, materials, and other tangible manifestations of Confidential Information;

b) Destroy all copies, notes, summaries, or derivatives thereof in any form;

c) Certify in writing the completion of such return and destruction.

5. NO LICENSE OR WARRANTIES

a) No license or other rights to Confidential Information are granted or implied by this Agreement;

b) All Confidential Information is provided "as is" without any warranties of any kind;

c) Neither party makes any representation as to the accuracy or completeness of Confidential Information.

6. TERM AND TERMINATION

This Agreement shall commence on the date first written above and shall continue for a period of ${data.duration || 'five (5) years'} unless:

a) Earlier terminated by mutual written consent of the parties;

b) Terminated by either party with thirty (30) days written notice;

c) The obligations of confidentiality shall survive termination and continue indefinitely.

7. REMEDIES AND ENFORCEMENT

a) The Receiving Party acknowledges that any breach of this Agreement may cause irreparable harm to the Disclosing Party;

b) The Disclosing Party shall be entitled to seek equitable relief, including injunction and specific performance, without prejudice to other available remedies;

c) The prevailing party in any legal action shall be entitled to recover reasonable attorney's fees and costs.

8. COMPLIANCE WITH LAWS

Both parties shall comply with all applicable laws, regulations, and export control restrictions in handling Confidential Information.

9. GOVERNING LAW AND JURISDICTION

This Agreement shall be governed by and construed in accordance with the laws of ${data.jurisdiction || '[STATE/COUNTRY]'}, without regard to conflict of law principles.

Any disputes arising under this Agreement shall be subject to the exclusive jurisdiction of the courts located in ${data.jurisdiction || '[JURISDICTION]'}.

10. ENTIRE AGREEMENT AND AMENDMENTS

This Agreement constitutes the entire agreement between the parties regarding the subject matter hereof and supersedes all prior negotiations, representations, or agreements relating to such subject matter.

This Agreement may only be amended by a written instrument signed by both parties.

11. SEVERABILITY

If any provision of this Agreement is held to be invalid, illegal, or unenforceable, the validity, legality, and enforceability of the remaining provisions shall not be affected or impaired.

12. COUNTERPARTS

This Agreement may be executed in counterparts, including electronic signatures, each of which shall be deemed an original and all of which together shall constitute one and the same instrument.

${data.additionalTerms ? `\n13. ADDITIONAL TERMS AND CONDITIONS\n\n${data.additionalTerms}` : ''}

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

FIRST PARTY:                      SECOND PARTY:

_____________________________     _____________________________
${data.party1Name}                ${data.party2Name}
${data.party1Role || 'Authorized Representative'}    ${data.party2Role || 'Authorized Representative'}

Date: _______________________     Date: _______________________

Print Name: _________________     Print Name: _________________

WITNESS:                          NOTARY PUBLIC:

_____________________________     _____________________________

Date: _______________________     Date: _______________________

State of ${data.jurisdiction?.split(' ')[0] || '_______'}
County of ________________

[Add notarization block if required by law]

---
LEGAL DISCLAIMER: This NDA is AI-generated for informational purposes only.
Consult with a qualified attorney before execution to ensure compliance with applicable laws.
Consider additional protections for highly sensitive information.
Generated by GenContract AI on ${getCurrentDate()}.

PAGE 1 OF 2
  `.trim();
};

const generateFreelanceContract = (data: any) => {
  return `
INDEPENDENT CONTRACTOR SERVICES AGREEMENT

This Independent Contractor Services Agreement ("Agreement") is entered into on ${data.startDate || getCurrentDate()} by and between:

CLIENT:
Name/Company: ${data.party1Name}
Address: ${data.party1Address || '[COMPLETE ADDRESS]'}
Contact: ${data.party1Email || '[EMAIL/PHONE]'}
${data.party1Role ? `Title: ${data.party1Role}` : ''}

CONTRACTOR:
Name: ${data.party2Name}
Business Address: ${data.party2Address || '[BUSINESS ADDRESS]'}
Contact: ${data.party2Email || '[EMAIL/PHONE]'}
${data.party2Role ? `Professional Title: ${data.party2Role}` : ''}
Tax ID/SSN: [TAX IDENTIFICATION NUMBER]

AGREEMENT TERMS

WHEREAS, Client desires to engage Contractor to provide certain professional services; and
WHEREAS, Contractor represents that they have the qualifications, experience, and ability to provide such services;

NOW, THEREFORE, the parties agree as follows:

1. SERVICES TO BE PROVIDED

Contractor agrees to provide the following services ("Services"):

${data.scope || `[DETAILED DESCRIPTION OF SERVICES TO BE PROVIDED]

The Services shall include, but not be limited to:
• [Specific task or deliverable 1]
• [Specific task or deliverable 2]
• [Specific task or deliverable 3]
• [Additional services as mutually agreed]`}

All Services shall be performed in a professional and workmanlike manner in accordance with industry standards and best practices.

2. DELIVERABLES AND MILESTONES

The following deliverables shall be provided according to the specified timeline:

${data.deliverables || `Milestone 1: [DELIVERABLE] - Due: [DATE]
Milestone 2: [DELIVERABLE] - Due: [DATE]
Milestone 3: [DELIVERABLE] - Due: [DATE]
Final Delivery: [FINAL DELIVERABLE] - Due: [DATE]`}

All deliverables must be approved by Client before considered complete.
Revisions will be provided within reasonable limits as specified in project scope.

3. COMPENSATION AND PAYMENT TERMS

a) Total Contract Value: $${data.paymentAmount || '[TOTAL AMOUNT]'}

b) Payment Structure:
   ${data.paymentTerms || `• 50% deposit upon contract execution
   • 25% upon completion of Milestone 2
   • 25% upon final delivery and acceptance`}

c) Payment Terms: Net 15 days from invoice date

d) Late Payment: Interest of 1.5% per month will be charged on overdue amounts

e) Additional Work: Any work outside the agreed scope will be billed at $[HOURLY RATE]/hour

f) Expenses: Pre-approved expenses will be reimbursed with proper documentation

4. PROJECT TIMELINE

a) Project Start Date: ${data.startDate || '[START DATE]'}
b) Project Completion Date: ${data.endDate || '[COMPLETION DATE]'}
c) Total Project Duration: ${data.duration || '[PROJECT DURATION]'}

Time is of the essence. Any delays must be communicated immediately.
Extensions may be granted for circumstances beyond Contractor's control.

5. INDEPENDENT CONTRACTOR RELATIONSHIP

a) Contractor is an independent contractor, not an employee of Client
b) Contractor is responsible for:
   • All applicable taxes (federal, state, local)
   • Worker's compensation insurance
   • Professional liability insurance
   • General liability insurance
   • All business licenses and permits

c) Contractor has the right to control the manner and means of performing Services
d) Contractor is not entitled to employee benefits
e) Contractor may work for other clients unless specifically restricted

6. INTELLECTUAL PROPERTY RIGHTS

a) Work Product: All work products, deliverables, and materials created specifically for this project shall be owned by Client upon full payment

b) Pre-existing IP: Contractor retains ownership of all pre-existing intellectual property, tools, and methodologies

c) License Grant: Contractor grants Client a perpetual, worldwide, non-exclusive license to use the work product

d) Third-Party Materials: Any third-party materials used must be properly licensed

7. CONFIDENTIALITY AND NON-DISCLOSURE

Contractor agrees to:
a) Maintain strict confidentiality of all Client proprietary information
b) Not disclose confidential information to third parties
c) Use confidential information solely for performing Services
d) Return all confidential materials upon project completion

8. WARRANTIES AND REPRESENTATIONS

Contractor warrants that:
a) Services will be performed in a professional manner
b) Work will be original and will not infringe third-party rights
c) Contractor has the authority to enter into this Agreement
d) All deliverables will conform to specifications
e) Contractor will comply with all applicable laws

9. LIMITATION OF LIABILITY

a) Contractor's total liability shall not exceed the total amount paid under this Agreement
b) Neither party shall be liable for indirect, incidental, or consequential damages
c) Client's sole remedy for defective work is re-performance or refund

10. INDEMNIFICATION

Each party agrees to indemnify and hold harmless the other party from claims arising out of:
a) Their own negligent acts or omissions
b) Breach of this Agreement
c) Violation of applicable laws

11. TERMINATION

${data.terminationClause || `Either party may terminate this Agreement:
a) With 30 days written notice for convenience
b) Immediately for material breach after 7 days notice and opportunity to cure
c) Immediately for bankruptcy, insolvency, or assignment for creditors

Upon termination:
• Contractor will be paid for work completed
• All work products will be delivered to Client
• Confidentiality obligations continue`}

12. FORCE MAJEURE

Neither party shall be liable for delays or failures due to circumstances beyond their reasonable control, including acts of God, government actions, or pandemics.

13. DISPUTE RESOLUTION

a) Governing Law: This Agreement shall be governed by the laws of ${data.jurisdiction || '[STATE/JURISDICTION]'}

b) Dispute Resolution Process:
   1. Good faith negotiation
   2. Mediation through [MEDIATION SERVICE]
   3. Binding arbitration if mediation fails
   4. Court action as last resort

14. GENERAL PROVISIONS

a) Entire Agreement: This Agreement constitutes the entire agreement between parties
b) Amendments: Must be in writing and signed by both parties
c) Severability: Invalid provisions do not affect remaining terms
d) Assignment: Neither party may assign without written consent
e) Counterparts: May be executed in counterparts, including electronic signatures

${data.additionalTerms ? `\n15. ADDITIONAL TERMS AND CONDITIONS\n\n${data.additionalTerms}` : ''}

EXECUTION

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

CLIENT:                           CONTRACTOR:

_____________________________     _____________________________
${data.party1Name}               ${data.party2Name}
${data.party1Role || 'Authorized Representative'}    ${data.party2Role || 'Independent Contractor'}

Date: _______________________     Date: _______________________

Print Name: _________________     Print Name: _________________

Tax ID: ____________________     Tax ID: ____________________

---
LEGAL DISCLAIMER: This contract is AI-generated for informational purposes only.
Please consult with a qualified attorney before execution to ensure compliance with local employment and tax laws.
Generated by GenContract AI on ${getCurrentDate()}.

PAGE 1 OF 3
  `.trim();
};

const generateEmploymentContract = (data: any) => {
  return `
EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into on ${data.startDate || getCurrentDate()} by and between:

EMPLOYER:
Company: ${data.party1Name}
Address: ${data.party1Address || '[COMPANY ADDRESS]'}
Contact: ${data.party1Email || '[HR CONTACT]'}
${data.party1Role ? `Department: ${data.party1Role}` : ''}

EMPLOYEE:
Name: ${data.party2Name}
Address: ${data.party2Address || '[EMPLOYEE ADDRESS]'}
Contact: ${data.party2Email || '[EMAIL/PHONE]'}
Position: ${data.party2Role || '[JOB TITLE]'}
Employee ID: [TO BE ASSIGNED]

EMPLOYMENT TERMS

1. POSITION AND DUTIES
   Position Title: ${data.party2Role || '[JOB TITLE]'}
   Department: ${data.scope || '[DEPARTMENT]'}
   Reports To: [SUPERVISOR NAME/TITLE]
   
   Duties and Responsibilities:
   ${data.deliverables || `• [Primary responsibility 1]
   • [Primary responsibility 2]
   • [Primary responsibility 3]
   • Such other duties as may be assigned by management`}

2. EMPLOYMENT TERM
   Start Date: ${data.startDate || '[START DATE]'}
   Employment Type: ${data.duration?.includes('permanent') ? 'Permanent' : 'At-will employment'}
   ${data.endDate ? `Contract End Date: ${data.endDate}` : 'No specified end date'}

3. COMPENSATION AND BENEFITS
   Base Salary: $${data.paymentAmount || '[ANNUAL SALARY]'} per year
   Pay Frequency: ${data.paymentTerms || 'Bi-weekly'}
   Payment Method: Direct deposit
   
   Benefits Package:
   • Health insurance (effective after 90 days)
   • Dental and vision coverage
   • 401(k) retirement plan with company matching
   • Paid time off (PTO) - [NUMBER] days annually
   • Sick leave as per company policy
   • Professional development opportunities

4. WORK SCHEDULE
   Standard Hours: 40 hours per week
   Schedule: Monday - Friday, 9:00 AM - 5:00 PM
   Location: ${data.additionalTerms?.includes('remote') ? 'Remote work authorized' : 'On-site at company premises'}
   Overtime: Paid in accordance with applicable law

5. CONFIDENTIALITY AND NON-DISCLOSURE
   Employee agrees to maintain confidentiality of:
   • Trade secrets and proprietary information
   • Customer lists and pricing information
   • Business strategies and financial data
   • Personnel information
   Confidentiality obligations survive termination of employment.

6. INTELLECTUAL PROPERTY
   All work products, inventions, and creations developed during employment belong to the Company.
   Employee assigns all rights to work-related intellectual property to the Company.

7. NON-COMPETE AND NON-SOLICITATION
   ${data.jurisdiction?.includes('California') ? 'Non-compete clauses are not enforceable in California.' : `For a period of [TIME PERIOD] after termination, Employee agrees not to:
   • Work for direct competitors
   • Solicit Company customers or employees
   • Use confidential information for competitive purposes`}

8. TERMINATION
   ${data.terminationClause || `Employment may be terminated:
   • By Employee with 2 weeks notice
   • By Company with or without cause
   • Immediately for violation of company policies
   
   Upon termination, Employee will receive:
   • Final paycheck including accrued PTO
   • COBRA insurance continuation rights
   • Return of company property required`}

9. EMPLOYEE HANDBOOK
   Employee acknowledges receipt of and agrees to comply with the Employee Handbook.
   Policies may be updated at Company's discretion.

IN WITNESS WHEREOF, the parties execute this Agreement.

EMPLOYER:                         EMPLOYEE:

_____________________________     _____________________________
${data.party1Name}               ${data.party2Name}
Authorized Representative         Employee

Date: _______________________     Date: _______________________

---
Generated by GenContract AI on ${getCurrentDate()}.
  `.trim();
};

const generatePartnershipContract = (data: any) => {
  return `
BUSINESS PARTNERSHIP AGREEMENT

This Partnership Agreement is entered into on ${data.startDate || getCurrentDate()} by and between:

PARTNER 1:
Name: ${data.party1Name}
Address: ${data.party1Address || '[ADDRESS]'}
Contact: ${data.party1Email || '[CONTACT]'}
Contribution: ${data.party1Role || '[CONTRIBUTION]'}

PARTNER 2:
Name: ${data.party2Name}
Address: ${data.party2Address || '[ADDRESS]'}
Contact: ${data.party2Email || '[CONTACT]'}
Contribution: ${data.party2Role || '[CONTRIBUTION]'}

PARTNERSHIP TERMS

1. BUSINESS PURPOSE
   ${data.scope || 'The partnership shall engage in [BUSINESS ACTIVITIES]'}

2. CAPITAL CONTRIBUTIONS
   Total Initial Capital: $${data.paymentAmount || '[AMOUNT]'}
   Partner 1 Contribution: $[AMOUNT] ([PERCENTAGE]%)
   Partner 2 Contribution: $[AMOUNT] ([PERCENTAGE]%)

3. PROFIT AND LOSS SHARING
   Profits and losses shall be shared equally unless otherwise specified.
   ${data.paymentTerms || 'Monthly profit distributions will be made.'}

4. MANAGEMENT AND DECISION MAKING
   Major decisions require unanimous consent.
   Day-to-day operations may be handled by either partner.

5. PARTNERSHIP DURATION
   ${data.duration || 'The partnership shall continue indefinitely until terminated.'}

IN WITNESS WHEREOF, the parties execute this Agreement.

_____________________________     _____________________________
${data.party1Name}               ${data.party2Name}

Date: _______________________     Date: _______________________

---
Generated by GenContract AI on ${getCurrentDate()}.
  `.trim();
};

const generateConsultingContract = (data: any) => {
  return `
CONSULTING SERVICES AGREEMENT

This Consulting Agreement is entered into on ${data.startDate || getCurrentDate()} by and between:

CLIENT: ${data.party1Name}
CONSULTANT: ${data.party2Name}

1. CONSULTING SERVICES
   ${data.scope || 'Consultant will provide professional consulting services as specified.'}

2. COMPENSATION
   Total Fee: $${data.paymentAmount || '[AMOUNT]'}
   Payment Terms: ${data.paymentTerms || 'Net 30 days'}

3. TERM
   Duration: ${data.duration || '[DURATION]'}
   Start: ${data.startDate || '[START DATE]'}
   End: ${data.endDate || '[END DATE]'}

4. DELIVERABLES
   ${data.deliverables || 'Specific deliverables to be provided as outlined in project scope.'}

5. CONFIDENTIALITY
   Consultant agrees to maintain confidentiality of all client information.

IN WITNESS WHEREOF, the parties execute this Agreement.

_____________________________     _____________________________
${data.party1Name}               ${data.party2Name}

Date: _______________________     Date: _______________________

---
Generated by GenContract AI on ${getCurrentDate()}.
  `.trim();
};

const generateLicenseContract = (data: any) => {
  return `
SOFTWARE/INTELLECTUAL PROPERTY LICENSE AGREEMENT

This License Agreement is entered into on ${data.startDate || getCurrentDate()} by and between:

LICENSOR: ${data.party1Name}
LICENSEE: ${data.party2Name}

1. LICENSED PROPERTY
   ${data.scope || 'Licensor grants Licensee rights to use specified intellectual property.'}

2. LICENSE TERMS
   Type: ${data.additionalTerms || 'Non-exclusive license'}
   Duration: ${data.duration || '[DURATION]'}
   Territory: ${data.jurisdiction || '[TERRITORY]'}

3. ROYALTIES AND PAYMENTS
   License Fee: $${data.paymentAmount || '[AMOUNT]'}
   Royalties: ${data.paymentTerms || '[ROYALTY STRUCTURE]'}

4. RESTRICTIONS
   Licensee may not sublicense without written consent.
   Use limited to specified purposes only.

5. TERMINATION
   ${data.terminationClause || 'Either party may terminate with 30 days notice.'}

IN WITNESS WHEREOF, the parties execute this Agreement.

_____________________________     _____________________________
${data.party1Name}               ${data.party2Name}

Date: _______________________     Date: _______________________

---
Generated by GenContract AI on ${getCurrentDate()}.
  `.trim();
};

const generateGenericContract = (data: any) => {
  return `
GENERAL SERVICE AGREEMENT

This Agreement is entered into on ${data.startDate || getCurrentDate()} between:

PARTY 1: ${data.party1Name}
PARTY 2: ${data.party2Name}

1. SERVICES: ${data.scope || '[SCOPE OF WORK]'}
2. COMPENSATION: $${data.paymentAmount || '[AMOUNT]'}
3. TERM: ${data.duration || '[DURATION]'}
4. ADDITIONAL TERMS: ${data.additionalTerms || 'None specified'}

IN WITNESS WHEREOF, the parties execute this Agreement.

_____________________________     _____________________________
${data.party1Name}               ${data.party2Name}

Date: _______________________     Date: _______________________

---
Generated by GenContract AI on ${getCurrentDate()}.
  `.trim();
};
