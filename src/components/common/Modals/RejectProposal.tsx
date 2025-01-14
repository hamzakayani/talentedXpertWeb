import 'bootstrap/dist/js/bootstrap.bundle.min';
import apiCall from '@/services/apiCall/apiCall';
import { useRouter } from 'next/navigation';
import React, { FC, useState } from 'react'
import { toast } from 'react-toastify';

const RejectProposal: FC<any> = ({ updateProposals }: any, id: number) => {
    const router = useRouter()
    const [error, setError] = useState<string>('');
    const [reason, setReason] = useState<string>('');


    const handleSubmit = async () => {
        if (reason === '') {
            setError('Please fill the field');
            return;

        }
        else {
            setError('')
            updateProposals('REJECTED', reason)
            toast.success('PROPOSAL REJECTED')
            const closeButton = document.querySelector('.modal .btn-close');
            if (closeButton) {
                (closeButton as HTMLElement).click();
            }
            router.push(`/dashboard/tasks/${id}/proposals`)
        }

    }


    return (
        <div className='ad-dispute'>
            <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={1}>
                <div className="modal-dialog  modal-dialog-centered  ">
                    <div className="modal-content modal-content-center ">  

                        <div className="modal-header">
                            <h5 className="modal-title text-white" id="exampleModalToggleLabel2">Proposal Rejection</h5>
                            <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">

                            <div className="mb-3 ">
                                <label htmlFor="exampleFormControlTextarea1" className="form-label">Reason</label>
                                <textarea className="form-control" id="exampleFormControlTextarea1" rows={3} value={reason}
                                    onChange={(e) => setReason(e.target.value)}></textarea>
                                {error && <small className="text-danger">{error}</small>}
                            </div>


                        </div>
                        <div className="modal-footer">
                            <div className="d-grid gap-2">

                            </div>
                            <button type="submit" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
                        </div>
                    </div>

                </div>
            </div>





        </div>

    )
}

export default RejectProposal
