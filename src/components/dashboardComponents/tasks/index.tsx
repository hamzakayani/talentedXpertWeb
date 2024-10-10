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
        setLoading(true)
        await apiCall(requests.getTasks + params, {}, 'get', false, dispatch, user, router).then((res: any) => {
            setTasks(res?.data?.data || [])
            setLoading(false)
        }).catch(err => console.warn(err))
    }

    const onPageChange = (page: number) => {
        setPage(page)
        let filters = ""

        filters += page > 0 ? '?pageNo=' + page : '';
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
                        {/* {loading && <SkeletonLoader count={20} />} */}
                        {!loading && tasks && tasks?.tasks?.length > 0 ?
                            tasks?.tasks?.map((task: any) => <TaskCard key={task?.id} task={task} />)
                            : !loading ? <NoFound message={"No Found Tasks"} />  : null
                        }

                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab" tabIndex={0}>
                        {/* {loading && <SkeletonLoader count={20} />} */}
                        {/* {!loading && tasks && tasks?.tasks?.length > 0 ?
                            tasks?.tasks?.map((task: any) => <TaskCard key={task?.id} />)
                            : !loading ? <p>No Found Tasks</p> : null
                        } */}

                        <div className='card-bodyy my-active-task py-2 '>

                            <div className="box mx-3 my-2  ">

                                <div className="ribbon ribbon-top-right"><span>Disability</span></div>

                                <div className='row'>


                                    <div className='col-lg-1 col-2  '>
                                        <Image
                                            src="/assets/images/promoted-tag.svg"
                                            alt="img"
                                            className="img-fluid promoteed-tag-img"
                                            width={60}
                                            height={60}
                                            priority
                                        />
                                        <div className='text-lg-end card-profile  mt-4 '>
                                            <div className='inerprofile text-end'>                                                <Image
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
                                    </div>
                                    <div className='col-lg-10 col-9 p-4'>
                                        <div className='priceanddate d-flex justify-content-between bordr'>
                                            <div className='d-flex align-items-baseline'>
                                                <h4>Tech Lead Software Engineer</h4>
                                                <button className="btn btn-blue ls mt-1 ms-5">in Progress</button>



                                            </div>

                                            <div className='pricedate text-end'>
                                                <span>2 days ago</span>
                                                <h5>$20 / hr</h5>
                                            </div>

                                        </div>
                                        <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...
`}
                                        </p>


                                        <div className='card-footer d-flex flex-wrap justify-content-between'>
                                            <div>

                                                <button className="btn btn-black rounded-pill ls mt-2 ">Wordpress</button>
                                                <button className="btn btn-black rounded-pill mt-2 mx-1">Angular React</button>



                                            </div>


                                            <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>

                        <div className='card-bodyy my-active-task py-2 '>

                            <div className="box mx-3 my-2  ">

                                <div className="ribbon ribbon-top-right"><span>Disability</span></div>

                                <div className='row'>


                                    <div className='col-lg-1 col-2  '>
                                        <Image
                                            src="/assets/images/promoted-tag.svg"
                                            alt="img"
                                            className="img-fluid promoteed-tag-img"
                                            width={60}
                                            height={60}
                                            priority
                                        />
                                        <div className='text-lg-end card-profile  mt-4 '>
                                            <div className='inerprofile text-end'>                                                <Image
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
                                    </div>
                                    <div className='col-lg-10 col-9 p-4'>
                                        <div className='priceanddate d-flex justify-content-between bordr'>
                                            <div className='d-flex align-items-baseline'>
                                                <h4>Tech Lead Software Engineer</h4>
                                                <button className="btn btn-blue ls mt-1 ms-5">in Progress</button>


                                            </div>

                                            <div className='pricedate text-end'>
                                                <span>2 days ago</span>
                                                <h5>$20 / hr</h5>
                                            </div>

                                        </div>
                                        <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...
`}
                                        </p>


                                        <div className='card-footer d-flex flex-wrap justify-content-between'>
                                            <div>

                                                <button className="btn btn-black rounded-pill ls mt-2 ">Wordpress</button>
                                                <button className="btn btn-black rounded-pill mt-2 mx-1">Angular React</button>



                                            </div>


                                            <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className='card-bodyy my-active-task py-2 '>

                            <div className="box mx-3 my-2  ">

                                <div className="ribbon ribbon-top-right"><span>Disability</span></div>

                                <div className='row'>


                                    <div className='col-lg-1 col-2  '>
                                        <Image
                                            src="/assets/images/promoted-tag.svg"
                                            alt="img"
                                            className="img-fluid promoteed-tag-img"
                                            width={60}
                                            height={60}
                                            priority
                                        />
                                        <div className='text-lg-end card-profile  mt-4 '>
                                            <div className='inerprofile text-end'>                                                <Image
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
                                    </div>
                                    <div className='col-lg-10 col-9 p-4'>
                                        <div className='priceanddate d-flex justify-content-between bordr'>
                                            <div className='d-flex align-items-baseline'>
                                                <h4>Tech Lead Software Engineer</h4>
                                                <button className="btn btn-blue ls mt-1 ms-5">in Progress</button>


                                            </div>

                                            <div className='pricedate text-end'>
                                                <span>2 days ago</span>
                                                <h5>$20 / hr</h5>
                                            </div>

                                        </div>
                                        <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...
