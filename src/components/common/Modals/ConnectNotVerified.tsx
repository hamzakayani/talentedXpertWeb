'use client'
import React, { useEffect } from 'react';
import HtmlData from '../HtmlData/HtmlData';
import Link from 'next/link';
import { useNavigation } from '@/hooks/useNavigation';
import ModalWrapper from '../ModalWrapper/ModalWrapper';

const ConnectNotVerified = ({ id, step }: any) => {
  const { navigate } = useNavigation();

  const handleClose = () => {
    // Close modal and remove backdrop
    const modal = document.getElementById('exampleModalToggle45');
    const backdrop = document.querySelector('.modal-backdrop');

    if (backdrop) {
      backdrop.remove();
    }

    // Remove modal open state from body
    document.body.classList.remove('modal-open');
    document.body.style.overflow = ''; // Reset any overflow styles (for smooth scrolling)
    
    // Optional: Reset modal display properties if necessary
    if (modal) {
      modal.style.display = 'none'; // Hide modal (useful for custom modal control)
    }
  };

  useEffect(() => {
    const modal = document.getElementById('exampleModalToggle45');
    const handleModalClose = () => {
      handleClose(); // Call handleClose when the modal is hidden
    };

    modal?.addEventListener('hidden.bs.modal', handleModalClose);

    return () => {
      modal?.removeEventListener('hidden.bs.modal', handleModalClose);
    };
  }, []);

  return (
    <div className="ad-dispute">
      <ModalWrapper
        modalId={"exampleModalToggle45"}
        title={"Payment Method Required"}
        handleClose={handleClose}
      >
        <HtmlData
          data={'Kindly connect your stripe account'}
          className="text-white fs-16 mb-4"
        />
        <div className="text-end mt-3" data-bs-dismiss="modal">
          {step && id && (
            <Link
              className="btn rounded-pill btn-outline-primary bg-gradient1 text-white mx-1 my-1"
              href={`/dashboard/tasks/${id}/add-proposal`}
              onClick={() => navigate(`/dashboard/tasks/${id}/add-proposal`)}
            >
              Skip for Now
            </Link>
          )}
          <Link
            className="btn rounded-pill btn-outline-primary bg-gradient1 text-white mx-1 my-1"
            href={'/dashboard/payments/information'}
            onClick={() => navigate('/dashboard/payments/information')}
          >
            Ok
          </Link>
        </div>
      </ModalWrapper>
    </div>
  );
};

export default ConnectNotVerified;