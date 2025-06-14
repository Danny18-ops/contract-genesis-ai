
export const generateDetailedContract = (contractData: any): string => {
  const { contractType, organizationData, dynamicFields, language } = contractData;
  
  // Get current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  switch (contractType) {
    case 'rental':
      return generateRentalAgreement(organizationData, dynamicFields, currentDate);
    case 'jobOffer':
      return generateJobOfferLetter(organizationData, dynamicFields, currentDate);
    case 'business':
      return generateBusinessAgreement(organizationData, dynamicFields, currentDate);
    case 'carRental':
      return generateCarRentalContract(organizationData, dynamicFields, currentDate);
    case 'storage':
      return generateStorageContract(organizationData, dynamicFields, currentDate);
    case 'nda':
      return generateNDAContract(organizationData, dynamicFields, currentDate);
    case 'freelance':
      return generateFreelanceAgreement(organizationData, dynamicFields, currentDate);
    case 'employment':
      return generateEmploymentContract(organizationData, dynamicFields, currentDate);
    case 'partnership':
      return generatePartnershipAgreement(organizationData, dynamicFields, currentDate);
    case 'consulting':
      return generateConsultingAgreement(organizationData, dynamicFields, currentDate);
    case 'license':
      return generateLicenseAgreement(organizationData, dynamicFields, currentDate);
    default:
      return generateGenericContract(organizationData, dynamicFields, currentDate);
  }
};

const generateRentalAgreement = (org: any, fields: any, date: string): string => {
  const startDate = fields.startDate ? new Date(fields.startDate).toLocaleDateString() : '[START DATE]';
  const endDate = fields.endDate ? new Date(fields.endDate).toLocaleDateString() : '[END DATE]';
  
  return `RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement ("Agreement") is entered into on ${date}, between ${org.name || '[LANDLORD NAME]'} ("Landlord"), with its principal place of business at ${org.address || '[LANDLORD ADDRESS]'}, and ${fields.tenant || '[TENANT NAME]'} ("Tenant").

PREMISES
The Landlord hereby leases to the Tenant the following described premises: ${fields.propertyAddress || '[PROPERTY ADDRESS]'} ("Premises").

TERM
This lease shall commence on ${startDate} and shall terminate on ${endDate}, unless terminated earlier in accordance with the terms herein.

RENT
The monthly rent for the Premises is $${fields.monthlyRent || '[MONTHLY RENT]'}, due on the first day of each month. Late fees of $${fields.lateFee || '50'} will be charged for payments received after the 5th day of the month.

SECURITY DEPOSIT
Tenant shall deposit with Landlord the sum of $${fields.securityDeposit || '[SECURITY DEPOSIT]'} as security for the faithful performance of Tenant's obligations under this Agreement.

USE OF PREMISES
The Premises shall be used and occupied by Tenant exclusively as a private single-family residence. No part of the Premises shall be used for business purposes without prior written consent of Landlord.

MAINTENANCE AND REPAIRS
Tenant acknowledges that the Premises are in good order and repair. During the term hereof, Tenant shall:
a) Keep the Premises clean and sanitary
b) Dispose of all rubbish, garbage, and waste in a clean manner
c) Use only in a reasonable manner all electrical, plumbing, sanitary, heating, ventilating, air conditioning, and other facilities
d) Not permit any deterioration or damage to the Premises
e) Pay for any damage caused by Tenant's negligence or misuse

ALTERATIONS AND IMPROVEMENTS
Tenant shall make no alterations to the Premises without the prior written consent of Landlord. Any alterations made shall become the property of Landlord upon termination of this Agreement.

PETS
${fields.petsAllowed === 'yes' ? 'Pets are permitted with additional deposit of $' + (fields.petDeposit || '200') + '.' : 'No pets are permitted on the Premises without prior written consent of Landlord.'}

UTILITIES
Tenant shall be responsible for all utilities and services, including but not limited to electricity, gas, water, sewer, telephone, internet, and cable television.

INSURANCE
Tenant is encouraged to obtain renter's insurance to protect personal property and provide liability coverage.

DEFAULT
If Tenant fails to pay rent when due or otherwise defaults under this Agreement, Landlord may terminate this Agreement and pursue all legal remedies available.

QUIET ENJOYMENT
Landlord warrants that Tenant, upon payment of rent and performance of the terms herein, shall peaceably and quietly enjoy the Premises.

NOTICES
All notices shall be given in writing and delivered personally or by certified mail to the addresses set forth above.

ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties and may only be modified in writing signed by both parties.

GOVERNING LAW
This Agreement shall be governed by the laws of ${fields.state || '[STATE]'}.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

LANDLORD:                           TENANT:

_________________________          _________________________
${org.name || '[LANDLORD NAME]'}                    ${fields.tenant || '[TENANT NAME]'}

Date: _________________            Date: _________________`;
};

