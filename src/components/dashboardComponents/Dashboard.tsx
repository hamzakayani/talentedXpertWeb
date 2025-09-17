"use client";
import React, { useEffect, useState } from "react";
import StatsCard from "../common/cards/StatsCard";
import NewCard from "../common/cards/newCard";
import ProfileCard from "../common/cards/ProfileCard";
import SearchFilter from "./SearchFilter/SearchFilter";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/Reducer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { requests } from "@/services/requests/requests";
import { Pagination } from "../common/Pagination/Pagination";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [promoted, setPromoted] = useState(true);
  const [disability, setDisability] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const user = useSelector((state: RootState) => state.user);

  // Fetch tasks with filters
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", searchQuery, promoted, disability, page, limit],
    queryFn: async () => {
      let params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      params.append("promoted", promoted.toString());
      params.append("disability", disability.toString());
      params.append("status", "INPROGRESS");
      if (user?.profile?.[0]?.type) {
        params.append("profileType", user?.profile?.[0]?.type);
      }

      if (searchQuery.trim()) {
        params.append("name", searchQuery.trim());
      }
      const response = await axios.get(
        `${requests.getTaskOnStatus}${user?.id}?${params.toString()}`
      );

      const data = response?.data?.data;
      return {
        tasks: data?.tasks || [],
        count: data?.count || 0,
      };
    },
    enabled: true,
  });

  return (
    <div>
      <div className="dashboard-card">
        {/* Search Filters  */}
        <SearchFilter
          title={"Opportunities we have for you"}
          onSearch={(q) => setSearchQuery(q)}
          promoted={promoted}
          onPromotedChange={setPromoted}
          disability={disability}
          onDisabilityChange={setDisability}
        />

        {/* Task Cards */}
        <div className="row row-gap-4 mt-1">
          {tasksLoading ? (
            <div className="col-12 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : tasksData?.tasks?.length > 0 ? (
            tasksData?.tasks.map((task: any, index: number) => (
              <div className="col-md-6 col-lg-4" key={task.id || index}>
                <NewCard task={task} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center">
              <p className="text-white">No tasks found</p>
            </div>
          )}
        </div>
        <div className="mt-3">
          <Pagination
            limit={limit}
            count={tasksData?.count || 0}
            page={page}
            onLimitChange={(val: number) => setLimit(val)}
            onPageChange={(val: number) => setPage(val)}
            siblingCount={1}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
