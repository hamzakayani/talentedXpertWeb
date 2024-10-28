import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'

const SubmitReview = ({ isOpen, onClose }: any) => {
    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
      setOpen(true)
    }, [isOpen])
  
    const handleClose = () => {
      onClose();
    }
  
  return (
    <div>
      {open &&<div className='ad-review'>
        <div className="modal fade" id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-white" id="exampleModalToggleLabel2">Add Review</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">


                <div className="mb-3 d-flex">
                  <label htmlFor="exampleFormControlInput1" className="form-label me-4">Add Rating :</label>
                  <div className='stars'>

                    <Icon icon="ic:baseline-star" className='text-warning' />
                    <Icon icon="ic:baseline-star" className='text-warning' />
                    <Icon icon="ic:baseline-star" className='text-warning' />
                    <Icon icon="mdi-light:star" className='text-light' />
                    <Icon icon="mdi-light:star" className='text-light' />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleFormControlTextarea1" className="form-label">Comments</label>
                  <textarea className="form-control" id="exampleFormControlTextarea1" rows={3}></textarea>
                </div>

              </div>
              <div className="modal-footer">
                <div className="d-grid gap-2">

                </div>
                <button type="button" className="btn btn-primary">Submit</button>
              </div>
            </div>
          </div>
        </div>





      </div>}
    </div>
  )
}

export default SubmitReview
