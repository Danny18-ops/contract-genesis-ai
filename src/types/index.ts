
export interface Organization {
  name: string;
  address: string;
  email: string;
  phone: string;
  logo: string;
}

export interface ContractData {
  contractType: string;
  organizationData: Organization;
  dynamicFields: { [key: string]: string };
  language: string;
  template: string;
  footerText: string;
  reusedOrgInfo: boolean;
}
