'use client';
import React from 'react';
import PhoneInput, { isValidPhoneNumber, getCountryCallingCode } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import styles from './PhoneInput.module.css';
import CustomCountrySelect from './CustomCountrySelect';

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
  defaultCountry?: string, 
}

const normalizePhone = (rawPhone: string | undefined, defaultCountryCode = "+92") => {
  if (!rawPhone) return undefined;
  let phone = rawPhone.trim().replace(/[\s\-()]/g, "");

  // Already has country code
  if (phone.startsWith("+")) return phone;

  // If starts with 0, strip it
  if (phone.startsWith("0")) {
    phone = phone.substring(1);
  }

  return `${defaultCountryCode}${phone}`;
};

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
  defaultCountry = "US", 
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

  // normalize if value is missing +country
  const normalizedValue = normalizePhone(value, `+${defaultCountry === "PK" ? "92" : "1"}`);

  const displayError = error || validationError;
  return (
    <div className="mb-3">
      <div className="form-floating">
        <PhoneInput
          value={normalizedValue}
          onChange={handleChange}
          placeholder=" "
          defaultCountry={defaultCountry as any}
          international
          countryCallingCodeEditable={false}
          countrySelectComponent={CustomCountrySelect}
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
