'use client'
import React, { useEffect, useState } from 'react'

const ProfileType = ({ isOpen, onClose }: any) => {
  const [open, setOpen] = useState<boolean>(false)

  useEffect(() => {
    setOpen(true)
  }, [isOpen])

  const handleClose = () => {
    onClose();
  }


  return (
    <>
      {open &&
        <div className="modal fade show" style={{display:'block',backgroundColor:'rgba(0, 0, 0, 0.75)'}} id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={1}>
          <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-black" id="exampleModalToggleLabel2">Login as <aside></aside></h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <div className="form-check radio me-4">
              <input className="form-check-input" type="radio" name="profileType" id="profileType1" value="TE" />
              <label className="form-check-label" htmlFor="profileType1">
                Talented Xpert
              </label>
            </div>
            <div className="form-check radio me-3">
              <input className="form-check-input" type="radio" name="profileType" id="profileType1" value="TR" />
              <label className="form-check-label" htmlFor="profileType1">
                Talent Requester
              </label>
            </div>
                </div>

              </div>
              <div className="modal-footer">
                <div className="d-grid gap-2">

                </div>
                <button type="button" className="btn btn-primary">Submit</button>
              </div>
            </div>
          </div>
        </div>}
    </>
  )
}

export default ProfileType
