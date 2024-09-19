import { useState } from "react";
import * as Yup from "yup";

export const useFormState = (formData: any, validationSchema: any) => {
  const [formErrors, setFormErrors] = useState({});

  const validateForm = async () => {
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      setFormErrors({});
      return true;
    } catch (err: any) {
      if (err instanceof Yup.ValidationError) {
        const errors: any = {};
        err.inner.forEach((error: any) => {
          errors[error.path] = error.message;
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  return {
    formErrors,
    validateForm,
  };
};
