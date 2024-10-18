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
                    <div className="box m-2 p-4">
                        <h4>{details?.name}</h4>
                        <p>{details?.details}</p>
                        <div className='keyfun mt-4'>
                            {/* <h5>The key functionalities of the EMR system includes: </h5>
                            <ul>
                                <li><a>Patient Records Management</a></li>
                                <li><a>Appointment Scheduling</a></li>
                                <li><a>{`Clinical Documentation (includes faxes, patient's reports etc)`}</a></li>
                                <li><a>Billing of each appointment</a></li>
                                <li><a>Settings (to customize the app the way assistant wants to) </a></li>
                            </ul>
                        </div>
                        <div className='document d-grid my-4'>
                            <h6>Document</h6>
                            <span>1. CDD Check/Salespersons Checklist on.word</span>
                            <span>2. CDD Check/Salespersons Checklist on.word</span> */}

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

                        <div className="box m-2 bg-black">
                            <div className='row'>
                                <div className=' col-lg-1 col-2  '>
                                    <div className=' card-profile text-end mt-4 '>
                                        <ImageFallback
                                        src="/assets/images/profile-img.png"
                                        alt="img"
                                        className="img-fluid user-img img-round"
                                        width={60}
                                        height={60}
                                        priority
                                        />
                                        <h2>John Smith</h2>
                                    </div>
                                </div>
                                <div className='col-lg-10 col-9 p-4'>
                                    <div className='priceanddate d-flex justify-content-between bordr'>
                                        <div className='stars mb-2'>
                                            <h4>Wordpress Project</h4>
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="ic:baseline-star" className='text-warning' />
                                            <Icon icon="mdi-light:star" className='text-light' />
                                            <Icon icon="mdi-light:star" className='text-light' />
                                        </div>
                                        <div>
                                            <span>2 days ago</span>
                                            <h5>$20 / hr</h5>
                                        </div>
                                    </div>
                                    <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...`}
                                    </p>
                                    <div className='card-footer d-flex justify-content-between p-0 mb-3'>
                                        <div>

                                            <button className="btn btn-dark rounded-pill hero-btn ls ">Wordpress</button>
                                            <button className="btn btn-dark rounded-pill hero-btn mx-2">Angular React</button>

                                        </div>

                                    </div>
                                    <div className='btn-border'>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">Reject</button>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">Shortlist</button>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">Interview Questions</button>
                                        <button className="btn rounded-pill btn-outline-info mx-1 my-1">View Details</button>


                                    </div>

                                </div>

                            </div>
                        </div>



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
                        </div>


                    </div>

                </div>
            </div>
        </div>
    )
}


export default ViewTasks
