import React from 'react'
import HtmlData from '../HtmlData/HtmlData'

const ConnectNotVerified = () => {
  return (
    <>
      <div className="modal fade" id="exampleModalToggle78" aria-hidden="true" aria-labelledby="exampleModalToggleLabel45" tabIndex={1}>
                <div className="modal-dialog  modal-dialog-centered   ">

                    <div className="modal-content modal-content-center">

                        <div className="modal-header">
                            <h5 className="modal-title text-white" id="exampleModalToggleLabel45">Issue</h5>
                            <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close" ></button>
                        </div>
                        <div className="modal-body">
                                <div className="card-body viewtask">
                                    <HtmlData data={'Kindly connect your sprite account'} className="text-white mb-4" />
                                    
                                        <div className="text-end mb-3">
                                            <button
                                                className="btn rounded-pill btn-outline-info mx-1 my-1"
                                                data-bs-dismiss="modal" aria-label="Close"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                className="btn rounded-pill btn-outline-info mx-1 my-1"
                                                data-bs-dismiss="modal" aria-label="Close" 
                                            >
                                                Reject
                                            </button>
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
  </>
  )
}

export default ConnectNotVerified
