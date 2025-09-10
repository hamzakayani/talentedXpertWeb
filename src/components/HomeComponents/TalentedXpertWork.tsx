import { Icon } from "@iconify/react/dist/iconify.js";
import React from "react";
import Image from "next/image";
import cardImg4 from "../../../public/assets/images/card-img4.png";
import cardImg5 from "../../../public/assets/images/card-image5.png";
import cardImg6 from "../../../public/assets/images/card-image6.png";

const TalentedXpertWork = () => {
  return (
    <section className="how_te_works pb-5">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="mb-0 fs-50">How it works</h1>
          </div>
          <div className="d-flex gap-2 rounded-pill overflow-hidden border border-black">
            <button
              className="btn btn-dark rounded-pill px-5"
              aria-current="page"
            >
              TalentXpert
            </button>
            <button className="btn btn-outline-black rounded-pill border-0">
              TalentRequestor
            </button>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4">
            <div className="card bg-gradient2 border-0 rounded-4 overflow-hidden">
              <div className="cardimgwork">
                <Image
                  className="img-fluid"
                  height={340}
                  src={cardImg4}
                  alt="card image"
                />
              </div>
              <div className="card-body">
                <h4>Get Matched</h4>
                <p className="text-black lh-21 fw-normal">
                  Set up your profile and let businesses discover your skills
                  instantly.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card bg-gradient2 border-0 rounded-4 overflow-hidden">
              <div className="cardimgwork">
                <Image
                  className="img-fluid"
                  height={340}
                  src={cardImg5}
                  alt="card image"
                />
              </div>
              <div className="card-body">
                <h4>Do What You Do Best</h4>
                <p className="text-black lh-21 fw-normal">
                  Apply, collaborate, and deliver high-quality work with ease.
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card bg-gradient2 border-0 rounded-4 overflow-hidden">
              <div className="cardimgwork">
                <Image
                  className="img-fluid"
                  height={340}
                  src={cardImg6}
                  alt="card image"
                />
              </div>
              <div className="card-body">
                <h4>Get Paid, Hassle-Free</h4>
                <p className="text-black lh-21 fw-normal">
                  Complete tasks and receive secure payments -quick, reliable,
                  and transparent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TalentedXpertWork;
