import { Icon } from '@iconify/react/dist/iconify.js'
import React, { useEffect, useState } from 'react'

const Hire = ({ isOpen, onClose }: any) => {

    const [open, setOpen] = useState<boolean>(false)

    useEffect(() => {
        setOpen(true)
      }, [isOpen])
    
      const handleClose = () => {
        onClose();
      }
  return (
    <div>
     {open && <div className='create-milstone'>
        <div className="modal fade" id="exampleHiredProposal"  aria-hidden="true" aria-labelledby="exampleModalHiredProposal" tabIndex={1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-white" id="exampleModalToggleLabel2">Create Milestone</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">


                <div className="mb-3 ">
                  <label htmlFor="exampleFormControlInput1" className="form-label me-4">Add Rating :</label>

                </div>
                <div className='table-responsive'>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col"></th>
                        <th scope="col">SR</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col"></th>


                      </tr>
                    </thead>
                    <tbody>
                      <tr className='table-dark'>
                        <th scope="row"> <Icon icon="line-md:plus-square-filled" className='text-info' width={32} height={32} /></th>
                        <td>1</td>
                        <td><input type="email" className="form-control text-white" id="exampleFormControlInput1" placeholder="$" /></td>
                        <td><Icon icon="uiw:date" /></td>
                        <td>05/08/2024</td>

                      </tr>
                      <tr className='table-dark'>
                        <th scope="row"> <Icon icon="line-md:plus-square-filled" className='text-info' width={32} height={32} /></th>
                        <td>1</td>
                        <td><input type="email" className="form-control" id="exampleFormControlInput1" placeholder="$" /></td>
                        <td><Icon icon="uiw:date" /></td>
                        <td>05/08/2024</td>

                      </tr>
                    </tbody>
                  </table>
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

export default Hire
