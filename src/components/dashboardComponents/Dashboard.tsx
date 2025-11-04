"use client";
import React, { useEffect, useState } from "react";
import NewCard from "../common/cards/newCard";
import SearchFilter from "./SearchFilter/SearchFilter";
import { useSelector } from "react-redux";
import { RootState } from "@/reducers/Reducer";
import { Pagination } from "../common/Pagination/Pagination";
import { useMultipleTotalSpending } from "@/hooks/wallet/useWallet";
import {
  useFetchTaskOnStatus,
  useMultipleTaskCount,
} from "@/hooks/tasks/useTasks";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [promoted, setPromoted] = useState(true);
  const [disability, setDisability] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const user = useSelector((state: RootState) => state.user);

  // Fetch tasks with filters
  const { data: tasksData, isLoading } = useFetchTaskOnStatus({
    id: user?.id,
    params: {
      ...{ status: "INPROGRESS" },
      ...(page && { page }),
      ...(limit && { limit }),
      ...(promoted && { promoted }),
      ...(disability && { disability }),
      ...(searchQuery.trim() && { name: searchQuery.trim() }),
      ...(user?.profile?.[0]?.type && {
        profileType: user?.profile?.[0]?.type,
      }),
    },
    enabled: !!user?.id,
  });

  // const spendingQueries = useMultipleTotalSpending({ data: tasksData?.data?.tasks });
  // const countQueries = useMultipleTaskCount({ data: tasksData?.data?.tasks });

  return (
    <div>
      <div className="dashboard-card">
        {/* Search Filters  */}
        <SearchFilter
          title={"Your Working Tasks"}
          onSearch={(q) => setSearchQuery(q)}
          promoted={promoted}
          onPromotedChange={setPromoted}
          disability={disability}
          onDisabilityChange={setDisability}
        />

        {/* Task Cards */}
        <div className="row row-gap-2 row-gap-md-4 mt-1">
          {isLoading ? (
            <div className="col-12 text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : !isLoading && tasksData?.data?.tasks?.length > 0 ? (
            tasksData?.data?.tasks.map((task: any, index: number) => {
              // const spendingQuery = spendingQueries[index];
              // const countingQuery = countQueries[index];

              return (
                <div
                  className="col-md-6 col-lg-6 col-xl-4"
                  key={task.id || index}
                >
                  <NewCard task={{ ...task }} isDashboard={true} />
                </div>
              );
            })
          ) : (
            !isLoading &&
            tasksData?.data?.tasks?.length === 0 && (
              <div className="col-12 text-center">
                <p className="text-white">No tasks found</p>
              </div>
            )
          )}
        </div>
        <div className="mt-3">
          <Pagination
            limit={limit}
            count={tasksData?.data?.count || 0}
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
