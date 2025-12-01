"use client";
import React, { useEffect, useState } from "react";
import ImageFallback from "../common/ImageFallback/ImageFallback";
import { useFetchAboutUs } from "@/hooks/about-us/useAboutUs";
import GlobalLoader from "../common/GlobalLoader/GlobalLoader";
import HtmlData from "../common/HtmlData/HtmlData";
import clientImg from "../../../public/assets/images/client-img.png";
import clientImg2 from "../../../public/assets/images/client2-img.png";
import clientImg3 from "../../../public/assets/images/kashif.jpg";

const ContactUs = () => {
  return (
    <section className="herosection pb-5">
      <div className="container-fluid p-0">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm rounded-3 my-5">
                <div className="card-body p-4">
                  <h2 className="text-center mb-4 font20 text-black">
                    Contact Us
                  </h2>
                  <div className="row">
                    <div className="col-12 col-md-6 mb-4">
                      <div className="form-floating">
                        <input
                          className="form-control "
                          id="firstName"
                          placeholder="e.g. John"
                          maxLength={50}
                          type="text"
                          name="firstName"
                        />
                        <label htmlFor="firstName">First Name</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-6 mb-4">
                      <div className="form-floating">
                        <input
                          className="form-control "
                          id="lastName"
                          placeholder="e.g. John"
                          maxLength={50}
                          type="text"
                          name="lastName"
                        />
                        <label htmlFor="lastName">Last Name</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-12 mb-4">
                      <div className="form-floating">
                        <input
                          className="form-control "
                          id="email"
                          placeholder="e.g. John"
                          maxLength={50}
                          type="text"
                          name="email"
                        />
                        <label htmlFor="email">Email</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-12 mb-4">
                      <div className="form-floating textarea-field">
                        <textarea
                          className="form-control"
                          id="message"
                          placeholder="e.g. Your message"
                          maxLength={500}
                          name="message"
                          rows={5}
                          cols={3}
                          // style={{ height: "150px" }}
                        ></textarea>
                        <label htmlFor="message">Comments</label>
                      </div>
                    </div>
                    <div className="col-12 col-md-12 text-end">
                      <button
                        className="btn btn-dark px-4 py-2 ms-auto"
                        type="submit"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
