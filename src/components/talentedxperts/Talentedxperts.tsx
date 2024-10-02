import React from 'react'
import Image from "next/image";
import { Icon } from '@iconify/react';

const Talentedxperts = () => {
    return (
        <div>
            <section className="promoted_te_section bg_black py-5">
                <div className="p-5">
                    <h2 className="text-white mb-4">Promoted TalentedXperts</h2>
                    <div className='row'>
                        <div className="col-md-4">
                            <div className="promoted_card mb-2 position-relative">
                                <div className="ribbon-1">
                                    <Image
                                        src="/assets/images/promote.svg"
                                        alt="img"
                                        className="img-fluid ribbon-img"
                                        width={255}
                                        height={255}
                                        priority
                                    />
                                </div>
                                <div className="ribbon-2"><span>Disability</span></div>
                                <div className="card_heading">
                                    <div className="userimg">
                                        <Image
                                            src="/assets/images/profile-img.png"
                                            alt="img"
                                            className="img-fluid ribbon-img"
                                            width={255}
                                            height={255}
                                            priority
                                        />
                                    </div>
                                    <div className="usertext mb-3">
                                        <h5>fdfdf</h5>
                                        <h6>fd fdfdf </h6>
                                        <div className="rating">
                                            {[...Array(5)].map((_, index) => (
                                                // <span
                                                //   key={index}
                                                //   className={`material-symbols-outlined ${index < data.rating ? "rated" : ""}`}
                                                // >
                                                //   kid_star
                                                // </span>
                                                // <Icon key={index} icon="material-symbols-light:kid-star" className={'text-warning me-1 ${index < data.rating ? "rated" : ""}' }/>
                                                <Icon icon="material-symbols-light:kid-star" key={index} className="text-light rated"/>

                                            ))}


                                        </div>
                                    </div>
                                </div>
                                <p className='line-clamp-3'>descdfl ndlkfndlk fn </p>
                                {/* <a href="#">more</a> */}
                                <div className="d-flex align-items-baseline justify-content-between">
                                    <h6 className="fs-12"> Tasks</h6>
                                    <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                                        View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="promoted_card mb-2 position-relative">
                                <div className="ribbon-1">
                                    <Image
                                        src="/assets/images/promote.svg"
                                        alt="img"
                                        className="img-fluid ribbon-img"
                                        width={255}
                                        height={255}
                                        priority
                                    />
                                </div>
                                <div className="ribbon-2"><span>Disability</span></div>
                                <div className="card_heading">
                                    <div className="userimg">
                                        <Image
                                            src="/assets/images/profile-img.png"
                                            alt="img"
                                            className="img-fluid ribbon-img"
                                            width={255}
                                            height={255}
                                            priority
                                        />
                                    </div>
                                    <div className="usertext mb-3">
                                        <h5>fdfdf</h5>
                                        <h6>fd fdfdf </h6>
                                        <div className="rating">
                                            {[...Array(5)].map((_, index) => (
                                                // <span
                                                //   key={index}
                                                //   className={`material-symbols-outlined ${index < data.rating ? "rated" : ""}`}
                                                // >
                                                //   kid_star
                                                // </span>
                                                // <Icon key={index} icon="material-symbols-light:kid-star" className={'text-warning me-1 ${index < data.rating ? "rated" : ""}' }/>
                                                <Icon key={index} icon="material-symbols-light:kid-star" className="text-light rated"/>

                                            ))}


                                        </div>
                                    </div>
                                </div>
                                <p className='line-clamp-3'>descdfl ndlkfndlk fn </p>
                                {/* <a href="#">more</a> */}
                                <div className="d-flex align-items-baseline justify-content-between">
                                    <h6 className="fs-12"> Tasks</h6>
                                    <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                                        View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="promoted_card mb-2 position-relative">
                                <div className="ribbon-1">
                                    <Image
                                        src="/assets/images/promote.svg"
                                        alt="img"
                                        className="img-fluid ribbon-img"
                                        width={255}
                                        height={255}
                                        priority
                                    />
                                </div>
                                <div className="ribbon-2"><span>Disability</span></div>
                                <div className="card_heading">
                                    <div className="userimg">
                                        <Image
                                            src="/assets/images/profile-img.png"
                                            alt="img"
                                            className="img-fluid ribbon-img"
                                            width={255}
                                            height={255}
                                            priority
                                        />
                                    </div>
                                    <div className="usertext mb-3">
                                        <h5>fdfdf</h5>
                                        <h6>fd fdfdf </h6>
                                        <div className="rating">
                                            {[...Array(5)].map((_, index) => (
                                                // <span
                                                //   key={index}
                                                //   className={`material-symbols-outlined ${index < data.rating ? "rated" : ""}`}
                                                // >
                                                //   kid_star
                                                // </span>
                                                // <Icon key={index} icon="material-symbols-light:kid-star" className={'text-warning me-1 ${index < data.rating ? "rated" : ""}' }/>
                                                <Icon key={index} icon="material-symbols-light:kid-star" className="text-light rated"/>

                                            ))}


                                        </div>
                                    </div>
                                </div>
                                <p className='line-clamp-3'>descdfl ndlkfndlk fn </p>
                                {/* <a href="#">more</a> */}
                                <div className="d-flex align-items-baseline justify-content-between">
                                    <h6 className="fs-12"> Tasks</h6>
                                    <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                                        View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Talentedxperts
