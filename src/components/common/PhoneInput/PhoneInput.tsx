'use client';
import React from 'react';
import PhoneInput, { isValidPhoneNumber, getCountryCallingCode } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import styles from './PhoneInput.module.css';

interface PhoneInputComponentProps {
  value?: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: string;
  label?: string;
  required?: boolean;
  validate?: boolean;
}

const PhoneInputComponent: React.FC<PhoneInputComponentProps> = ({
  value,
  onChange,
  placeholder = "Enter phone number",
  className = "",
  disabled = false,
  error,
  label,
  required = false,
  validate = true,
}) => {
  const [validationError, setValidationError] = React.useState<string>("");

  const handleChange = (phoneValue: string | undefined) => {
    onChange(phoneValue);
    
    if (validate && phoneValue) {
      if (!isValidPhoneNumber(phoneValue)) {
        setValidationError("Please enter a valid phone number");
      } else {
        setValidationError("");
      }
    } else if (validate && required && !phoneValue) {
      setValidationError("Phone number is required");
    } else {
      setValidationError("");
    }
  };

  const displayError = error || validationError;
  return (
    <div className="mb-3">
      <div className="form-floating">
        <PhoneInput
          value={value}
          onChange={handleChange}
          placeholder=" "
          defaultCountry="US"
          international
          countryCallingCodeEditable={false}
          className={`${styles.phoneInput} ${displayError ? styles.error : ''} ${className}`}
          style={{
            '--PhoneInput-color--focus': '#0d6efd',
            '--PhoneInputCountrySelect-marginRight': '0.5em',
            '--PhoneInputCountrySelectArrow-color': '#6c757d',
            '--PhoneInputCountrySelectArrow-color--focus': '#0d6efd',
          } as React.CSSProperties}
          disabled={disabled}

        />
        {label && (
          <label className="form-label">
            {label} {required && <span style={{ color: "red" }}>*</span>}
          </label>
        )}
      </div>
      {displayError && (
        <div className="text-danger mt-1" style={{fontSize: "12px"}}>{displayError}</div>
      )}
    </div>
  );
};

export default PhoneInputComponent;