`}
                                        </p>


                                        <div className='card-footer d-flex flex-wrap justify-content-between'>
                                            <div>

                                                <button className="btn btn-black rounded-pill ls mt-2 ">Wordpress</button>
                                                <button className="btn btn-black rounded-pill mt-2 mx-1">Angular React</button>



                                            </div>


                                            <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>
                    <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab" tabIndex={0}>
                        {/* {loading && <SkeletonLoader count={20} />} */}
                        {/* {!loading && tasks && tasks?.tasks?.length > 0 ?
                            tasks?.tasks?.map((task: any) => <TaskCard key={task?.id} />)
                            : !loading ? <NoFound message={"No Found Tasks"} /> : null
                        } */}

                        <div className='card-bodyy my-active-task py-2 '>

                            <div className="box mx-3 my-2  ">

                                <div className="ribbon ribbon-top-right"><span>Disability</span></div>

                                <div className='row'>


                                    <div className='col-lg-1 col-2  '>
                                        <Image
                                            src="/assets/images/promoted-tag.svg"
                                            alt="img"
                                            className="img-fluid promoteed-tag-img"
                                            width={60}
                                            height={60}
                                            priority
                                        />
                                        <div className='text-lg-end card-profile  mt-4 '>
                                            <div className='inerprofile text-end'>                                                <Image
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
                                    </div>
                                    <div className='col-lg-10 col-9 p-4'>
                                        <div className='priceanddate d-flex justify-content-between bordr'>
                                            <div className='d-flex align-items-baseline'>
                                                <h4>Tech Lead Software Engineer</h4>
                                                <button className="btn btn-warning ls mt-1 ms-5">Posted</button>


                                            </div>

                                            <div className='pricedate text-end'>
                                                <span>2 days ago</span>
                                                <h5>$20 / hr</h5>
                                            </div>

                                        </div>
                                        <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...
`}
                                        </p>


                                        <div className='card-footer d-flex flex-wrap justify-content-between'>
                                            <div>

                                                <button className="btn btn-black rounded-pill ls mt-2 ">Wordpress</button>
                                                <button className="btn btn-black rounded-pill mt-2 mx-1">Angular React</button>



                                            </div>


                                            <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className='card-bodyy my-active-task py-2 '>

                            <div className="box mx-3 my-2  ">

                                <div className="ribbon ribbon-top-right"><span>Disability</span></div>

                                <div className='row'>


                                    <div className='col-lg-1 col-2  '>
                                        <Image
                                            src="/assets/images/promoted-tag.svg"
                                            alt="img"
                                            className="img-fluid promoteed-tag-img"
                                            width={60}
                                            height={60}
                                            priority
                                        />
                                        <div className='text-lg-end card-profile  mt-4 '>
                                            <div className='inerprofile text-end'>                                                <Image
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
                                    </div>
                                    <div className='col-lg-10 col-9 p-4'>
                                        <div className='priceanddate d-flex justify-content-between bordr'>
                                            <div className='d-flex align-items-baseline'>
                                                <h4>Tech Lead Software Engineer</h4>
                                                <button className="btn btn-warning ls mt-1 ms-5">Posted</button>


                                            </div>

                                            <div className='pricedate text-end'>
                                                <span>2 days ago</span>
                                                <h5>$20 / hr</h5>
                                            </div>

                                        </div>
                                        <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...
`}
                                        </p>


                                        <div className='card-footer d-flex flex-wrap justify-content-between'>
                                            <div>

                                                <button className="btn btn-black rounded-pill ls mt-2 ">Wordpress</button>
                                                <button className="btn btn-black rounded-pill mt-2 mx-1">Angular React</button>



                                            </div>


                                            <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>
                        <div className='card-bodyy my-active-task py-2 '>

                            <div className="box mx-3 my-2  ">

                                <div className="ribbon ribbon-top-right"><span>Disability</span></div>

                                <div className='row'>


                                    <div className='col-lg-1 col-2  '>
                                        <Image
                                            src="/assets/images/promoted-tag.svg"
                                            alt="img"
                                            className="img-fluid promoteed-tag-img"
                                            width={60}
                                            height={60}
                                            priority
                                        />
                                        <div className='text-lg-end card-profile  mt-4 '>
                                            <div className='inerprofile text-end'>                                                <Image
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
                                    </div>
                                    <div className='col-lg-10 col-9 p-4'>
                                        <div className='priceanddate d-flex justify-content-between bordr'>
                                            <div className='d-flex align-items-baseline'>
                                                <h4>Tech Lead Software Engineer</h4>
                                                <button className="btn btn-warning ls mt-1 ms-5">Posted</button>


                                            </div>

                                            <div className='pricedate text-end'>
                                                <span>2 days ago</span>
                                                <h5>$20 / hr</h5>
                                            </div>

                                        </div>
                                        <p>{`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications and determine operational feasibility Integrate software components into a fully functional software system Develop software verification plans...
`}
                                        </p>


                                        <div className='card-footer d-flex flex-wrap justify-content-between'>
                                            <div>

                                                <button className="btn btn-black rounded-pill ls mt-2 ">Wordpress</button>
                                                <button className="btn btn-black rounded-pill mt-2 mx-1">Angular React</button>



                                            </div>


                                            <Link className="btn rounded-pill btn-outline-info mt-2" href={'/dashboard/tasks/view-task'} >View Details<Icon icon="ic:sharp-arrow-forward" /></Link>


                                        </div>

                                    </div>

                                </div>
                            </div>

                        </div>

                    </div>

                </div>







            </div>

            {/* pagination */}
            {!loading && tasks && tasks?.count > 0 && <Pagination count={tasks?.count} page={page} limit={limit} onPageChange={onPageChange} onLimitChange={onLimitChange} siblingCount={1} />}
        </div>
    )
}

export default Tasks