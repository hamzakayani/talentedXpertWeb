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


const ViewTasks = () => {

    const [loading, setLoading] = useState<boolean>(false)
    const [proposals, setProposals] = useState<any>([])
    const [details, setDetails] = useState<any>()
    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const { id } = useParams()

    const getTask = async (id: number) => {
        setLoading(true)
        await apiCall(requests.getTaskId + id, {}, 'get', false, dispatch, user, router).then((res: any) => {
            setDetails(res?.data?.data?.task || [])
            setLoading(false)
        }).catch(err => console.warn(err))
    }
    console.log('details', details)

    //     const getProposals = async() => {
    //         try {
    //             const response = await apiCall(requests.getProposals, {}, 'get', false, dispatch, user, router
    //             );
    //             console.log('res',response)
    //             setProposals(response?.data?.data?.proposals || []);
    //             console.log('proposal',proposals)

    //         } catch (error) {
    //             console.warn("Error fetching tasks:", error);
    //     }
    // }

    useEffect(() => {
        getTask(Number(id));
        // getProposals();
    }, [])



    return (
        <div>
            <div className='card'>
                <div className='viewtask-card card-header  px-4 bg-gray'>
                    <div className='card-left-heading'>
                        <h3>View Task Details</h3>
                    </div>
                </div>
                <div className='card-bodyy viewtask'>
                    <div className="box m-2 p-3">
                        


                        <div className="box m-2 bg-black keyfun p-3">
                        <h4>{details?.name}</h4>
                        <p>{details?.details}</p>

                            {/* <h5>The key functionalities of the EMR system includes: </h5>
                            <ul>
                                <li><a>Patient Records Management</a></li>
                                <li><a>Appointment Scheduling</a></li>
                                <li><a>{`Clinical Documentation (includes faxes, patient's reports etc)`}</a></li>
                                <li><a>Billing of each appointment</a></li>
                                <li><a>Settings (to customize the app the way assistant wants to) </a></li>
                            </ul>

                            <div className='document d-grid my-4'>
                                <h6>Document</h6>
                                <span>1. CDD Check/Salespersons Checklist on.word</span>
                                <span>2. CDD Check/Salespersons Checklist on.word</span>


                            </div> */}

                            <div className='btn-border mt-4'>
                                <button className="btn rounded-pill btn-outline-info mx-1 my-1">Edit</button>
                                <button className="btn rounded-pill btn-outline-info mx-1 my-1">Shortlist</button>
                                {user?.profile[0]?.type === 'TR' ?
                                    <Link className="btn rounded-pill btn-outline-info mx-1 my-1" href={`/dashboard/tasks/${id}/proposals`}>Proposals</Link> :
                                    <Link className="btn rounded-pill btn-outline-info mx-1 my-1" href={`/dashboard/tasks/${id}/add-proposal`}>Submit Proposal</Link>
                                }
                                <button className="btn rounded-pill btn-outline-info mx-1 my-1">Milestones</button>
                                <button className="btn rounded-pill btn-outline-info mx-1 my-1">Messages</button>

                            </div>





                        </div>



                        <div className='viewtaskquestion'>

                            <h6>Interview Questions</h6>
                           {details?.interviewQuestions?.map((data:any, index: number)=>( <ul>
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


                    </div>

                </div>
            </div>
        </div>
    )
}


export default ViewTasks
