'use client'

import { milestotneReviewSchema } from '@/schemas/submitReviewMilestone-schema/submitReviewMilestoneSchema';
import { RootState, useAppDispatch } from '@/store/Store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import * as bootstrap from 'bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import { requests } from '@/services/requests/requests';
import apiCall from '@/services/apiCall/apiCall';
import { toast } from 'react-toastify';


const SubmitReviewMilestone = ({ setsubmitReviewMilestoneCheck, reviewMilestone, taskId, revieweeTeamId, getContract,task }: any) => {
  const modalRef = useRef<HTMLDivElement>(null)


  const user = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  type FormSchemaType = z.infer<typeof milestotneReviewSchema>;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState<number>(0); // Track rating value
  //   const [comments, setComments] = useState(''); // Simple state for comments
  const closeBtnRef = useRef<any>(null);
  // console.log('revieweeId',revieweeId, typeof(revieweeId))

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormSchemaType>({
    defaultValues: {
      review: "",
      rating: 0,
      taskId: Number(taskId),
      milestoneId: task?.amountType === "FIXED" ? Number(reviewMilestone.id) : undefined,
      reviewerProfileId: Number(user?.profile[0]?.id),
      revieweeProfileId: Number(reviewMilestone.teamMemberProfileId || reviewMilestone.teProfileId),
      revieweeTeamId:  revieweeTeamId? Number(revieweeTeamId): undefined,
      weeklyMilestoneId: task?.amountType === "HOURLY" ? Number(reviewMilestone.id) : undefined,
    },
    resolver: zodResolver(milestotneReviewSchema),
    mode: "all",
  });
  const setComments = (value: any) => {
    console.log('value', value)
    setValue('review', value)


  }
  console.log('err', errors)
  const handleDisputeClick = () => {
    const secondModal = new bootstrap.Modal(document.getElementById('exampleModalToggle11')!);
    secondModal.show();
  };

  const onSubmit = async (data: FormSchemaType) => {
    console.log('Form submitted:', { ...data });
    // Handle form submission here
    setIsSubmitting(true);
    try {
      const res = await apiCall(
        requests.milestoneReview,
        data,
        "post",
        true,
        dispatch,
        user,
        router
      );

      if (res?.error) {
        const message = res?.error?.message;
        if (Array.isArray(message)) {
          message?.map((msg: string) =>
            toast.error(msg || "Something went wrong, please try again")
          );
        } else {
          toast.error(message || "Something went wrong, please try again");
        }
      } else {
        toast.success(res?.data?.message);
        closeBtnRef.current?.click();
        handleClose()
        getContract()

        // router.push(`/dashboard/tasks/${taskId}`);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsSubmitting(false);
      reset();
    }

  };

  const handleClose = () => {
    setsubmitReviewMilestoneCheck(false)
    const parentModal = document.getElementById('exampleHiredProposal')
    if (parentModal) {
      parentModal.classList.add('show')
      parentModal.style.display = 'block'
      parentModal.removeAttribute('aria-hidden')
      parentModal.focus()
    }
  }

  return (

    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-xl">
      <div className="modal-content modal-content-center">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-white" id="exampleModalToggleLabel800">Submit Review for Milestone</h5>
            <button
              type="button"
              className="btn-close bg-light"
              onClick={handleClose} // Custom close handler
              aria-label="Close"
            ></button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="d-flex">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label me-4"
                >
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
                            icon={
                              star <= field.value
                                ? "ic:baseline-star"
                                : "mdi-light:star"
                            }
                            className={
                              star <= field.value
                                ? "text-warning"
                                : "text-light"
                            }
                            onClick={() => {
                              field.onChange(star);
                              setRating(star); // Update rating state
                            }}
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
                </div>
              </div>
              {errors.rating && (
                <div className="text-danger pt-2 mb-2">
                  {errors.rating.message}
                </div>
              )}
              {rating > 0 && rating < 3 && (
                <div className="text-danger pt-2 mb-2">
                  It seems like you are not satisfied with the work. Please
                  open a dispute to resolve the issue.
                </div>
              )}
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea1"
                  className="form-label"
                >
                  Comments
                </label>
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows={3}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter your comments here..."
                />
                {errors.review && (
                  <div className="text-danger pt-2 mb-2">
                    {errors.review.message}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <div className="d-grid gap-2">
                {rating > 0 && rating < 3 && (
                  <button
                    type="button"
                    className="btn btn-warning"
                    onClick={handleDisputeClick}
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    Open Dispute
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={rating > 0 && rating < 3} // Disable submit if rating < 3
                >
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

  )
}

export default SubmitReviewMilestone




