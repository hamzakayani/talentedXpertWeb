"use client";
import { useFetchDisputePolicy } from "@/hooks/disputes/useDisputes";
import React from "react";
import GlobalLoader from "../common/GlobalLoader/GlobalLoader";
import HtmlData from "../common/HtmlData/HtmlData";

const DisputePolicies = () => {
  const fetchDisputePolicy = useFetchDisputePolicy();

  if (fetchDisputePolicy.isLoading) {
    return <GlobalLoader />;
  }

  if (fetchDisputePolicy.error) {
    return (
      <section className="herosection pb-5">
        <div className="container">
          <div className="text-center py-5">
            <h2 className="text-danger">Error loading dispute policies</h2>
            <p className="text-muted">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="herosection pb-5">
      <div className="container">
        <div className="row">
          <div className="col-12 ">
            <div className="card shadow-sm rounded-3 my-5">
              <div className="card-body p-4">
                <h2 className="text-center mb-4 font20 text-black">
                  {fetchDisputePolicy?.data?.data?.policies?.[0]?.title || ""}
                </h2>
                <HtmlData
                  data={
                    fetchDisputePolicy?.data?.data?.policies?.[0]?.content ||
                    "No content found yet"
                  }
                  className="text-muted mb-4"
                  isDark
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DisputePolicies;
