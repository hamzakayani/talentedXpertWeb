"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { useRouter } from "next/navigation";
import { RootState, useAppDispatch } from "@/store/Store";
import { useSelector } from "react-redux";
import { getTimeago } from "@/services/utils/util";
import FilterCard from "../dashboardComponents/tasks/FilterCard";
import { Pagination } from "../common/Pagination/Pagination";

const Payment = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [transactions, setTransactions] = useState<any>([]);
  const [view, setView] = useState<"transactions" | "wallet">("transactions");
  const [walletTab, setWalletTab] = useState<"deposit" | "withdraw">("deposit");
  const [balance, setBalance] = useState<any>({});
  const user = useSelector((state: RootState) => state.user);

  // pagination
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  const [filters, setFilters] = useState<string>("");

  const getTransactions = async (params: any) => {
    await apiCall(
      `${requests.transactions}${params}`,
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        if (res?.error) {
          return;
        } else {
          setTransactions(res?.data?.data || []);
        }
      })
      .catch((err) => console.warn(err));
  };

  const setFilterParams = () => {
    let filters = "";
    filters += "?page=" + 1 || "";
    filters += limit > 0 ? "&limit=" + limit : "";
    setPage(1);
    setFilters(filters);
  };

  useEffect(() => {
    setFilterParams();
  }, [limit]);

  const getBalance = async () => {
    await apiCall(requests.balance, {}, "get", false, dispatch, user, router)
      .then((res: any) => {
        if (res?.error) {
          return;
        } else {
          setBalance(res?.data?.data?.balance);
        }
      })
      .catch((err) => console.warn(err));
  };

  useEffect(() => {
    getBalance();
  }, []);

  useEffect(() => {
    if (filters && filters !== "") {
      getTransactions(filters);
    }
  }, [filters]);

  const onPageChange = (page: number) => {
    setPage(page);
    let filters = "";

    filters += page > 0 ? "?page=" + page : "";
    filters += limit > 0 ? "&limit=" + limit : "";

    setFilters(filters);
  };

  const onLimitChange = (limit: number) => {
    setLimit(limit);
  };

  return (
    <div className="card">
      {user?.profile[0]?.type == "TE" && (
        <div className="walletscreen Top-card d-flex justify-content-between pb-2">
          <div className="card bg-dark text-white px-4 py-2">
            <h3>Pending Balance</h3>
            {balance?.pending?.length > 0 && (
              <span>$ {balance?.pending[0]?.amount / 100}</span>
            )}
          </div>
          <div className="card bg-dark text-white px-4 py-2">
            <h3>Available Soon Balance</h3>
            {balance?.instant_available?.length > 0 && (
              <span>$ {balance?.instant_available[0]?.amount / 100}</span>
            )}
          </div>
          <div className="card bg-dark text-white px-4 py-2">
            <h3>Available Balance</h3>
            {balance?.available?.length > 0 && (
              <span>$ {balance?.available[0]?.amount / 100}</span>
            )}
          </div>
          {/* <div className='card bg-dark text-white px-4 py-2'>
                    <h3>Received Balance</h3>
                    <span>$</span>
                </div> */}
        </div>
      )}
      <div className="tab-card first-card card-header  ">
        <div
          style={{ display: "flex", justifyContent: "space-between" }}
          className="card-header bg-black px-2 text-light mx-0"
        >
          <h5 className="mb-0">
            {view === "transactions" ? "Transactions" : "Wallet"}
          </h5>
          <button
            className="btn btn-primary"
            onClick={() =>
              setView(view === "transactions" ? "wallet" : "transactions")
            }
          >
            {view === "transactions" ? "Wallet" : "Transactions"}
          </button>
        </div>

        {/* <ul className="nav nav-pills mt-3" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                        <button className="nav-link active " id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">Payment</button>
                    </li>
                    <li className="nav-item" role="presentation">
                        <button className="nav-link" id="pills-profile-tab" data-bs-toggle="pill" data-bs-target="#pills-profile" type="button" role="tab" aria-controls="pills-profile" aria-selected="false">Wallet</button>
                    </li>
                    <li className="nav-item mb-2" role="presentation">
                        <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Balance</button>
                    </li>
                </ul> */}
        <div className="filtersearch d-flex align-items-center justify-content-between flex-wrap p-2">
          <div className="filters d-flex align-items-center ">
            <select
              className="form-select form-select-sm mx-1"
              aria-label=".form-select-sm example"
            >
              <option value={""}>Select</option>
            </select>
          </div>
        </div>

        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
            tabIndex={0}
          >
            {view === "transactions" ? (
              <>
                <div className="Table table-responsive">
                  <table className="table table-dark table-bordered">
                    <thead>
                      <tr>
                        <th>Paid by</th>
                        <th>Paid to</th>
                        <th>Task Name</th>
                        <th>Task Type</th>
                        <th>Milestone Title</th>
                        <th>Amount</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions?.transactions?.map((trans: any) => (
                        <tr className="table-dark" key={trans?.id}>
                          <td scope="row">
                            {trans?.senderProfile?.user?.firstName}{" "}
                            {trans?.senderProfile?.user?.lastName}
                          </td>
                          <td>
                            {trans?.receiverProfile?.user?.firstName}{" "}
                            {trans?.receiverProfile?.user?.lastName}
                          </td>
                          <td>{trans?.task?.name}</td>
                          <td>{trans?.task?.amountType}</td>
                          <td>{trans?.milestone?.title}</td>
                          <td>{trans?.netAmount}</td>
                          <td>
                            {
                              new Date(trans?.createdAt)
                                .toISOString()
                                .split("T")[0]
                            }
                          </td>
                          <td>{trans?.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {transactions && transactions?.count > 0 && (
                  <Pagination
                    count={transactions?.count}
                    page={page}
                    limit={limit}
                    onPageChange={onPageChange}
                    onLimitChange={onLimitChange}
                    siblingCount={1}
                  />
                )}
              </>
            ) : (
              <>
                <ul
                  style={{ display: "flex", gap: "10px" }}
                  className="nav nav-tabs mb-3"
                >
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      style={{
                        transition: "all 0.5s ease",
                        backgroundColor:
                          walletTab === "deposit" ? "white" : "black",
                        color: walletTab === "deposit" ? "black" : "white",
                        border: "1px solid #dee2e6",
                        margin: "5px 0px",
                        borderRadius: "10px",
                      }}
                      onClick={() => setWalletTab("deposit")}
                    >
                      Deposit
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      style={{
                        transition: "all 0.3s ease",
                        backgroundColor:
                          walletTab === "withdraw" ? "white" : "black",
                        color: walletTab === "withdraw" ? "black" : "white",
                        border: "1px solid #dee2e6",
                        margin: "5px 0px",
                        borderRadius: "10px",
                      }}
                      onClick={() => setWalletTab("withdraw")}
                    >
                      Withdraw
                    </button>
                  </li>
                </ul>

                <div className="Table table-responsive">
                  <table className="table table-striped table-bordered">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Method</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(walletTab === "deposit" ? [1, 2, 3] : [4, 5, 6]).map(
                        (item, idx) => (
                          <tr key={idx}>
                            <td>{item}</td>
                            <td>
                              {walletTab === "deposit"
                                ? "Bank Transfer"
                                : "PayPal"}
                            </td>
                            <td>
                              $
                              {walletTab === "deposit" ? item * 100 : item * 75}
                            </td>
                            <td>{new Date().toISOString().split("T")[0]}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="card-right-heading d-flex justify-content-between"></div>
      </div>
    </div>
  );
};

export default Payment;
