'use client'
import React, { FC, useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import ProjectsSlider from '@/components/common/sliders/ProjectsSlider';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import defaultUserImg from "../../../../public/assets/images/default-user.jpg"
import ImageFallback from '@/components/common/ImageFallback/ImageFallback';
import Review from '@/components/common/Review/Review';
import RatingStar from '@/components/common/RatingStar/RatingStar';
import ListCards from '../Articles/ListCards';
import HtmlData from '@/components/common/HtmlData/HtmlData';
import { dynamicBlurDataUrl } from '@/services/utils/dynamicBlurImage';
import { useNavigation } from '@/hooks/useNavigation';


const ViewProfile: FC<any> = () => {
    const [details, setDetails] = useState<any>({})
    const [article, setArticle] = useState<any>([])
    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');
    const { navigate } = useNavigation()

    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()
    const { userType, id } = useParams()

    const getUser = async (id: number) => {
        await apiCall(requests.getUserInfo + id, {}, 'get', false, dispatch, user, router).then((res: any) => {
            setDetails({
                ...res?.data,
                profile: res?.data?.profile?.filter((prof: any) => userType === 'talent-requestors' ? prof?.type === 'TR' : prof?.type === 'TE')
            })
        }).catch(err => console.warn(err))
    }

    useEffect(() => {
        getUser(Number(id));
    }, [])

    useEffect(() => {
        if (details?.profilePicture?.fileUrl) {
            fetchBlurDataURL();
        }
    }, [details?.profilePicture?.fileUrl]);

    const fetchBlurDataURL = async () => {
        if (details?.profilePicture?.fileUrl) {
            const blurUrl = await dynamicBlurDataUrl(details?.profilePicture?.fileUrl);
            setProfileImageBlurDataURL(blurUrl);
        }
    }

    const formatedDate = (date: string) => {
        const formattedDate = new Date(date).toISOString().split("T")[0]
        return formattedDate
    }

    const getArticles = async () => {
        const data = {
            profileId: details?.profile[0]?.id
        }
        try {
            const response = await apiCall(requests?.articles, data, 'get', false, dispatch, user, router);
            setArticle(response?.data?.data?.articles || []);
        } catch (error) {
            console.warn("Error fetching articles:", error);
        }
    }
    const calculateTaskSuccess = () =>{
        if(details?.profile?.length > 0){

            const successRate = (details?.profile[0]?.averageRating/5)*100
            return successRate;
        }
    }
    // useEffect(()=>{
    //  console.log('success rate', calculateTaskSuccess )
    // },[])

    return (
        <>
            <div className='card'>
                <div className='card  card-header bg-gray'>
                    <h3 className='text-white'>View Profile</h3>
                </div>
                <div className='bg-black p-3'>
                    <div className=' my-active-task py-2 bg-gray b-r'>
                        <div className='profile-header d-md-flex justify-content-between mx-md-5 p-4'>
                            <div className='profile-left d-md-flex'>
                                <div className='d-flex justify-content-around me-md-5'>
                                    <ImageFallback
                                        src={details?.profilePicture?.fileUrl}
                                        fallbackSrc={defaultUserImg}
                                        alt="img"
                                        className=" user-img img-round mb-3"
                                        width={100}
                                        height={100}
                                        loading='lazy'
                                        blurDataURL={profileImageBlurDataURL}
                                        userName={details ? `${details?.firstName} ${details?.lastName}` : null}
                                    />
                                </div>
                                <div className='profile-detail d-grid'>
                                    <h5><b>{details?.firstName} {details?.lastName}</b></h5>
                                    <p>{details?.title}</p>
                                    <span>{user?.profile[0]?.type=='TR'? 'Spendings: ' :'Earnings: ' }<strong>$50K+</strong></span>
                                    {details?.profile?.length > 0 && <span>Total Tasks: <strong>{details?.profile[0]?.completedTasks ? details?.profile[0]?.completedTasks : 0}</strong></span>}
                                </div>
                            </div>
                            <div className='profile-right '>
                                <div className='d-flex align-items-center'>
                                    <Image
                                        src="/assets/images/success.svg"
                                        alt="img"
                                        className="me-2"
                                        width={25}
                                        height={25}
                                        priority
                                    />
                                    <p className='m-0'>{calculateTaskSuccess()}% Task Success</p>
                                </div>
                                <div className='d-flex align-items-center py-1'>
                                    <Image
                                        src="/assets/images/verifid.svg"
                                        alt="img"
                                        className="me-2"
                                        width={25}
                                        height={25}
                                        priority
                                    />
                                    <p className='m-0'>Verified</p>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <Image
                                        src="/assets/images/rated.svg"
                                        alt="img"
                                        className="me-2"
                                        width={25}
                                        height={25}
                                        priority
                                    />
                                    <div className='star d-flex align-items-center'>
                                        {details?.profile?.length > 0 && <RatingStar rating={details?.profile[0]?.averageRating} />}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='about mx-2 mx-md-4 p-3'>
                            <h4 className='pb-2 border-bottom'>About</h4>
                            <HtmlData data={details?.about} className='text-white' />
                        </div>
                        <div className='about  mx-2 mx-md-4 p-3 my-3'>
                            <h4 className='pb-2 border-bottom'>Education</h4>
                            {details?.education?.length > 0 ?
                                details?.education?.map((edu: any, index: number) => (
                                    <div key={index}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <p className="fw-bold mb-2">{edu?.institution}</p>
                                                <p className="mb-0">{edu?.degree}</p>
                                            </div>
                                            <p className="mb-0">{formatedDate(edu?.date)}</p>
                                        </div>
                                        {index !== details.education.length - 1 && (
                                            <hr className="mt-2" style={{ borderColor: "#ccc", opacity: 0.7 }} />
                                        )}
                                    </div>
                                ))
                                : <p className='text-center mb-0'>No Education found yet</p>
                            }
                        </div>
                        <div className='about  mx-2 mx-md-4 p-3'>
                            <h4 className='pb-2 border-bottom'>Experience</h4>
                            {details?.experience?.length > 0 ?
                                details?.experience?.map((exp: any, index: number) => (
                                    <div key={index}>
                                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                                            <div className="d-flex justify-content-between w-100">
                                                <p className="fw-bold mb-0">{exp?.role}</p>
                                                <p className=" mb-0">{formatedDate(exp?.startDate)} -{exp?.isPresent? 'On going' :formatedDate(exp?.endDate)}</p>
                                            </div>


                                            <p className="mb-2">{exp?.companyName}</p>
                                            <p className="mb-2">{exp?.description}</p>
                                        </div>
                                        {index !== details.experience.length - 1 && (
                                            <hr className="mt-2" style={{ borderColor: "#ccc", opacity: 0.7 }} />
                                        )}
                                    </div>
                                ))
                                : <p className='text-center mb-0'>No Experience found yet</p>
                            }
                        </div>
                        <div className='about  mx-2 mx-md-4 p-3 my-3'>
                            <h4 className='pb-2 border-bottom'>Reviews</h4>
                            {details?.profile?.length > 0 && details?.profile[0]?.reviewsReceived?.length > 0 ?
                                details.profile[0]?.reviewsReceived?.map((review: any) => {
                                    return <Review reviewReceive={review} key={review?.id} />
                                })
                                : <p className='text-center mb-0'>No Reviews found yet</p>
                            }
                        </div>
                       {details?.profile?.length> 0 && (details?.profile[0]?.completedTasksAsTR?.length > 0 || details?.profile[0]?.completedTasksAsTE?.length > 0 ) && <div className='Projects p-lg-4 p-md-4 p-sm-2  p-3 m-4'>
                            <h3 className='my-3 ms-2'>Projects</h3>
                            {details?.profile?.length > 0 && <ProjectsSlider  task={userType === 'talent-requestors' ? details?.profile[0].completedTasksAsTR : details?.profile[0].completedTasksAsTE} />}
                            <div className='text-end mt-3'>
                                <button className="btn rounded-pill btn-outline-info ms-4 ls">View All</button>
                            </div>
                        </div>}
                        {user?.profile[0].type=='TE'? <div className='articles  p-3'>
                            <h3 className='my-2 ms-2'>Articles</h3>
                            <div className='d-flex justify-content-between  flex-column flex-md-row'>
                                <div className='articles-card promoted_card me-2 mt-2 '>
                                    <h4>Don’t forget text has a starring role in video...</h4>
                                    <span>12 hours ago</span>
                                    <p>Words appear in blog posts or descriptions of product features and benefits. But writers can ...</p>

                                </div>
                                <div className='articles-card promoted_card me-2 mt-2'>

                                    <h4>Don’t forget text has a starring role in video...</h4>
                                    <span>12 hours ago</span>
                                    <p>Words appear in blog posts or descriptions of product features and benefits. But writers can ...</p>

                                </div>
                                <div className='articles-card promoted_card me-2 mt-2 '>

                                    <h4>Don’t forget text has a starring role in video...</h4>
                                    <span>12 hours ago</span>
                                    <p>Words appear in blog posts or descriptions of product features and benefits. But writers can ...</p>

                                </div>
                            </div>
                            <div className='text-end mt-3'>
                                {/* <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/talentxpertEX/Articlelist'} onClick={()=>navigate('/dashboard/talentxpertEX/Articlelist')} >View All<Icon icon="ic:sharp-arrow-forward" className='ms-2' /></Link> */}
                                <Link className="btn rounded-pill btn-outline-info mt-2" href={'#'} >View All<Icon icon="ic:sharp-arrow-forward" className='ms-2' /></Link>

                            </div>
                        </div> : ''}


                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewProfile