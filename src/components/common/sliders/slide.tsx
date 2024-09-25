'use client'
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Icon } from '@iconify/react';
import userimg from "../../../../public/assets/images/defaultuser.jpg";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// import required modules
import { Navigation } from 'swiper/modules';
import Image from 'next/image';

const Slider: React.FC = () => {
  return (
    <>
      <Swiper navigation={true}
        slidesPerView={3}
        spaceBetween={30}
        slidesPerGroup={1}
        loop={true}
        // navigation={{
        //     prevEl: ".swiper-button-prev.swiper-button-disabled",
        //     nextEl: ".swiper-button-next.swiper-button-disabled",
        // }}
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
        modules={[Navigation]} className="mySwiper">

        <div className="row">
          <SwiperSlide>
            <div className="col">
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
                      src={userimg}
                      width={48}
                      height={48}
                      alt="User Image"
                    />
                  </div>
                  <div className="usertext">
                    <h5>Andrew Smith</h5>
                    <h6>WordPress Developer</h6>
                    <div className="rating">
                      <span className="material-symbols-outlined rated">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined rated">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined rated">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined">
                        kid_star
                      </span>
                    </div>
                  </div>
                </div>
                <p>
                  I am Web developer expert with over eight years of experience
                  in Websites... <a href="">more</a>
                </p>
                <div className="d-flex align-items-baseline justify-content-between">
                  <h6 className="fs-12">85 Tasks</h6>
                  <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                    View Details <Icon icon="material-symbols:arrow-right-alt-rounded" />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="col">
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
                <div className="card_heading">
                  <div className="userimg">
                    <Image
                      src={userimg}
                      width={48}
                      height={48}
                      alt="User Image"
                    />
                  </div>
                  <div className="usertext">
                    <h5>Andrew Smith</h5>
                    <h6>WordPress Developer</h6>
                    <div className="rating">
                      <span className="material-symbols-outlined rated">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined rated">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined rated">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined">
                        kid_star
                      </span>
                    </div>
                  </div>
                </div>
                <p>
                  I am Web developer expert with over eight years of experience
                  in Websites... <a href="">more</a>
                </p>
                <div className="d-flex align-items-baseline justify-content-between">
                  <h6 className="fs-12">144 Tasks</h6>
                  <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                    View Details <Icon icon="material-symbols:arrow-right-alt-rounded" />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="col">
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
                      src={userimg}
                      width={48}
                      height={48}
                      alt="User Image"
                    />
                  </div>
                  <div className="usertext">
                    <h5>Andrew Smith</h5>
                    <h6>WordPress Developer</h6>
                    <div className="rating">
                      <span className="material-symbols-outlined rated">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined rated">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined rated">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined">
                        kid_star
                      </span>
                    </div>
                  </div>
                </div>
                <p>
                  I am Web developer expert with over eight years of experience
                  in Websites... <a href="">more</a>
                </p>
                <div className="d-flex align-items-baseline justify-content-between">
                  <h6 className="fs-12">100 Tasks</h6>
                  <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                    View Details <Icon icon="material-symbols:arrow-right-alt-rounded" />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="col">
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
                      src={userimg}
                      width={48}
                      height={48}
                      alt="User Image"
                    />
                  </div>
                  <div className="usertext">
                    <h5>Andrew Smith</h5>
                    <h6>WordPress Developer</h6>
                    <div className="rating">
                      <span className="material-symbols-outlined rated">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined rated">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined rated">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined">
                        kid_star
                      </span>
                      <span className="material-symbols-outlined">
                        kid_star
                      </span>
                    </div>
                  </div>
                </div>
                <p>
                  I am Web developer expert with over eight years of experience
                  in Websites... <a href="">more</a>
                </p>
                <div className="d-flex align-items-baseline justify-content-between">
                  <h6 className="fs-12">85 Tasks</h6>
                  <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                    View Details <Icon icon="material-symbols:arrow-right-alt-rounded" />
                  </button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </div>
      </Swiper>
    </>
  );
}

export default Slider;
