
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

export const validatePinCode = (pinCode: string): boolean => {
  const pinCodeRegex = /^\d{6}$/;
  return pinCodeRegex.test(pinCode);
};

export const validateNameField = (name: string): boolean => {
  const nameRegex = /^[a-zA-Z\s]+$/;
  return nameRegex.test(name) && name.trim().length > 0;
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateContractDuration = (startDate: string, endDate: string): boolean => {
  if (!startDate || !endDate) return false;
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Calculate difference in months
  const monthsDiff = (end.getFullYear() - start.getFullYear()) * 12 + 
                    (end.getMonth() - start.getMonth());
  
  return monthsDiff >= 6;
};

export const validateOrganizationData = (orgData: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!orgData.name || !validateNameField(orgData.name)) {
    errors.push("Organization name should contain only letters and spaces");
  }
  
  if (orgData.email && !validateEmail(orgData.email)) {
    errors.push("Please enter a valid email address");
  }
  
  if (orgData.phone && !validatePhoneNumber(orgData.phone)) {
    errors.push("Phone number must be exactly 10 digits");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
