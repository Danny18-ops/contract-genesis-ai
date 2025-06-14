
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
  
  // Check if end date is after start date
  if (end <= start) return false;
  
  // Calculate the difference in months more accurately
  const startYear = start.getFullYear();
  const startMonth = start.getMonth();
  const startDay = start.getDate();
  
  const endYear = end.getFullYear();
  const endMonth = end.getMonth();
  const endDay = end.getDate();
  
  // Calculate total months difference
  let monthsDiff = (endYear - startYear) * 12 + (endMonth - startMonth);
  
  // If end day is less than start day, subtract one month
  if (endDay < startDay) {
    monthsDiff--;
  }
  
  console.log('Date validation:', { startDate, endDate, monthsDiff });
  
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
