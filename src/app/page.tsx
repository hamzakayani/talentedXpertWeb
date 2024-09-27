import Image from "next/image";
import styles from "./page.module.css";
import heroimg from "../../public/assets/images/heroimg.png";
import userimg from "../../public/assets/images/defaultuser.jpg";
import MainLayout from "@/components/MainLayout";
import { Icon } from '@iconify/react';
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import Slider from "@/components/common/sliders/slide";
import { category, clientTest, promotedTasks } from "@/services/helpers/staticdata";

export default function Home() {

  return (

    <MainLayout>
      <main className="main">
        <section className="herosection py-5">
          <div className="container">
            <div className="heroimg">
              <Image src={heroimg} alt="Heroimg" className="hero-img" />
            </div>
            <div className="hero-content">
              <div className="d-flex justify-content-center flex-wrap">
                <div className="herocard">
                  <h1>Why TalentedXpert</h1>
                  <p>
                    We help build and manage a team of world-class TalentedXpert
                    to
                  </p>
                  <a href="#">
                    Read more
                    {/* <span className="material-symbols-outlined">
                      arrow_forward
                    </span> */}
                    <Icon icon="line-md:arrow-right" />
                  </a>
                </div>
                <div className="v-divider d-block"></div>
                <div className="herocard">
                  <h1>What is TalentedXpert</h1>
                  <p>
                    We help build and manage a team of world-class TalentedXpert
                    to
                  </p>
                  <a href="#">
                    Read more
                    {/* <span className="material-symbols-outlined">
                      arrow_forward
                    </span> */}
                    <Icon icon="line-md:arrow-right" />
                  </a>
                </div>
              </div>
              <div className="buttons">
                <button className="btn btn-dark rounded-pill hero-btn">
                  Find your TalentedXperts
                </button>
                <button className="btn btn-light rounded-pill hero-btn">
                  Find your next Task
                </button>
                <button className="btn btn-info rounded-pill hero-btn">Join Us Now</button>
              </div>
            </div>
          </div>
        </section>
        <section className="how_te_works bg-light text-center py-5">
          <div className="container">
            <h2>How TalentedXpert Works</h2>
            <div className="row py-5 mt-5">
              <div className="col col-sm-6 col-lg-3">
                {/* <span className="material-symbols-outlined bg-dark text-white rounded-pill fs-2 p-3 mb-4">
                  group_add
                </span> */}
                <div className=" material-symbols-outlined bg-dark rounded-pill  p-3 mb-4 material-icn">
                  <Icon icon="octicon:person-add-24" className="text-light fs-3 d-flex" />
                </div>
                <h6 className="fs-5">Create Profile</h6>
                <div className="victorimgup d-none d-lg-block"></div>
              </div>
              <div className="col col-sm-6 col-lg-3">
                {/* <span className="material-symbols-outlined bg-dark text-white rounded-pill fs-2 p-3 mb-4">
                  approval_delegation
                </span> */}
                <div className=" material-symbols-outlined bg-dark rounded-pill  p-3 mb-4 material-icn">
                  <Icon icon="ph:cloud-arrow-up" className="text-light fs-3 d-flex" />
                </div>
                <h6 className="fs-5">Apply For task</h6>
                <div className="victorimgdown d-none d-lg-block"></div>
              </div>
              <div className="col col-sm-6 col-lg-3">
                {/* <span className="material-symbols-outlined bg-dark text-white rounded-pill fs-2 p-3 mb-4">
                  arrow_upload_progress
                </span> */}
                <div className=" material-symbols-outlined bg-dark rounded-pill  p-3 mb-4 material-icn">
                  <Icon icon="mdi:search-add-outline" className="text-light fs-3 d-flex" />
                </div>
                <h6 className="fs-5">Perform Task</h6>
                <div className="victorimgup d-none d-lg-block"></div>
              </div>
              <div className="col col-sm-6 col-lg-3">
                {/* <span className="material-symbols-outlined bg-dark text-white rounded-pill fs-2 p-3 mb-4">
                  credit_score
                </span> */}
                <div className=" material-symbols-outlined bg-dark rounded-pill  p-3 mb-4 material-icn">
                  <Icon icon="majesticons:settings-cog-check-line" className="text-light fs-3 d-flex" />
                </div>
                <h6 className="fs-5">Receive Payment</h6>
              </div>
            </div>
          </div>
        </section>
        <section className="promoted_te_section bg_black py-5">
          <div className="container">
            <h2 className="text-white mb-4">Promoted TalentedXperts</h2>
            <Slider />
          </div>
        </section>
        <section className="promoted_te_section py-5">
          <div className="container">
            <h2 className="mb-4">Promoted Tasks</h2>
            <div className="row row-gap-4">
              {promotedTasks.map((data: any) => (
                <div className="col-md-6 col-lg-4" key={data.id}>
                  <div className="promoted_card mb-2">
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

                    <div className="usertext">
                      <h5 className="mb-0">{data.designation}</h5>
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <p className="fs-12 mb-0">{data.workingSlot} <span className="ms-2">{data.country}</span><span className="ms-2">{data.status}</span></p>
                        <p className="text-white fw-medium mb-0">${data.rate}/ hr</p>
                      </div>
                      <div className="rating">
                        {[...Array(5)].map((_, index) => (
                          // <span
                          //   key={index}
                          //   className={`material-symbols-outlined ${index < data.rating ? "rated" : ""}`}
                          // >
                          //   kid_star
                          // </span>
                        <Icon icon="material-symbols-light:kid-star"  className={`text-light ${index < data.rating ? "rated" : ""}`}/>

                        ))}
                      </div>
                    </div>
                    <p className="line-clamp-3">
                      {data.description}
                      {/* <a href="">more</a> */}
                    </p>
                    <div className="d-flex align-items-baseline justify-content-between">
                      <h6 className="fs-12 text-secondary">{data.task_age} days ago</h6>
                      <button className="btn btn-outline-info rounded-pill text-white fs-10 btn-sm">
                        Apply Now <Icon icon="line-md:arrow-right" className='ms-1' />
                      </button>
                    </div>

                  </div>

                </div>
              ))}
            </div>
            <div className="buttondiv text-end mt-4">
              <button className="btn btn-info rounded-pill">View All</button>
            </div>
          </div>
        </section>
        <section className="categories_te_section bg_tertiary py-5">
          <div className="container">
            <h2 className="mb-4">Categories</h2>

            <div className="row row-gap-4">
              {category.map((data: any) => (
                <div className="col-md-4" key={data.id}>
                  <div className={`card ${data.isDark ? "bg-dark text-light" : "bg-light text-dark"}  border-0`}>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        {/* <span className="material-symbols-outlined fs-1">devices</span> */}
                        <Icon icon="tdesign:device" className="fs-1"/>
                        <h6 className="ms-3 mb-0">{data.categoryName}</h6>
                      </div>
                      <p className={`line-clamp-3 mb-0 ${data.isDark ? "text-light" : ""}`}>{data.description}</p>
                    </div>
                  </div>

                </div>
              ))}
            </div>
            <div className="buttondiv text-end mt-4">
              <button className="btn btn-info rounded-pill">View All</button>
            </div>
          </div>
        </section>
        <section className="promoted_te_section bg_black py-5">
          <div className="container">
            <h2 className="text-white text-center mb-4">Clients Testimonial</h2>

            <div className="row">
              {clientTest.map((data: any) => (
                <div className="col" key={data.id} >

                  <div className="promoted_card mb-2">
                    <div className="card_heading">
                      <div className="userimg">
                        <Image
                          src={data.src}
                          width={48}
                          height={48}
                          alt="User Image"
                        />
                      </div>
                      <div className="usertext">
                        <p className="mb-1 fs-12">{data.name}</p>
                        <p className="fs-12">{data.designation}</p>

                      </div>
                      <Icon icon="material-symbols:format-quote" className="text-white ms-auto comma-icn" />
                    </div>
                    <div className="rating">
                      {[...Array(5)].map((_, index) => (
                        // <span
                        //   key={index}
                        //   className={`material-symbols-outlined ${index < data.rating ? "rated" : ""}`}
                        // >
                        //   kid_star
                        // </span>
                        <Icon icon="material-symbols-light:kid-star"  className={`text-light ${index < data.rating ? "rated" : ""}`}/>

                      ))}
                    </div>
                    <p className="line-clamp-3">
                      {data.description} <a href="">more</a>
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </section>
        <section className="become-section py-5">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 mb-2">
                <div className="card bg-become-expert">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-8">
                        <h5 className="fw-bold">Become a TalentedXpert</h5>
                        <p>Master your craft by honing your skills, staying updated, and providing expert solutions in your field</p>
                        <button className="btn btn-info rounded-pill">Register Now <Icon icon="material-symbols:arrow-right-alt-rounded" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 mb-2">
                <div className="card bg-become-requester">
                  <div className="card-body">
                    <div className="row text-light">
                      <div className="col-8">
                        <h5 className="fw-bold">Become a TalentedXpert</h5>
                        <p className="text-light">Master your craft by honing your skills, staying updated, and providing expert solutions in your field</p>
                        <button className="btn btn-info rounded-pill">Register Now <Icon icon="material-symbols:arrow-right-alt-rounded" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </MainLayout>
  );
}
