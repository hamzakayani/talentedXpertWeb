'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '@/store/Store';
import { useParams, useRouter } from 'next/navigation';
import FilterCard from '../dashboardComponents/tasks/FilterCard';
import ImageFallback from '../common/ImageFallback/ImageFallback';
import defaultUserImg from "../../../public/assets/images/default-user.jpg"
import RatingStar from '../common/RatingStar/RatingStar';
import { Pagination } from '../common/Pagination/Pagination';
import HtmlData from '../common/HtmlData/HtmlData';

const Talentedxperts = () => {
    const { userType } = useParams()
    const user = useSelector((state: RootState) => state.user)
    const [users, setUsers] = useState<any>([])
    const [limit, setLimit] = useState<number>(12)
    const [page, setPage] = useState<number>(1)
    const [filters, setFilters] = useState<string>('')
    const [status, setStatus] = useState<string>('')
    const [disability, setDisability] = useState<boolean>(false)
    const [promoted, setPromoted] = useState<boolean>(false)
    const [amountType, setAmountType] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const dispatch = useAppDispatch();
    const router = useRouter()
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

    useEffect(() => {
        if (filters && filters != "") {
            getUserDetails(filters);
        }
    }, [filters])

    useEffect(() => {
        setFilterParams();
    }, [limit, status, promoted, amountType, disability, search])

    const getUserDetails = async (params: any) => {
        await apiCall(`${requests.getUserAll}${params}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
            if (res?.error) {
                console.warn(res?.error)
            } else {
                setUsers(res?.data?.data)
            }
        }).catch(err => console.warn(err))
    }

    const setFilterParams = () => {
        let filters = "";

        filters += '?page=' + 1 || '';
        // user ? filters += '&profileType=' + `${user?.profile?.length > 0 && user?.profile[0]?.type}` : ''
        filters += limit > 0 ? '&limit=' + limit : '';
        filters += status != '' ? '&status=' + status : '';
        // filters += disability? '&disability=' + disability : '';
        // filters += promoted? '&promoted=' + promoted : '';
        // filters += amountType != '' ? '&amountType=' + amountType : '';
        filters += search != '' ? '&name=' + search : '';

        setPage(1)
        setFilters(filters)
    }

    const onPageChange = (page: number) => {
        setPage(page)
        let filters = ""

        filters += page > 0 ? '?page=' + page : '';
        filters += limit > 0 ? '&limit=' + limit : '';

        setFilters(filters)
    }

    const onLimitChange = (limit: number) => {
        setLimit(limit);
    };

    return (
        <div>
            {/* ${!isAuth && 'forpadding'} */}
            <div className={`card`}>
                <div className='card first-card card-header'>
                    <div className='card-left-heading'>
                        <h3>{userType === 'talented-requestors' ? 'Talent Requestors' : 'Talented Xperts'}</h3>
                    </div>
                </div>
                <FilterCard setPromoted={setPromoted} promoted={promoted} disability={disability} setDisability={setDisability} setAmountType={setAmountType} resetFilters={status} setSearch={setSearch} />
                <div className='card-bodyy my-active-task py-1 ps-2 pe-4 '>
                    <div className='row'>
                        {users?.users?.map((use: any) => <div className='col-lg-4 p-0 mb-3 ' key={use?.id}>
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
                                                    <RatingStar rating={use?.profile?.find((prof: any) => userType === 'talented-requestors' ? prof?.type === 'TR' : prof?.type === 'TE')?.averageRating} />

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
                                        <Link className="btn rounded-pill btn-sm btn-outline-info mt-2" href={'/dashboard/messages'} >Contact Now<Icon icon="ic:sharp-arrow-forward" className='ms-2' /></Link>
                                    </div>
                                    {user ?
                                        <Link className="btn rounded-pill btn-sm btn-outline-info mt-2" href={`/dashboard/${userType}/${use?.id}`} >View Details<Icon icon="ic:sharp-arrow-forward" className='ms-2' /></Link>
                                        : <Link className="btn rounded-pill btn-sm btn-outline-info mt-2" href={`/${userType}/${use?.id}`} >View Details<Icon icon="ic:sharp-arrow-forward" className='ms-2' /></Link>
                                    }
                                </div>
                            </div>
                        </div>)}

                    </div>

                    {/* <div className='d-flex justify-content-end my-3'>

                        <Link className="btn rounded-pill btn-outline-info mt-2 btn-sm " href={''} >View All</Link>
                    </div> */}




                </div>


            </div>
            {users?.count > 0 && <Pagination count={users?.count} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} siblingCount={1} />}
        </div>
    )
}

export default Talentedxperts
