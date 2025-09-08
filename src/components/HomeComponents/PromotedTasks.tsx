import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { getTimeago } from "@/services/utils/util";
import { RootState, useAppDispatch } from "@/store/Store";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import HtmlData from "../common/HtmlData/HtmlData";
import ImageFallback from "../common/ImageFallback/ImageFallback";
import { useNavigation } from "@/hooks/useNavigation";
import RatingStar from "../common/RatingStar/RatingStar";
import Image from "next/image";
import userimg from "../../../public/assets/images/default-user.jpg";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const PromotedTasks = () => {
  const [tasks, setTasks] = useState<any>([]);

  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

  const router = useRouter();
  const { navigate } = useNavigation();

  useEffect(() => {
    getAllTasks();
  }, []);

  const getAllTasks = async () => {
    let params = "";
    params += "?promoted=" + true;
    params += "&limit=" + 6;

    try {
      const response = await apiCall(
        `${requests.getTasks}${params}`,
        {},
        "get",
        false,
        dispatch,
        user,
        router
      );
      setTasks(response?.data?.data.tasks || []);
    } catch (error) {
      console.warn("Error fetching tasks:", error);
    } finally {
    }
  };

  return (
    <section className="promoted_te_section pb-5">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div>
            <h1 className="mb-0 fs-56">Featured Talent. Priority Tasks.</h1>
          </div>
          <div className="d-flex gap-2 rounded-pill overflow-hidden border border-black">
            <button
              className="btn btn-dark rounded-pill px-5"
              aria-current="page"
            >
              TalentXpert
            </button>
            <button className="btn btn-outline-black rounded-pill border-0">
              Promoted Tasks
            </button>
          </div>
        </div>
        <div className="row row-gap-4">
          {tasks?.map((data: any) => (
            <div className="col-md-4" key={data.id}>
              <div className="promoted_task mb-2  d-flex flex-column h-100">
                {/* <div className="ribbon-1">
                  <ImageFallback
                    src="/assets/images/promote.svg"
                    alt="img"
                    className="img-fluid ribbon-img"
                    width={255}
                    height={255}
                    priority
                  />
                </div> */}
                <div className="usertext">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex gap-3">
                      <div className="userimg overflow-hidden">
                        <Image
                          src={userimg}
                          alt="userimg"
                          width={48}
                          height={48}
                        />
                      </div>
                      <Link
                        className="mb-0 text-white"
                        href={`/tasks/${data?.id}`}
                        onClick={() => navigate(`/tasks/${data?.id}`)}
                      >
                        {data?.name}
                        <h6 className="fw-light">Product Designer</h6>
                      </Link>
                    </div>
                    <div className="ribbin">Promoted</div>
                  </div>
                  {/* <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <p className="fs-12 mb-0">
                      {data?.taskLocation?.country && (
                        <span className="">
                          {data?.taskLocation?.country?.name}
                        </span>
                      )}
                      <span
                        className={data?.taskLocation?.country ? "ms-2" : ""}
                      >
                        {data.taskType}
                      </span>
                    </p>
                    <p className="text-white fw-medium mb-0">
                      ${data.amount}/ hr
                    </p>
                  </div> */}
                </div>
                <HtmlData
                  data={data?.details}
                  className="text-white line-clamp-3 fw-normal fs-14"
                />
                <hr className="text-light" />
                <div className="tags mb-2">
                  <div className="tag border border-light text-white p-1 fs-12 rounded-1 d-inline-block">
                    Product Designer
                  </div>
                  <div className="tag border border-light text-white p-1 fs-12 rounded-1 d-inline-block">
                    UX/UI
                  </div>
                  <div className="tag border border-light text-white p-1 fs-12 rounded-1 d-inline-block">
                    Brand Design
                  </div>
                  <div className="tag border border-light text-white p-1 fs-12 rounded-1 d-inline-block">
                    Design System
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-auto">
                  {/* <p className="fs-12 text-secondary">
                    {getTimeago(data.createdAt)}
                  </p> */}
                  <RatingStar rating={data?.requesterProfile?.averageRating} />
                  {(user?.profile && user?.profile[0].type == "TE") ||
                  !isAuth ? (
                    <Link
                      className="btn btn-outline-light rounded-pill btn-sm w-auto mt-1"
                      href={isAuth ? `/tasks/${data.id}` : "/signin"}
                      onClick={() =>
                        navigate(isAuth ? `/tasks/${data.id}` : "/signin")
                      }
                    >
                      Apply Now{" "}
                      <Icon icon="line-md:arrow-right" className="ms-1" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 d-flex align-items-center">
          {tasks?.length <= 6 && (
            <Link
              className="btn btn btn-outline-dark w-auto rounded-pill fs-18 m-auto"
              href={"/tasks"}
              onClick={() => navigate("/tasks")}
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
