'use client';
import React, { useState, useRef, useEffect } from 'react';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en.json';
import styles from './CustomCountrySelect.module.css';

interface CustomCountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
  disabled?: boolean;
  className?: string;
}

const CustomCountrySelect: React.FC<CustomCountrySelectProps> = ({
  value,
  onChange,
  options,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAbove, setShowAbove] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Get all countries with their data
  const countries = getCountries();
  
  // Create country data with flags, names, and calling codes
  const countryData = countries.map(country => ({
    code: country,
    name: en[country] || country,
    callingCode: `+${getCountryCallingCode(country)}`,
    flag: `https://flagcdn.com/24x18/${country.toLowerCase()}.png`
  }));

  // Filter countries based on search term
  const filteredCountries = countryData.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.callingCode.includes(searchTerm)
  );

  // Get current selected country data
  const selectedCountry = countryData.find(country => country.code === value);

  // Close dropdown when clicking outside and check available space
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    // Check available space when dropdown opens
    const checkAvailableSpace = () => {
      if (triggerRef.current && isOpen) {
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 300; // max-height of dropdown
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        // Show above if not enough space below but enough space above
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setShowAbove(true);
        } else {
          setShowAbove(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    if (isOpen) {
      checkAvailableSpace();
      window.addEventListener('resize', checkAvailableSpace);
      window.addEventListener('scroll', checkAvailableSpace);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', checkAvailableSpace);
      window.removeEventListener('scroll', checkAvailableSpace);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      const newIsOpen = !isOpen;
      setIsOpen(newIsOpen);
      setSearchTerm('');
      
      // Check available space when opening
      if (newIsOpen && triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 300;
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        
        // Show above if not enough space below but enough space above
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          setShowAbove(true);
          console.log('Dropdown will show ABOVE - space below:', spaceBelow, 'space above:', spaceAbove);
        } else {
          setShowAbove(false);
          console.log('Dropdown will show BELOW - space below:', spaceBelow, 'space above:', spaceAbove);
        }
      }
    }
  };

  const handleSelect = (countryCode: string) => {
    onChange(countryCode);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCountries.length > 0) {
        handleSelect(filteredCountries[0].code);
      }
    }
  };

  return (
    <div className={`${styles.customCountrySelect} ${className}`} ref={dropdownRef}>
      <div 
        ref={triggerRef}
        className={`${styles.selectTrigger} ${isOpen ? styles.open : ''} ${disabled ? styles.disabled : ''}`}
        onClick={handleToggle}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        style={{width: '60px'}}
      >
        <div className={styles.selectedOption}>
          {selectedCountry && (
            <div key={selectedCountry.code}>
              <img 
                src={selectedCountry.flag} 
                alt={`${selectedCountry.name} flag`}
                className={styles.flag}
                onError={(e) => {
                  // Fallback to country code if image fails
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'inline-block';
                    fallback.textContent = selectedCountry.code;
                  }
                }}
              />
              <span className={styles.fallbackFlag} style={{ display: 'none' }}></span>
            </div>
          )}
        </div>
        <div style={{marginLeft: "10px"}} className={`${styles.arrow} ${isOpen ? styles.arrowUp : styles.arrowDown}`}>
          <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
            <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className={`${styles.dropdown} ${showAbove ? styles.dropdownAbove : ''}`}>
          <div className={styles.searchContainer}>
            <input
              ref={inputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>
          
          <div className={styles.optionsList}>
            {filteredCountries.length === 0 ? (
              <div className={styles.noResults}>No countries found</div>
            ) : (
              filteredCountries.map((country) => (
                <div
                  key={country.code}
                  className={`${styles.option} ${country.code === value ? styles.selected : ''}`}
                  onClick={() => handleSelect(country.code)}
                  role="option"
                  aria-selected={country.code === value}
                >
                  <img 
                    src={country.flag} 
                    alt={`${country.name} flag`}
                    className={styles.flag}
                    onError={(e) => {
                      // Fallback to text if image fails
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className={styles.countryInfo}>
                    <span className={styles.countryName}>{country.name}</span>
                    <span className={styles.callingCode}>{country.callingCode}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCountrySelect;
