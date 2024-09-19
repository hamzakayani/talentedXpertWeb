'use client'
import React, { useState } from 'react'

const RegisterComponent = () => {
    const [selected, setSelected] = useState(0);
    const [completed, setCompleted] = useState(0);
    const [next, setNext] = useState(0);
    const [previous, setPrevious] = useState(0);
    const [currentStep, setCurrentStep] = useState(0);
  
  
    const steps = [
      'Individual account',
      'Education & Certification',
      'Other'
    ];

  return (
    <div className={'stepper'}>
     {steps.map((step, index) => (
       <div
         key={index}
         className={`step ${index <= currentStep ? 'completed' : ''}`}
         onClick={() => setCurrentStep(index)}
       >
         <span className={'label'}>{step}</span>
         {index < steps.length - 1 && <div className={'line'}></div>}
       </div>
     ))}
   </div>
  )
}

export default RegisterComponent