const generateJobOfferLetter = (org: any, fields: any, date: string): string => {
  return `JOB OFFER LETTER

${date}

${fields.candidate || '[CANDIDATE NAME]'}
${fields.candidateAddress || '[CANDIDATE ADDRESS]'}

Dear ${fields.candidate || '[CANDIDATE NAME]'},

We are pleased to extend an offer of employment for the position of ${fields.jobTitle || '[JOB TITLE]'} with ${org.name || '[COMPANY NAME]'}. We believe your skills and experience will be a valuable addition to our team.

POSITION DETAILS
Position: ${fields.jobTitle || '[JOB TITLE]'}
Department: ${fields.department || '[DEPARTMENT]'}
Start Date: ${fields.startDate || '[START DATE]'}
Reports To: ${fields.supervisor || '[SUPERVISOR NAME]'}

COMPENSATION AND BENEFITS
Annual Salary: $${fields.salary || '[SALARY]'}
Payment Schedule: ${fields.paySchedule || 'Bi-weekly'}

Benefits include:
- Health Insurance
- Dental Insurance
- Vision Insurance
- 401(k) Plan with company matching
- Paid Time Off (PTO)
- Sick Leave
- ${fields.additionalBenefits || 'Additional benefits as outlined in the employee handbook'}

EMPLOYMENT TYPE
This is a ${fields.employmentType || 'full-time'} position. Your employment with ${org.name} will be at-will, meaning that either you or the company may terminate the employment relationship at any time, with or without cause or notice.

DUTIES AND RESPONSIBILITIES
Your primary responsibilities will include:
${fields.responsibilities || '- [PRIMARY RESPONSIBILITIES]\n- [ADDITIONAL DUTIES AS ASSIGNED]\n- [OTHER RELEVANT TASKS]'}

CONFIDENTIALITY
You will be required to sign a confidentiality agreement protecting proprietary information and trade secrets of ${org.name}.

CONDITIONS OF EMPLOYMENT
This offer is contingent upon:
- Successful completion of background check
- Verification of employment eligibility
- ${fields.additionalConditions || 'Any additional conditions as required'}

ACCEPTANCE
Please confirm your acceptance of this offer by signing and returning this letter by ${fields.responseDeadline || '[RESPONSE DEADLINE]'}. If you have any questions, please contact me at ${org.phone || '[PHONE]'} or ${org.email || '[EMAIL]'}.

We look forward to welcoming you to our team!

Sincerely,

_________________________
${fields.hiringManager || '[HIRING MANAGER NAME]'}
${fields.hiringManagerTitle || '[TITLE]'}
${org.name}

ACCEPTANCE:

I accept the above offer of employment and agree to the terms and conditions stated herein.

_________________________          Date: _________________
${fields.candidate || '[CANDIDATE NAME]'}`;
};

