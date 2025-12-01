"use client";
import React, { useEffect, useState } from "react";
import ImageFallback from "../common/ImageFallback/ImageFallback";
import { useFetchAboutUs } from "@/hooks/about-us/useAboutUs";
import GlobalLoader from "../common/GlobalLoader/GlobalLoader";
import HtmlData from "../common/HtmlData/HtmlData";
import clientImg from "../../../public/assets/images/client-img.png";
import clientImg2 from "../../../public/assets/images/client2-img.png";
import clientImg3 from "../../../public/assets/images/kashif.jpg";

const About = () => {
  // Fetch about us data using the custom hook
  const fetchAboutUsQuery = useFetchAboutUs();

  if (fetchAboutUsQuery?.isLoading) {
    return <GlobalLoader />;
  }

  if (fetchAboutUsQuery?.error) {
    return (
      <section className="herosection forpadding pb-5">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="text-danger">Error loading about us information</h2>
            <p className="text-muted">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="herosection  pb-5">
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm rounded-3 my-5">
              <div className="card-body p-4">
                <h2 className="text-center mb-4 font20 text-black">About Us</h2>
                {/* <h2 className="mb-4">{fetchAboutUsQuery?.data?.data?.aboutus?.[0]?.title || ''}</h2> */}
                <HtmlData
                  data={
                    fetchAboutUsQuery?.data?.data?.aboutus?.[0]?.content ||
                    "No content found yet"
                  }
                  className="text-muted mb-4"
                  isDark
                />
                <div className="d-flex justify-content-center align-items-center mb-4 flex-wrap">
                  <div>
                    <div className="border rounded-circle p-2">
                      <ImageFallback
                        src={clientImg}
                        alt="Client Image"
                        width={150}
                        height={150}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="text-center mt-2">
                      <h6 className="m-0">Mojahed Qashoa</h6>
                      <small className="text-muted">Co-founder & CEO</small>
                    </div>
                  </div>
                  <div>
                    <div className="border rounded-circle p-2">
                      <ImageFallback
                        src={clientImg2}
                        alt="Client Image"
                        width={150}
                        height={150}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="text-center mt-2">
                      <h6 className="m-0">Nada Qashoa</h6>
                      <small className="text-muted">Co-founder</small>
                    </div>
                  </div>
                  <div>
                    <div className="border rounded-circle p-2">
                      <ImageFallback
                        src={clientImg3}
                        alt="Client Image"
                        width={150}
                        height={150}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                    </div>
                    <div className="text-center mt-2">
                      <h6 className="m-0">Kashif</h6>
                      <small className="text-muted">
                        Director & Co-founder
                      </small>
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

export default About;
