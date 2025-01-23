const validateFields = (formDataArray: any[], rules: any) => {
  const newErrors: any = {}; // Object to hold new errors indexed by formData item index

  // Iterate over each item in formDataArray (which is an array of work experience items)
  formDataArray.forEach((formData, index) => {
    // Create an empty object for the current item's errors
    newErrors[index] = {};

    // Loop through all the rules and validate the form data for each item
    Object.keys(rules).forEach((field) => {
      const value = formData[field]; // Get the value for the field from formData
      const rule = rules[field]; // Get the validation rule for the field

      // Check if the field is required and if the value is missing or empty
      if (rule.required && !value) {
        newErrors[index][field] = rule.message || "Field is required";
      } else if (rule.custom && typeof rule.custom === "function") {
        const customError = rule.custom(value); // Custom validation rule (if provided)
        if (customError) {
          newErrors[index][field] = customError;
        }
      }
    });

    // Remove index from newErrors if there are no errors for that item
    if (Object.keys(newErrors[index]).length === 0) {
      delete newErrors[index];
    }
  });

  // Return the validation result: errors and whether the form is valid
  return { errors: newErrors, isValid: Object.keys(newErrors).length === 0 };
};

export default validateFields;