const generateBusinessAgreement = (org: any, fields: any, date: string): string => {
  return `BUSINESS AGREEMENT

This Business Agreement ("Agreement") is entered into on ${date}, between ${org.name || '[PARTY 1 NAME]'} ("Party 1"), with its principal place of business at ${org.address || '[PARTY 1 ADDRESS]'}, and ${fields.party2 || '[PARTY 2 NAME]'} ("Party 2").

PURPOSE
The purpose of this Agreement is to establish the terms and conditions for ${fields.businessPurpose || '[BUSINESS PURPOSE/COLLABORATION]'}.

SCOPE OF WORK
Party 1 agrees to provide:
${fields.party1Responsibilities || '- [PARTY 1 RESPONSIBILITIES]\n- [DELIVERABLES]\n- [SERVICES]'}

Party 2 agrees to provide:
${fields.party2Responsibilities || '- [PARTY 2 RESPONSIBILITIES]\n- [DELIVERABLES]\n- [SERVICES]'}

TERM
This Agreement shall commence on ${fields.startDate || '[START DATE]'} and shall continue until ${fields.endDate || '[END DATE]'}, unless terminated earlier in accordance with the terms herein.

FINANCIAL TERMS
${fields.financialTerms || 'Financial arrangements and payment terms to be detailed as follows:\n- Payment schedule\n- Amount and method of payment\n- Expense allocation'}

INTELLECTUAL PROPERTY
All intellectual property created during the course of this Agreement shall be owned by ${fields.ipOwnership || '[SPECIFY OWNERSHIP]'}. Each party retains ownership of their pre-existing intellectual property.

CONFIDENTIALITY
Both parties agree to maintain the confidentiality of any proprietary information shared during the course of this Agreement.

TERMINATION
Either party may terminate this Agreement with ${fields.terminationNotice || '30'} days written notice to the other party.

DISPUTE RESOLUTION
Any disputes arising under this Agreement shall be resolved through ${fields.disputeResolution || 'mediation, and if unsuccessful, through binding arbitration'}.

GOVERNING LAW
This Agreement shall be governed by the laws of ${fields.jurisdiction || '[JURISDICTION]'}.

ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

PARTY 1:                           PARTY 2:

_________________________          _________________________
${org.name || '[PARTY 1 NAME]'}                    ${fields.party2 || '[PARTY 2 NAME]'}

Date: _________________            Date: _________________`;
};

const generateCarRentalContract = (org: any, fields: any, date: string): string => {
  return `CAR RENTAL AGREEMENT

This Car Rental Agreement ("Agreement") is entered into on ${date}, between ${org.name || '[RENTAL COMPANY NAME]'} ("Rental Company"), with its principal place of business at ${org.address || '[COMPANY ADDRESS]'}, and ${fields.renter || '[RENTER NAME]'} ("Renter").

VEHICLE INFORMATION
Make: ${fields.carMake || '[CAR MAKE]'}
Model: ${fields.carModel || '[CAR MODEL]'}
Year: ${fields.carYear || '[YEAR]'}
VIN: ${fields.vin || '[VIN NUMBER]'}
License Plate: ${fields.licensePlate || '[LICENSE PLATE]'}
Color: ${fields.carColor || '[COLOR]'}

RENTAL PERIOD
Pickup Date: ${fields.pickupDate || '[PICKUP DATE]'}
Return Date: ${fields.returnDate || '[RETURN DATE]'}
Pickup Location: ${fields.pickupLocation || org.address || '[PICKUP LOCATION]'}
Return Location: ${fields.returnLocation || org.address || '[RETURN LOCATION]'}

RENTAL RATES
Daily Rate: $${fields.dailyRate || '[DAILY RATE]'}
Weekly Rate: $${fields.weeklyRate || '[WEEKLY RATE]'}
Mileage Allowance: ${fields.mileageAllowance || 'Unlimited'} miles per day
Excess Mileage Charge: $${fields.excessMileageRate || '0.25'} per mile

ADDITIONAL CHARGES
Security Deposit: $${fields.securityDeposit || '500'}
Insurance (optional): $${fields.insuranceRate || '25'} per day
GPS Navigation (optional): $${fields.gpsRate || '10'} per day
Additional Driver Fee: $${fields.additionalDriverFee || '15'} per day

RENTER REQUIREMENTS
The Renter must:
- Be at least ${fields.minimumAge || '21'} years old
- Possess a valid driver's license
- Provide a major credit card
- Meet insurance requirements

VEHICLE CONDITION
The Renter acknowledges that the vehicle is in good working condition and agrees to return it in the same condition, normal wear and tear excepted.

PERMITTED USE
The vehicle may only be used for personal transportation. Commercial use is prohibited unless specifically authorized.

PROHIBITED USES
The Renter agrees not to:
- Allow unauthorized persons to drive the vehicle
- Use the vehicle for illegal purposes
- Drive under the influence of alcohol or drugs
- Smoke in the vehicle
- Transport hazardous materials

INSURANCE AND LIABILITY
The Renter is responsible for all damage to the vehicle during the rental period. ${fields.insuranceProvided === 'yes' ? 'Basic insurance coverage is included.' : 'The Renter must provide adequate insurance coverage.'}

FUEL POLICY
The vehicle will be provided with a ${fields.fuelLevel || 'full'} tank of fuel and must be returned with the same fuel level. Refueling charges will apply if returned with less fuel.

BREAKDOWN AND ACCIDENTS
In case of breakdown or accident, the Renter must immediately notify the Rental Company at ${org.phone || '[EMERGENCY PHONE]'}.

RETURN CONDITIONS
The vehicle must be returned on time to avoid additional charges. Late return fees of $${fields.lateReturnFee || '50'} per hour will apply.

PAYMENT TERMS
Payment is due at the time of rental. The security deposit will be refunded upon satisfactory return of the vehicle.

GOVERNING LAW
This Agreement shall be governed by the laws of ${fields.state || '[STATE]'}.

By signing below, both parties agree to the terms and conditions of this Agreement.

RENTAL COMPANY:                    RENTER:

_________________________          _________________________
${org.name || '[COMPANY NAME]'}                    ${fields.renter || '[RENTER NAME]'}

Date: _________________            Date: _________________`;
};

