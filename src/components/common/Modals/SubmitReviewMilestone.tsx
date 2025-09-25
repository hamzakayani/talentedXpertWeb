'use client'

import { milestotneReviewSchema } from '@/schemas/submitReviewMilestone-schema/submitReviewMilestoneSchema';
import { RootState, useAppDispatch } from '@/store/Store';
import { zodResolver } from '@hookform/resolvers/zod';
import { Icon } from '@iconify/react/dist/iconify.js';
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import * as bootstrap from 'bootstrap';
import { Controller, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { z } from 'zod';
import { requests } from '@/services/requests/requests';
import apiCall from '@/services/apiCall/apiCall';
import { toast } from 'react-toastify';
import ModalWrapper from '../ModalWrapper/ModalWrapper';
import { StarIcon } from '@hugeicons/core-free-icons';


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
      <ModalWrapper
        modalId={"exampleModalToggleLabel800"}
        title={"Submit Review for Milestone"}
        closeRef={closeBtnRef}
        handleClose={handleClose}      
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="d-flex justify-content-center align-items-center gap-1">
            <label
              htmlFor="exampleFormControlInput1"
              className="fs-14"
            >
              Add Ratings :
            </label>
            <Controller
              name="rating"
              control={control}
              render={({ field }) => (
                <div className='stars d-flex gap-1'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <HugeiconsIcon
                      key={star}
                      icon={StarIcon}
                      className={
                        star <= field.value
                          ? "text-warning"
                          : ""
                      }
                      onClick={() => {
                        field.onChange(star);
                        setRating(star); // Update rating state
                      }}
                      size={20}
                      style={ star <= field.value ? { fill: "currentColor", stroke: "currentColor" } : { } }
                    />
                  ))}
                </div>
              )}
            />
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
          <div className="form-floating mt-3 mb-3">
            <textarea
              className="form-control"
              id="comment"
              rows={3}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Write your comments here..."
            />
            <label
              htmlFor="comment"
              // className="form-label"
            >
              Comments
            </label>
            {errors.review && (
              <div className="text-danger mt-2 mb-2">
                {errors.review.message}
              </div>
            )}
          </div>
          <div className="d-flex justify-content-end">
            {rating > 0 && rating < 3 && (
              <button
                type="button"
                className="btn btn-warning me-2"
                onClick={handleDisputeClick}
                data-bs-dismiss="modal"
                aria-label="Close"
              >
                Open Dispute
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary text-white"
              style={{ background: 'linear-gradient(135deg, #00BBFF, #5947FF)',}}
              disabled={rating > 0 && rating < 3} // Disable submit if rating < 3
            >
              Submit Review
            </button>
          </div>
        </form>
      </ModalWrapper>
  )
}

export default SubmitReviewMilestone




