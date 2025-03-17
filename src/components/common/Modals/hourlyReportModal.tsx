'use client'
import React from 'react'

const HourlyReportModal = () => {
  return (
    <form>
            <div className='ad-dispute'>
                <div className="modal fade" id="exampleModalToggle555" aria-hidden="true" aria-labelledby="exampleModalToggleLabe555" tabIndex={1}>
                    <div className="modal-dialog  modal-dialog-centered   ">

                        <div className="modal-content modal-content-center">

                            <div className="modal-header">
                                <h5 className="modal-title text-white" id="exampleModalToggleLabel555">Log Hours</h5>
                                <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">

                                {/* <div className="mb-3">
                                    <label htmlFor="taskDropdown" className="form-label">Select Task:</label>
                                    <select className="form-select" id="taskDropdown" defaultValue="">
                                        <option value="" disabled>Select task</option>
                                        {tasks?.map((data: any) => <option value={data?.id} key={data?.id}>{data?.name}</option>)}
                                        
                                    </select>
                                </div> */}
                                {/* <div className="mb-3 ">
                                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Description:</label>
                                    <textarea
                                       
                                        className="form-control"
                                        id="exampleFormControlTextarea1"
                                        rows={5}
                                       >
                                    </textarea>
                                    {
                                        errors.description && (
                                            <div className="text-danger pt-2">{errors.description.message}</div>
                                        )
                                    }
                                </div> */}



                            </div>
                            <div className="modal-footer">
                                <div className="d-grid gap-2">

                                </div>
                                <button type="submit" className="btn btn-primary"  >Submit</button>
                            </div>
                        </div>

                    </div>
                </div>





            </div>
        </form>
  )
}

export default HourlyReportModal





 