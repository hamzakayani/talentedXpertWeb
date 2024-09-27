'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Icon } from '@iconify/react';
import userimg from "../../../../public/assets/images/defaultuser.jpg";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

// Import required modules
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import { promotedTE } from '@/services/helpers/staticdata';

const Slider: React.FC = () => {
  return (
    <>
      <Swiper
        navigation={true}
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
        <div className="row">
          {promotedTE.map((data: any) => (
            <SwiperSlide key={data.id}>
              <div className="col" key={data.id}>
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
                  {data.disability && <div className="ribbon-2"><span>Disability</span></div>}
                  <div className="card_heading">
                    <div className="userimg">
                      <Image
                        src={data.src}
                        width={48}
                        height={48}
                        alt="User Image"
                      />
                    </div>
                    <div className="usertext mb-3">
                      <h5>{data.name}</h5>
                      <h6>{data.designation}</h6>
                      <div className="rating">
                        {[...Array(5)].map((_, index) => (
                          // <span
                          //   key={index}
                          //   className={`material-symbols-outlined ${index < data.rating ? "rated" : ""}`}
                          // >
                          //   kid_star
                          // </span>
                          // <Icon key={index} icon="material-symbols-light:kid-star" className={'text-warning me-1 ${index < data.rating ? "rated" : ""}' }/>
                          <Icon icon="material-symbols-light:kid-star" className={`text-light ${index < data.rating ? "rated" : ""}`} />

                        ))}


                      </div>
                    </div>
                  </div>
                  <p className='line-clamp-3'>{data.description} </p>
                  {/* <a href="#">more</a> */}
                  <div className="d-flex align-items-baseline justify-content-between">
                    <h6 className="fs-12">{data.tasks} Tasks</h6>
                    <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                      View Details  <Icon icon="line-md:arrow-right" className='ms-1' />
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </>
  );
};

export default Slider;
