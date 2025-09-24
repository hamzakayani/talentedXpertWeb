"use client";
import React, { FC, useEffect, useState } from "react";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { RootState, useAppDispatch } from "@/store/Store";
import { useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@/components/common/Pagination/Pagination";
import NoFound from "@/components/common/NoFound/NoFound";
import SearchFilter from "../SearchFilter/SearchFilter";
import TasksTabs from "../Tabs/TasksTabs";
import { TaskStatusTE, TaskStatusTR } from "@/services/enums/enums";
import { useFetchAllTasks, useFetchTaskOnStatus, useMultipleTaskCount } from "@/hooks/tasks/useTasks";
import { useFetchAllProposals } from "@/hooks/proposals/useProposal";
import SpinnerLoader from "@/components/common/GlobalLoader/SpinnerLoader";
import NewCard from "@/components/common/cards/newCard";
import { useMultipleTotalSpending } from "@/hooks/wallet/useWallet";

const Tasks: FC<any> = ({ isactive, topMenu, auth, isDashboard }) => {
  const searchParams  = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("");

  const [tasks, setTasks] = useState<any>([]);
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const [loading, setLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [minBudget, setMinBudget] = useState<string>("");
  const [maxBudget, setMaxBudget] = useState<string>("");
  const [promoted, setPromoted] = useState<boolean>(
    user?.profile[0]?.type == "TE" && status !== "" ? true : false
  );
  const [disability, setDisability] = useState<boolean>(false);

  const [amountType, setAmountType] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const proposalsQuery = useFetchAllProposals({
    params: {
      ...(status === "CLOSED" ? { status } : { teProposals: true }),
      ...(page && { page }),
      ...(limit && { limit }),
      ...(promoted && { promoted }),
      ...(disability && { disability }),
      ...(rating && { rating }),
      ...(minBudget && { minBudget }),
      ...(maxBudget && { maxBudget }),
      ...(amountType && { amountType }),
      // ...(searchQuery.trim() && { name: searchQuery.trim()}),
    },
    enabled: status === "PROPOSALS" || (user?.profile?.[0]?.type === "TE" && status === "CLOSED"),
  });

  const tasksOnStatusQuery = useFetchTaskOnStatus({
    id: user?.id,
    params: {
      ...(status && { status }),
      ...(page && { page }),
      ...(limit && { limit }),
      ...(promoted && { promoted }),
      ...(disability && { disability }),
      ...(rating && { rating }),
      ...(minBudget && { minBudget }),
      ...(maxBudget && { maxBudget }),
      ...(amountType && { amountType }),
      ...(searchQuery.trim() && { name: searchQuery.trim() }),
      ...((status === "INPROGRESS" || status === "COMPLETED" || status === "CLOSED") && {
        profileType: user?.profile?.[0]?.type,
      }),
    },
    enabled: status === "INPROGRESS" || status === "COMPLETED" || status === "CLOSED",
  });

  const allTasksQuery = useFetchAllTasks({
    params: {
      ...(status && { status }),
      ...(page && { page }),
      ...(limit && { limit }),
      ...(promoted && { promoted }),
      ...(disability && { disability }),
      ...(rating && { rating }),
      ...(minBudget && { minBudget }),
      ...(maxBudget && { maxBudget }),
      ...(amountType && { amountType }),
      ...(searchQuery.trim() && { name: searchQuery.trim() }),
      ...((status === "INPROGRESS" || status === "COMPLETED" || status === "CLOSED") && {
        profileType: user?.profile?.[0]?.type,
      }),
    },
    enabled: !(status === "PROPOSALS" || status === "INPROGRESS" || status === "COMPLETED" || status === "CLOSED"),
  });

  let fetchAllTasks;

  if (status === "PROPOSALS" || (user?.profile?.[0]?.type === "TE" && status === "CLOSED")) {
    fetchAllTasks = proposalsQuery;
  } else if (status === "INPROGRESS" || status === "COMPLETED" || status === "CLOSED") {
    fetchAllTasks = tasksOnStatusQuery;
  } else {
    fetchAllTasks = allTasksQuery;
  }

  const spendingQueries = useMultipleTotalSpending({ data: (fetchAllTasks?.data?.data?.tasks || fetchAllTasks?.data?.data?.proposals) });
  const countQueries = useMultipleTaskCount({ data: (fetchAllTasks?.data?.data?.tasks || fetchAllTasks?.data?.data?.proposals) });

  // Set search state from URL param on mount or when param changes
  useEffect(() => {
    const searchValue = searchParams.get('search') || '';
    setSearch(searchValue);
  }, [searchParams]);

  // Set status from URL param on mount or when param changes
  useEffect(() => {
    const statusParam = searchParams.get('status') || '';
    const filterParam = searchParams.get('filter') || '';
    
    if (statusParam) {
      setStatus(statusParam);
    } else if (filterParam === 'sentProposals') {
      setStatus('PROPOSALS');
    }
  }, [searchParams]);

  useEffect(() => {
    if (
      status === "PROPOSALS" ||
      (user?.profile?.length > 0 &&
        user?.profile[0]?.type === "TE" &&
        status === "CLOSED")
    ) {
      getProposal(filters);
    } else {
      if (filters && filters != "") {
        getAllTasks(filters);
      }
    }
  }, [user, filters]);

  const setFilterParams = () => {
    let filters = "";
    filters += "?page=" + page || "";
    filters += limit > 0 ? "&limit=" + limit : "";
    if (isactive) {
      filters += "&status=INPROGRESS";
      filters +=
        "&profileType=" +
        `${user?.profile?.length > 0 && user?.profile[0]?.type}`;
    } else {
      filters += status != "" ? "&status=" + status : "";
      if (
        status === "INPROGRESS" ||
        status === "COMPLETED" ||
        status === "CLOSED"
      ) {
        filters +=
          "&profileType=" +
          `${user?.profile?.length > 0 && user?.profile[0]?.type}`;
      }
      filters += rating ? "&rating=" + rating : "";
      filters += minBudget ? "&minBudget=" + minBudget : "";
      filters += maxBudget ? "&maxBudget=" + maxBudget : "";
      promoted ? (filters += "&promoted=" + promoted) : "";
      disability ? (filters += "&disability=" + disability) : "";
      filters += amountType != "" ? "&amountType=" + amountType : "";
      filters += search != "" ? "&name=" + search : "";
      filters += searchParams?.get('location') ? '&location=' + searchParams?.get('location') : ''
    }

    setFilters(filters);
  };

  const getProposal = async (params: any) => {
    setLoading(true);

    let param = params
      .replace(/&promoted=[^&]*/g, "")
      .replace(/&status=[^&]*/g, "")
      .replace(/&profileType=[^&]*/g, "");

    let statusParam = "";

    if (
      user?.profile?.length > 0 &&
      user?.profile[0]?.type === "TE" &&
      status === "CLOSED"
    ) {
      statusParam = "&status=CLOSED";
    } else if (status === "PROPOSALS") {
      statusParam = "&teProposals= true";
    }

    // Add new status param
    param += statusParam;
    await apiCall(
      `${requests.getProposals}${param}`,
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        setTasks(res?.data?.data || []);
        setLoading(false);
        // setProposal(res?.data?.data?.proposals[0] || [])
        // setPrposalCount(res?.data?.data?.count || 0)
      })
      .catch((err) => console.warn(err));
  };

  useEffect(() => {
    setFilterParams();
  }, [
    limit,
    status,
    promoted,
    amountType,
    rating,
    minBudget,
    maxBudget,
    search,
    page,
    user,
    disability,
  ]);

  useEffect(() => {
    setDisability(false);
    setAmountType("");
    setMinBudget("");
    setMaxBudget("");
    setRating("");
    setPromoted(user?.profile[0]?.type === "TE" && status == "");
    setPage(1);
  }, [status]);

  const getAllTasks = async (params: any) => {
    try {
      setLoading(true);
      const response = await apiCall(
        isactive ||
          status === "INPROGRESS" ||
          status === "COMPLETED" ||
          status === "CLOSED"
          ? `${requests.getTaskOnStatus}${user?.id}${params}`
          : `${requests.getTasks}${params}`,
        {},
        "get",
        false,
        dispatch,
        user,
        router,
        !auth ||
          isactive ||
          status === "INPROGRESS" ||
          status === "COMPLETED" ||
          status === "CLOSED"
          ? false
          : true
      );

      setTasks(response?.data?.data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (page: number) => {
    setPage(page);
    let filters = "";

    filters += page > 0 ? "?page=" + page : "";
    filters += limit > 0 ? "&limit=" + limit : "";

    setFilters(filters);
  };

  const onLimitChange = (limit: number) => {
    setLimit(limit);
    setPage(1)
  };

  const handleTab  = (tab:string) => {
    setStatus(tab)
    // Update URL to reflect the tab change
    const url = new URL(window.location.href);
    if (tab === '') {
      url.searchParams.delete('status');
    } else {
      url.searchParams.set('status', tab);
    }
    router.replace(url.pathname + url.search);
  }

  const handleBudgetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '') {
      setMinBudget('');
      setMaxBudget('');
    } else {
      const [min, max] = value.split('-').map(Number);
      setMinBudget(String(min));
      setMaxBudget(String(max));
    }
  };

  return (
    <div>
      <div className="dashboard-card">
        {/* Search Filters */}
        <SearchFilter
          title={'Your working tasks'}
          onSearch={(q) => setSearchQuery(q)} 
          promoted={promoted}
          onPromotedChange={setPromoted}
          disability={disability}
          onDisabilityChange={setDisability}
          isDashboard={isDashboard}
        />
        <div className={`d-flex ${isDashboard ? 'justify-content-between' : 'justify-content-end'} gap-2 mb-3 flex-wrap`}>
          {!isactive && topMenu && 
            <div className="order-1 order-md-2">
              <TasksTabs tabs={user?.profile?.[0]?.type === 'TR' ? TaskStatusTR : TaskStatusTE} activeTab={status || ''} onClick={(tab) => handleTab(tab)} isBtn={user?.profile?.[0]?.type === 'TR' || false} />
            </div>
          }

          <div className={`d-flex gap-2 align-items-start mb-md-2 mb-0 order-2 order-md-1`}>
              <select 
                className={`form-select rounded-5 bg-transparent ${isDashboard ? "text-white" : "text-black border-black"}`}
                onChange={(e) => setRating(e.target.value)}
                value={rating}
              >
                <option value={''}>Rating</option>
                <option value={'3'}>3 Stars</option>
                <option value={'4'}>4 Stars</option>
                <option value={'5'}>5 Stars</option>
              </select>
              <select 
                className={`form-select rounded-5 bg-transparent ${isDashboard ? "text-white" : "text-black border-black"}`}
                onChange={handleBudgetChange}
                value={minBudget && maxBudget ? `${minBudget}-${maxBudget}` : ''}
              >
                <option value="">Budget</option>
                <option value="0-500">0 - $500</option>
                <option value="500-1000">$500 - $1000</option>
                <option value="1000-5000">$1000 - $5000</option>
                <option value="5000-10000">$5000 - $10,000</option>
                <option value="10000-999999">$10000 or above</option>
              </select>
              <select
                className={`form-select rounded-5 bg-transparent ${isDashboard ? "text-white" : "text-black border-black"}`}
                onChange={(e) => setAmountType(e.target.value)}
                value={amountType}
              >
                <option value="">Amount</option>
                <option value="FIXED">Fixed</option>
                <option value="HOURLY">Hourly</option>
              </select>
          </div>
        </div>

        {/* Task Cards */}
        <div className="row row-gap-4 my-3">
          {fetchAllTasks?.isLoading ? 
            <SpinnerLoader />
            : !fetchAllTasks?.isLoading && (fetchAllTasks?.data?.data?.tasks?.length > 0 || fetchAllTasks?.data?.data?.proposals?.length > 0) ?
              (fetchAllTasks?.data?.data?.tasks || fetchAllTasks?.data?.data?.proposals)?.map((data:any, index:number) => {
                const spendingQuery = spendingQueries[index];
                const countingQuery = countQueries[index];
                return (
                  <div className="col-md-6 col-lg-4" key={data?.id}>
                    <NewCard task={(status === "PROPOSALS" || (user?.profile?.[0]?.type === 'TE' && status === "CLOSED")) ? {...data?.task, totalSpent: spendingQuery?.data, totalTasks: countingQuery?.data} : {...data, totalSpent: spendingQuery?.data, totalTasks: countingQuery?.data}} />
                  </div>
                )
              })
              : !fetchAllTasks?.isLoading && (fetchAllTasks?.data?.data?.tasks?.length === 0 || fetchAllTasks?.data?.data?.proposals?.length === 0)
              && <NoFound className={"col-12 text-center"} message="No tasks found" />
          }
        </div>

        {/* pagination */}
        {!fetchAllTasks?.isLoading && (fetchAllTasks?.data?.data?.count > 0 || fetchAllTasks?.data?.data?.count > 0) && (
          <Pagination
            count={(fetchAllTasks?.data?.data?.count || fetchAllTasks?.data?.data?.count)}
            page={page}
            limit={limit}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            siblingCount={1}
          />
        )}
      </div>
      
      {/* <div className={`card ${!isactive && !topMenu && "forpadding"}`}>
        {(isactive || (!isactive && !topMenu)) && (
          <div className="bg-dark text-white card-header d-flex justify-content-between px-4 ">
            <div className="card-left-heading">
              <h3>
                {!isactive ? "Tasks" : `My Working Tasks (${tasks?.count || 0})`}
              </h3>
            </div>
          </div>
        )}
        <div className="tab-card first-card card-header card-bodyy h-100 ">
          {!isactive && topMenu && <TopMenu setStatus={setStatus} />}
          {!isactive && (
            <FilterCard
              promoted={promoted}
              setRating={setRating}
              disability={disability}
              setDisability={setDisability}
              rating={rating}
              setPromoted={setPromoted}
              minBudget={minBudget}
              maxBudget={maxBudget}
              setMinBudget={setMinBudget}
              setMaxBudget={setMaxBudget}
              setAmountType={setAmountType}
              resetFilters={status}
              search={search}
              setSearch={setSearch}
              amountType={amountType}
            />
          )}

          <div className="tab-content" id="pills-tabContent">
            {status == "PROPOSALS" ||
            (user?.profile?.length > 0 &&
              user?.profile[0]?.type === "TE" &&
              status === "CLOSED") ? (
              <div
                className="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
                tabIndex={0}
              >\
                {!loading &&
                tasks &&
                tasks?.count > 0 &&
                tasks?.proposals?.length > 0 ? (
                  tasks.proposals?.map((task: any) => (
                    <TaskCard
                      key={task?.task?.id}
                      task={task?.task}
                      reviews={task?.requesterProfile?.averageRating}
                      status={status}
                    />
                  ))
                ) : !loading ? (
                  <NoFound message={"No Task Found"} />
                ) : null}
              </div>
            ) : (
              <div
                className="tab-pane fade show active"
                id="pills-home"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
                tabIndex={0}
              >
                {!loading && tasks && tasks?.tasks?.length > 0 ? (
                  tasks?.tasks?.map((task: any) => (
                    <TaskCard
                      key={task?.id}
                      task={task}
                      reviews={task?.requesterProfile?.averageRating}
                    />
                  ))
                ) :

                !loading ? (
                  <NoFound message={"No Task Found"} />
                ) : null}
              </div>
            )}
          </div>
        </div>

        {!loading && tasks && tasks?.count > 0 && (
          <Pagination
            count={tasks?.count}
            page={page}
            limit={limit}
            onPageChange={onPageChange}
            onLimitChange={onLimitChange}
            siblingCount={1}
          />
        )}
      </div> */}
    </div>
  );
};

export default Tasks;
