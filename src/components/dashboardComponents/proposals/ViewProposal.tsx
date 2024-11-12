'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import { useParams, useRouter } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { getTimeago } from '@/services/utils/util';
import defaultUserImg from "../../../../public/assets/images/default-user.jpg"
import ImageFallback from '@/components/common/ImageFallback/ImageFallback';
import { dynamicBlurDataUrl } from '@/services/utils/dynamicBlurImage';
import Hire from '@/components/common/Modals/Hire';
import { number } from 'zod';

const ViewProposal = () => {
  let { id, proposalId } = useParams()
  // id = Number(id);
  const dispatch = useAppDispatch();
  const router = useRouter()
  const user = useSelector((state: RootState) => state.user)
  const [proposal, setProposal] = useState<any>({})
  const [task, setTask] = useState<any>({})
  const [thread, setThread] = useState<any>({})
  const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');
  const [pop, setPop] = useState<boolean>(false);

  const getProposals = async () => {
    try {
      const response = await apiCall(requests.getProposals, { id: Number(proposalId) }, 'get', false, dispatch, user, router);
      setProposal(response?.data?.data?.proposals[0] || {});
    } catch (error) {
      console.warn("Error fetching tasks:", error);
    }
  }
  const getTask = async () => {
    await apiCall(requests.getTaskId + Number(id), {}, 'get', false, dispatch, user, router).then((res: any) => {
        setTask(res?.data?.data?.task || [])
        
    }).catch(err => console.warn(err))
    console.log('task', task)
}


  const getMessageThread = async (item:any) => {
    console.log(item)
    let params:string = ''
    // params += '?expertProfileId=' + item.expertProfileId;
    try {
      const response = await apiCall(requests.getThread, {}, 'get', false, dispatch, user, router);
      console.log('MSGresponse', response?.data);
      if (response?.data?.threads?.length === 0) {
        let data = {
        'taskId': item.taskId,
        'expertProfileId':item.expertProfileId 
        }
        const res = await apiCall(requests.createThread, data, 'post', false, dispatch, user, router);
        console.log('MSG2response (new thread)', res);
        setThread(res?.data || {});
      }
      else{
        console.log('id', response, response?.data?.threads[0]?.id)
        // router.push(`/dashboard/messaage/${response?.threads?.id}`)
        router.push(
          `/dashboard/message/?threadid=${response?.data?.threads[0]?.id}&personid=${response?.data?.threads[0]?.expertProfile?.userId}`
        );
      }
      setThread(response?.data || {});
    } catch (error) {
      console.warn('Error fetching tasks:', error);
    }
  }  
  
  useEffect(() => {
    getProposals();
    getTask();
  }, [])

  useEffect(() => {
    if (user?.profilePicture || defaultUserImg) {
      fetchBlurDataURL();
    }
  }, [user?.profilePicture, defaultUserImg]);


  const fetchBlurDataURL = async () => {
    if (user?.profilePicture || defaultUserImg) {
      const blurUrl = await dynamicBlurDataUrl(user?.profilePicture || defaultUserImg);
      setProfileImageBlurDataURL(blurUrl);
    }
  }
  const handleSubmit = () => {
    setPop(true)
  }

  return (
    <div className='card'>
      <div className='card first-card card-header'>
        <h3>View TalentXpert proposal</h3>
      </div>
      <div className='card-bodyy my-active-task'>


        <div className='row'>
          <div className='col-md-7'>
            <div className="box m-2 ">
              <div className='row'>
                <div className='  col-3  '>
                  <div className=' card-profile text-center mt-4 '>

                    <ImageFallback
                      src={proposal?.expertProfile?.user?.profilePicture || defaultUserImg}
                      fallbackSrc={defaultUserImg}
                      alt="img"
                      className="user-img img-round"
                      width={90}
                      height={90}
                      loading='lazy'
                      blurDataURL={profileImageBlurDataURL}
                    />
                    <h2>{proposal?.expertProfile?.user?.firstName} {proposal?.expertProfile?.user?.lastName}</h2>
                  </div>
                </div>
                <div className=' col-9 p-4'>
                  <div className='priceanddate d-flex justify-content-between bordr'>
                    <div className='stars'>
                      <h4>{proposal?.task?.name}</h4>
                      <Icon icon="ic:baseline-star" className='text-warning' />
                      <Icon icon="ic:baseline-star" className='text-warning' />
                      <Icon icon="ic:baseline-star" className='text-warning' />
                      <Icon icon="mdi-light:star" className='text-light' />
                      <Icon icon="mdi-light:star" className='text-light' />
                    </div>
                    <div>
                      <span>{getTimeago(proposal.createdAt)}</span>
                      <h5>${proposal?.amount}</h5>
                    </div>
                  </div>
                  <p>{proposal?.details}</p>

                  <div className="accordion my-5" id="accordionExample">
                    <h6>Interview Questions</h6>
                    {proposal?.answers?.map((data: any, index: number) => (
                      <div className="accordion-item" key={index}>
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button bg-black text-white"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${index}`}
                            aria-expanded="false"
                            aria-controls={`collapse${index}`}
                          >
                            {data?.question?.question}
                          </button>
                        </h2>
                        <div
                          id={`collapse${index}`}
                          className="accordion-collapse collapse"
                          data-bs-parent="#accordionExample"
                        >
                          <div className="accordion-body bg-gray text-white">
                            {data.answer}
                          </div>
                        </div>
                      </div>
                    ))}


                  </div>

                  <div className='btn-border'>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Reject</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Shortlist</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1" onClick={() => getMessageThread(proposal)}>Message</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Complete</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1 " data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">Submit Review</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1">Payment</button>
                    <button className="btn rounded-pill btn-outline-info mx-1 my-1" data-bs-target="#exampleHiredProposal" data-bs-toggle="modal"  onClick={handleSubmit}>Hire</button>
                  </div>

                </div>

              </div>
            </div>
          </div>
          <div className='col-md-5'>
            <div className='my-project p-2'>
              <div className='d-flex'>
                <h3 className='me-2'>{task.name}</h3>
                <h5 className='w-9'>${task.amount}</h5>
              </div>
              <p>
                {task.details}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='ad-review'>
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





      </div>


      {pop && <Hire isOpen={pop} onClose={() => setPop(false)} />}
    </div>
  )
}

export default ViewProposal