const generateStorageContract = (org: any, fields: any, date: string): string => {
  return `STORAGE CONTAINER LEASE AGREEMENT

This Storage Container Lease Agreement ("Agreement") is entered into on ${date}, between ${org.name || '[STORAGE COMPANY NAME]'} ("Company"), and ${fields.customer || '[CUSTOMER NAME]'} ("Customer").

STORAGE UNIT DETAILS
Unit Number: ${fields.unitNumber || '[UNIT NUMBER]'}
Unit Size: ${fields.unitSize || '[UNIT SIZE]'}
Location: ${fields.storageLocation || org.address || '[STORAGE FACILITY ADDRESS]'}

LEASE TERM
Start Date: ${fields.startDate || '[START DATE]'}
Monthly Rental Rate: $${fields.monthlyRate || '[MONTHLY RATE]'}
Payment Due Date: ${fields.paymentDueDate || '1st'} of each month

SECURITY DEPOSIT
Security Deposit: $${fields.securityDeposit || '[SECURITY DEPOSIT]'}

ACCESS AND SECURITY
The Customer will receive access codes/keys to access the storage unit during facility hours: ${fields.accessHours || '[ACCESS HOURS]'}.

PERMITTED STORAGE
Customer may store household goods, business records, and other personal property. Prohibited items include hazardous materials, perishables, and illegal substances.

INSURANCE
Customer is responsible for insuring stored items. The Company is not liable for damage or loss except in cases of gross negligence.

LATE FEES AND DEFAULT
Late fees of $${fields.lateFee || '25'} apply to payments received after the 5th of the month. Non-payment may result in lien and sale of stored items.

TERMINATION
Either party may terminate with ${fields.noticePeriod || '30'} days written notice.

CUSTOMER:                          COMPANY:

_________________________          _________________________
${fields.customer || '[CUSTOMER NAME]'}                   ${org.name || '[COMPANY NAME]'}

Date: _________________            Date: _________________`;
};

const generateNDAContract = (org: any, fields: any, date: string): string => {
  return `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into on ${date}, between ${org.name || '[DISCLOSING PARTY]'} ("Disclosing Party"), and ${fields.receivingParty || '[RECEIVING PARTY]'} ("Receiving Party").

PURPOSE
The purpose of this Agreement is to protect confidential information that may be disclosed in connection with ${fields.purpose || '[PURPOSE OF DISCLOSURE]'}.

CONFIDENTIAL INFORMATION
Confidential Information includes all non-public, proprietary information, including but not limited to technical data, trade secrets, business plans, financial information, customer lists, and any other information marked as confidential.

OBLIGATIONS
The Receiving Party agrees to:
- Maintain strict confidentiality
- Use information solely for the stated purpose
- Not disclose to third parties without written consent
- Return or destroy all confidential materials upon request

TERM
This Agreement shall remain in effect for ${fields.duration || '5'} years from the date of execution.

EXCEPTIONS
This Agreement does not apply to information that:
- Is publicly available
- Was known prior to disclosure
- Is independently developed
- Is required to be disclosed by law

REMEDIES
Breach of this Agreement may result in irreparable harm, and the Disclosing Party may seek injunctive relief and monetary damages.

GOVERNING LAW
This Agreement shall be governed by the laws of ${fields.jurisdiction || '[JURISDICTION]'}.

DISCLOSING PARTY:                  RECEIVING PARTY:

_________________________          _________________________
${org.name || '[DISCLOSING PARTY]'}                ${fields.receivingParty || '[RECEIVING PARTY]'}

Date: _________________            Date: _________________`;
};

