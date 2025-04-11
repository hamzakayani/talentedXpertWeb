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
  const dispatch = useAppDispatch()
  const router = useRouter()
  
  // State to track number of days and total amount
  const [promotionDays, setPromotionDays] = useState<number | ''>('')
  const promotionRate = 5 // $5 per day
  const totalAmount = promotionDays ? promotionDays * promotionRate : 0

  // Watch the 'promoted' radio button value
  const isPromoted = watch('promoted')

  useEffect(() => {
    setOpen(isOpen)
  }, [isOpen])

  // Reset promotionDays when promotion is not selected
  useEffect(() => {
    if (isPromoted === 'false') {
      setPromotionDays('')
    }
  }, [isPromoted])

  const handleClose = () => {
    setIsFormSubmitted(false)
    setPromotionDays('')
    onClose()
  }

  const handleSubmit = () => {
    // Include promotionDays and totalAmount in formData if promoted
    // const formData = dataForServer({
    //   ...data,
    //   promoted: watch('promoted'),
    //   ...(watch('promoted') === 'true' && {
    //     promotionDays: Number(promotionDays),
    //     promotionTotal: totalAmount,
    //   }),
    // })
    const formData = dataForServer({
      ...data,
      promoted: watch('promoted')
    })

    apiCall(
      `${type ? requests.editTask + id : requests.addtask}`,
      formData,
      `${type ? 'put' : 'post'}`,
      true,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        let message: any
        if (res?.error) {
          message = res?.error?.message
          if (Array.isArray(message)) {
            message?.map((msg: string) => toast.error(msg ? msg : 'Something went wrong, please try again'))
          } else {
            toast.error(message ? message : 'Something went wrong, please try again')
          }
          setIsFormSubmitted(false)
        } else {
          toast.success(res?.data?.message)
          setIsFormSubmitted(false)
          reset({})
          handleClose()
          router.push('/dashboard/tasks')
        }
      })
      .catch((err) => {
        setIsFormSubmitted(false)
        console.warn(err)
      })
  }

  return (
    <>
      {open && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
          id="exampleModalToggle2"
          aria-hidden="true"
          aria-labelledby="exampleModalToggleLabel2"
          tabIndex={1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-black" id="exampleModalToggleLabel2">
                  Would you like to promote your task?
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={handleClose}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <div className="form-check radio me-4">
                    <label className="form-check-label" htmlFor="promoteYes">
                      <input
                        {...register('promoted')}
                        value="true"
                        className="form-check-input"
                        type="radio"
                        name="promoted"
                        id="promoteYes"
                      />
                      Yes
                    </label>
                  </div>
                  <div className="form-check radio me-3">
                    <label className="form-check-label" htmlFor="promoteNo">
                      <input
                        {...register('promoted')}
                        value="false"
                        className="form-check-input"
                        type="radio"
                        name="promoted"
                        id="promoteNo"
                      />
                      No
                    </label>
                  </div>
                </div>

                {/* Show days input and rate info when 'Yes' is selected */}
                {isPromoted === 'true' && (
                  <div className="mb-3">
                    <label htmlFor="promotionDays" className="form-label">
                      How many days would you like to promote the task?
                    </label>
                    <input
                      type="number"
                      className="form-control text-dark"
                      id="promotionDays"
                      value={promotionDays}
                      onChange={(e) => {
                        const value = e.target.value
                        setPromotionDays(value === '' ? '' : Number(value))
                      }}
                      min="1"
                      placeholder="Enter number of days"
                    />
                    <div className="mt-2">
                      <p>Rate: $5 per day</p>
                      {promotionDays  && (
                        <p>Total Amount: ${totalAmount}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Promotion