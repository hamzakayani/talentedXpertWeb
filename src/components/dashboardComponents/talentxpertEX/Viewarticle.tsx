import React from 'react'
import { Icon } from '@iconify/react';


export const Viewarticle = () => {
    return (
        <section className='addtask'>
            <div className="card">
                <div className="card-header bg-dark text-light">
                    <h3 className='mb-0'>View Article</h3>
                </div>
                <div className="card-body bg-gray">
                    <div className="card bg-dark mb-2">
                        <div className="card-body">
                            <h6 className='text-light fw-light'>What if your data is telling you one thing but your customers or employees are telling you another?</h6>
                            <p className='text-light fs-12'>{`I can understand why the idea of big data has grown so rapidly. The value of data is very easy to sell. It’s a clear, almost mathematical way to analyse trends and drive marginal gains within a business or product. But equally, I would argue it’s also a lazy strategy if used in silo. What if the fundamental approach the business or a product is taking is wrong? Are you just driving changes towards the wrong end?`}</p>
                            <p className='text-light fs-12'>{`This is where consumer experience or ‘consumer love’ is key. Creating a product that people relate to; that fulfils a real need or desire is critical to building a long-lasting, successful business. But herein lies the problem — how do you measure emotional response towards your product?`}</p>
                            <p className='text-light fs-12'>{`For me, I like to think of this as implied value. Emotion doesn’t directly create value, but it can create a strong affinity towards a product that can indirectly result in heavier and more regular use with strong rewards. This is inevitably difficult to ‘sell’ to stakeholders because of the lack of tangible benefit. Equally, it’s difficult to measure because more often than not, the link between the product change and the implied benefit can be much harder to prove than using pure data.`}</p>
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
                                {/* <div className='d-flex mb-2 mb-md-0'>
                                    <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                                        View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="card bg-dark mb-2">
                        <div className="card-body">
                            <h6 className='text-light'>Write headlines with words that resonate</h6>
                            <p className='text-light fs-12'>{`It makes sense. Audiences are seeking information that will help them in their lives, and they have a lot of content from which to choose. By using the article a, we’ve created a general statement, implying that any cup of tea would taste good after any long day By writing phrases like “how to” in a headline, you tell ...`}</p>
                            <div className='d-flex align-items-center justify-content-around flex-wrap'>
                                <div className='d-flex flex-wrap mb-2'>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Networking</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">Development</button>
                                    <button type="button" className="btn btn-gray text-light btn-sm rounded-pill me-2">AI blockchain</button>
                                </div>
                                <div className='d-flex mb-2'>
                                    <Icon icon="ri:facebook-fill" className='me-2 text-light' />
                                    <Icon icon="lets-icons:insta" className="me-2 text-light" />
                                    <Icon icon="mdi:twitter" className="me-2 text-light" />
                                    <Icon icon="mdi:youtube" className='me-2 text-light' />
                                </div>
                                <div className='d-flex mb-2'>
                                    <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                                        View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                    </button>
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
                                    <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                                        View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    )
}