const generateFreelanceAgreement = (org: any, fields: any, date: string): string => {
  return `FREELANCE SERVICE AGREEMENT

This Freelance Service Agreement ("Agreement") is entered into on ${date}, between ${org.name || '[CLIENT NAME]'} ("Client"), and ${fields.freelancer || '[FREELANCER NAME]'} ("Freelancer").

PROJECT DESCRIPTION
${fields.projectDescription || '[DETAILED PROJECT DESCRIPTION]'}

SCOPE OF WORK
The Freelancer agrees to provide the following services:
${fields.scopeOfWork || '- [SERVICE 1]\n- [SERVICE 2]\n- [DELIVERABLES]'}

TIMELINE
Project Start Date: ${fields.startDate || '[START DATE]'}
Project Completion Date: ${fields.completionDate || '[COMPLETION DATE]'}

COMPENSATION
Total Project Fee: $${fields.totalFee || '[TOTAL FEE]'}
Payment Schedule: ${fields.paymentSchedule || '[PAYMENT SCHEDULE]'}

INTELLECTUAL PROPERTY
All work product created shall be owned by ${fields.ipOwnership || 'the Client'} upon full payment.

INDEPENDENT CONTRACTOR
The Freelancer is an independent contractor and not an employee of the Client.

TERMINATION
Either party may terminate with ${fields.terminationNotice || '7'} days written notice.

CLIENT:                            FREELANCER:

_________________________          _________________________
${org.name || '[CLIENT NAME]'}                     ${fields.freelancer || '[FREELANCER NAME]'}

Date: _________________            Date: _________________`;
};

const generateEmploymentContract = (org: any, fields: any, date: string): string => {
  return `EMPLOYMENT CONTRACT

This Employment Contract ("Agreement") is entered into on ${date}, between ${org.name || '[COMPANY NAME]'} ("Company"), and ${fields.employee || '[EMPLOYEE NAME]'} ("Employee").

POSITION AND DUTIES
Position: ${fields.jobTitle || '[JOB TITLE]'}
Department: ${fields.department || '[DEPARTMENT]'}
Start Date: ${fields.startDate || '[START DATE]'}

The Employee's primary duties include:
${fields.jobDuties || '- [PRIMARY DUTIES]\n- [RESPONSIBILITIES]\n- [ADDITIONAL TASKS]'}

COMPENSATION
Annual Salary: $${fields.salary || '[ANNUAL SALARY]'}
Payment Schedule: ${fields.paySchedule || 'Bi-weekly'}

BENEFITS
The Employee is entitled to:
- Health insurance
- Retirement plan participation
- ${fields.vacationDays || '15'} days paid vacation annually
- ${fields.sickDays || '10'} days sick leave annually

EMPLOYMENT TERM
This is a ${fields.employmentType || 'permanent'} position beginning ${fields.startDate || '[START DATE]'}.

CONFIDENTIALITY
The Employee agrees to maintain confidentiality of all proprietary company information.

TERMINATION
Employment may be terminated by either party with ${fields.noticePeriod || '30'} days written notice.

GOVERNING LAW
This Agreement shall be governed by the laws of ${fields.jurisdiction || '[JURISDICTION]'}.

COMPANY:                           EMPLOYEE:

_________________________          _________________________
${org.name || '[COMPANY NAME]'}                    ${fields.employee || '[EMPLOYEE NAME]'}

Date: _________________            Date: _________________`;
};

