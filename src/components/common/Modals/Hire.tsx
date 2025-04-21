"use client";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { RootState, useAppDispatch } from "@/store/Store";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MsgNotifier from "../MsgNotifier/MsgNotifier";
import { toast } from "react-toastify";
import { Pagination } from "../Pagination/Pagination";
import StripeModal from "../StripeWidget/StripeModal";
import HourlyLogModal from "./hourlyLogModal";
import ConnectNotVerified from "./ConnectNotVerified";

const Hire: FC<any> = ({
  milestone,
  setMilestones,
  contract,
  type,
  amount,
  proposal,
  areAllMilestonesApproved,
  task,
  count,
  page,
  limit,
  onPageChange,
  onLimitChange,
  team,
}: any) => {
  const user = useSelector((state: RootState) => state.user);
  const [error, setError] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<Number>(0);
  const [weekIndex, setWeekIndex] = useState<Number>(1);
  const [msgNotify, setMsgNotify] = useState<boolean>(false);
  const [milestoneIdsToDelete, setMilestoneIdsToDelete] = useState<any>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [stripeDetail, setStripeDetail] = useState<boolean>(false)

  const [isAccept, setIsAccept] = useState<boolean>(false);
  const [payData, setPayData] = useState<any>({});

  let data = {
    ...(milestone?.length > 0 && {
      milestones: milestone?.map((data: any) => ({
        contractId: contract?.id,
        amount: Number(data?.amount),
        teamMemberProfileId: data?.teamMemberId || proposal?.expertProfile?.id,
        title: data?.title,
        details: data?.details,
        duration: data?.date,
        date: new Date(),
        status: type
          ? data?.isTEApproved
            ? data?.status === "PAID"
              ? "PAID"
              : "APPROVED"
            : data?.status
          : "APPROVAL_PENDING",
        isTEApproved: data?.isTEApproved || false,
        isTRApproved: true,
        ...(type && data?.id && { id: Number(data?.id) }),
      })),
    }),
    ...(type && { milestoneIdsToDelete }),
  };

  useEffect(() => {
    if (milestone?.length === 0) {
      setMilestones([
        {
          amount: "",
          date: "",
          title: "",
          details: "",
          status: "APPROVAL_PENDING",
          isTEApproved: false,
        },
      ]);
      setError("");
    } else if (milestone?.length > 0) {
      const updatedTotalAmount = milestone?.reduce(
        (acc: number, item: any) => acc + (Number(item?.amount) || 0),
        0
      );
      setTotalAmount(updatedTotalAmount);
      setError("");
    }
  }, [milestone]);

  const onDelete = (id: number, index: any) => {
    setMilestoneIdsToDelete((prev: any) => [...prev, id]);
    const updatedQuestions = milestone.filter(
      (_: any, i: number) => i !== index
    );
    setMilestones(updatedQuestions);
  };

  const addMilestone = () => {
    const incomplete = milestone?.some(
      (m: any) => !m.amount || !m.date || !m.title || !m.details
    );
    if (incomplete) {
      setError("Please fill in all fields before adding a new milestone.");
      return;
    } else {
      setError("");
      setMilestones((prev: any) => [
        ...prev,
        { amount: "", status: "APPROVAL_PENDING" },
      ]);
    }
  };

  const handledate = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newQuestionArr = [...milestone];
    newQuestionArr[index].date = e.target.value;
    setMilestones(newQuestionArr);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newMilestone = [...milestone];
    newMilestone[index].amount = e.target.value;
    setMilestones(newMilestone);
  };

  const handleTitle = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newMilestone = [...milestone];
    newMilestone[index].title = e.target.value;
    setMilestones(newMilestone);
  };

  const handleDetails = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newMilestone = [...milestone];
    newMilestone[index].details = e.target.value;
    setMilestones(newMilestone);
  };
  const handleTeam = (e: any, index: number) => {
    const newMilestone = [...milestone];
    newMilestone[index].teamMemberId = Number(e);
    setMilestones(newMilestone);
  };

  const handleSubmit = async () => {
    const incomplete = milestone?.some(
      (m: any) => !m.amount || !m.date || !m.title || !m.details
    );
    if (incomplete) {
      setError("Please fill in all fields before adding a new milestone.");
      return;
    } else {
      setError("");
      await apiCall(
        requests.makeMilestone,
        data,
        `${type ? "patch" : "post"}`,
        true,
        dispatch,
        user,
        router
      )
        .then((res: any) => {
          if (!type) {
            setMsgNotify(true);
          }
          toast.success("Submitted");
          getMilestones(contract?.id);
        })
        .catch((err) => console.warn(err));
    }
  };
  const getConnectAccount = async () => {
    apiCall(`${requests?.connectStripeAccount}`, {}, 'get', false, dispatch, user, router).then(res => {
      if (res?.error?.message) return;
      setStripeDetail(res?.data?.data?.capabilities?.card_payments === 'active')
    }).catch(err => console.warn(err))
  }

  const handleApprove = async (index: number) => {
      const newMilestones = [...milestone];
      newMilestones[index].isTEApproved = true;
      newMilestones[index].status = "APPROVED";
      newMilestones[index].teamMemberProfileId =
        data?.milestones[index]?.teamMemberProfileId;
      await apiCall(
        requests.makeMilestone,
        {
          ...data,
          milestones: [...newMilestones],
        },
        "patch",
        false,
        dispatch,
        user,
        router
      )
        .then((res: any) => {
          setMilestones(newMilestones);
          toast.success("Approved successfully");
        })
        .catch((err) => console.warn(err));
  };

  const handlePayNow = (data: any) => {
    if (proposal?.status !== "HIRED") {
      toast.error("You need to HIRE the Xpert first");
      return;
    }
    setIsAccept(true);
    setPayData({
      ...data,
      amountType: task?.amountType,
      taskId: task?.id,
    });
  };

  const closeFn = async (isClose: boolean) => {
    isClose ? await getMilestones(payData?.contractId) : "";
    setIsAccept(false);
    setError("");
    setPayData({});
  };

  const setId = (index: number) => {
    setWeekIndex(index);
    // Manually show HourlyLogModal without hiding parent
    const childModal = document.getElementById("exampleModalToggle555");
    const parentModal = document.getElementById("exampleHiredProposal");
    if (childModal && parentModal) {
      // Remove aria-hidden from parent to fix accessibility warning
      parentModal.removeAttribute("aria-hidden");
      // Ensure parent modal stays visible
      parentModal.classList.add("show");
      parentModal.style.display = "block";
      // Show child modal
      childModal.classList.add("show");
      childModal.style.display = "block";
      // Trap focus in child modal
      childModal.focus();
    }
  };

  const getMilestones = async (id: number) => {
    let params: any = "?taskId=" + task?.id;
    params += "&contractId=" + Number(id);
    await apiCall(
      `${requests.getMilestones}${params}`,
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        setMilestones(res?.data?.data?.milestones);
      })
      .catch((err) => console.warn(err));
  };
  useEffect(() => {

    getConnectAccount()
  }, [])

  return (
    <div>
      <div className="create-milstone">
        <div
          className="modal fade"
          id="exampleHiredProposal"
          aria-hidden="true"
          aria-labelledby="exampleModalHiredProposal"
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered modal-dialog modal-xl">
            <div className="modal-content p-r">
              <div className="modal-header justify-content-between">
                <button
                  type="button"
                  className="btn-close bg-light p-a me-3"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() => closeFn(false)}
                ></button>
                <h5 className="modal-title text-white">
                  {user?.profile?.length > 0 && user?.profile[0]?.type === "TR"
                    ? "Create Milestone"
                    : "Milestones"}
                </h5>
                <div className="d-flex">
                  {!areAllMilestonesApproved &&
                    (user?.profile[0]?.type === "TR" ||
                      (user?.profile[0]?.type === "TE" && team?.id)) && (
                      <Icon
                        icon="line-md:plus-square-filled"
                        className={`text-info mx-5 ${totalAmount === amount ? "disabled" : ""
                          }`}
                        width={32}
                        height={32}
                        onClick={addMilestone}
                      />
                    )}
                </div>
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">SR</th>
                        <th scope="col">Title</th>
                        <th scope="col">Description</th>
                        {team?.id && user?.profile[0]?.type === "TE" && (
                          <th scope="col">Member Name</th>
                        )}
                        {task?.amountType == "HOURLY" && <th>Hours</th>}
                        <th scope="col">Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        <th scope="col" className="text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="table-dark">
                      {milestone?.length > 0 &&
                        milestone.map((data: any, index: number) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <input
                                type="text"
                                value={
                                  task?.amountType == "HOURLY"
                                    ? `Week ${data?.week}`
                                    : data?.title
                                }
                                readOnly={
                                  (user?.profile[0]?.type === "TE" &&
                                    !team?.id) ||
                                  areAllMilestonesApproved
                                }
                                className="form-control text-white"
                                id="exampleFormControlInput2"
                                placeholder="Title"
                                onChange={(e) => handleTitle(e, index)}
                              />
                            </td>
                            <td>
                              {task?.amountType === "HOURLY" ? (
                                <button
                                  className="btn rounded-pill btn-outline-info mx-1 my-1"
                                  onClick={() => setId(index)} // Use custom handler instead of data-bs attributes
                                >
                                  Hours Log
                                </button>
                              ) : (
                                <input
                                  type="text"
                                  value={data?.details}
                                  readOnly={
                                    (user?.profile[0]?.type === "TE" &&
                                      !team?.id) ||
                                    areAllMilestonesApproved
                                  }
                                  className="form-control text-white"
                                  id="exampleFormControlInput2"
                                  placeholder="Description"
                                  onChange={(e) => handleDetails(e, index)}
                                />
                              )}
                            </td>
                            {team?.id && user?.profile[0]?.type === "TE" && (
                              <td>
                                <select
                                  value={data?.teamMemberProfileId}
                                  className="form-select form-select-sm bg-gray text-white border-0 py-2 px-4"
                                  id="taskDropdown"
                                  defaultValue=""
                                  onChange={(e) =>
                                    handleTeam(e?.target?.value, index)
                                  }
                                >
                                  <option value="" disabled>
                                    Select Member
                                  </option>
                                  {team?.teamMembers?.map((data: any) => (
                                    <option
                                      value={data?.memberProfileId}
                                      key={data?.id}
                                    >
                                      {data?.profile?.user?.firstName}{" "}
                                      {data?.profile?.user?.lastName}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            )}
                            {task?.amountType === "HOURLY" && (
                              <td className="pt-3">
                                <span className="mt-2">
                                  {Math.floor(data?.totalHours / 60)}h{" "}
                                  {data?.totalHours % 60}m
                                </span>
                              </td>
                            )}
                            <td>
                              <input
                                type="number"
                                value={
                                  task?.amountType == "HOURLY"
                                    ? data?.totalAmount
                                    : data?.amount
                                }
                                readOnly={
                                  (user?.profile[0]?.type === "TE" &&
                                    !team?.id) ||
                                  areAllMilestonesApproved
                                }
                                className="form-control text-white"
                                id="exampleFormControlInput1"
                                placeholder="$"
                                onChange={(e) => handleChange(e, index)}
                              />
                            </td>
                            <td>
                              <input
                                type="date"
                                className="bg-gray text-white border-0 p-1"
                                readOnly={
                                  (user?.profile[0]?.type === "TE" &&
                                    !team?.id) ||
                                  areAllMilestonesApproved
                                }
                                value={
                                  (data?.date || data?.createdAt) &&
                                    !isNaN(
                                      new Date(
                                        data?.date || data?.createdAt
                                      ).getTime()
                                    )
                                    ? new Date(data?.date || data?.createdAt)
                                      .toISOString()
                                      .split("T")[0]
                                    : ""
                                }
                                onChange={(e) => handledate(e, index)}
                              />
                            </td>
                            <td>{data?.status}</td>
                            <td>
                              {user?.profile?.length > 0 &&
                                user?.profile[0]?.type === "TE" ? (
                                milestone[index]?.isTEApproved ? (
                                  <span className="d-flex align-items-center justify-content-center">
                                    ✔
                                  </span>
                                ) : (
                                  <button
                                    className="btn rounded-pill btn-outline-info mx-1 my-1"
                                    data-bs-target={!stripeDetail ? "#exampleModalToggle45" : undefined}
                                    data-bs-toggle={!stripeDetail ? "modal" : undefined}
                                    onClick={() => stripeDetail && handleApprove(index)}
                                  >
                                    Approve
                                  </button>
                                )
                              ) : (
                                ""
                              )}
                              {user?.profile?.[0]?.type === "TR" &&
                                ((
                                  task?.amountType === "HOURLY"
                                    ? (milestone[index]?.hourlylogs?.every(
                                      (log: any) => log.isApproved
                                    ) &&
                                      milestone[index]?.hourlylogs.length >
                                      0) ||
                                    milestone[index]?.isTEApproved
                                    : milestone[index]?.isTEApproved
                                ) ? (
                                  <button
                                    className="btn rounded-pill btn-outline-info mx-1 my-1"
                                    disabled={
                                      milestone[index]?.status === "PAID"
                                    }
                                    onClick={() => handlePayNow(data)}
                                  >
                                    Pay Now
                                  </button>
                                ) : (
                                  <Icon
                                    icon="line-md:minus-square-filled"
                                    className="text-info"
                                    width={32}
                                    height={32}
                                    onClick={() => onDelete(data.id, index)}
                                  />
                                ))}
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td colSpan={8}>
                          <span className="pt-3 pb-3">
                            Total Amount :
                            <span className="text-white ms-2">
                              ${String(totalAmount)}
                            </span>
                          </span>
                          {user?.profile[0]?.type === "TR" && (
                            <div className="text-danger fs-12">
                              * Total amount should be equal to proposal amount{" "}
                            </div>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {user?.profile[0]?.type === "TR" && (
                    <div className="text-warning fs-12">
                      Note: Platform service fee of 5% will be deducted on each
                      milestone
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <div className="d-grid gap-2"></div>
                {(user?.profile[0]?.type === "TR" ||
                  (user?.profile[0]?.type === "TE" && team?.id)) &&
                  task?.status !== "COMPLETED" &&
                  task?.status !== "INPROGRESS" && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={totalAmount !== amount}
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  )}
              </div>
              {count > 10 && (
                <Pagination
                  count={count}
                  page={page}
                  limit={limit}
                  onPageChange={onPageChange}
                  onLimitChange={onLimitChange}
                  siblingCount={1}
                />
              )}
            </div>
          </div>
        </div>
        {isAccept && (
          <StripeModal isOpen={isAccept} closeFn={closeFn} data={payData} />
        )}
        <HourlyLogModal task={task} weekIndex={weekIndex} />
        {msgNotify && (
          <MsgNotifier
            senderProfileId={user.id}
            receiverProfileId={contract?.updatedBy}
            text="Milestone has been created"
            taskId={contract?.proposal?.taskId}
          />
        )}
       {proposal  && <ConnectNotVerified step={2} />}
      </div>
    </div>
  );
};

export default Hire;
