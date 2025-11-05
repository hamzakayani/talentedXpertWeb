"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useNavigation } from "@/hooks/useNavigation";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import PromotedTaskCard from "@/components/common/cards/PromotedTaskCard";
import {
  useFetchPromotedTasks,
  useFetchTalentedXperts,
} from "@/hooks/home/useHome";
import NoFound from "../common/NoFound/NoFound";

const PromotedTasks = () => {
  const getTalentedXpert = useFetchTalentedXperts();
  const getPromotedTasks = useFetchPromotedTasks();
  const [activeTab, setActiveTab] = useState<"talentedxpert" | "promoted">(
    "talentedxpert"
  );

  const { navigate } = useNavigation();

  // Data select based on active tab
  const tasks =
    activeTab === "talentedxpert"
      ? getTalentedXpert?.data?.data?.users || []
      : getPromotedTasks?.data?.data?.tasks || [];

  const isLoading =
    activeTab === "talentedxpert"
      ? getTalentedXpert.isLoading
      : getPromotedTasks.isLoading;

  return (
    <section className="promoted_te_section pb-5">
      <div className="container-fluid">
        <div className="d-flex flex-column flex-md-row gap-3 align-items-center justify-content-between mb-4">
          <div>
            <h1 className="mb-0 fs-50">Sponsored Talent and Tasks</h1>
          </div>
          <div className="d-flex gap-2 rounded-pill overflow-hidden border border-black">
            <button
              // className={`btn btn-dark rounded-pill px-5`}
              className={`btn rounded-pill ${
                activeTab === "talentedxpert" ? "btn-dark" : "btn-outline-black"
              }`}
              aria-current="page"
              onClick={() => setActiveTab("talentedxpert")}
            >
              TalentedXpert
            </button>
            <button
              // className={`btn btn-outline-black rounded-pill border-0`}
              className={`btn rounded-pill border-0 ${
                activeTab === "promoted" ? "btn-dark" : "btn-outline-black"
              }`}
              onClick={() => setActiveTab("promoted")}
            >
              Tasks
            </button>
          </div>
        </div>
        <div className="row row-gap-2 row-gap-md-4">
          {isLoading && <p>Loading...</p>}
          {!isLoading && tasks?.length > 0 ? (
            tasks?.map((data: any) => (
              <div className="col-md-6 col-lg-6 col-xl-4" key={data.id}>
                <PromotedTaskCard
                  data={data}
                  activeTab={activeTab}
                  btn={"View Details"}
                />
              </div>
            ))
          ) : !isLoading && tasks?.length === 0 ? (
            <NoFound
              message={`No Record Found`}
              className={"col-12 fw-normal text-center"}
              isDark={true}
              fs={"fs-16"}
            />
          ) : null}
        </div>
        <div className="mt-4 d-flex align-items-center">
          {!isLoading && tasks?.length > 0 && tasks?.length <= 6 && (
            <Link
              className="btn btn btn-outline-dark w-auto rounded-pill fs-18 m-auto fw-semibold"
              href={
                activeTab === "talentedxpert" ? "/talented-xperts" : "/tasks"
              }
              onClick={() =>
                navigate(
                  activeTab === "talentedxpert" ? "/talented-xperts" : "/tasks"
                )
              }
            >
              View More <HugeiconsIcon icon={ArrowRight02Icon} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default PromotedTasks;
