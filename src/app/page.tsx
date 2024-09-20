import Image from "next/image";
import styles from "./page.module.css";
import heroimg from "../../public/assets/images/heroimg.png";
import userimg from "../../public/assets/images/defaultuser.jpg";
import MainLayout from "@/components/MainLayout";
import { Icon } from '@iconify/react';

export default function Home() {
  return (
    <MainLayout>
      <main className="main">
        <section className="herosection py-5">
          <div className="container">
            <div className="heroimg">
              <Image src={heroimg} alt="Heroimg" />
            </div>
            <div className="hero-content">
              <div className="d-flex justify-content-center">
                <div className="herocard">
                  <h1>Why TalentedXpert</h1>
                  <p>
                    We help build and manage a team of world-class TalentedXpert
                    to
                  </p>
                  <a href="#">
                    Read more
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </a>
                </div>
                <div className="v-divider"></div>
                <div className="herocard">
                  <h1>What is TalentedXpert</h1>
                  <p>
                    We help build and manage a team of world-class TalentedXpert
                    to
                  </p>
                  <a href="#">
                    Read more
                    <span className="material-symbols-outlined">
                      arrow_forward
                    </span>
                  </a>
                </div>
              </div>
              <div className="buttons">
                <button className="btn btn-dark rounded-pill">
                  Find your TalentedXperts
                </button>
                <button className="btn btn-light rounded-pill">
                  Find your next Task
                </button>
                <button className="btn btn-info rounded-pill">Join Us Now</button>
              </div>
            </div>
          </div>
        </section>
        <section className="how_te_works bg-light text-center py-5">
          <div className="container">
            <h2>How TalentedXpert Works</h2>
            <div className="row py-5 mt-5">
              <div className="col col-sm-6 col-lg-3">
                <span className="material-symbols-outlined bg-dark text-white rounded-pill fs-2 p-3 mb-4">
                  group_add
                </span>
                <h6 className="fs-5">Create Profile</h6>
                <div className="victorimgup d-none d-lg-block"></div>
              </div>
              <div className="col col-sm-6 col-lg-3">
                <span className="material-symbols-outlined bg-dark text-white rounded-pill fs-2 p-3 mb-4">
                  approval_delegation
                </span>
                <h6 className="fs-5">Apply For task</h6>
                <div className="victorimgdown d-none d-lg-block"></div>
              </div>
              <div className="col col-sm-6 col-lg-3">
                <span className="material-symbols-outlined bg-dark text-white rounded-pill fs-2 p-3 mb-4">
                  arrow_upload_progress
                </span>
                <h6 className="fs-5">Perform Task</h6>
                <div className="victorimgup d-none d-lg-block"></div>
              </div>
              <div className="col col-sm-6 col-lg-3">
                <span className="material-symbols-outlined bg-dark text-white rounded-pill fs-2 p-3 mb-4">
                  credit_score
                </span>
                <h6 className="fs-5">Receive Payment</h6>
              </div>
            </div>
          </div>
        </section>
        <section className="promoted_te_section bg_black py-5">
          <div className="container">
            <h2 className="text-white mb-4">Promoted TalentedXperts</h2>
            <div className="row">
              <div className="col">
                <div className="promoted_card">
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
                  <h6>85 Tasks</h6>
                </div>
              </div>
              <div className="col">
                <div className="promoted_card">
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
                  <h6>85 Tasks</h6>
                </div>
              </div>
              <div className="col">
                <div className="promoted_card">
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
                  <h6>85 Tasks</h6>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="promoted_te_section py-5">
          <div className="container">
            <h2 className="mb-4">Promoted Tasks</h2>
            <div className="row row-gap-4">
              <div className="col-md-4">
                <div className="promoted_card">
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
                  <h6>85 Tasks</h6>
                </div>
              </div>
              <div className="col-md-4">
                <div className="promoted_card">
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
                  <h6>85 Tasks</h6>
                </div>
              </div>
              <div className="col-md-4">
                <div className="promoted_card">
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
                  <h6>85 Tasks</h6>
                </div>
              </div>
              <div className="col-md-4">
                <div className="promoted_card">
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
                  <h6>85 Tasks</h6>
                </div>
              </div>
              <div className="col-md-4">
                <div className="promoted_card">
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
                  <h6>85 Tasks</h6>
                </div>
              </div>
              <div className="col-md-4">
                <div className="promoted_card">
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
                  <h6>85 Tasks</h6>
                </div>
              </div>
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
              <div className="col-md-4">
                <div className="card bg-dark text-light border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span className="material-symbols-outlined fs-1">devices</span>
                      <h6 className="ms-3 mb-0">Visual Design</h6>
                    </div>
                    <p className="mb-0 text-light">Develop modern and unique user interface designs that
                      captivate users and enhance</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-light text-dark border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span className="material-symbols-outlined fs-1">devices</span>
                      <h6 className="ms-3 mb-0">Visual Design</h6>
                    </div>
                    <p className="mb-0 text-dark">Develop modern and unique user interface designs that
                      captivate users and enhance</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-light text-dark border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span className="material-symbols-outlined fs-1">devices</span>
                      <h6 className="ms-3 mb-0">Visual Design</h6>
                    </div>
                    <p className="mb-0 text-dark">Develop modern and unique user interface designs that
                      captivate users and enhance</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-light text-dark border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span className="material-symbols-outlined fs-1">devices</span>
                      <h6 className="ms-3 mb-0">Visual Design</h6>
                    </div>
                    <p className="mb-0 text-dark">Develop modern and unique user interface designs that
                      captivate users and enhance</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-light text-dark border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span className="material-symbols-outlined fs-1">devices</span>
                      <h6 className="ms-3 mb-0">Visual Design</h6>
                    </div>
                    <p className="mb-0 text-dark">Develop modern and unique user interface designs that
                      captivate users and enhance</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-light text-dark border-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <span className="material-symbols-outlined fs-1">devices</span>
                      <h6 className="ms-3 mb-0">Visual Design</h6>
                    </div>
                    <p className="mb-0 text-dark">Develop modern and unique user interface designs that
                      captivate users and enhance</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="buttondiv text-end mt-4">
              <button className="btn btn-info rounded-pill">View All</button>
            </div>
          </div>
        </section>
        <section className="promoted_te_section bg_black py-5">
          <div className="container">
            <h2 className="text-white mb-4">Clients Testimonial</h2>
            <div className="row">
              <div className="col">
                <div className="promoted_card">
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
                  <h6>85 Tasks</h6>
                </div>
              </div>
              <div className="col">
                <div className="promoted_card">
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
                  <h6>85 Tasks</h6>
                </div>
              </div>
              <div className="col">
                <div className="promoted_card">
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
                  <h6>85 Tasks</h6>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="become-section py-5">
          <div className="container">
            <div className="row">
              <div className="col-md-6">
                <div className="card bg-become-expert">
                  <div className="card-body">
                    <div className="row">
                      <div className="col-8">
                        <h5 className="fw-bold">Become a TalentedXpert</h5>
                        <p>Master your craft by honing your skills, staying updated, and providing expert solutions in your field</p>
                        <button className="btn btn-info rounded-pill">Register Now</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card bg-become-requester">
                  <div className="card-body">
                    <div className="row text-light">
                      <div className="col-8">
                        <h5 className="fw-bold">Become a TalentedXpert</h5>
                        <p className="text-light">Master your craft by honing your skills, staying updated, and providing expert solutions in your field</p>
                        <button className="btn btn-info rounded-pill">Register Now</button>
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
