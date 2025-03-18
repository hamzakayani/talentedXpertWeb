'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useEffect, useState } from 'react';
import FileUpload from '../upload/FileUpload';
import { uploadFileToS3 } from '@/services/uploadFileToS3/uploadFileToS3';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { disputeSchema } from '@/schemas/dispute-schema/disputeSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { InviteTEschema } from '@/schemas/InviteTE-schema/InviteTEschema';
import { dataForServer } from '@/models/InviteTEmodel/InviteTEmodel';

const InviteModal = ({ userId }: any) => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [tasks, setTasks] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false); // Added for consistency
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  type FormSchemaType = z.infer<typeof InviteTEschema>;

  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<FormSchemaType>({
    defaultValues: {
      description: '',
      expertProfileId: String(userId),
      taskId: '',
    },
    resolver: zodResolver(InviteTEschema),
    mode: 'all',
  });

  useEffect(() => {
    getTasks();
  }, []);

  useEffect(() => {
    if (userId) {
      setValue('expertProfileId', String(userId));
    }
  }, [userId]);

  const getTasks = async () => {
    let filters = '?status=POSTED';
    filters += '&profileType=' + user?.profile[0]?.type;

    try {
      const response = await apiCall(
        `${requests.getTaskOnStatus}${user?.id}${filters}`,
        {},
        'get',
        false,
        dispatch,
        user,
        router
      );
      setTasks(response?.data?.data?.tasks || []);
    } catch (error) {
      console.warn('Error fetching tasks:', error);
    }
  };

  const onSubmit: SubmitHandler<FormSchemaType> = async (data) => {
    setIsSubmitting(true); // Set submitting state
    const formData = dataForServer(data);

    try {
      const res = await apiCall(requests.inviteTE, formData, 'post', true, dispatch, user, router);

      if (res?.error) {
        const message = res?.error?.message;
        if (Array.isArray(message)) {
          message.map((msg: string) => toast.error(msg || 'Something went wrong, please try again'));
        } else {
          toast.error(message || 'Something went wrong, please try again');
        }
      } else {
        toast.success(res?.data?.message);
        reset(); // Reset form after success

        // Manually close modal on success (same as SubmitReview)
        const modal = document.getElementById('exampleModalToggle66');
        if (modal) {
          // Using Bootstrap's modal method to hide
          // @ts-ignore
          (window as any).bootstrap?.Modal?.getInstance(modal)?.hide();
        }

        // Optional: Redirect if needed (adjust as per your app's flow)
        // router.push('/some-route'); // Uncomment and adjust if redirection is desired
      }
    } catch (err) {
      console.warn('Submission error:', err);
      toast.error('An error occurred while submitting. Please try again.');
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="ad-dispute">
        <div className="modal fade" id="exampleModalToggle66" aria-hidden="true" aria-labelledby="exampleModalToggleLabel66" tabIndex={1}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content modal-content-center">
              <div className="modal-header">
                <h5 className="modal-title text-white" id="exampleModalToggleLabel66">Invite Xpert</h5>
                <button type="button" className="btn-close bg-light" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="taskDropdown" className="form-label">Select Task:</label>
                  <select {...register('taskId')} className="form-select" id="taskDropdown" defaultValue="">
                    <option value="" disabled>Select task</option>
                    {tasks?.map((data: any) => (
                      <option value={data?.id} key={data?.id}>{data?.name}</option>
                    ))}
                  </select>
                  {errors.taskId && <div className="text-danger pt-2">{errors?.taskId?.message}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleFormControlTextarea1" className="form-label">Description:</label>
                  <textarea
                    {...register('description')}
                    className="form-control"
                    id="exampleFormControlTextarea1"
                    rows={5}
                  />
                  {errors.description && <div className="text-danger pt-2">{errors.description.message}</div>}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting} // Disable button during submission
                >
                  {isSubmitting ? 'Inviting...' : 'Invite'} {/* Optional: Show loading text */}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default InviteModal;