import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { RootState, useAppDispatch } from "@/store/Store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@/hooks/useNavigation";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import PromotedTaskCard from "@/components/common/cards/PromotedTaskCard";

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
            <h1 className="mb-0 fs-50">Featured Talent. Priority Tasks.</h1>
          </div>
          <div className="d-flex gap-2 rounded-pill overflow-hidden border border-black">
            <button
              className="btn btn-dark rounded-pill px-5"
              aria-current="page"
            >
              TalentedXpert
            </button>
            <button className="btn btn-outline-black rounded-pill border-0">
              Promoted Tasks
            </button>
          </div>
        </div>
        <div className="row row-gap-4">
          {tasks?.map((data: any) => (
            <div className="col-md-4" key={data.id}>
              <PromotedTaskCard data={data} />
            </div>
          ))}
        </div>
        <div className="mt-4 d-flex align-items-center">
          {tasks?.length <= 6 && (
            <Link
              className="btn btn btn-outline-dark w-auto rounded-pill fs-18 m-auto fw-semibold"
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
