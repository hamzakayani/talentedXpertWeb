'use client'
import ImageFallback from '@/components/common/ImageFallback/ImageFallback'
import apiCall from '@/services/apiCall/apiCall'
import { requests } from '@/services/requests/requests'
import { RootState, useAppDispatch } from '@/store/Store'
import { useParams, useRouter } from 'next/navigation'
import React, { FC, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import defaultUserImg from "../../../../../public/assets/images/default-user.jpg"
import HtmlData from '@/components/common/HtmlData/HtmlData'
import MemberList from './MemberList'
import NoFound from '@/components/common/NoFound/NoFound'
import { dynamicBlurDataUrl } from '@/services/utils/dynamicBlurImage'
import BackButton from '@/components/common/backButton/BackButton'

const ViewTeam:FC<any> = ({ isDashboard = true }) => {
    const { id } = useParams()

    const [details, setDetails] = useState<any>({})
    const [logoImageBlurDataURL, setLogoImageBlurDataURL] = useState('');
    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');

    const user = useSelector((state: RootState) => state.user)
    const dispatch = useAppDispatch()
    const router = useRouter()

    const getTeam = async (id: number) => {
        await apiCall(requests.teams, { id: id }, 'get', false, dispatch, user, router).then((res: any) => {
            if (res?.data?.data?.teams?.length > 0) {
                setDetails({
                    ...res?.data?.data?.teams[0],
                })
            }
        }).catch(err => console.warn(err))
    }

    useEffect(() => {
        if (id) {
            getTeam(Number(id));
        }
    }, [id])

    useEffect(() => {
        if (details?.logoUrl || details?.createdByProfile?.user?.profilePicture?.fileUrl) {
            fetchBlurDataURL();
        }
    }, [details?.logoUrl, details?.createdByProfile?.user?.profilePicture?.fileUrl]);

    const fetchBlurDataURL = async () => {
        if (details?.logoUrl) {
            const blurUrl = await dynamicBlurDataUrl(details?.logoUrl);
            setLogoImageBlurDataURL(blurUrl);
        }
        if (details?.createdByProfile?.user?.profilePicture?.fileUrl) {
            const blurUrl = await dynamicBlurDataUrl(details?.createdByProfile?.user?.profilePicture?.fileUrl);
            setProfileImageBlurDataURL(blurUrl);
        }
    }

    return (
        <div
            className={`dashboard-card ${isDashboard ? '' : 'text-dark'}`}
            style={{
                minHeight: 86,
                position: "relative",
                ...(isDashboard ? {border: "1px solid #333333"} : {}),
            }}
        >
            <div className="d-flex align-items-center mb-3 flex-wrap">
                <BackButton fontSize="24px" color={isDashboard ? "white" : 'black'} />
                <h4 className="mb-0 ms-2" style={{ color: `${isDashboard ? 'var(--color_tertiary)' : 'var(--color_black)'}` }}>
                    View Team Details
                </h4>
            </div>
            <div className='row g-3'>
                <div className='col-12'>
                    <div className="p-4 stat-card">
                        <div className="d-flex justify-content-between align-items-center flex-wrap">
                            <div className="d-flex align-items-center">
                                <div
                                    className="text-lg-end card-profile d-block"
                                >
                                    <ImageFallback
                                        src={details?.logoUrl}
                                        fallbackSrc={defaultUserImg}
                                        alt="img"
                                        className="img-round me-3"
                                        width={64}
                                        height={64}
                                        loading="lazy"
                                        blurDataURL={profileImageBlurDataURL}
                                        userName={
                                        details
                                            ? `${details?.name}`
                                            : null
                                        }
                                    />
                                </div>
                                <div>
                                    <p
                                        className="mb-0 fw-medium"
                                        style={{ color: `${isDashboard ? 'var(--color_tertiary)' : 'var(--color_black)'}` }}
                                    >
                                        {details?.name}
                                    </p>
                                </div>
                            </div>
                            <div className="text-end mt-3 mt-lg-0 d-flex flex-column gap-2">
                            </div>
                        </div>
                    </div>
                    <div
                        className={`mt-3 ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                        style={{
                            border: "1px solid var(--color_grey)",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}
                    >
                        <button
                            type="button"
                            className={`w-100 d-flex justify-content-between align-items-center p-3 text-start ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                            // onClick={() => setOpenDesc(!openDesc)}
                            // aria-expanded={openDesc}
                            style={{
                                color: isDashboard ? "var(--color_tertiary)" : 'var(--color_black)',
                                border: "none",
                                width: "100%",
                                maxWidth: "100%",
                                height: 43,
                                borderRadius: 8,
                                opacity: 1,
                                background: "#333333",
                            }}
                        >
                        <p className="m-0 fw-medium">Description</p>
                        {/* <Icon
                            icon="mdi:chevron-down"
                            style={{
                            transition: "transform 200ms ease",
                            // transform: openDesc ? "rotate(0deg)" : "rotate(180deg)",
                            }}
                        /> */}
                        </button>
                        {/* {openDesc && ( */}
                        <div className="py-1 px-3">
                            <HtmlData data={details?.description} className={`${isDashboard ? 'text-white' : 'text-dark'}`} isDark={!isDashboard} />
                        </div>
                        {/* )} */}
                    </div>
                    {details?.teamInvitations?.length > 0 ? 
                        <div
                            className={`mt-3 ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                            style={{
                                border: "1px solid var(--color_grey)",
                                borderRadius: 12,
                                overflow: "hidden",
                            }}
                        >
                            <button
                                type="button"
                                className={`w-100 d-flex justify-content-between align-items-center p-3 text-start ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                                // onClick={() => setOpenDesc(!openDesc)}
                                // aria-expanded={openDesc}
                                style={{
                                    color: isDashboard ? "var(--color_tertiary)" : 'var(--color_black)',
                                    border: "none",
                                    width: "100%",
                                    maxWidth: "100%",
                                    height: 43,
                                    borderRadius: 8,
                                    opacity: 1,
                                    background: "#333333",
                                }}
                            >
                            <p className="m-0 fw-medium">Invited Members List</p>
                            {/* <Icon
                                icon="mdi:chevron-down"
                                style={{
                                transition: "transform 200ms ease",
                                // transform: openDesc ? "rotate(0deg)" : "rotate(180deg)",
                                }}
                            /> */}
                            </button>
                            {/* {openDesc && ( */}
                            <div className="py-1 px-3">
                                {details?.teamInvitations?.length > 0 ?
                                    <MemberList data={details?.teamInvitations} type="invited" getTeam={getTeam} id={id} />
                                    : <NoFound message={"No Invited Members Found yet"} />
                                }
                            </div>
                            {/* )} */}
                        </div>
                    : null}
                    <div
                        className={`mt-3 ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                        style={{
                            border: "1px solid var(--color_grey)",
                            borderRadius: 12,
                            overflow: "hidden",
                        }}
                    >
                        <button
                            type="button"
                            className={`w-100 d-flex justify-content-between align-items-center p-3 text-start ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                            // onClick={() => setOpenDesc(!openDesc)}
                            // aria-expanded={openDesc}
                            style={{
                                color: isDashboard ? "var(--color_tertiary)" : 'var(--color_black)',
                                border: "none",
                                width: "100%",
                                maxWidth: "100%",
                                height: 43,
                                borderRadius: 8,
                                opacity: 1,
                                background: "#333333",
                            }}
                        >
                        <p className="m-0 fw-medium">Members List</p>
                        {/* <Icon
                            icon="mdi:chevron-down"
                            style={{
                            transition: "transform 200ms ease",
                            // transform: openDesc ? "rotate(0deg)" : "rotate(180deg)",
                            }}
                        /> */}
                        </button>
                        {/* {openDesc && ( */}
                        <div className="py-1 px-3">
                            {details?.teamMembers?.length > 0 ?
                                <MemberList data={details?.teamMembers} type="members" />
                                : <NoFound message={"No Members Found yet"} />
                            }
                        </div>
                        {/* )} */}
                    </div>
                </div>
            </div>
            {/* <div className='card-bodyy viewtask'>
                <div className="box m-2 p-3">
                    <div className='profile-header d-md-flex justify-content-between mx-md-5 p-4'>
                        <div className='d-md-flex'>
                            <div className='d-flex justify-content-around me-md-5'>
                                <ImageFallback
                                    src={details?.logoUrl}
                                    fallbackSrc={defaultUserImg}
                                    alt="img"
                                    className=" user-img img-round mb-3"
                                    width={100}
                                    height={100}
                                    loading='lazy'
                                    blurDataURL={logoImageBlurDataURL}
                                    userName={details ? details?.name : null}
                                />
                            </div>
                            <div className='d-flex align-items-center justify-content-center'>
                                <h5><b>{details.name}</b></h5>
                            </div>
                        </div>
                    </div>
                    <div className='about mx-2 mx-md-4 p-3'>
                        <h4>Description</h4>
                        <HtmlData data={details?.description} />
                    </div>
                    {details?.teamInvitations?.length > 0 ? <div className='about mx-2 mx-md-4 p-3 my-3'>
                        <h4>Invited Members List</h4>
                        {details?.teamInvitations?.length > 0 ?
                            <MemberList data={details?.teamInvitations} type="invited" getTeam={getTeam} id={id} />
                            : <NoFound message={"No Invited Members Found yet"} />
                        }
                    </div> : null}
                    <div className={`about mx-2 mx-md-4 p-3 ${details?.teamInvitations?.length === 0 && 'my-3'}`}>
                        <h4>Members List</h4>
                        {details?.teamMembers?.length > 0 ?
                            <MemberList data={details?.teamMembers} type="members" />
                            : <NoFound message={"No Members Found yet"} />
                        }
                    </div>
                    <div className='about mx-2 mx-md-4 p-3 my-3'>
                        <h4>Created By</h4>
                        <div className='d-md-flex mt-3'>
                            <div className='d-flex justify-content-around me-md-5'>
                                <ImageFallback
                                    src={details?.createdByProfile?.user?.profilePicture?.fileUrl}
                                    fallbackSrc={defaultUserImg}
                                    alt="img"
                                    className=" user-img img-round mb-3"
                                    width={80}
                                    height={80}
                                    loading='lazy'
                                    blurDataURL={profileImageBlurDataURL}
                                    userName={details?.createdByProfile?.user ? `${details?.createdByProfile?.user?.firstName} ${details?.createdByProfile?.user?.lastName}` : null}

                                />
                            </div>
                            <div className='d-flex align-items-center justify-content-center'>
                                <div className=''>
                                                                         <h5>
                                         <span className="me-2 badge bg-warning text-dark" title="Team Lead">Team Lead</span>
                                         <b>{details.createdByProfile?.user?.firstName} {details.createdByProfile?.user?.lastName}</b>
                                     </h5>
                                    <p>{details.createdByProfile?.user?.title}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
        </div>
    )
}

export default ViewTeam