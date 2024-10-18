'use client'
import React, { useEffect, useState } from 'react'
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

const Tasks = () => {
    const [tasks, setTasks] = useState<any>([])
    const dispatch = useAppDispatch()
    const user = useSelector((state: RootState) => state.user)
    const router = useRouter()

    // pagination
    const [limit, setLimit] = useState<number>(10)
    const [page, setPage] = useState<number>(1)

    const [loading, setLoading] = useState<boolean>(false)
    const [filters, setFilters] = useState<string>('')

    useEffect(() => {
        if (filters && filters != "") {
            getAllTasks(filters)
        }
    }, [filters])

    const setFilterParams = () => {
        let filters = ""

        filters += '?page=' + 1 || '';
        filters += limit > 0 ? '&limit=' + limit : '';

        setPage(1)

        setFilters(filters)
    }

    useEffect(() => {
        setFilterParams();
    }, [limit])

    const getAllTasks = async (params: any) => {
        try {
            setLoading(true);
            const response = await apiCall(
                `${requests.getTasks}${params}`, 
                {}, 
                'get', 
                false, 
                dispatch, 
                user, 
                router
            );
            
            setTasks(response?.data?.data || []);
        } catch (error) {
            console.warn("Error fetching tasks:", error);
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
            <div className='tab-card first-card card-header px-4 '>
                <TopMenu />
                <FilterCard />

                <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab" tabIndex={0}>
                        {loading && <SkeletonLoader count={20} />}
                        {!loading && tasks && tasks?.tasks?.length > 0 ?
                            tasks?.tasks?.map((task: any) => <TaskCard key={task?.id} task={task} />)
                            : !loading ? <NoFound message={"No Found Tasks"} />  : null
                        }

                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                        {loading && <SkeletonLoader count={20} />}
                        {!loading && tasks && tasks?.tasks?.length > 0 ?
                            tasks?.tasks?.map((task: any) => <TaskCard key={task?.id} task={task} />)
                            : !loading ? <p>No Found Tasks</p> : null
                        }

                        

                    </div>
                    <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabIndex={0}>
                        {loading && <SkeletonLoader count={20} />}
                        {!loading && tasks && tasks?.tasks?.length > 0 ?
                            tasks?.tasks?.map((task: any) => <TaskCard key={task?.id} task={task}/>)
                            : !loading ? <NoFound message={"No Found Tasks"} /> : null
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