const validateFields = (
  formDataArray: Record<string, any>[],
  rules: Record<string, { required?: boolean; message?: string; format?: RegExp; formatMessage?: string; custom?: (value: any) => string | null }>
): { errors: Record<number, Record<string, string>>; isValid: boolean } => {
  const newErrors: Record<number, Record<string, string>> = {};

  formDataArray.forEach((formData, index) => {
    const itemErrors: Record<string, string> = {};

    Object.entries(rules).forEach(([field, rule]) => {
      const value = formData[field];

      // Check if the field is required
      if (rule.required && !value) {
        itemErrors[field] = rule.message || `${field} is required`;
      }

      // Check the format using a regular expression (if provided)
      if (rule.format && value && !rule.format.test(value)) {
        itemErrors[field] = rule.formatMessage || `${field} is not in the correct format`;
      }

      // Apply custom validation (if provided)
      if (rule.custom && typeof rule.custom === "function") {
        const customError = rule.custom(value);
        if (customError) {
          itemErrors[field] = customError;
        }
      }
    });

    if (Object.keys(itemErrors).length > 0) {
      newErrors[index] = itemErrors;
    }
  });

  return { errors: newErrors, isValid: Object.keys(newErrors).length === 0 };
};

export default validateFields;
