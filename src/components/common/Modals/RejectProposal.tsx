'use client';

import 'bootstrap/dist/js/bootstrap.bundle.min';
import { Modal } from 'bootstrap';
import { useRouter } from 'next/navigation';
import React, { FC, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import GradientButton from '../GradientButton/GradientButton';

interface RejectProposalProps {
  updateProposals: (status: string, reason: string) => void;
  id: number;
  handleClose: any
}

const RejectProposal: FC<RejectProposalProps> = ({ updateProposals, id, handleClose }) => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const closeRef = useRef(null)

  const handleSubmit = async () => {
    if (reason.trim() === '') {
      setError('Please fill the field');
      return;
    }

    setError('');
    updateProposals('REJECTED', reason);
    toast.success('PROPOSAL REJECTED');
    handleClose();

    const modalElement = document.getElementById('exampleModalToggle97');
    if (modalElement) {
      let modalInstance = Modal.getInstance(modalElement);
      if (!modalInstance) {
        modalInstance = new Modal(modalElement);
      }
      modalInstance.hide();

      // Force cleanup in case Bootstrap doesn't
      setTimeout(() => {
        const backdrops = document.querySelectorAll('.modal-backdrop');
        backdrops.forEach((el) => el.remove());
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
      }, 300);
    }
    router.push(`/dashboard/tasks/${id}`);
  };

  return (
    <ModalWrapper
      modalId={"exampleModalToggle97"}
      title={"Proposal Rejection"}
      closeRef={closeRef}
      handleClose={handleClose}
    >
      <div className="mb-3">
        <div className='form-floating'>
          <textarea
            className="form-control"
            id="reason"
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder='Write reason here...'
          />
          <label htmlFor="reason">
            Reason
          </label>
        </div>
        {error && <small className="text-danger">{error}</small>}
      </div>
      <div className='d-flex justify-content-end align-items-end'>        
        <GradientButton type="submit" className='rounded-1' style={{width:"25%"}} onClick={handleSubmit}>
          Submit
        </GradientButton>
      </div>
    </ModalWrapper>
  );
};

export default RejectProposal;
