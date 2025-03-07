'use client'
import React, { FC, useEffect, useState } from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';
import Link from 'next/link';
import TopMenu from './TopMenu';
import apiCall from '@/services/apiCall/apiCall';
import { requests } from '@/services/requests/requests';
import { RootState, useAppDispatch } from '@/store/Store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import FilterCard from './FilterCard';
import { Pagination } from '@/components/common/Pagination/Pagination';
import TaskCard from './TaskCard';
import NoFound from '@/components/common/NoFound/NoFound';
import SkeletonLoader from '@/components/common/SkeletonLoader/SkeletonLoader';

const Tasks: FC<any> = ({ isactive }) => {
    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const [tasks, setTasks] = useState<any>([])
    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()

    // pagination
    const [limit, setLimit] = useState<number>(10)
    const [page, setPage] = useState<number>(1)

    const [loading, setLoading] = useState<boolean>(false)
    const [filters, setFilters] = useState<string>('')
    const [status, setStatus] = useState<string>('')
    const [disability, setDisability] = useState<boolean>(false)
    const [promoted, setPromoted] = useState<boolean>(true)
    const [amountType, setAmountType] = useState<string>('')
    const [search, setSearch] = useState<string>('')

    useEffect(() => {
        if (status == 'PROPOSALS') {
            getProposal()
        }
        else {
            if (filters && filters != "") {
                // isactive ? setFilters(() => '?status=INPROGRESS&profileType=' + `${user?.profile?.length> 0 && user?.profile[0]?.type}`) : ''
                // if(user?.id){

                getAllTasks(filters)
                // }
            }

        }
    }, [user, filters])

    const setFilterParams = () => {
        let filters = ""
        filters += '?page=' + page || '';
        filters += limit > 0 ? '&limit=' + limit : '';
        if (isactive) {
            filters += '&status=INPROGRESS'
            filters += '&profileType=' + `${user?.profile?.length > 0 && user?.profile[0]?.type}`
        }
        else {
            filters += status != '' ? '&status=' + status : '';
            if (status === 'INPROGRESS' || status === 'COMPLETED' || status === 'CLOSED') {
                filters += '&profileType=' + `${user?.profile?.length > 0 && user?.profile[0]?.type}`
            }
            filters += disability ? '&disability=' + disability : '';
            filters += promoted ? '&promoted=' + promoted : '';
            filters += amountType != '' ? '&amountType=' + amountType : '';
            filters += search != '' ? '&name=' + search : '';
        }
        // setPage(1)
        setFilters(filters)
    }

    const getProposal = async () => {
        setLoading(true)
        let params: any = '?limit=' + limit;
        params += '&page= ' + page;
        await apiCall(`${requests.getProposals}${params}`, {}, 'get', false, dispatch, user, router).then((res: any) => {
            setTasks(res?.data?.data || []);
            setLoading(false);
            // setProposal(res?.data?.data?.proposals[0] || [])
            // setPrposalCount(res?.data?.data?.count || 0)
        }).catch(err => console.warn(err))
    }

    useEffect(() => {
        setFilterParams();
    }, [limit, status, promoted, amountType, disability, search, page, user])

    useEffect(() => {
        setDisability(false)
        setAmountType('')
        setPromoted(true)
        setPage(1)
    }, [status])

    const getAllTasks = async (params: any) => {
        try {
            setLoading(true);
            const response = await apiCall(isactive || (status === 'INPROGRESS' || status === 'COMPLETED' || status === 'CLOSED')
                ?
                `${requests.getTaskOnStatus}${user?.id}${params}` : `${requests.getTasks}${params}`,
                {},
                'get',
                false,
                dispatch,
                user,
                router
            );

            setTasks(response?.data?.data || []);
        } catch (error) {
            // console.warn("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };


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
        <div className={`card ${!isAuth && 'forpadding'}`}>
            {(isactive || (!isAuth && !isactive)) &&
                <div className='bg-dark text-white card-header d-flex justify-content-between px-4 '>
                    <div className='card-left-heading'>
                        <h3>
                            {(!isAuth && !isactive) ? 'Tasks' : `My Active Tasks (${tasks?.count || 0})`}
                        </h3>
                    </div>
                </div>
            }
            <div className='tab-card first-card card-header card-bodyy '>
                {!isactive && isAuth && <TopMenu setStatus={setStatus} />}
                {!isactive && <FilterCard promoted={promoted} disability={disability} setPromoted={setPromoted} setDisability={setDisability} setAmountType={setAmountType} resetFilters={status} setSearch={setSearch} />}

                <div className="tab-content" id="pills-tabContent">
                    {status == 'PROPOSALS' ?
                        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                            {/* {loading && <SkeletonLoader count={20} />} */}
                            {!loading && tasks && tasks?.count > 0 && tasks?.proposals?.length > 0 ?
                                tasks.proposals?.map((task: any) => <TaskCard key={task?.task?.id} task={task?.task} />)
                                : !loading ? <NoFound message={"No Task Found"} /> : null
                            }
                        </div>
                        :

                        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                            {/* {loading && <SkeletonLoader count={20} />} */}
                            {!loading && tasks && tasks?.tasks?.length > 0 ?
                                tasks?.tasks?.map((task: any) => <TaskCard key={task?.id} task={task} reviews={task?.reviews?.length > 0 ? task?.reviews?.filter((rev: any) => rev?.revieweeProfileId === (user?.profile?.length > 0 && user?.profile[0]?.id)) : 0} />)
                                : !loading ? <NoFound message={"No Task Found"} /> : null
                            }
                        </div>
                    }
                </div>
            </div>

            {/* pagination */}
            {!loading && tasks && tasks?.count > 0 && <Pagination count={tasks?.count} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} siblingCount={1} />}
        </div>
    )
}

export default Tasks
