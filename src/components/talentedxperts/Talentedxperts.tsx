'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/Store';
import { useRouter } from 'next/navigation';
import FilterCard from '../dashboardComponents/tasks/FilterCard';
import ImageFallback from '../common/ImageFallback/ImageFallback';
import defaultUserImg from "../../../public/assets/images/default-user.jpg"
import RatingStar from '../common/RatingStar/RatingStar';

const Talentedxperts = () => {
    const user = useSelector((state: RootState) => state.user)
    const [users, setUsers] = useState<any>([])
    const [filters, setFilters] = useState<string>('')
    const [status, setStatus] = useState<string>('')
    const [disability, setDisability] = useState<boolean>(false)
    const [promoted, setPromoted] = useState<boolean>(false)
    const [amountType, setAmountType] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    // const [limit, setLimit] = useState<number>(10)
    // const [page, setPage] = useState<number>(1)
    const dispatch = useAppDispatch();
    const router = useRouter()

    useEffect(() => {
        getUserDetails(filters);
    }, [filters])


    useEffect(() => {
        setFilterParams();
    }, [promoted, amountType, disability, search])


    const getUserDetails = async (params: any) => {
        await apiCall(`${requests.getUserAll}${params}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
            if (res?.error) {
                console.warn(res?.error)
            } else {
                setUsers(res?.data?.data?.users)
            }
        }).catch(err => console.warn(err))
    }
    
    
    const setFilterParams = () => {
        let filters = "";

        filters += '?page=' + 1 || '';
        filters += '&profileType=' + `${user?.profile?.length > 0 && user?.profile[0]?.type}`;
        // filters += limit > 0 ? '&limit=' + limit : '';
        // filters += status != '' ? '&status=' + status : '';
        // filters += disability? '&disability=' + disability : '';
        // filters += promoted? '&promoted=' + promoted : '';
        // filters += amountType != '' ? '&amountType=' + amountType : '';
        filters += search != '' ? '&name=' + search : '';

        setFilters(filters)
    }


    return (
        <div>
            <div className='card'>
                <div className='card first-card card-header'>
                    <h3>{user?.profile?.lenght > 0 && user?.profile[0]?.type === 'TR' ? 'Talented Xperts' : 'Talent Requsters'}</h3>
                </div>
                <FilterCard setPromoted={setPromoted} setDisability={setDisability} setAmountType={setAmountType} resetFilters={status} setSearch={setSearch} />
                <div className='card-bodyy my-active-task py-1 ps-2 pe-4 '>
                    <div className='row'>
                        {users?.map((use: any) => <div className='col-lg-4 p-0 mb-3 ' key={use?.id}>
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
                                                    src={use?.profilePicture?.fileUrl || defaultUserImg}
                                                    alt="img"
                                                    className=" user-img img-round"
                                                    width={60}
                                                    height={60}
                                                />

                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-right p-2'>
                                        <div className='priceanddate d-flex justify-content-between '>
                                            <div className='d-flex align-items-baseline'>
                                                <div className='stars mb-2'>
                                                    <h5 className='ls'>{use?.firstName} {use?.lastName}</h5>
                                                    <RatingStar rating={use.profile?.length > 0 && use?.profile?.filter((prof:any) => prof?.type !== (user?.profile?.length >0 && user?.profile[0]?.type))[0]?.averageRating}/>
                                                    {/* <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                    <Icon icon="mdi-light:star" className='text-light' /> */}
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                </div>

                                <p className='text-white ps-3 line-clamp-3'>{use.about}</p>
                                <div className='card-footer mt-auto d-flex flex-wrap justify-content-between'>
                                    <div>
                                        <Link className="btn rounded-pill btn-sm btn-outline-info mt-2" href={'/dashboard/message'} >Contact Now<Icon icon="ic:sharp-arrow-forward" /></Link>
                                    </div>
                                    <Link className="btn rounded-pill btn-sm btn-outline-info mt-2" href={use?.profile?.lenght > 0 && user?.profile[0]?.type === 'TR' ? `/dashboard/talented-xperts/${user.id}` : `/dashboard/talented-requestors/${user.id}`} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>
                                </div>
                            </div>
                        </div>)}
                        {/* <div className='col-lg-4 p-0 my-1 '>
                            <div className="box ms-3 p-2  ">
                                <div className='d-flex'>
                                    <div className='card-left'>
                                        <div className='promoted'>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                        </div>
                                        <div className='text-lg-end card-profile  mt-2 '>
                                            <div className='inerprofile text-end'>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />

                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-right p-2'>
                                        <div className='priceanddate d-flex justify-content-between '>
                                            <div className='d-flex align-items-baseline'>

                                                <div className='stars mb-2'>
                                                    <h5 className='ls'>Front end Developer</h5>
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>

                                </div>

                                <p>{
                                    `Develop and implement user interfaces for websites and web applications.Ensure the responsiveness..`}

                                </p>

                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >Contact Now<Icon icon="ic:sharp-arrow-forward" /></Link>



                                    </div>


                                    <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/talendxperts/viewProfile'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                </div>


                            </div>
                        </div>
                        <div className='col-lg-4 p-0 my-1 '>
                            <div className="box ms-3 p-2  ">






                                <div className='d-flex'>
                                    <div className='card-left'>
                                        <div className='promoted'>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                        </div>
                                        <div className='text-lg-end card-profile  mt-2 '>
                                            <div className='inerprofile text-end'>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />


                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-right p-2'>
                                        <div className='priceanddate d-flex justify-content-between '>
                                            <div className='d-flex align-items-baseline'>

                                                <div className='stars mb-2'>
                                                    <h5 className='ls'>Front end Developer</h5>
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                </div>
                                            </div>
                                        </div>




                                    </div>

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>






















                                </div>

                                <p>{
                                    `Develop and implement user interfaces for websites and web applications.Ensure the responsiveness..`}

                                </p>

                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >Contact Now<Icon icon="ic:sharp-arrow-forward" /></Link>



                                    </div>


                                    <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                </div>


                            </div>
                        </div>

                        <div className='col-lg-4 p-0 my-1 '>
                            <div className="box ms-3 p-2  ">






                                <div className='d-flex'>
                                    <div className='card-left'>
                                        <div className='promoted'>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                        </div>
                                        <div className='text-lg-end card-profile  mt-2 '>
                                            <div className='inerprofile text-end'>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />


                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-right p-2'>
                                        <div className='priceanddate d-flex justify-content-between '>
                                            <div className='d-flex align-items-baseline'>

                                                <div className='stars mb-2'>
                                                    <h5 className='ls'>Front end Developer</h5>
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                </div>
                                            </div>
                                        </div>




                                    </div>

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>






















                                </div>

                                <p>{
                                    `Develop and implement user interfaces for websites and web applications.Ensure the responsiveness..`}

                                </p>

                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >Contact Now<Icon icon="ic:sharp-arrow-forward" /></Link>



                                    </div>


                                    <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                </div>


                            </div>
                        </div>
                        <div className='col-lg-4 p-0 my-1 '>
                            <div className="box ms-3 p-2  ">






                                <div className='d-flex'>
                                    <div className='card-left'>
                                        <div className='promoted'>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                        </div>
                                        <div className='text-lg-end card-profile  mt-2 '>
                                            <div className='inerprofile text-end'>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />


                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-right p-2'>
                                        <div className='priceanddate d-flex justify-content-between '>
                                            <div className='d-flex align-items-baseline'>

                                                <div className='stars mb-2'>
                                                    <h5 className='ls'>Front end Developer</h5>
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                </div>
                                            </div>
                                        </div>




                                    </div>

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>






















                                </div>

                                <p>{
                                    `Develop and implement user interfaces for websites and web applications.Ensure the responsiveness..`}

                                </p>

                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >Contact Now<Icon icon="ic:sharp-arrow-forward" /></Link>



                                    </div>


                                    <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                </div>


                            </div>
                        </div>
                        <div className='col-lg-4 p-0 my-1 '>
                            <div className="box ms-3 p-2  ">






                                <div className='d-flex'>
                                    <div className='card-left'>
                                        <div className='promoted'>
                                            <Image
                                                src="/assets/images/promoted-tag.svg"
                                                alt="img"
                                                className="img-fluid promoteed-tag-img"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                        </div>
                                        <div className='text-lg-end card-profile  mt-2 '>
                                            <div className='inerprofile text-end'>

                                                <Image
                                                    src="/assets/images/profile-img.png"
                                                    alt="img"
                                                    className="img-fluid user-img img-round"
                                                    width={60}
                                                    height={60}
                                                    priority
                                                />


                                            </div>
                                        </div>
                                    </div>
                                    <div className='card-right p-2'>
                                        <div className='priceanddate d-flex justify-content-between '>
                                            <div className='d-flex align-items-baseline'>

                                                <div className='stars mb-2'>
                                                    <h5 className='ls'>Front end Developer</h5>
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="ic:baseline-star" className='text-warning' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                    <Icon icon="mdi-light:star" className='text-light' />
                                                </div>
                                            </div>
                                        </div>




                                    </div>

                                    <div className="ribbon ribbon-top-right"><span>Disability</span></div>






















                                </div>

                                <p>{
                                    `Develop and implement user interfaces for websites and web applications.Ensure the responsiveness..`}

                                </p>

                                <div className='card-footer d-flex flex-wrap justify-content-between'>
                                    <div>

                                        <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >Contact Now<Icon icon="ic:sharp-arrow-forward" /></Link>



                                    </div>


                                    <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                </div>


                            </div>
                        </div> */}
                    </div>

                    <div className='d-flex justify-content-end my-3'>

                        <Link className="btn rounded-pill btn-outline-info mt-2 btn-sm " href={''} >View All</Link>
                    </div>




                </div>


            </div>
        </div>
    )
}

export default Talentedxperts
