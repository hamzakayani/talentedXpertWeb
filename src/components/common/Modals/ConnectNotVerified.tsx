import React from 'react'
import HtmlData from '../HtmlData/HtmlData'
import Link from 'next/link'
import { useNavigation } from '@/hooks/useNavigation'

const ConnectNotVerified = ({id, step}:any) => {
console.log('id',id)

const { navigate } = useNavigation()
    return (
        <div className='ad-dispute'>
            <div className="modal fade" id="exampleModalToggle45" aria-hidden="true" aria-labelledby="exampleModalToggleLabel45" tabIndex={1}>
                <div className="modal-dialog  modal-dialog-centered   ">

                    <div className="modal-content modal-content-center">

                        <div className="modal-header">
                            <h5 className="modal-title text-white" id="exampleModalToggleLabel45">Payment Method Required</h5>
                            <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close" ></button>
                        </div>

                        <div className="modal-body">
                            <div className="card-body viewtask">
                                <HtmlData data={'Kindly connect your stripe account'} className="text-white mb-4" />

                                <div className="text-end mb-3" data-bs-dismiss="modal" aria-label="Close">
                                    {step && id && <Link
                                        className="btn rounded-pill btn-outline-info mx-1 my-1"
                                        href={`/dashboard/tasks/${id}/add-proposal`}
                                        onClick={()=> navigate(`/dashboard/tasks/${id}/add-proposal`) }
                                    >
                                        Skip for Now
                                    </Link>}
                                    <Link
                                        className="btn rounded-pill btn-outline-info mx-1 my-1"
                                        href={'/dashboard/payments/information'}
                                        onClick={()=> navigate('/dashboard/payments/information')}
                                    >
                                        Ok
                                    </Link>
                                </div>

                            </div>

                        </div>
                        {/* {user?.profile[0]?.type === 'TR' && <div className="modal-footer">
                            <div className="d-grid gap-2">

                            </div>
                            {user?.profile[0]?.type === 'TR' && taskStatus !== 'COMPLETED' && taskStatus != 'INPROGRESS' && <button type="submit" className="btn btn-info btn-sm rounded-pill" data-bs-dismiss="modal" aria-label="Close" onClick={handleSubmit} >Submit</button>}
                        </div>} */}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ConnectNotVerified
