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
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: "red" }}>*</span>}
        </label>
      )}
      <PhoneInput
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        defaultCountry="US"
        international
        countryCallingCodeEditable={false}
        className={`${styles.phoneInput} ${className}`}
        style={{
          '--PhoneInput-color--focus': '#007bff',
          '--PhoneInputCountrySelect-marginRight': '0.5em',
          '--PhoneInputCountrySelectArrow-color': '#666',
          '--PhoneInputCountrySelectArrow-color--focus': '#007bff',
        } as React.CSSProperties}
        disabled={disabled}
      />
      {displayError && (
        <div className="text-danger pt-2">{displayError}</div>
      )}
    </div>
  );
};

export default PhoneInputComponent;
