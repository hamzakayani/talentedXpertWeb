"use client";
import { useNavigation } from "@/hooks/useNavigation";
import apiCall from "@/services/apiCall/apiCall";
import { category } from "@/services/helpers/staticdata";
import { requests } from "@/services/requests/requests";
import { RootState, useAppDispatch } from "@/store/Store";
import {
  ArrowRight02Icon,
  ChartHistogramIcon,
  MarketingIcon,
  MicrosoftAdminIcon,
  PaintBoardIcon,
  SourceCodeSquareIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Categories = () => {
  const [categories, setcategories] = useState<any>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { navigate } = useNavigation()
  const user = useSelector((state: RootState) => state.user);

  const getCategory = async (level: number) => {
    await apiCall(
      `${requests.getCategory}?level=${level}`,
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        setcategories(res?.data?.data?.categories || []);
      })
      .catch((err) => console.warn(err));
  };

  useEffect(() => {
    getCategory(1);
  }, []);

  return (
    <section className="categories_te_section py-5">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h1 className="mb-0 fs-50">Skill Categories</h1>
            <p className="fw-normal mt-1">
              Looking for work?{" "}
              <a
                href=""
                className="text-decoration-underline text-black fw-medium"
              >
                Browse tasks
              </a>
            </p>
          </div>
          <div className="d-flex gap-2 rounded-pill overflow-hidden border border-black">
            <button
              className="btn btn-dark rounded-pill px-5"
              aria-current="page"
            >
              Online
            </button>
            <button className="btn btn-outline-black rounded-pill border-0 px-5">
              Local
            </button>
          </div>
        </div>
        <div className="row row-cols-5 row-gap-4">
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
          </div>
        </div>
        <div className="findtalent">
          <h6>TalentRequestors</h6>
          <div className="bottomtext">
            <h1 className="fs-50">Find TalentXperts your way</h1>
            <p>
              Work with the largest network of independent professionals locally
              and online - get things done from quick turnarounds to big
              transformations.
            </p>
            <button className="btn btn-outline-light rounded-pill fs-18 fw-medium w-auto" onClick={() => navigate('/talented-xperts')}>
              Hire Now <HugeiconsIcon icon={ArrowRight02Icon} />
            </button>
          </div>
        </div>
        {/* <div className="row row-gap-4">
          {categories?.length <= 6 &&
            categories?.map((data: any, index: number) => (
              <div className="col-md-4" key={data.id}>
                <div
                  className={`card ${
                    data.isDark ? "bg-dark text-light" : "bg-light text-dark"
                  }  border-0`}
                >
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <Icon icon={category[index].icon} className="fs-1" />
                      <h6 className="ms-3 mb-0">{data.name}</h6>
                    </div>
                    <p
                      className={`line-clamp-3 mb-0 ${
                        data.isDark ? "text-light" : ""
                      }`}
                    >
                      {category[index].description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </div> */}
        <div className="buttondiv text-end mt-4">
          {/* {categories?.length <= 6 && <button className="btn btn-info rounded-pill">View All</button>} */}
        </div>
      </div>
    </section>
  );
};

export default Categories;
