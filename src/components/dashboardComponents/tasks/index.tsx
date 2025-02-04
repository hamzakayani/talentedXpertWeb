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
        if (filters && filters != "") {
            // isactive ? setFilters(() => '?status=INPROGRESS&profileType=' + `${user?.profile?.length> 0 && user?.profile[0]?.type}`) : ''

            getAllTasks(filters)
        }
    }, [user, filters])

    const setFilterParams = () => {
        let filters = ""
        filters += '?page=' + 1 || '';
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
        setPage(1)
        setFilters(filters)
    }

    useEffect(() => {
        setFilterParams();
    }, [limit, status, promoted, amountType, disability, search])

    // useEffect(() => {
    //     setDisability(false)
    //     setAmountType('')
    //     // setPromoted(true)
    // }, [status])

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

        <div className='card'>
            {isactive &&
                <div className='bg-dark text-white card-header d-flex justify-content-between px-4 '>
                    <div className='card-left-heading'>
                        <h3>My Active Tasks ({tasks.count || 0})</h3>
                    </div>
                </div>
            }
            <div className='tab-card first-card card-header card-bodyy '>
                {!isactive && isAuth && <TopMenu setStatus={setStatus} />}
                {!isactive && <FilterCard setPromoted={setPromoted} setDisability={setDisability} setAmountType={setAmountType} resetFilters={status} setSearch={setSearch} />}

                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                        {/* {loading && <SkeletonLoader count={20} />} */}
                        {!loading && tasks && tasks?.tasks?.length > 0 ?
                            tasks?.tasks?.map((task: any) => <TaskCard key={task?.id} task={task} reviews={task?.reviews?.length > 0 ? task?.reviews?.filter((rev: any) => rev?.revieweeProfileId === (user?.profile?.length > 0 && user?.profile[0]?.id)) : 0} />)
                            : !loading ? <NoFound message={"No Task Found"} /> : null
                        }
                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                        {/* {loading && <SkeletonLoader count={20} />} */}
                        {!loading && tasks && tasks?.tasks?.length > 0 ?
                            tasks?.tasks?.map((task: any) => <TaskCard key={task?.id} task={task} reviews={task?.reviews?.length > 0 ? task?.reviews?.filter((rev: any) => rev?.revieweeProfileId === (user?.profile?.length > 0 && user?.profile[0]?.id)) : 0} />)
                            : !loading ? <p>No Task Found</p> : null
                        }
                    </div>
                    <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabIndex={0}>
                        {/* {loading && <SkeletonLoader count={20} />} */}
                        {!loading && tasks && tasks?.tasks?.length > 0 ?
                            tasks?.tasks?.map((task: any) => <TaskCard key={task?.id} task={task} reviews={task?.reviews?.length > 0 ? task?.reviews?.filter((rev: any) => rev?.revieweeProfileId === (user?.profile?.length > 0 && user?.profile[0]?.id)) : 0} />)
                            : !loading ? <NoFound message={"No Task Found"} /> : null
                        }
                    </div>
                </div>
            </div>

            {/* pagination */}
            {!loading && tasks && tasks?.count > 0 && <Pagination count={tasks?.count} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} siblingCount={1} />}
        </div>
    )
}

export default Tasks