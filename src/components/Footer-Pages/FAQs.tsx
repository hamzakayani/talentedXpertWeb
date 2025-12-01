"use client";
import React, { useState, useEffect } from "react";
import ImageFallback from "../common/ImageFallback/ImageFallback";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { requests } from "@/services/requests/requests";
import GlobalLoader from "../common/GlobalLoader/GlobalLoader";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const FAQs = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["faqs"],
    queryFn: async () => {
      const response = await axios.get(
        `${requests.faqList as string}?page=1&limit=50&status=PUBLISHED`
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (data?.data) {
      setFaqs(data.data.faqs);
    }
  }, [data]);

  if (isLoading) {
    return <GlobalLoader />;
  }

  if (error) {
    return (
      <section className="herosection forpadding pb-5">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="text-danger">Error loading FAQs</h2>
            <p className="text-muted">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="herosection  pb-5">
      <div className="container-fluid p-0">
        {/* <div id="carouselExampleAutoplaying" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <ImageFallback
                src="/assets/images/heroimg.png"
                alt="img"
                className="img-fluid mb-3"
                width={1920}
                height={350}
                priority
              />
            </div>
            <div className="carousel-item">
              <ImageFallback
                src="/assets/images/heroimg2.png"
                alt="img"
                className="img-fluid mb-3"
                width={1920}
                height={350}
                priority
              />
            </div>
            <div className="carousel-item">
              <ImageFallback
                src="/assets/images/heroimg3.png"
                alt="img"
                className="img-fluid mb-3"
                width={1920}
                height={350}
                priority
              />
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleAutoplaying" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div> */}
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm rounded-3 mt-5">
              <div className="card-body p-4">
                <h2 className="text-center mb-4 font20 text-black">
                  Frequently Asked Questions
                </h2>

                {faqs?.length === 0 ? (
                  <div className="text-center py-5">
                    <h3 className="text-muted">No FAQs Available</h3>
                    <p className="text-muted">
                      Please check back later for frequently asked questions.
                    </p>
                  </div>
                ) : (
                  <div className="accordion faq-content" id="faqAccordion">
                    {faqs.map((faq, index) => (
                      <div
                        key={faq.id}
                        className="accordion-item mb-3"
                        style={{ border: "none" }}
                      >
                        <h2 className="accordion-header" id={`heading${index}`}>
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#collapse${index}`}
                            aria-expanded="false"
                            aria-controls={`collapse${index}`}
                            style={{
                              backgroundColor: "white",
                              color: "black",
                              border: "none",
                              borderBottom: "1px solid #dee2e6",
                              boxShadow: "none",
                              outline: "none",
                            }}
                            onFocus={(e) => {
                              e.target.style.backgroundColor = "white";
                              e.target.style.color = "black";
                              // @ts-ignore - style is fine for runtime, not all props typed
                              e.target.style.boxShadow = "none";
                              // @ts-ignore
                              e.target.style.outline = "none";
                            }}
                            onBlur={(e) => {
                              e.target.style.backgroundColor = "white";
                              e.target.style.color = "black";
                              // @ts-ignore
                              e.target.style.boxShadow = "none";
                              // @ts-ignore
                              e.target.style.outline = "none";
                            }}
                          >
                            <strong>{faq.question}</strong>
                          </button>
                        </h2>
                        <div
                          id={`collapse${index}`}
                          className="accordion-collapse collapse"
                          aria-labelledby={`heading${index}`}
                          data-bs-parent="#faqAccordion"
                          style={{ border: "none" }}
                        >
                          <div className="accordion-body">
                            <div
                              className="text-muted"
                              dangerouslySetInnerHTML={{ __html: faq.answer }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* <div className="text-center mt-5">
                  <p className="text-muted">
                    Last updated: {faqs?.length > 0 ? new Date(faqs[0].updatedAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQs;
