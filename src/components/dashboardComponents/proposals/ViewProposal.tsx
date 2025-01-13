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
import { setThread } from '@/reducers/ThreadSlice';
import { number } from 'zod';
import Link from 'next/link';
import Hire from '@/components/common/Modals/Hire';
import HtmlData from '@/components/common/HtmlData/HtmlData';
import { ProposalStatus } from '@/services/enums/enums';
import DisputeModal from '@/components/common/Modals/DisputeModal';
import RejectProposal from '@/components/common/Modals/RejectProposal';
import SubmitReview from '@/components/common/Modals/SubmitReview';

const ViewProposal = () => {
  let { id, proposalId } = useParams()
  const dispatch = useAppDispatch();
  const router = useRouter()
  const user = useSelector((state: RootState) => state.user)
  const [proposal, setProposal] = useState<any>({})
  const [contracts, setContracts] = useState<any>({})
  const [task, setTask] = useState<any>({})
  const [reason, setRe] = useState<any>({})
  const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');
  const [type, setType] = useState<boolean>(false);
  const [milestones, setMilestones] = useState<any>([])
  const [areAllMilestonesApproved, setAreAllMilestonesApproved] = useState<boolean>(false)
  const [areAllMilestonesPaid, setAreAllMilestonesPaid] = useState<boolean>(false)
  const [addReview, setAddReview] = useState<boolean>(false)
  const revieweeId = Number(proposal?.expertProfileId)


  const getProposals = async () => {
    try {
      const response = await apiCall(requests.getProposals, { id: Number(proposalId) }, 'get', false, dispatch, user, router);
      setProposal(response?.data?.data?.proposals[0] || {});
    } catch (error) {
      console.warn("Error fetching tasks:", error);
    }
  }
  const updateProposals = async (status: string, reason: string) => {
    const data = {
      status: status,
      taskId: Number(id),
      ...(status === 'REJECTED' && { rejectionReason: reason })

    }
    try {
      const response = await apiCall(requests.updateProposal + Number(proposalId), data, 'put', false, dispatch, user, router);
      router.push(`/dashboard/tasks/${id}/proposals`)
    } catch (error) {
      console.warn(error);
    }
  }
  console.log('expertProfileId', proposal?.expertProfileId)

  const updateTask = async (status: string) => {
    console.log('comp')
    const data = {
      status: status,
    }
    try {
      const response = await apiCall(requests.editTask + Number(id), data, 'put', false, dispatch, user, router);
      // router.push(`/dashboard/tasks/${id}/proposals`)
    } catch (error) {
      console.warn(error);
    }
  }
  const getTask = async () => {
    await apiCall(requests.getTaskId + Number(id), {}, 'get', false, dispatch, user, router).then((res: any) => {
      setTask(res?.data?.data?.task || [])

    }).catch(err => console.warn(err))


  }
  const getContract = async () => {
    await apiCall(requests.getContract, { proposalId: Number(proposalId) }, 'get', false, dispatch, user, router).then((res: any) => {
      setContracts(res?.data?.data?.contracts[0] || [])


    }).catch(err => console.warn(err))
  }



  const getMilestones = async (id: number) => {
    let params: any = '?contractId=' + Number(id);
    await apiCall(`${requests.getMilestones}${params}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
      setMilestones(res?.data?.data?.milestones || [])
      setType(true)

    }).catch(err => console.warn(err))
  }

  const getMessageThread = async (proposal: any) => {
    try {
      const response = await apiCall(requests.getThread, {}, 'get', false, dispatch, user, router);
      const matchingThread = response?.data?.threads?.find((thread: any) => thread.expertProfileId === proposal.expertProfileId);

      if (matchingThread) {
        // console.log('got',matchingThread)
        dispatch(setThread(matchingThread))
        router.push(
          // `/dashboard/message/?threadid=${matchingThread?.id}&personid=${matchingThread?.expertProfileId}`
          `/dashboard/message/${matchingThread?.id}`
        );
      }
      else {
        let data = {
          'taskId': proposal?.taskId,
          'expertProfileId': proposal?.expertProfileId
        }
        const res = await apiCall(requests.createThread, data, 'post', false, dispatch, user, router);
        dispatch(setThread(res?.data.thread))
        router.push(
          `/dashboard/message/${res?.data.thread?.id}`
        );
      }


    } catch (error) {
      console.warn('Error fetching threads', error);
    }
  }

  useEffect(() => {
    getTask();
  }, [])

  useEffect(() => {
    if (proposalId) {
      getContract();
      getProposals();
    }
  }, [proposalId])

  useEffect(() => {
    if (contracts?.id) {
      getMilestones(contracts?.id)
    }    
  }, [contracts])

  useEffect(() => {
    if(milestones?.length> 0){
     setAreAllMilestonesApproved(
      milestones?.every((milestone: any) => milestone.status === 'APPROVED') || false);
      setAreAllMilestonesPaid(
        milestones?.every((milestone: any) => milestone.status === 'PAID') || false
      );
      setAddReview(
        milestones?.some((milestone: any) => milestone.status === 'PAID') || false
      );
    
    }

  }, [milestones]);
  useEffect(()=>{
    if(areAllMilestonesPaid){
      updateTask('COMPLETED');
    }
  },[areAllMilestonesPaid])

  console.log('areAllMilestonesPaid', areAllMilestonesPaid)

  useEffect(() => {
    if (user?.profilePicture?.fileUrl || defaultUserImg) {
      fetchBlurDataURL();
    }
  }, [user?.profilePicture, defaultUserImg]);


  const fetchBlurDataURL = async () => {
    if (user?.profilePicture?.fileUrl || defaultUserImg) {
      const blurUrl = await dynamicBlurDataUrl(user?.profilePicture?.fileUrl || defaultUserImg);
      setProfileImageBlurDataURL(blurUrl);
    }
  }


  return (
    <div className='card'>
      <div className='card first-card card-header'>
        <h3>View TalentXpert proposal</h3>
      </div>
      <div className='card-bodyy my-active-task bg-black'>


        <div className='row'>
          <div className='col-md-7'>
            <div className="box m-2 ">
              <div className='row'>
                <div className='  col-2 ms-2 me-3 me-md-0 '>
                  <div className=' card-profile text-center mt-4 '>

                    <ImageFallback
                      src={proposal?.expertProfile?.user?.profilePicture?.fileUrl || defaultUserImg}
                      fallbackSrc={defaultUserImg}
                      alt="img"
                      className="user-img img-round"
                      width={60}
                      height={60}
                      loading='lazy'
                      blurDataURL={profileImageBlurDataURL}
                    />
                    <h2 className='w-s'>{proposal?.expertProfile?.user?.firstName} {proposal?.expertProfile?.user?.lastName}</h2>
                  </div>
                </div>
                <div className=' col-9 p-4'>
                  <div className='priceanddate d-flex justify-content-between bordr'>
                    <div className='stars mb-2'>
                      <h4 className='m-0 p-0'>{proposal?.task?.name}</h4>
                      <Icon icon="ic:baseline-star" className='text-warning' />
                      <Icon icon="ic:baseline-star" className='text-warning' />
                      <Icon icon="ic:baseline-star" className='text-warning' />
                      <Icon icon="mdi-light:star" className='text-light' />
                      <Icon icon="mdi-light:star" className='text-light' />
                    </div>
                    <div>
                      <span>{getTimeago(proposal.createdAt)}</span>
                      <h5 className='text-center'>${proposal?.amount}</h5>
                    </div>
                  </div>
                  <HtmlData data={proposal?.details} className='text-white' />
                  {/* <h5>Rejection Reason: {proposal?.rejectionReason}</h5> */}
                  {proposal?.rejectionReason && user?.profile?.length> 0 && user?.profile[0]?.type==='TE' && (
                    <div className="alert alert-danger mt-4">
                      <h5 className="mb-2 text-danger">Rejection Reason</h5>
                      <p className="mb-0">{proposal.rejectionReason}</p>
                    </div>
                  )}
                  {/* <p>{proposal?.details}</p> */}

                  {proposal?.documents?.map((doc: any) => (
                    <div key={doc.fileUrl}>
                      <Link href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                        {doc.key}
                      </Link>
                    </div>
                  ))}


                  <div className="accordion my-5" id="accordionExample">
                    {proposal?.answers?.question?.length > 0 && <h6>Interview Questions</h6>}
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

                  <div className='btn-border '>
                    {user?.profile[0]?.type === 'TR' ?
                      <>
                        {proposal?.status != "REJECTED" && <button className="btn rounded-pill btn-outline-info mx-1 my-1" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">Reject</button>}
                        {proposal?.status !== 'SHORTLISTED' && <button className="btn rounded-pill btn-outline-info mx-1 my-1" onClick={() => updateProposals('SHORTLISTED', '')}>Shortlist</button>}
                        <button className="btn rounded-pill btn-outline-info mx-1 my-1" onClick={() => getMessageThread(proposal)}>Message</button>
                        {areAllMilestonesApproved && proposal?.status != "HIRED" && <button className="btn rounded-pill btn-outline-info mx-1 my-1" onClick={() => updateProposals('HIRED', '')}>Hire</button>}
                       {addReview && <button className="btn rounded-pill btn-outline-info mx-1 my-1 " data-bs-target="#exampleModalToggle88" data-bs-toggle="modal">Submit Review</button>}
                        <Link className="btn rounded-pill btn-outline-info mx-1 my-1" href={`/dashboard/tasks/${id}/contract/?proposalId=${proposalId}&taskId=${id}`}>Contract</Link>
                        {contracts?.isTEApproved && <button className="btn rounded-pill btn-outline-info mx-1 my-1" data-bs-target="#exampleHiredProposal" data-bs-toggle="modal">Milestone</button>}
                      </> : (
                        <>
                          <Link className="btn rounded-pill btn-outline-info mx-1  my-1" href={`/dashboard/tasks/${id}/proposals/${proposalId}/edit-proposal`}>Edit Proposal</Link>
                          {contracts.id ? <Link className="btn rounded-pill btn-outline-info mx-1 my-1" href={`/dashboard/tasks/${id}/contract/?proposalId=${proposalId}&taskId=${id}`}>View Contract</Link> : ''}
                        </>
                      )}
                    {task?.status == "INPROGRESS" && <button className="btn rounded-pill btn-outline-info mx-1 w-s my-1" data-bs-target="#exampleModalToggle11" data-bs-toggle="modal" >Dispute</button>}  

                      <button className="btn rounded-pill btn-outline-info mx-1 ls" >Complete<Icon icon="mdi:tick" width="24" height="24" className='pb-1' /></button>

                  </div>

                </div>

              </div>
            </div>
          </div>
          <div className='col-md-5 mx-3 mx-md-0'>
            <div className='my-project pt-3 '>
              <div className='d-flex  justify-content-between'>
                <h3 className='me-2 text-white'>{task.name}</h3>
                <h5 className='w-9 text-white'>${task.amount}</h5>
              </div>
            </div>
            <HtmlData data={task?.details} className='text-white' />

            {/* <p>
                {task.details}
              </p> */}

            {/* <Link className="btn rounded-pill btn-outline-info mx-1 my-1" href={`/dashboard/tasks/${id}/editContract`}>Edit Contract</Link> */}
            {(<Hire milestone={milestones} setMilestones={setMilestones} contract={contracts} type={type} />)}
            {(<RejectProposal updateProposals={updateProposals} id={id} />)}

          </div>
        </div>

      </div>
      {/* <div className='ad-review'>
        <div className="modal fade" id="exampleModalToggle3" aria-hidden="true" aria-labelledby="exampleModalToggleLabel3" tabIndex={1}>
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

       



      </div> */}
      <DisputeModal taskId={id} proposalId={proposalId} />
      <SubmitReview taskId={Number(id)} revieweeId={revieweeId}/>



    </div>
  )
}

export default ViewProposal