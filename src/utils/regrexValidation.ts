export const regexPatterns: Record<string, RegExp> = {
  // Exams
  // listening_score: /^(100(\.0{1,2})?|(\d{0,2}(\.\d{1,2})?))$/,
  // speaking_score: /^(100(\.0{1,2})?|(\d{0,2}(\.\d{1,2})?))$/,
  // reading_score: /^(100(\.0{1,2})?|(\d{0,2}(\.\d{1,2})?))$/,
  // writing_score: /^(100(\.0{1,2})?|(\d{0,2}(\.\d{1,2})?))$/,
  // overall_score: /^(100(\.0{1,2})?|(\d{0,2}(\.\d{1,2})?))$/,

  // Basic Info
  // full_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  // city: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  // address: /^[a-zA-Z0-9À-ÖØ-öø-ÿ'.,\- ]*$/,
  phone: /^\+?[0-9]{0,10}$/,
  secondary_number: /^\+?[0-9]{0,10}$/,
  passport: /^[A-Za-z0-9]*$/, // Allow empty string
  // emergency_contact_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  emergency_contact_phone: /^\+?[0-9]{0,10}$/,
  // remarks: /^[a-zA-Z0-9À-ÖØ-öø-ÿ'.,\- ]*$/,
  // concern_on_medical_condition_details: /^[a-zA-Z0-9À-ÖØ-öø-ÿ'.,\- ]*$/,
  // criminal_offence_details: /^[a-zA-Z0-9À-ÖØ-öø-ÿ'.,\- ]*$/,
  // state: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  // country: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  // nationality: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,

  // Work Info
  // designation: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  // company: /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  years: /^\d{0,2}$/,

  // Primary-Secondary- Education
  // board_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  // school_name: /^(?!.*[^a-zA-ZÀ-ÖØ-öø-ÿ]{2})[a-zA-ZÀ-ÖØ-öø-ÿ' ,.-]{0,50}(?:[,.](?: ?)[a-zA-ZÀ-ÖØ-öø-ÿ' ,.-]*)?$/,
  // board_name: /^(?!.*[^a-zA-ZÀ-ÖØ-öø-ÿ]{2})[a-zA-ZÀ-ÖØ-öø-ÿ' ,.-]{0,50}$/,
  // school_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' .-]*$/,

  // Graduation Details
  // university_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  // college_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  percentage: /^(100(\.0+)?|(\d{0,2}(\.\d+)?))$/,

  // Fund Plan
  // sponsor_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  approx_annual_income: /^\+?[0-9]{0,15}(\.[0-9]+)?$/,
  // relation_with_sponsor: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  sponsorship_amount: /^\+?[0-9]{0,15}(\.[0-9]+)?$/,
  // name_of_bank: /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  // Passport Details
  // number_of_passports: /^\d{0,2}$/,
  // name_change: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  passport_number: /^[A-Z0-9]{0,9}$/,

  // Family Details
  // name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  // occupation: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  // organization: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  // current_income_source: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
  zipcode: /^\+?[0-9]{0,15}$/,
  pincode: /^\+?[0-9]{0,15}$/,

  // Lead Type
  // category_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  // category_description: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  // Lead Source
  // source_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  // source_description: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  // Lead Channel
  // channel_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  // channel_description: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  // Office Type
  // office_type_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  // office_type_description: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  // Regions
  // region_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  // region_description: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  // Flag
  // flag_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  // flag_description: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  // Marital Status
  // marital_status_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  // marital_status_description: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  // Country
  // country_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  // country_code: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  // Branch
  // branch_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  // contact_person_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  contact_person_mobile: /^\+?[0-9]{0,15}$/,
  // contact_person_designation: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,

  // Franchise
  // pocName: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  // Course Type
  // type_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  // description: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  
  // Streams
  // stream_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  // stream_description: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  // Course
  // course_name: /^(?!.* {3})[^\s]{1,}$/,
  // course_description: /^(?!.* {3})[^\s]{1,}$/,

  // Campus
  // campus_name: /^(?!.* {3})[^\s]{1,}$/,
  // location: /^(?!.* {3})[^\s]{1,}$/,

  // Status
  // status_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
  // status_description: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

  // Role
  // role_name: /^(?!.* {3})[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
};

export const regrexValidation = (name: string, value: string): boolean => {
  const regex = regexPatterns[name];
  if (regex) {
    return regex.test(value);
  }
  console.warn(`No validation rule defined for ${name}`);
  return true; // If no regex is defined, consider it valid by default
};
