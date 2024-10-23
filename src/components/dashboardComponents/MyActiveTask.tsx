import { mytasks } from '@/services/helpers/mytasks'
import React from 'react'
import { Icon } from '@iconify/react';
import Image from 'next/image';
import Link from 'next/link';
import ImageFallback from '../common/ImageFallback/ImageFallback';

const MyActiveTask = () => {
    return (
        <div className='card'>
            <div className='first-card card-header d-flex justify-content-between px-4 bg-gray'>
                <div className='card-left-heading'>
                    <h3>My Active Tasks</h3>
                </div>
                {/* <Link href='/dashboard/tasks/add-task'><div className='card-right-heading bg-info text-white  d-flex justify-content-between' >
                    <span className='me-3'>Add New Task</span>
                    <Icon icon="line-md:plus-square-filled" className='text-dark' width={32} height={32} />
                </div></Link> */}
            </div>

            {mytasks.map((data: any) => (<div className='card-bodyy my-active-task align-itmes-center ' key={data?.id}>

                <div className="box mx-3 my-2">

                    {data.disability && <div className="ribbon ribbon-top-right"><span>Disability</span></div>}

                    <div className='row'>


                        <div className='col-lg-2 col-md-2 pe-4 '>

                            <div className='w-75'>  {data.isPromoted && 
                            <ImageFallback
                            src="/assets/images/promoted-tag.svg"
                            alt="img"
                            className="img-fluid promoteed-tag-img pe-lg-4"
                            width={60}
                            height={60}
                            priority
                            />
                            }</div>

                            <div className='promoted-tag'> 
                                <div className='pe-lg-4 pe-md-4 ps-sm-4'>
                                
                            </div>
                            </div>

                            <div className='text-lg-end card-profile mt-4 '>
                                <div className='inerprofile text-center ms-4'>                                                <Image
                                    src={data.src}
                                    alt="img"
                                    className="img-fluid user-img img-round"
                                    width={60}
                                    height={60}
                                    priority
                                />
                                    <h2>{data.name}</h2>

                                </div>
                            </div>
                        </div>
                        <div className='col-lg-9 col-md-9 col-sm-9 py-4 pe-4 ps-lg-0 ps-md-0 p-4'>
                            <div className='priceanddate d-flex justify-content-between bordr'>
                                <h4>{data.designation}</h4>
                                <div className='pricedate text-end'>
                                    <span>{data.task_age} days ago</span>
                                    <h5 className='m-0 p-0'>${data.rate} / hr</h5>
                                </div>

                            </div>
                            <p>
                                {`A bachelor's degree or higher in computer science, software engineering, or another related field. Hands-on programming experience using relevant languages. Experience using relevant tool suites. Write well-designed, testable code Produce specifications ...`}

                            </p>


                            <div className='card-footer d-flex flex-wrap justify-content-between'>
                                <div>

                                    {data.domain.map((data: any, idx: number) => (<button className="btn btn-black rounded-pill ls mt-2 mx-1 " key={idx}>{data}</button>))}

                                </div>


                                <button className="btn rounded-pill btn-outline-info mt-2">View Details<Icon icon="ic:sharp-arrow-forward" /></button>


                            </div>

                        </div>

                    </div>
                </div>

            </div>))}
            <div className='pagiandnumber d-flex justify-content-between px-lg-5 px-2 bg-black'>
                <div className='Numbring d-flex align-items-center'>
                    <span>Show</span>
                    <select className="form-select form-select-sm mx-3" aria-label=".form-select-sm example">
                        <option value="">3</option>
                        <option value="1">5</option>
                        <option value="2">20</option>
                        <option value="3">50</option>
                    </select>
                    <span>entries</span>
                </div>
                <div className='pagination'>
                    <nav aria-label="Page navigation example">
                        <ul className="pagination">
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            <li className="page-item active"><a className="page-link" href="#">1</a></li>
                            <li className="page-item"><a className="page-link" href="#">2</a></li>
                            <li className="page-item"><a className="page-link" href="#">3</a></li>
                            <li className="page-item">
                                <a className="page-link" href="#" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    )
}

export default MyActiveTask
