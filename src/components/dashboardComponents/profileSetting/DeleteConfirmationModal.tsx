'use client'
import ModalWrapper from '@/components/common/ModalWrapper/ModalWrapper';
import React, { useEffect, useRef, useState } from 'react'

const DeleteConfirmationModal = ({ isOpen, onConfirm, onClose, type }: any) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const closeRef = useRef(null);

    useEffect(() => {
        setOpenModal(isOpen);
    }, [isOpen]);

    const handleClose = () => {
        setOpenModal(false);
        onClose && onClose(); 
    };

    const onClickFunction = () => {
        onConfirm && onConfirm();
        handleClose();
    };

    return (
        <>
            {openModal && (
                <div className='ad-dispute'>
                    <ModalWrapper
                        modalId="InviteMemberModal"
                        title="Confirmation"
                        closeRef={closeRef}
                        handleClose={handleClose}
                    >
                        <div className="mb-3 ">
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">{`Are you sure you want to delete this ${type}? This action cannot be undone.`}</label>
                        </div>
                        <div className='text-end'>
                            <button type="button" className="btn btn-secondary me-3" onClick={handleClose} >Cancel</button>
                            <button type="button" className="btn btn-outline-danger" onClick={onClickFunction} >Delete </button>
                        </div>
                    </ModalWrapper>
                </div>
            )}
        </>
    )
}

export default DeleteConfirmationModal
