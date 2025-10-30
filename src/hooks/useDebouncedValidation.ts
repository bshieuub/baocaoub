import { useState, useEffect } from 'react';
import { ValidationError } from '../utils/validation';
import { UI_CONFIG } from '../constants';

interface ValidationResult {
  isValid: boolean;
  error: string;
}

export const useDebouncedValidation = (
  value: string, 
  validator: (value: string) => ValidationResult,
  delay: number = UI_CONFIG.DEBOUNCE_DELAY
) => {
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!value) {
      setIsValid(true);
      setError('');
      setIsValidating(false);
      return;
    }

    setIsValidating(true);
    
    const timer = setTimeout(() => {
      const result = validator(value);
      setIsValid(result.isValid);
      setError(result.error || '');
      setIsValidating(false);
    }, delay);

    return () => {
      clearTimeout(timer);
      setIsValidating(false);
    };
  }, [value, validator, delay]);

  return { isValid, error, isValidating };
};

export const useFormValidation = (formData: any, validationRules: any) => {
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  const validateForm = async () => {
    setIsValidating(true);
    
    try {
      const validationErrors = validationRules(formData);
      setErrors(validationErrors);
      return validationErrors.length === 0;
    } finally {
      setIsValidating(false);
    }
  };

  const clearErrors = (fieldName?: string) => {
    if (fieldName) {
      setErrors(prev => prev.filter(error => error.field !== fieldName));
    } else {
      setErrors([]);
    }
  };

  return {
    errors,
    isValidating,
    validateForm,
    clearErrors,
    hasErrors: errors.length > 0,
  };
};