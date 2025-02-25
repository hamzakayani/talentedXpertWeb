import React, { FC, useEffect, useRef, useState } from 'react'
import ModalWrapper from '../ModalWrapper/ModalWrapper'

const InviteMemberModal: FC<any> = ({ isOpen, onClose }) => {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const closeRef = useRef(null)

    useEffect(() => {
        setOpenModal(true)
    }, [isOpen])

    const handleClose = () => {
        setOpenModal(false)
        onClose()
    }

    return (
        <>
            {openModal && 
                <div className='ad-review'>D
                    <ModalWrapper modalId={"InviteMemberModal"} title={'Add New Member'} closeRef={closeRef} handleClose={handleClose}>

                    </ModalWrapper>
                </div>
            }
        </>
    )
}

export default InviteMemberModal