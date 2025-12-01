"use client";
import React, { useState, useEffect } from "react";
import ImageFallback from "../common/ImageFallback/ImageFallback";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { requests } from "@/services/requests/requests";
import GlobalLoader from "../common/GlobalLoader/GlobalLoader";

interface Term {
  id: string;
  title: string;
  content: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const TermsConditions = () => {
  const [terms, setTerms] = useState<Term[]>([]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["terms"],
    queryFn: async () => {
      const response = await axios.get(
        `${requests.termsList as string}?page=1&limit=50&status=PUBLISHED`
      );
      return response.data;
    },
  });

  useEffect(() => {
    if (data?.data) {
      setTerms(data.data.terms);
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
            <h2 className="text-danger">Error loading terms and conditions</h2>
            <p className="text-muted">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="herosection pb-5">
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

      <div className="container my-5">
        <div className="row">
          <div className="col-12">
            <div className="card shadow-sm rounded-3">
              <div className="card-body p-4">
                <h2 className="text-center mb-4 font20 text-black">
                  {terms?.[0]?.title}
                </h2>

                {terms?.length === 0 ? (
                  <div className="text-center py-5">
                    <h3 className="text-muted">
                      No Terms and Conditions Available
                    </h3>
                    <p className="text-muted">
                      Please check back later for our terms and conditions.
                    </p>
                  </div>
                ) : (
                  <div className="terms-content">
                    {terms.map((term, index) => (
                      <div key={term.id} className="mb-5">
                        {/* <h2 className="h4 text-dark mb-3">{term.title}</h2> */}
                        <div
                          className="text-muted"
                          dangerouslySetInnerHTML={{ __html: term.content }}
                        />
                        {index < terms.length - 1 && <hr className="my-4" />}
                      </div>
                    ))}
                  </div>
                )}

                {/* <div className="text-center mt-5">
                  <p className="text-muted">
                    Last updated: {terms?.length > 0 ? new Date(terms[0].updatedAt).toLocaleDateString() : 'N/A'}
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

export default TermsConditions;
