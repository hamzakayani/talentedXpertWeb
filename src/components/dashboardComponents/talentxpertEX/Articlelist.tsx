import React from 'react'
import { Icon } from '@iconify/react';
import Link from 'next/link';


export const Articlelist = () => {
    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light d-flex align-items-center justify-content-between">
                    <h5 className='mb-0'>My Articles</h5>
                    <Link href='/dashboard/articles/add'><div className='d-flex align-items-center' >
                        <h5 className='mb-0 me-3 text-light'>Add New Article</h5>
                        <Icon icon="line-md:plus-square-filled" className='text-info' width={32} height={32} />
                    </div></Link>
                </div>
                <div className="card-body bg-gray">
                    <div className="card bg-dark mb-2">
                        <div className="card-body">
                            <h6 className='text-light'>Write headlines with words that resonate</h6>
                            <p className='text-light fs-12'>{`It makes sense. Audiences are seeking information that will help them in their lives, and they have a lot of content from which to choose. By using the article a, we’ve created a general statement, implying that any cup of tea would taste good after any long day By writing phrases like “how to” in a headline, you tell ...`}</p>
                            <div className='d-flex align-items-center justify-content-around flex-wrap'>
                                <div className='d-flex flex-wrap mb-2 mb-md-0'>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Networking</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Development</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">AI blockchain</button>
                                </div>
                                <div className='d-flex mb-2 mb-md-0'>
                                    <Icon icon="ri:facebook-fill" className='me-2 text-light' />
                                    <Icon icon="lets-icons:insta" className="me-2 text-light" />
                                    <Icon icon="mdi:twitter" className="me-2 text-light" />
                                    <Icon icon="mdi:youtube" className='me-2 text-light' />
                                </div>
                                <div className='d-flex mb-2 mb-md-0'>
                                    <Link className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm" href={'/dashboard/articles/1'}>
                                        View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-dark mb-2">
                        <div className="card-body">
                            <h6 className='text-light'>Write headlines with words that resonate</h6>
                            <p className='text-light fs-12'>{`It makes sense. Audiences are seeking information that will help them in their lives, and they have a lot of content from which to choose. By using the article a, we’ve created a general statement, implying that any cup of tea would taste good after any long day By writing phrases like “how to” in a headline, you tell ...`}</p>
                            <div className='d-flex align-items-center justify-content-around flex-wrap'>
                                <div className='d-flex flex-wrap mb-2 mb-md-0'>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Networking</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Development</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">AI blockchain</button>
                                </div>
                                <div className='d-flex mb-2 mb-md-0'>
                                    <Icon icon="ri:facebook-fill" className='me-2 text-light' />
                                    <Icon icon="lets-icons:insta" className="me-2 text-light" />
                                    <Icon icon="mdi:twitter" className="me-2 text-light" />
                                    <Icon icon="mdi:youtube" className='me-2 text-light' />
                                </div>
                                <div className='d-flex mb-2 mb-md-0'>
                                    <Link className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm" href={'/dashboard/articles/2'}>
                                        View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-dark mb-2">
                        <div className="card-body">
                            <h6 className='text-light'>Write headlines with words that resonate</h6>
                            <p className='text-light fs-12'>{`It makes sense. Audiences are seeking information that will help them in their lives, and they have a lot of content from which to choose. By using the article a, we’ve created a general statement, implying that any cup of tea would taste good after any long day By writing phrases like “how to” in a headline, you tell ...`}</p>
                            <div className='d-flex align-items-center justify-content-around flex-wrap'>
                                <div className='d-flex flex-wrap mb-2 mb-md-0'>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Networking</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Development</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">AI blockchain</button>
                                </div>
                                <div className='d-flex mb-2 mb-md-0'>
                                    <Icon icon="ri:facebook-fill" className='me-2 text-light' />
                                    <Icon icon="lets-icons:insta" className="me-2 text-light" />
                                    <Icon icon="mdi:twitter" className="me-2 text-light" />
                                    <Icon icon="mdi:youtube" className='me-2 text-light' />
                                </div>
                                <div className='d-flex mb-2 mb-md-0'>
                                    <Link className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm" href={'/dashboard/articles/3'}>
                                        View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}
