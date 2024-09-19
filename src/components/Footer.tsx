import React from "react";
import Image from "next/image";
import { Icon } from '@iconify/react';



function Footer() {
  return <footer className="footer-section">
    <div className="container-fluid">
      <div className="row bg-dark pt-5 px-5">
        <div className="col-12 text-white">
          <div className="row">
            <div className="col-md-4">
              <Image
                src="/assets/images/footer-logo.svg"
                alt="img"
                className="img-fluid mb-3"
                width={255}
                height={255}
                priority
              />
              <h6>Call now:(319) 555-0115</h6>
              <p className="text-white fs-12">6391 Elgin St. Celina, Delaware 10299, New <br />York, United States of America</p>
            </div>
            <div className="col-md-2">
              <h6 className="mb-4">Quick Link</h6>
              <p className="text-white fs-14 footer-text">About</p>
              <p className="text-white fs-14 footer-text">Projects</p>
              <p className="text-white fs-14 footer-text">Blog</p>
              <p className="text-white fs-14 footer-text">Dispute</p>
            </div>
            <div className="col-md-2">
              <h6 className="mb-4">TalentedXpert</h6>
              <p className="text-white fs-14 footer-text">Task</p>
              <p className="text-white fs-14 footer-text">TalentedXpert</p>
              <p className="text-white fs-14 footer-text">TalentedRequester</p>
              <p className="text-white fs-14 footer-text">Articles</p>
            </div>
            <div className="col-md-2">
              <h6 className="mb-4">TalentedRequester</h6>
              <p className="text-white fs-14 footer-text">Post a Task</p>
              <p className="text-white fs-14 footer-text">Browse TalentedXpert</p>
              <p className="text-white fs-14 footer-text">TalentedRequester Profile</p>
              <p className="text-white fs-14 footer-text">Applications</p>
            </div>
            <div className="col-md-2">
              <h6 className="mb-4">Contact</h6>
              <p className="text-white fs-14 footer-text">FAQs</p>
              <p className="text-white fs-14 footer-text">Privacy Policy</p>
              <p className="text-white fs-14 footer-text">Terms & Conditions</p>
            </div>
            <div className="border-bottom"></div>
            <div className="col-12">
              <div className="d-flex justify-content-between pt-2 pe-3 mb-2">
                <p className="text-white fs-10 mb-0">@ 2024 TalentedXpert. All rights Reserved</p>
                <div className="d-flex">
                  <Icon icon="ri:facebook-fill" className="me-2"/>
                  <Icon icon="iconoir:youtube" className="me-2"/>
                  <Icon icon="lets-icons:insta" className="me-2"/>
                  <Icon icon="mdi:twitter" className="me-2"/>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  </footer>;
}

export default Footer;
