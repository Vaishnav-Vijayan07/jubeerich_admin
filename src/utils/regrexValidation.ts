export const regexPatterns: Record<string, RegExp> = {
    // Exams
    listening_score: /^\+?[0-9]{0,5}$/,
    speaking_score: /^\+?[0-9]{0,5}$/,
    reading_score: /^\+?[0-9]{0,5}$/,
    writing_score: /^\+?[0-9]{0,5}$/,
    overall_score: /^\+?[0-9]{0,5}$/,

    // Basic Info
    full_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    city: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    address: /^[a-zA-Z0-9À-ÖØ-öø-ÿ'.,\- ]*$/,
    phone: /^\+?[0-9]{0,15}$/,
    secondary_number: /^\+?[0-9]{0,15}$/,
    passport: /^[A-Za-z0-9]*$/, // Allow empty string
    emergency_contact_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    emergency_contact_phone: /^\+?[0-9]{0,15}$/,
    remarks: /^[a-zA-Z0-9À-ÖØ-öø-ÿ'.,\- ]*$/,
    concern_on_medical_condition_details: /^[a-zA-Z0-9À-ÖØ-öø-ÿ'.,\- ]*$/,
    criminal_offence_details: /^[a-zA-Z0-9À-ÖØ-öø-ÿ'.,\- ]*$/,
    state: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    country: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    nationality: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,

    // Work Info
    designation: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    company: /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

    // Primary-Secondary- Education
    board_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    school_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

    // Graduation Details
    university_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    college_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,
    percentage: /^\+?[0-9]{0,4}(\.[0-9]+)?$/,

    // Fund Plan
    sponsor_name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    approx_annual_income: /^\+?[0-9]{0,15}(\.[0-9]+)?$/,
    relation_with_sponsor: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    sponsorship_amount: /^\+?[0-9]{0,15}(\.[0-9]+)?$/,
    name_of_bank: /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/,

    // Passport Details
    name_change: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    passport_number: /^[A-Z0-9]{0,9}$/,

    // Family Details
    name: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    occupation: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    organization: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,
    current_income_source: /^[a-zA-ZÀ-ÖØ-öø-ÿ' -]*$/,

    zipcode: /^[a-zA-ZÀ-ÖØ-öø-ÿ0-9' -]*$/
  };
  
  export const regrexValidation = (name: string, value: string): boolean => {
    const regex = regexPatterns[name];
    if (regex) {
      return regex.test(value);
    }
    console.warn(`No validation rule defined for ${name}`);
    return true; // If no regex is defined, consider it valid by default
  };
  