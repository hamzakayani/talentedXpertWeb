"use client";
import { useFetchCategories } from "@/hooks/home/useHome";
import { useNavigation } from "@/hooks/useNavigation";
import {
  Agreement01Icon,
  ArrowRight02Icon,
  Calendar02Icon,
  ChartHistogramIcon,
  CustomerSupportIcon,
  GlobalEducationIcon,
  MarketingIcon,
  MentoringIcon,
  MicrosoftAdminIcon,
  PaintBoardIcon,
  RepairIcon,
  SourceCodeSquareIcon,
  TeachingIcon,
  UserStatusIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React from "react";

const Categories = () => {
  const getCategories = useFetchCategories();

  const { navigate } = useNavigation();

  const categories = getCategories?.data?.data?.categories || [];

  const icons = [
    SourceCodeSquareIcon,
    // PaintBoardIcon,
    Calendar02Icon,
    TeachingIcon,
    // MarketingIcon,
    // MicrosoftAdminIcon,
    MentoringIcon,
    ChartHistogramIcon,
    RepairIcon,
    GlobalEducationIcon,
    CustomerSupportIcon,
    UserStatusIcon,
    Agreement01Icon,
  ];

  return (
    <section className="categories_te_section py-3 py-md-5">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h1 className="mb-0 fs-50">Talent Categories</h1>
            <p className="fw-normal mt-1">
              {/* Looking for work?{" "} */}
              {/* <a
                href="/tasks"
                onClick={() => navigate('/tasks')}
                className="text-decoration-underline text-black fw-medium"
                style={{marginLeft: '5px'}}
              >
                Browse tasks
              </a> */}
            </p>
          </div>
          {/* <div className="d-flex gap-2 rounded-pill overflow-hidden border border-black">
            <button
              className="btn btn-dark rounded-pill px-5"
              aria-current="page"
            >
              Online
            </button>
            <button className="btn btn-outline-black rounded-pill border-0 px-5">
              Onsite
            </button>
          </div> */}
        </div>
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 row-cols-xl-5 row-gap-3">
          {categories?.length <= 10 &&
            categories.map((item: any, idx: number) => (
              <div className="col" key={idx}>
                <div className="card p-2 border-black">
                  <HugeiconsIcon icon={icons[idx % icons.length]} size={40} />
                  <h4 className="mt-2 fw-normal">{item.name}</h4>
                </div>
              </div>
            ))}
          {/* <div className="col">
            <div className="card p-3 border-black">
              <HugeiconsIcon icon={SourceCodeSquareIcon} size={40} />
              <h4 className="mt-2 fw-normal">Development & IT</h4>
            </div>
          </div>
          <div className="col">
            <div className="card p-3 border-black">
              <HugeiconsIcon icon={PaintBoardIcon} size={40} />
              <h4 className="mt-2 fw-normal">Design & Creatives</h4>
            </div>
          </div>
          <div className="col">
            <div className="card p-3 border-black">
              <HugeiconsIcon icon={MarketingIcon} size={40} />
              <h4 className="mt-2 fw-normal">Sales & Marketing</h4>
            </div>
          </div>
          <div className="col">
            <div className="card p-3 border-black">
              <HugeiconsIcon icon={MicrosoftAdminIcon} size={40} />
              <h4 className="mt-2 fw-normal">Cyber Security</h4>
            </div>
          </div>
          <div className="col">
            <div className="card p-3 border-black">
              <HugeiconsIcon icon={ChartHistogramIcon} size={40} />
              <h4 className="mt-2 fw-normal">Financial Services</h4>
            </div>
          </div>
          <div className="col">
            <div className="card p-3 border-black">
              <HugeiconsIcon icon={SourceCodeSquareIcon} size={40} />
              <h4 className="mt-2 fw-normal">Development & IT</h4>
            </div>
          </div>
          <div className="col">
            <div className="card p-3 border-black">
              <HugeiconsIcon icon={PaintBoardIcon} size={40} />
              <h4 className="mt-2 fw-normal">Design & Creatives</h4>
            </div>
          </div>
          <div className="col">
            <div className="card p-3 border-black">
              <HugeiconsIcon icon={MarketingIcon} size={40} />
              <h4 className="mt-2 fw-normal">Sales & Marketing</h4>
            </div>
          </div>
          <div className="col">
            <div className="card p-3 border-black">
              <HugeiconsIcon icon={MicrosoftAdminIcon} size={40} />
              <h4 className="mt-2 fw-normal">Cyber Security</h4>
            </div>
          </div>
          <div className="col">
            <div className="card p-3 border-black">
              <HugeiconsIcon icon={ChartHistogramIcon} size={40} />
              <h4 className="mt-2 fw-normal">Financial Services</h4>
            </div>
          </div> */}
        </div>
        <div className="findtalent">
          <h5 className="text-white fw-normal">TalentRequestors</h5>
          <div className="bottomtext">
            <h1 className="fs-50">Find TalentXperts Your Way</h1>
            <p>
              TalentedXpert has been designed to support local economies by
              onshoring professional talent service offerings.
            </p>
            <button
              className="btn btn-outline-light rounded-pill fs-18 fw-medium w-auto"
              onClick={() => navigate("/talented-xperts")}
            >
              Start Your Journey <HugeiconsIcon icon={ArrowRight02Icon} />
            </button>
          </div>
        </div>
        <div className="buttondiv text-end mt-4"></div>
      </div>
    </section>
  );
};

export default Categories;
