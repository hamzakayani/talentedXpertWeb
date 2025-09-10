import { Icon } from "@iconify/react/dist/iconify.js";
import heroimg from "../../../public/assets/images/heroimg.svg";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import ImageFallback from "../common/ImageFallback/ImageFallback";
import { useNavigation } from "@/hooks/useNavigation";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight02Icon,
  Location01Icon,
  Search01Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
import cardImg from "../../../public/assets/images/teimg1.png";
import cardImg2 from "../../../public/assets/images/teimg2.png";
import { useSelector } from "react-redux";

const MainDescription = () => {
  const { navigate } = useNavigation();

  const isAuth = useSelector((state: any) => state.auth.isAuthenticated)

  return (
    <section className="herosection">
      <div className="container-fluid">
        <div className="row py-5">
          <div className="col-lg-6">
            <div className="d-flex gap-2 align-items-center mb-2">
              <span className="fs-24">Freelancing For Everybody</span>{" "}
              <HugeiconsIcon icon={VolumeHighIcon} />
            </div>
            <h1 className="mt-2 mb-4 fs-50">
              Connecting TalentRequesters with TalentedXperts who deliver
            </h1>
            <div className="card border-1 border-black rounded-4">
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <label className="mb-0 fw-medium text-black">
                    Find what and where you like:
                  </label>
                  <div className="d-flex gap-3 align-items-center">
                    <div className="form-check form-check-inline m-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="searchType"
                        id="localRadio"
                      />
                      <label
                        className="form-check-label fw-normal fs-16"
                        htmlFor="localRadio"
                      >
                        Finding Local
                      </label>
                    </div>
                    <div className="form-check form-check-inline m-0">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="searchType"
                        id="onlineRadio"
                      />
                      <label
                        className="form-check-label fw-normal fs-16"
                        htmlFor="onlineRadio"
                      >
                        Online
                      </label>
                    </div>
                  </div>
                </div>
                <div className="d-flex mb-3 border border-black rounded-pill">
                  <button
                    className="btn btn-dark rounded-pill flex-fill fw-medium border-0"
                    style={{ minWidth: 0 }}
                  >
                    Find TalentedXperts
                  </button>
                  <button
                    className="btn btn-outline-black rounded-pill border-0 flex-fill fw-medium"
                    style={{ minWidth: 0 }}
                  >
                    Browse Tasks
                  </button>
                </div>
                <div className="input-group rounded-pill border border-gray bg-white px-2 py-1">
                  <input
                    type="text"
                    className="form-control border-0 bg-transparent rounded-pill ps-2 fs-16"
                    placeholder="Search by role, skills, or keywords"
                    style={{ boxShadow: "none" }}
                  />
                  <span className="input-group-text bg-transparent border-0 px-1">
                    <HugeiconsIcon icon={Location01Icon} size={24} />
                  </span>
                  <button
                    className="btn btn-dark rounded-pill px-4 py-1 fw-normal d-flex align-items-center gap-2"
                    type="button"
                  >
                    <HugeiconsIcon icon={Search01Icon} size={16} />
                    Search
                  </button>
                </div>
              </div>
            </div>
            <div className="rounded-pill p-2 bg-gradient1 text-white text-center fs-16 fw-normal mt-3">
              Inclusive by design • Secure payments • Verified reviews • 24/7
              support
            </div>
          </div>
          <div className="col-lg-6">
            <div className="heroimage">
              <Image className="img-fluid" src={heroimg} alt="heroimg" />
            </div>
          </div>
        </div>
        {/* Card Section */}
        {!isAuth && (
          <div className="row">
            <div className="col-lg-6">
              <div className="card bg-gradient2 border-0 rounded-4 overflow-hidden h-100 why-join-card">
                <div className="align-items-baseline card-body d-flex flex-column">
                  <h4 className="my-0">What is TalentedXpert?</h4>
                  <p>
                    TalentedXpert is your all-in-one platform to find the right
                    help, fast. From everyday{" "}
                    <b style={{fontWeight: '600'}}>local services to highly specialized online skills</b>, you
                    can hire verified TalentedXperts who are ready to deliver with
                    professionalism and care.
                  </p>
                  <button className="btn btn-dark rounded-pill d-flex align-items-center gap-2 mt-auto" onClick={() => navigate('/talented-xperts')}>
                    Find your TalentedXpert today{" "}
                    <HugeiconsIcon icon={ArrowRight02Icon} />{" "}
                  </button>
                </div>
                <div className="cardimg d-flex flex-end align-items-end">
                  <Image
                    className="img-fluid"
                    height={340}
                    src={cardImg2}
                    alt="card image"
                  />
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card bg-gradient2 border-0 rounded-4 overflow-hidden h-100 why-join-card">
                <div className="align-items-baseline card-body d-flex flex-column">
                  <h4 className="my-0">Why join TalentedXpert?</h4>
                  <p>
                    Because your <b style={{fontWeight: '600'}}>skills deserve a stage.</b> Whether you’re
                    looking work locally or online - a designer, plumber, or
                    tutor, TalentedXpert gives you a trusted place to showcase
                    your talent, find real opportunities, and get paid fairly.
                  </p>
                  <button className="btn btn-dark rounded-pill d-flex align-items-center gap-2 mt-auto" onClick={() => navigate('/register')}>
                    Start your journey <HugeiconsIcon icon={ArrowRight02Icon} />{" "}
                  </button>
                </div>
                <div className="cardimg d-flex flex-end align-items-end">
                  <Image
                    className="img-fluid"
                    height={340}
                    src={cardImg}
                    alt="card image"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MainDescription;
