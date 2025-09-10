import { Icon } from "@iconify/react/dist/iconify.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { clientTest } from "@/services/helpers/staticdata";
import "swiper/css";
// import "swiper/css/grid";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Grid } from "swiper/modules";
import Image from "next/image";
import ImageFallback from "../ImageFallback/ImageFallback";
import { HugeiconsIcon } from "@hugeicons/react";
import { QuoteUpIcon, SourceCodeSquareIcon } from "@hugeicons/core-free-icons";

const ClientTestimonialSlider = () => {
  return (
    <div>
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        breakpoints={{
          320: {
            slidesPerView: 1,
            spaceBetween: 30,
          },
          575: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          767: {
            slidesPerView: 2,
            spaceBetween: 30,
          },
          991: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1199: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {clientTest.map((data: any) => (
          <SwiperSlide key={data.id}>
            {/* <div className="promoted_card mb-2">
                <div className="card_heading">
                  <div className="userimg">
                    <ImageFallback
                      src={data.src}
                      className="user-img"
                      width={48}
                      height={48}
                      alt="User Image"
                    />
                  </div>
                  <div className="usertext">
                    <p className="mb-1 fs-12 clients-text">{data.name}</p>
                    <p className="fs-12 clients-text">{data.designation}</p>
                  </div>

                  <ImageFallback
                    src="assets/images/quote.svg"
                    alt="User Image"
                    className="ms-auto"
                    width={28}
                    height={28}
                    priority
                  />
                </div>
                <div className="rating">
                  {[...Array(5)].map((_, index) => (
                    <Icon
                      icon="material-symbols-light:kid-star"
                      key={index}
                      className={`text-light me-1 ${
                        index < data.rating ? "rated" : ""
                      }`}
                    />
                  ))}
                </div>
                <p className="line-clamp-3">
                  {data.description} <a href="#">more</a>
                </p>
              </div> */}

            <div className="card border-black rounded-4 overflow-hidden">
              <div className="card-body bg-gradient2 p-4">
                <HugeiconsIcon icon={QuoteUpIcon} />
                <p className="text-black lh-1 fw-normal my-2 line-clamp-4">
                  Haris came in and helped us transfer knowledge from our
                  departing developer, meeting a serious deadline, without fail.
                  His knowledge and experience are exceptional.
                </p>
                <div className="d-flex align-items-center justify-content-between mt-4">
                  <div className="d-flex align-items-center gap-2">
                    <HugeiconsIcon icon={SourceCodeSquareIcon} />{" "}
                    <h6 className="m-0">Dev & IT</h6>
                  </div>
                  <div className="rating">
                    {[...Array(5)].map((_, index) => (
                      <Icon
                        icon="material-symbols-light:kid-star"
                        key={index}
                        className={`text-black-50 me-1 ${
                          index < data.rating ? "rated" : ""
                        }`}
                      />
                    ))}
                    <span className="text-black fs-12">4/5</span>
                  </div>
                </div>
              </div>
              <div className="card-footer bg-white p-4">
                <div className="d-flex align-items-center gap-2">
                  <div className="userimg overflow-hidden rounded-pill">
                    <ImageFallback
                      src={data.src}
                      className="user-img"
                      width={48}
                      height={48}
                      alt="User Image"
                    />
                  </div>
                  <div className="usertext">
                    <p className="mb-0 fs-14 clients-text fw-medium">
                      {data.name}
                    </p>
                    <p className="fs-12 clients-text m-0">{data.designation}</p>
                  </div>

                  <h6 className="ms-auto fs-12 fw-lighter">Apr 7, 2025</h6>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      {/* <div className="custom-prev custom-circle">
          <Icon icon="ph:arrow-left-light" />
        </div>
        <div className="custom-next custom-circle">
          <Icon icon="ph:arrow-right-light" />
        </div> */}

      {/* <style jsx>{`
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
          left: -50px;
        }

        .custom-next {
          right: -50px;
        }

        @media (max-width: 575px) {
          .custom-prev,
          .custom-next {
            font-size: 20px;
          }
          .custom-prev {
            left: 5px;
          }
          .custom-next {
            right: 20px;
          }
        }
      `}</style> */}
    </div>
  );
};

export default ClientTestimonialSlider;
