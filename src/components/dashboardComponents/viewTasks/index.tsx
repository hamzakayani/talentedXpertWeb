'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { requests } from '@/services/requests/requests';
import apiCall from '@/services/apiCall/apiCall';
import ImageFallback from '@/components/common/ImageFallback/ImageFallback';
import HtmlData from '@/components/common/HtmlData/HtmlData';
import Hire from '@/components/common/Modals/Hire';
import SubmitReview from '@/components/common/Modals/SubmitReview';
import Contract from '@/components/common/Modals/Contract';
import { setThread } from '@/reducers/ThreadSlice';

const ViewTasks = () => {
    const [loading, setLoading] = useState<boolean>(false)
    const [proposal, setProposal] = useState<any>([])
    const [contracts, setContracts] = useState<any>({})
    const [milestones, setMilestones] = useState<any>([])
    const [dispute, setDispute] = useState<any>([{}])
    const [details, setDetails] = useState<any>()
    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const { id } = useParams()
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [addReview, setAddReview] = useState<boolean>(false)
    const [proposalCount, setPrposalCount] = useState<number>(0)




    const getMessageThread = async (proposal: any) => {
        try {
            const response = await apiCall(requests.getThread, {
                taskId: proposal?.taskId
            }, 'get', false, dispatch, user, router);
            const matchingThread = response?.data?.threads?.find((thread: any) => thread.expertProfileId === proposal.expertProfileId);

            if (matchingThread) {
                dispatch(setThread(matchingThread))
                router.push(
                    `/dashboard/messages/${matchingThread?.id}`
                );
            }


        } catch (error) {
            console.warn('Error fetching threads', error);
        }
    }

    const getTask = async (id: number) => {
        setLoading(true)
        await apiCall(requests.getTaskId + id, {}, 'get', false, dispatch, user, router).then((res: any) => {
            setDetails(res?.data?.data?.task || [])
            setLoading(false)
        }).catch(err => console.warn(err))
    }

    const getContract = async (id: number) => {
        await apiCall(requests.getContract, { proposalId: Number(id) }, 'get', false, dispatch, user, router).then((res: any) => {
            setContracts(res?.data?.data.contracts[0] || [])
        }).catch(err => console.warn(err))
    }
    const getdisputes = async (id:number) => {
        const data = {
            taskId: id
        }
        try {
            const response = await apiCall(requests?.dispute, data, 'get', false, dispatch, user, router);
            setDispute(response?.data?.data?.disputes || {});
        } catch (error) {
            console.warn("Error fetching tasks:", error);
        }

    }
    console.log('disp', dispute)

    const getProposal = async (id: number) => {
        let params: any = '?taskId=' + id;
        params += '&limit=' + 1;
        params += '&page= ' + 1;
        await apiCall(`${requests.getProposals}${params}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
            setProposal(res?.data?.data?.proposals[0] || [])
            setPrposalCount(res?.data?.data?.count || 0)
        }).catch(err => console.warn(err))
    }

    const getMilestones = async (id: number) => {
        let params: any = '?contractId=' + Number(id);
        await apiCall(`${requests.getMilestones}${params}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
            setMilestones(res?.data?.data?.milestones)
        }).catch(err => console.warn(err))
    }

    useEffect(() => {
        if (isAuth) {
            getProposal(Number(id));

        }
    }, [isAuth, id])

    useEffect(() => {
        if (isAuth && proposal?.id) {
            getContract(Number(proposal?.id))
        }
    }, [proposal, isAuth])

    useEffect(() => {
        if (isAuth && contracts?.id) {
            getMilestones(Number(contracts?.id))
        }
    }, [contracts])

    useEffect(() => {
        getTask(Number(id));
        getdisputes(Number(id))
    }, [id])
    useEffect(() => {
        if (milestones?.length > 0) {
            setAddReview(
                milestones?.some((milestone: any) => milestone.status === 'PAID') || false
            );
        }
    }, [milestones])

    const getPrivateFile = (uploadedFile: any) => {
        apiCall(`${requests.downloadFile}?fileUrl=${uploadedFile?.fileUrl}`, {}, 'get', false, dispatch, user, router).then(res => {
            if (res?.data) {
                window.open(res?.data?.presignedUrl, '_blank')
            }
        }).catch(err => console.warn(err))
    }
    // console.log('revieweeProfileId', details?.reviews[0]?.revieweeProfileId, user?.profile[0]?.id)
    return (
        <div>
            <div className='card'>
                <div className='viewtask-card card-header px-4 bg-gray'>
                    <div className='card-left-heading'>
                        <h3>View Task Details</h3>
                    </div>


                </div>
                <div className='card-bodyy viewtask'>
                    <div className="box m-2 p-3">

                        <div className="box m-2 bg-black keyfun p-3">
                            <h4>{details?.name}</h4>
                            <HtmlData data={details?.details} className='text-white' />
                            <div className='bordr'></div>
                            {isAuth && details?.documents?.lenght > 0 && <h6 className='text-white mt-2'>Document</h6>}
                            {isAuth &&
                                details?.documents?.map((doc: any) => (
                                    // onClick={() => getPrivateFile(doc)}
                                    <div key={doc.fileUrl}>
                                        <Link href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                            {doc.key}
                                        </Link>
                                    </div>
                                ))
                            }


                            <div className='btn-border mt-4'>


                                {user?.profile?.length > 0 && user?.profile[0]?.type === 'TR' ?
                                    <>
                                        <Link className={`btn rounded-pill btn-outline-info mx-1 my-1 ${details?.status !== 'POSTED' && 'disabled'}`} href={`/dashboard/tasks/${id}/edit`}>Edit</Link>
                                        <Link className="btn rounded-pill btn-outline-info mx-1 my-1" href={`/dashboard/tasks/${id}/proposals`}>Proposals ({proposalCount})</Link> </> :
                                    <>

                                        {proposal?.id ? (
                                            <>
                                                <Link
                                                    className="btn rounded-pill btn-outline-info mx-1 my-1"
                                                    href={`/dashboard/tasks/${id}/proposals/${proposal.id}`}

                                                >
                                                    View Proposal
                                                </Link>
                                                {milestones?.length > 0 && milestones[0]?.id && <button className="btn rounded-pill btn-outline-info mx-1 my-1" data-bs-target="#exampleHiredProposal" data-bs-toggle="modal">Milestone</button>}
                                                {contracts?.id ? <button className="btn rounded-pill btn-outline-info mx-1 my-1" data-bs-target="#exampleModalToggle78" data-bs-toggle="modal">View Contract</button> : ''}
                                                {addReview && <button className="btn rounded-pill btn-outline-info mx-1 my-1 " data-bs-target="#exampleModalToggle88" data-bs-toggle="modal">Submit Review</button>}
                                                {details?.status === 'INPROGRESS' || details?.status === 'COMPLETED' && <button className="btn rounded-pill btn-outline-info mx-1 my-1" onClick={() => getMessageThread(proposal)}>Message</button>}
                                            </>

                                        ) : (

                                            <Link
                                                className="btn rounded-pill btn-outline-info mx-1 my-1"
                                                href={`/dashboard/tasks/${id}/add-proposal`}
                                            >
                                                Submit Proposal
                                            </Link>
                                        )}


                                        {/* <Link className="btn rounded-pill btn-outline-info mx-1 my-1" href={`/dashboard/tasks/${id}/contract/?taskId=${id}`}>View Contract</Link> */}
                                    </>
                                }

                                {/* <button className="btn rounded-pill btn-outline-info mx-1 my-1">Messages</button> */}

                            </div>





                        </div>



                        <div className='viewtaskquestion'>

                            {details?.interviewQuestions?.length > 0 && <h6>Interview Questions</h6>}
                            {details?.interviewQuestions?.map((data: any, index: number) => (<ul key={index}>
                                <li>
                                    {data.question}
                                </li>
                            </ul>
                            ))}

                        </div>



                        {/* 
                        <div className="accordion my-5" id="accordionExample">
                            <h6>Interview Questions</h6>
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button bg-black text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                        How dose TalentedXpert Work      </button>
                                </h2>
                                <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
                                    <div className="accordion-body bg-gray text-white">
                                        The easiest way to look at how TalentedXpert works are in these three phases: before you hire, finding and engaging talent, doing the work      </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed bg-black text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                        How do i message a TalentedXpert?      </button>
                                </h2>
                                <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                    <div className="accordion-body bg-gray text-white">
                                        <strong>{`This is the second item's accordion body.`}</strong>
                                        {`It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.`}
                                    </div>
                                </div>
                            </div>
                            <div className="accordion-item">
                                <h2 className="accordion-header">
                                    <button className="accordion-button collapsed bg-black text-white" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                        How do i find the perfect TalentedXpert for my needs?      </button>
                                </h2>
                                <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
                                    <div className="accordion-body bg-gray text-white">
                                        <strong>{`This is the third item's accordion body.`}</strong>
                                        {`It is hidden by default, until the collapse plugin adds the appropriate classes that we use to style each element. These classes control the overall appearance, as well as the showing and hiding via CSS transitions. You can modify any of this with custom CSS or overriding our default variables. It's also worth noting that just about any HTML can go within the <code>.accordion-body</code>, though the transition does limit overflow.`}
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        {/* Review start */}

                        {details?.reviews[0] && details?.reviews[1] && <div className='review mx-2  p-3 mt-3'>

                            {details?.reviews[0]?.revieweeProfileId === user?.profile[0]?.id ? (
                                <div className="d-flex">
                                    <Link href={`/dashboard/talented-xperts/${details?.reviews[1]?.revieweeProfile?.userId}`}>
                                        <ImageFallback
                                            src={details?.reviews[1]?.revieweeProfile?.user?.profilePicture?.fileUrl}
                                            alt="img"
                                            className="user-img img-round me-3"
                                            width={40}
                                            height={40}
                                            priority
                                        />
                                    </Link>
                                    <div className="text-light d-flex justify-content-between">
                                        <div>
                                            <h6>
                                                {details?.reviews[1]?.revieweeProfile?.user?.firstName}{" "}
                                                {details?.reviews[1]?.revieweeProfile?.user?.lastName}
                                            </h6>
                                            <div className="ms-3">
                                                <div className="rating">
                                                    {[...Array(5)].map((_, index) => (
                                                        <Icon
                                                            icon="material-symbols-light:kid-star"
                                                            key={index}
                                                            className={`text-light ${index < details?.reviews[1]?.rating ? "rated" : ""
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <span>{details?.reviews[1]?.comments}</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="d-flex">
                                    <Link href={`/dashboard/talented-requestors/${details?.reviews[0]?.revieweeProfile?.userId}`}>
                                        <ImageFallback
                                            src={details?.reviews[0]?.revieweeProfile?.user?.profilePicture?.fileUrl}
                                            alt="img"
                                            className="user-img img-round me-3"
                                            width={40}
                                            height={40}
                                            priority
                                        />
                                    </Link>
                                    <div className="text-light d-flex justify-content-between">

                                        <div>
                                            <h6>
                                                {details?.reviews[0]?.revieweeProfile?.user?.firstName}{" "}
                                                {details?.reviews[0]?.revieweeProfile?.user?.lastName}
                                            </h6>
                                            <div className="ms-3">
                                                <div className="rating">
                                                    {[...Array(5)].map((_, index) => (
                                                        <Icon
                                                            icon="material-symbols-light:kid-star"
                                                            key={index}
                                                            className={`text-light ${index < details?.reviews[0]?.rating ? "rated" : ""
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span>{details?.reviews[0]?.comments}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                        </div>}

                        {/* Review End */}

                    </div>


                </div>

                <Hire milestone={milestones} setMilestones={setMilestones} contract={contracts} type={true} taskStatus={details?.status} />
                <SubmitReview taskId={id} revieweeId={Number(details?.requesterProfileId)} />
                <Contract taskId={Number(id)} proposalId={proposal?.id} taskStatus={details?.status} />












            </div>
        </div>
    )
}


export default ViewTasks
