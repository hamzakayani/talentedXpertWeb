'use client'
import React from 'react'
import { Icon } from '@iconify/react/dist/iconify.js';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import Img from '../ImageFallback/Img';
import { clientTest } from '@/services/helpers/staticdata';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';

const ProjectsSlider = () => {
    return (
        <>
            <div className='position-relative'>
                <Swiper
                    navigation={{
                        nextEl: '.custom-next', // Custom class for next button
                        prevEl: '.custom-prev', // Custom class for prev button
                    }}
                    slidesPerView={3}
                    spaceBetween={30}
                    slidesPerGroup={1}
                    loop={true}
                    breakpoints={{
                        320: {
                            slidesPerView: 1,
                            spaceBetween: 30
                        },
                        575: {
                            slidesPerView: 2,
                            spaceBetween: 30
                        },
                        767: {
                            slidesPerView: 2,
                            spaceBetween: 30
                        },
                        991: {
                            slidesPerView: 3,
                            spaceBetween: 30
                        },
                        1199: {
                            slidesPerView: 3,
                            spaceBetween: 30
                        }
                    }}
                    modules={[Navigation]}
                    className="mySwiper"
                >
                        <SwiperSlide>
                            <div className="promoted_card mb-2 position-relative project-card">
                            <Image
                                        src="/assets/images/project-1.jpg"
                                        alt="img"
                                        className="img-fluid ribbon-img"
                                        width={255}
                                        height={255}
                                        priority
                                    />
                                <div className="ribbon-1">
                                    
                                </div>
                                <h6>Shopify Project</h6>
                               <p>This project involves building a fully functional, scalable Shopi This project involves building a fully functional, scalable Shopi ...</p>
                              
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        <div className="promoted_card mb-2 position-relative project-card">
                            <Image
                                        src="/assets/images/project-1.jpg"
                                        alt="img"
                                        className="img-fluid ribbon-img"
                                        width={255}
                                        height={255}
                                        priority
                                    />
                                <div className="ribbon-1">
                                    
                                </div>
                                <h6>Shopify Project</h6>
                               <p>This project involves building a fully functional, scalable Shopi This project involves building a fully functional, scalable Shopi ...</p>
                              
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        <div className="promoted_card mb-2 position-relative project-card">
                            <Image
                                        src="/assets/images/project-1.jpg"
                                        alt="img"
                                        className="img-fluid ribbon-img"
                                        width={255}
                                        height={255}
                                        priority
                                    />
                                <div className="ribbon-1">
                                    
                                </div>
                                <h6>Shopify Project</h6>
                               <p>This project involves building a fully functional, scalable Shopi This project involves building a fully functional, scalable Shopi ...</p>
                              
                            </div>
                        </SwiperSlide>
                        <SwiperSlide>
                        <div className="promoted_card mb-2 position-relative project-card">
                            <Image
                                        src="/assets/images/project-1.jpg"
                                        alt="img"
                                        className="img-fluid ribbon-img"
                                        width={255}
                                        height={255}
                                        priority
                                    />
                                <div className="ribbon-1">
                                    
                                </div>
                                <h6>Shopify Project</h6>
                               <p>This project involves building a fully functional, scalable Shopi This project involves building a fully functional, scalable Shopi ...</p>
                              
                            </div>
                        </SwiperSlide>

                </Swiper>
                <div className="custom-prev custom-circle">
                    <Icon icon="ph:arrow-left-light" />

                </div>
                <div className="custom-next custom-circle">
                    <Icon icon="ph:arrow-right-light" />

                </div>
            </div>


            <style jsx>{`
        .custom-prev,
        .custom-next {
          position: absolute;
          top: 45%;
          transform: translateY(-50%);
          z-index: 10;
          font-size: 24px;
          cursor: pointer;
          color: #fff;
        }

        .custom-prev {
          left: -30px; /* Custom left positioning */
        }

        .custom-next {
          right: -30px; /* Custom right positioning */
        }

        /* Optional: Adjust size for small screens */
        @media (max-width: 575px) {
          .custom-prev,
          .custom-next {
            font-size: 20px;
          }
          .custom-prev {
            left: 5px; /* Adjust for smaller screens */
          }
          .custom-next {
            right: 20px; /* Adjust for smaller screens */
          }
        }
      `}</style>
        </>
    )
}

export default ProjectsSlider