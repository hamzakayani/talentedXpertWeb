import { dataForServer } from '@/models/reviewModel/reviewModel';
import { reviewSchema } from '@/schemas/submitReview-schema/submitReviewSchema'
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { RootState, useAppDispatch } from '@/store/Store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js'
import { useRouter } from 'next/navigation';
import React, { FC, useEffect, useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { z } from 'zod';

const SubmitReview: FC<any> = ({ taskId, revieweeId }: {taskId: number; revieweeId: number }) => {
  const user = useSelector((state: RootState) => state.user)
  const dispatch = useAppDispatch();
  const router = useRouter()
  type FormSchemaType = z.infer<typeof reviewSchema>

  console.log('revieweeProfileId', revieweeId, taskId, typeof (revieweeId))

  const { register, handleSubmit, control, formState: { errors, }, setValue } = useForm<FormSchemaType>({
    defaultValues: {
      comments: '',
      rating: 0,
      taskId: Number(taskId),
      reviewerProfileId: Number(user?.profile[0]?.id),
      revieweeProfileId: 0,

    },
    resolver: zodResolver(reviewSchema),
    mode: 'all'
  })
  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    console.log('data', data)
    const formData = dataForServer(data)
    console.log('newData', formData)

    await apiCall(requests.reviews, formData, 'post', true, dispatch, user, router).then((res: any) => {
      let message: any;
      if (res?.error) {
        message = res?.error?.message;

        if (Array.isArray(message)) {
          message?.map((msg: string) => toast.error(msg ? msg : 'Something went wrong, please try again'));
        } else {
          toast.error(message ? message : 'Something went wrong, please try again')
        }
        // setIsFormSubmitted(false)
      } else {
        // setIsFormSubmitted(false)
        toast.success(res?.data?.message)
        console.log('post res', res)
        router.push(`/dashboard/tasks/${taskId}`);

      }
    }).catch(err => {
      // setIsFormSubmitted(false)
      console.warn(err)
    })

   

  }

  useEffect(() => {
    console.log("hello")
    if(revieweeId){
      setValue('revieweeProfileId',revieweeId)
    }
      }, [revieweeId])

  console.log('err', errors)


  return (
    <div>
      <div className='ad-review'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="modal fade" id="exampleModalToggle88" aria-hidden="true" aria-labelledby="exampleModalToggleLabe88" tabIndex={1}>
          
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-white" id="exampleModalToggleLabe88">Add Review</h5>
                  <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">

                  <div className="mb-3 d-flex">
                    <label htmlFor="exampleFormControlInput1" className="form-label me-4">
                      Add Rating :
                    </label>
                    <div className="stars d-flex">
                      <Controller
                        name="rating"
                        control={control}
                        render={({ field }) => (
                          <div className="d-flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Icon
                                key={star}
                                icon={star <= field.value ? "ic:baseline-star" : "mdi-light:star"}
                                className={star <= field.value ? "text-warning" : "text-light"}
                                onClick={() => field.onChange(star)} // Update the rating
                                style={{
                                  cursor: "pointer",
                                  fontSize: "2rem",
                                  marginRight: "5px",
                                }}
                              />
                            ))}
                          </div>
                        )}
                      />

                      {/* {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        icon={star <= rating ? 'ic:baseline-star' : 'mdi-light:star'}
                        className={star <= rating ? 'text-warning' : 'text-light'}
                        onClick={() => handleRating(star)} 
                        style={{
                          cursor: 'pointer',
                          fontSize: '2rem', 
                          marginRight: '5px', 
                        }}
                      />
                    ))} */}
                    </div>
                  </div>


                  {/* <div className="mb-3 d-flex">
                  <label htmlFor="exampleFormControlInput1" className="form-label me-4">Add Rating :</label>
                  <div className='stars'>

                    <Icon icon="ic:baseline-star" className='text-warning' />
                    <Icon icon="ic:baseline-star" className='text-warning' />
                    <Icon icon="ic:baseline-star" className='text-warning' />
                    <Icon icon="mdi-light:star" className='text-light' />
                    <Icon icon="mdi-light:star" className='text-light' />
                  </div>
                </div> */}
                  <div className="mb-3">
                    <label htmlFor="exampleFormControlTextarea1" className="form-label">Comments</label>
                    <textarea {...register('comments')} className="form-control" id="exampleFormControlTextarea1" rows={3}></textarea>
                  </div>

                </div>
                <div className="modal-footer">
                  <div className="d-grid gap-2">

                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </div>
            </div>
          
        </div>

        </form>



      </div>
    </div>
  )
}

export default SubmitReview
