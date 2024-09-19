'use client';
import React, { useState } from 'react';
import { Stepper, Step } from 'react-form-stepper';

const RegisterComponent: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0); // Explicitly typing the state as a number

  const handleNext = (): void => {
    if (activeStep < 2) {
      setActiveStep(prevStep => prevStep + 1);
    }
  };

  const handleBack = (): void => {
    if (activeStep > 0) {
      setActiveStep(prevStep => prevStep - 1);
    }
  };

  const handleReset = (): void => {
    setActiveStep(0);
  };

  return (
    <div>
      <Stepper activeStep={activeStep}>
        <Step label="Individual account" />
        <Step label="Education & Certification" />
        <Step label="Other" />
      </Stepper>

      <div>
        {activeStep === 0 && <div>Step 1: Enter your information</div>}
        {activeStep === 1 && <div>Step 2: Review your details</div>}
        {activeStep === 2 && <div>Step 3: Complete the form</div>}
      </div>

      <div>
        <button disabled={activeStep === 0} onClick={handleBack}>
          Back
        </button>
        <button onClick={activeStep === 2 ? handleReset : handleNext}>
          {activeStep === 2 ? 'Reset' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default RegisterComponent;
