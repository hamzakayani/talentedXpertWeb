import Link from 'next/link'
import React, { FC, useEffect, useState } from 'react'
import HtmlData from '../common/HtmlData/HtmlData'
import RatingStar from '../common/RatingStar/RatingStar'
import ImageFallback from '../common/ImageFallback/ImageFallback'
import Image from 'next/image'
import { Icon } from '@iconify/react';
import defaultUserImg from "../../../public/assets/images/default-user.jpg"
import profileImg from "../../../public/assets/images/profile-img.png"
import { dynamicBlurDataUrl } from '@/services/utils/dynamicBlurImage'
import InviteModal from '../common/Modals/inviteModal'

const UsersCard: FC<any> = ({ use, userType, user, setUserId }) => {
    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState('');
    // const [userId, setUserId ]= useState<any>()

    useEffect(() => {
        if (use?.profilePicture?.fileUrl || profileImg) {
            fetchBlurDataURL();
        }
    }, [use?.profilePicture?.fileUrl, profileImg]);


    const fetchBlurDataURL = async () => {
        if (use?.profilePicture?.fileUrl || profileImg) {
            const blurUrl = await dynamicBlurDataUrl(use?.profilePicture?.fileUrl || profileImg);
            setProfileImageBlurDataURL(blurUrl);
        }
    }
    const setId=(id:number) => {
        console.log('idddddd', id)
        setUserId(id)
    }

    return (
        <div className='col-lg-4 p-0 mb-3 ' key={use?.id}>
            <div className="box ms-3 py-2 pe-2  d-flex flex-column h-100">
                <div className='d-flex'>
                    <div className='card-left'>
                        {use?.profile[0]?.promoted && <div className='promoted'>
                            <Image
                                src="/assets/images/promoted-tag.svg"
                                alt="img"
                                className="img-fluid promoteed-tag-img"
                                width={60}
                                height={60}
                                priority
                            />
                        </div>}
                        <div className='text-center card-profile ms-2 mt-2 '>
                            <div className='inerprofile '>
                                <ImageFallback
                                    src={use?.profilePicture?.fileUrl}
                                    fallbackSrc={defaultUserImg}
                                    alt="img"
                                    className=" user-img img-round"
                                    width={60}
                                    height={60}
                                    loading='lazy'
                                    blurDataURL={profileImageBlurDataURL}
                                    userName={use ? `${use?.firstName} ${use?.lastName}` : null}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='card-right p-2'>
                        <div className='priceanddate d-flex justify-content-between '>
                            <div className='d-flex align-items-baseline'>
                                <div className='stars mb-2'>
                                    <h5 className='ls'>{use?.firstName} {use?.lastName}</h5>
                                    <RatingStar rating={use?.profile?.find((prof: any) => userType === 'talent-requestors' ? prof?.type === 'TR' : prof?.type === 'TE')?.averageRating} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='text-white ps-3 line-clamp-3'>
                    <HtmlData data={use?.about} />
                </div>
                <div className='card-footer mt-auto d-flex flex-wrap justify-content-between'>
                    <div>
                        {user?.profile[0]?.type == 'TR' && <button className="btn rounded-pill btn-sm btn-outline-info mt-2" data-bs-target="#exampleModalToggle66" data-bs-toggle="modal" onClick={()=>setId(use?.profile[0]?.id)} >Invite<Icon icon="ic:sharp-arrow-forward" className='ms-2' /></button>}
                    </div>
                    {user ?
                        <Link className="btn rounded-pill btn-sm btn-outline-info mt-2" href={`/dashboard/${userType}/${use?.id}`} >
                            View Details<Icon icon="ic:sharp-arrow-forward" className='ms-2' />
                        </Link>
                        : <Link className="btn rounded-pill btn-sm btn-outline-info mt-2" href={`/${userType}/${use?.id}`} >
                            View Details<Icon icon="ic:sharp-arrow-forward" className='ms-2' />
                        </Link>
                    }
                </div>
            </div>
            
        </div>
    )
}

export default UsersCard