const generatePartnershipAgreement = (org: any, fields: any, date: string): string => {
  return `PARTNERSHIP AGREEMENT

This Partnership Agreement ("Agreement") is entered into on ${date}, between ${org.name || '[PARTNER 1 NAME]'} ("Partner 1"), and ${fields.partner2 || '[PARTNER 2 NAME]'} ("Partner 2").

PARTNERSHIP NAME
The partnership shall operate under the name: ${fields.partnershipName || '[PARTNERSHIP NAME]'}

BUSINESS PURPOSE
The purpose of this partnership is: ${fields.businessPurpose || '[BUSINESS PURPOSE]'}

CAPITAL CONTRIBUTIONS
Partner 1 Contribution: $${fields.partner1Capital || '[AMOUNT]'}
Partner 2 Contribution: $${fields.partner2Capital || '[AMOUNT]'}

PROFIT AND LOSS SHARING
Profits and losses shall be shared: ${fields.profitSharing || '50/50'} between the partners.

MANAGEMENT
Both partners shall have equal rights in management decisions unless otherwise specified.

PARTNERSHIP DURATION
This partnership shall commence on ${fields.startDate || '[START DATE]'} and continue until terminated.

DISSOLUTION
The partnership may be dissolved by mutual agreement or upon ${fields.dissolutionTerms || '[DISSOLUTION CONDITIONS]'}.

PARTNERS:

_________________________          _________________________
${org.name || '[PARTNER 1 NAME]'}                  ${fields.partner2 || '[PARTNER 2 NAME]'}

Date: _________________            Date: _________________`;
};

const generateConsultingAgreement = (org: any, fields: any, date: string): string => {
  return `CONSULTING AGREEMENT

This Consulting Agreement ("Agreement") is entered into on ${date}, between ${org.name || '[CLIENT NAME]'} ("Client"), and ${fields.consultant || '[CONSULTANT NAME]'} ("Consultant").

CONSULTING SERVICES
The Consultant agrees to provide: ${fields.consultingServices || '[CONSULTING SERVICES]'}

PROJECT TIMELINE
Start Date: ${fields.startDate || '[START DATE]'}
End Date: ${fields.endDate || '[END DATE]'}

COMPENSATION
Hourly Rate: $${fields.hourlyRate || '[HOURLY RATE]'}
Total Project Fee: $${fields.totalFee || '[TOTAL FEE]'}

INDEPENDENT CONTRACTOR
The Consultant is an independent contractor and not an employee.

CONFIDENTIALITY
The Consultant agrees to maintain confidentiality of all client information.

CLIENT:                            CONSULTANT:

_________________________          _________________________
${org.name || '[CLIENT NAME]'}                     ${fields.consultant || '[CONSULTANT NAME]'}

Date: _________________            Date: _________________`;
};

const generateLicenseAgreement = (org: any, fields: any, date: string): string => {
  return `LICENSE AGREEMENT

This License Agreement ("Agreement") is entered into on ${date}, between ${org.name || '[LICENSOR NAME]'} ("Licensor"), and ${fields.licensee || '[LICENSEE NAME]'} ("Licensee").

LICENSED PROPERTY
The Licensor grants a license for: ${fields.licensedProperty || '[LICENSED PROPERTY/SOFTWARE]'}

LICENSE TERMS
License Type: ${fields.licenseType || '[EXCLUSIVE/NON-EXCLUSIVE]'}
Territory: ${fields.territory || '[TERRITORY]'}
Duration: ${fields.duration || '[DURATION]'}

ROYALTIES
Royalty Rate: ${fields.royaltyRate || '[ROYALTY RATE]'}%
Payment Terms: ${fields.paymentTerms || '[PAYMENT TERMS]'}

RESTRICTIONS
The Licensee agrees to: ${fields.restrictions || '[USAGE RESTRICTIONS]'}

LICENSOR:                          LICENSEE:

_________________________          _________________________
${org.name || '[LICENSOR NAME]'}                   ${fields.licensee || '[LICENSEE NAME]'}

Date: _________________            Date: _________________`;
};

const generateGenericContract = (org: any, fields: any, date: string): string => {
  return `LEGAL AGREEMENT

This Agreement is entered into on ${date}, between ${org.name || '[PARTY 1 NAME]'} and ${fields.party2 || '[PARTY 2 NAME]'}.

TERMS AND CONDITIONS
[This is a generic contract template. Please specify the contract type for a more detailed agreement.]

PARTY 1:                           PARTY 2:

_________________________          _________________________
${org.name || '[PARTY 1 NAME]'}                    ${fields.party2 || '[PARTY 2 NAME]'}

Date: _________________            Date: _________________`;
};
