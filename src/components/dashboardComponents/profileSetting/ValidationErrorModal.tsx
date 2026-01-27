'use client'
import GradientButton from '@/components/common/GradientButton/GradientButton';
import ModalWrapper from '@/components/common/ModalWrapper/ModalWrapper';
import React, { useEffect, useRef, useState } from 'react'

interface ValidationErrorModalProps {
  isOpen: boolean;
  errors: string[];
  onClose: () => void;
}

const ValidationErrorModal = ({ isOpen, errors, onClose }: ValidationErrorModalProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const closeRef = useRef(null);

  useEffect(() => {
    setOpenModal(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpenModal(false);
    onClose();
  };

  return (
    <>
      {openModal && (
        <div className='ad-dispute'>
          <ModalWrapper
            modalId="ValidationErrorModal"
            title="Required Fields Missing"
            closeRef={closeRef}
            handleClose={handleClose}
          >
            <div className="mb-3">
              <p className="text-light mb-3">
                Please fill in the following required fields before saving:
              </p>
              <ul className="list-unstyled mb-0">
                {errors.map((error, index) => (
                  <li key={index} className="text-danger mb-2 d-flex align-items-start">
                    <span className="me-2">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className='text-end'>
              <GradientButton type="button" className='rounded-1'  style={{width:"25%"}} onClick={handleClose}>
                OK
              </GradientButton>
            </div>
          </ModalWrapper>
        </div>
      )}
    </>
  )
}

export default ValidationErrorModal

