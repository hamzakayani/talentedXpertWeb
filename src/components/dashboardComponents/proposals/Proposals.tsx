'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { getTimeago } from '@/services/utils/util';
import { Pagination } from '@/components/common/Pagination/Pagination';
import SkeletonLoader from '@/components/common/SkeletonLoader/SkeletonLoader';
import NoFound from '@/components/common/NoFound/NoFound';
import ImageFallback from '@/components/common/ImageFallback/ImageFallback';
import { ProposalStatus } from '@/services/enums/enums';
import HtmlData from '@/components/common/HtmlData/HtmlData';
import defaultUserImg from "../../../../public/assets/images/default-user.jpg"

const Proposals = () => {
    const { id } = useParams()
    const dispatch = useAppDispatch();
    const router = useRouter()
    const user = useSelector((state: RootState) => state.user)
    const [proposals, setProposals] = useState<any>([])
    const [limit, setLimit] = useState<number>(10)
    const [page, setPage] = useState<number>(1)
    const [status, setStatus] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [filters, setFilters] = useState<string>('')

    useEffect(() => {
        if (filters && filters != "") {
            getProposals(filters)
        }
    }, [filters])

    const setFilterParams = () => {
        let filters = ""

        filters += '?page=' + 1 || '';
        filters += limit > 0 ? '&limit=' + limit : '';
        filters += Number(id) > 0 ? '&taskId=' + Number(id) : '';
        filters += status !== '' ? '&status=' + status : '';

        setPage(1)

        setFilters(filters)
    }

    useEffect(() => {
        setFilterParams();
    }, [limit, status])

    const getProposals
        = async (params: any) => {
            try {
                setLoading(true);
                const response = await apiCall(`${requests.getProposals}${params}`, {}, 'get', false, dispatch, user, router
                );
                setProposals(response?.data?.data || []);

            } catch (error) {
                console.warn("Error fetching tasks:", error);
            } finally {
                setLoading(false);
            }
        }


    const onPageChange = (page: number) => {
        setPage(page)
        let filters = ""

        filters += page > 0 ? '?page=' + page : '';
        filters += limit > 0 ? '&limit=' + limit : '';
        filters += Number(id) > 0 ? '&taskId=' + Number(id) : '';

        setFilters(filters)
    }

    const onLimitChange = (limit: number) => {
        setLimit(limit);
    };
    const handlechange = (e:any) => {
        setStatus(e.target.value)
    };



    return (
        <div>

            <div className='mx-4 d-flex justify-content-between'>
                <ul className="nav nav-pills mt-3" id="pills-tab" role="tablist">
                   
                </ul>

            </div>
            <div className='card'>
                <div className='card first-card card-header '>
                <div className='d-flex justify-content-between'>
                <h3 className='mt-2'>Proposals</h3>
                
                <div className='filtersearch d-flex align-items-center justify-content-between flex-wrap p-2'>
                            <div className='filters d-flex align-items-center '>
                                <select className="form-select form-select-sm mx-1" aria-label=".form-select-sm example" onChange={handlechange}>
                                    {Object.keys(ProposalStatus).map(key => {
                                        const value = ProposalStatus[key as keyof typeof ProposalStatus];
                                        return (
                                            <>
                                                <option value={key}>{value}</option>
                                            </>

                                        );
                                    })}


                                </select>
                            </div>

                        </div>
                </div>
                
                
                    
                   
                </div>
                <div className='card-bodyy my-active-task'>
                    {/* {loading && <SkeletonLoader count={20} />} */}

                    {!loading && proposals && proposals?.proposals?.length > 0 ?
                        proposals?.proposals.map((data: any, index: number) => (
                            <div className="box m-2 " key={index} >
                                <div className='row'>
                                    <div className=' col-lg-1 col-2  '>
                                        <div className=' card-profile text-end mt-4 '>
                                            
                                            <ImageFallback
                                                src={data?.expertProfile?.user?.profilePicture?.fileUrl || defaultUserImg}
                                                alt="img"
                                                className=" user-img img-round"
                                                width={60}
                                                height={60}
                                                priority
                                            />
                                            <h2>{data?.expertProfile?.user?.firstName} {data?.expertProfile?.user?.lastName}</h2>
                                            
                                        </div>
                                    </div>
                                    <div className='col-lg-10 col-9 p-4'>
                                        <div className='priceanddate d-flex justify-content-between bordr'>
                                            <div className='stars'>
                                                <h4>{data?.task?.name}</h4>
                                                <span className="badge text-bg-primary ms-0 ms-lg-3 ms-md-3 ">{data?.status}</span>
                                                <Icon icon="ic:baseline-star" className='text-warning' />
                                                <Icon icon="ic:baseline-star" className='text-warning' />
                                                <Icon icon="ic:baseline-star" className='text-warning' />
                                                <Icon icon="mdi-light:star" className='text-light' />
                                                <Icon icon="mdi-light:star" className='text-light' />
                                            </div>
                                            <div>
                                            
                                                <span>{getTimeago(data.createdAt)}</span>
                                                <h5>${data.amount}</h5>
                                            </div>
                                        </div>
                                        <HtmlData data={data?.details} className='truncate-overflow text-white line-clamp-2 ps-2' /> 
                                        {/* <p>{data.details} </p> */}
                                        <div className='card-footer d-flex justify-content-between  p-0 mb-3'>
                                            <div>

                                                {/* <button className="btn btn-dark rounded-pill hero-btn ls ">Wordpress</button>
                                                <button className="btn btn-dark rounded-pill hero-btn mx-2">Angular React</button> */}

                                            </div>

                                        </div>
                                        <div className='btn-border'>
                                            {/* <button className="btn rounded-pill btn-outline-info mx-1 my-1">Reject</button> */}
                                            {/* <button className="btn rounded-pill btn-outline-info mx-1 my-1">Shortlist</button> */}
                                            {/* <button className="btn rounded-pill btn-outline-info mx-1 my-1">Interview Questions</button> */}
                                            <Link className="btn rounded-pill btn-outline-info mx-1 my-1" href={`/dashboard/tasks/${id}/proposals/${data?.id}`} >View Details</Link>


                                        </div>

                                    </div>

                                </div>
                            </div>
                        ))
                        : !loading ? <NoFound message={"No Found Proposals"} /> : null
                    }

                </div>
                {!loading && proposals && proposals?.count > 0 && <Pagination count={proposals?.count} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} siblingCount={1} />}
            </div>
        </div>

    )
}

export default Proposals