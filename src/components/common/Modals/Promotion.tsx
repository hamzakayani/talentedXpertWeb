'use client'
import { dataForServer } from '@/models/taskModel/taskModel'
import apiCall from '@/services/apiCall/apiCall'
import { requests } from '@/services/requests/requests'
import { RootState, useAppDispatch } from '@/store/Store'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'


const Promotion = ({ isOpen, onClose, register, watch, setValue, activeStep, setActiveStep, data, reset, setIsFormSubmitted, type, id }: any) => {
  const user = useSelector((state: RootState) => state.user)
  const [open, setOpen] = useState<boolean>(false)
  const dispatch = useAppDispatch();
  const router = useRouter()

  useEffect(() => {
    setOpen(true)
  }, [isOpen])

  const handleClose = () => {
    onClose();
  }

  const handleSubmit = () => {
    const formData = dataForServer({
      ...data,
      promoted: watch('promoted'),
      disability: watch('disability')
    })
    
    const { taskLocation, interviewQuestions , ...updatedFormData} = formData;
    apiCall(`${type?requests.editTask + id:requests.addtask}`, type? updatedFormData: formData, `${type?'put':'post' }`, true, dispatch, user, router).then((res: any) => {
      let message: any;
      if (res?.error) {
        message = res?.error?.message;

        if (Array.isArray(message)) {
          message?.map((msg: string) => toast.error(msg ? msg : 'Something went wrong, please try again'));
        } else {
          toast.error(message ? message : 'Something went wrong, please try again')
        }
        setIsFormSubmitted(false)
      } else {
        if(type){
          toast.success("Updated!", {
            position: 'top-right'
          });
        }

        setIsFormSubmitted(false)
        reset({})
        handleClose()
        router.push('/dashboard/tasks')
        
      }
    }).catch(err => {
      setIsFormSubmitted(false)
      console.warn(err)
    })
  }



  return (
    <>
      {open &&
        <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.75)' }} id="exampleModalToggle2" aria-hidden="true" aria-labelledby="exampleModalToggleLabel2" tabIndex={1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-black" id="exampleModalToggleLabel2">Add Promotion <aside></aside></h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleClose}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <div className="form-check radio me-4">

                    <label className="form-check-label" htmlFor="profileType1">
                      <input value={'true'} className="form-check-input" type="radio" name="promoted" id="profileType1"
                      onChange={() => setValue("promoted", true)} />
                      Yes
                    </label>
                  </div>
                  <div className="form-check radio me-3">
                    <label className="form-check-label" htmlFor="profileType1">
                      <input value={'false'} className="form-check-input" type="radio" name="promoted" id="profileType1"
                      onChange={() => setValue("promoted", false)} />
                      No
                    </label>
                  </div>
                </div>

              </div>
              <div className="modal-footer">
                <div className="d-grid gap-2">

                </div>
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      }
    </>

  )
}

export default Promotion
