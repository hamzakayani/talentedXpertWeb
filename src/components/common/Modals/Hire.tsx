"use client";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { RootState, useAppDispatch } from "@/store/Store";
import { Icon } from "@iconify/react/dist/iconify.js";
import { usePathname, useRouter } from "next/navigation";
import React, { FC, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import MsgNotifier from "../MsgNotifier/MsgNotifier";
import { toast } from "react-toastify";
import { Pagination } from "../Pagination/Pagination";
import StripeModal from "../StripeWidget/StripeModal";
import HourlyLogModal from "./hourlyLogModal";
import { Modal } from "bootstrap";
import ConnectNotVerified from "./ConnectNotVerified";
import HtmlData from "../HtmlData/HtmlData";
import SubmitReviewMilestone from "./SubmitReviewMilestone";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import GradientButton from "../GradientButton/GradientButton";

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
  getTask,
  getContract,
  disputes,
  handleClose
}: any) => {
  const user = useSelector((state: RootState) => state.user);
  const closeRef = useRef(null)

  const [error, setError] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<Number>(0);
  const [weekIndex, setWeekIndex] = useState<Number>(1);
  const [msgNotify, setMsgNotify] = useState<boolean>(false);
  const [milestoneIdsToDelete, setMilestoneIdsToDelete] = useState<number[]>(
    []
  );
  const [checkConditions, setCheckConditions] = useState<boolean>(false);
  const [submitReviewMilestoneCheck, setsubmitReviewMilestoneCheck] = useState<boolean>(false);
  const [reviewMilestone, setReviewMilestone] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [stripeDetail, setStripeDetail] = useState<boolean>(false);
  const [wallet, setWallet] = useState<any>({});
  const [isAccept, setIsAccept] = useState<boolean>(false);
  const [payData, setPayData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const hasActiveDispute = Array.isArray(disputes)
    ? disputes.some((d: any) => d?.status === "INITIALIZED" || d?.status === "IN_REVIEW")
    : false;

  
  const [colSpanValue, setColSpanValue] = useState(10);

  const renderStars = (rating:any) => {
  const maxStars = 5;
  const stars = [];
  for (let i = 1; i <= maxStars; i++) {
    stars.push(
      <span key={i} style={{ color: i <= rating ? "#FFD700" : "#D3D3D3" }}>
        {i <= rating ? "★" : "☆"}
      </span>
    );
  }
  return stars;
};

  useEffect(() => {
    // This will run after the component is mounted
    const thElements = document.querySelectorAll('thead th');
    setColSpanValue(thElements.length || 10);
  }, []);

  useEffect(() => {
    if (milestone?.length === 0 && task?.amountType !== 'HOURLY') {
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
    setMilestoneIdsToDelete((prev: number[]) => [...prev, id]);
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

  const getWallet = async () => {
    await apiCall(
      `${requests.wallet}`,
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
          setWallet(res?.data?.data);
          console.log("wallet", res?.data?.data || []);
        }
      })
      .catch((err) => console.warn(err));
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
    getConnectAccount();
    getWallet();

  }, []);


  const handleDetails = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const newMilestone = [...milestone];
    newMilestone[index].details = e.target.value;
    setMilestones(newMilestone);
  };

  const handleTeam = (e: any, index: number) => {
    const newMilestone = [...milestone];
    newMilestone[index].teamMemberProfileId = Number(e);
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
      setIsSubmitting(true);
      
      // Create data object with current milestone state
      let submitData = {
        ...(milestone?.length > 0 && {
          milestones: milestone?.map((milestoneItem: any) => ({
            contractId: contract?.id,
            amount: Number(milestoneItem?.amount),
            teamMemberProfileId:
              milestoneItem?.teamMemberProfileId || proposal?.expertProfile?.id,
            title: milestoneItem?.title,
            details: milestoneItem?.details,
            duration: (() => {
              try {
                if (milestoneItem?.date) {
                  const date = new Date(milestoneItem.date + 'T00:00:00.000Z');
                  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
                }
                return new Date().toISOString();
              } catch (error) {
                return new Date().toISOString();
              }
            })(),
            date: (() => {
              try {
                if (milestoneItem?.date) {
                  const date = new Date(milestoneItem.date + 'T00:00:00.000Z');
                  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
                }
                return new Date().toISOString();
              } catch (error) {
                return new Date().toISOString();
              }
            })(),
            status: type
              ? milestoneItem?.isTEApproved
                ? milestoneItem?.status === "PAID"
                  ? "PAID"
                  : "APPROVED"
                : milestoneItem?.status
              : "APPROVAL_PENDING",
            isTEApproved: milestoneItem?.isTEApproved || false,
            isTRApproved: true,
            ...(type && milestoneItem?.id && { id: Number(milestoneItem?.id) }),
          })),
        }),
        ...(type && { milestoneIdsToDelete }),
      };
      
      try {
        const res = await apiCall(
          requests.makeMilestone,
          submitData,
          `${type ? "patch" : "post"}`,
          true,
          dispatch,
          user,
          router
        );
        
        if (!type) {
          setMsgNotify(true);
        }
        const modalElement = document.getElementById("exampleHiredProposal");
        if (modalElement) {
          let modalInstance = Modal.getInstance(modalElement);
          if (!modalInstance) {
            modalInstance = new Modal(modalElement);
          }
          modalInstance.hide();

          setTimeout(() => {
            const backdrops = document.querySelectorAll(".modal-backdrop");
            backdrops.forEach((el) => el.remove());
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
          }, 300);
        }
        if (res.error) {
          toast.error(res.error.message);
        } else {
          toast.success("Submitted");
          if (handleClose && typeof handleClose === 'function') {
            handleClose();
          }
        }
        getMilestones(contract?.id);
        getContract();
      } catch (err) {
        console.warn(err);
        toast.error("Failed to submit milestone. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getConnectAccount = async () => {
    apiCall(
      `${requests?.connectStripeAccount}`,
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res) => {
        if (res?.error?.message) return;
        setStripeDetail(
          res?.data?.data?.capabilities?.card_payments === "active"
        );
      })
      .catch((err) => console.warn(err));
  };

  const handleApprove = async (index: number) => {
    if (!checkConditions) {
      toast.error("Please accept the Terms and Conditions to proceed.");
      return;
    } else {
      const newMilestones = [...milestone].map(m => {
        const { milestonereview, ...rest } = m;
        return rest;
      });
      newMilestones[index].isTEApproved = true;
      newMilestones[index].status = "APPROVED";
      newMilestones[index].teamMemberProfileId =
        newMilestones[index]?.teamMemberProfileId;

      // Create data object with current milestone state
      let submitData = {
        ...(newMilestones?.length > 0 && {
          milestones: newMilestones?.map((milestoneItem: any) => ({
            contractId: contract?.id,
            amount: Number(milestoneItem?.amount),
            teamMemberProfileId:
              milestoneItem?.teamMemberProfileId || proposal?.expertProfile?.id,
            title: milestoneItem?.title,
            details: milestoneItem?.details,
            duration: (() => {
              try {
                if (milestoneItem?.date) {
                  const date = new Date(milestoneItem.date + 'T00:00:00.000Z');
                  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
                }
                return new Date().toISOString();
              } catch (error) {
                return new Date().toISOString();
              }
            })(),
            date: (() => {
              try {
                if (milestoneItem?.date) {
                  const date = new Date(milestoneItem.date + 'T00:00:00.000Z');
                  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
                }
                return new Date().toISOString();
              } catch (error) {
                return new Date().toISOString();
              }
            })(),
            status: type
              ? milestoneItem?.isTEApproved
                ? milestoneItem?.status === "PAID"
                  ? "PAID"
                  : "APPROVED"
                : milestoneItem?.status
              : "APPROVAL_PENDING",
            isTEApproved: milestoneItem?.isTEApproved || false,
            isTRApproved: true,
            ...(type && milestoneItem?.id && { id: Number(milestoneItem?.id) }),
          })),
        }),
        ...(type && { milestoneIdsToDelete }),
      };

      await apiCall(
        requests.makeMilestone,
        submitData,
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
    }
  };

  const termsConditions = async (check: boolean) => {
    await apiCall(
      requests.editContract + contract?.id,
      {
        termsAccepted: check,
      },
      "put",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        console.log('res term', res);
      })
      .catch((err) => console.warn(err));
  };

  const handlePayNow = async (data: any) => {
    if (proposal?.status !== "HIRED") {
      toast.error("You need to HIRE the Xpert first");
      return;
    }
    if (wallet?.availableBalance < data?.amount && data?.status !== "FUNDED") {
      toast.error("Your wallet doesn't have enough balance");
      return;
    }
    if (data?.status === "FUNDED") {
      const hasReviewed = data?.milestonereview?.rating? true:false
      

      if (!hasReviewed) {
        toast.error('You need to submit the review first');
        return;
      }
    }
    await apiCall(
      data.status === "APPROVED" || data.status === "PAYMENT_PENDING"
        ? requests?.milestoneFund
        : requests?.milestoneRelease,
      {
        milestoneId: data?.id,
        taskId: task?.id,
      },
      "post",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        toast.success(res?.data?.message);
        if (task?.amountType == "HOURLY") {
          getTask();
        } else {
          getMilestones(contract?.id);
        }
      })
      .catch((err) => console.warn(err));
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
    setIsSubmitting(false);
    if (handleClose && typeof handleClose === 'function') {
      handleClose();
    }
  };

  const setId = (index: number) => {
    setWeekIndex(index);
    const childModal = document.getElementById("exampleModalToggle555");
    const parentModal = document.getElementById("exampleHiredProposal");
    if (childModal && parentModal) {
      parentModal.removeAttribute("aria-hidden");
      parentModal.classList.add("show");
      parentModal.style.display = "block";
      childModal.classList.add("show");
      childModal.style.display = "block";
      childModal.focus();
    }
  };

  const submitReviewMilestoneModal = (milestone: any) => {
    setsubmitReviewMilestoneCheck(true)
    setReviewMilestone(milestone)

  };

  useEffect(() => {
    getConnectAccount();
    getWallet();
  }, []);

  useEffect(() => {
    setCheckConditions(contract?.termsAccepted);
  }, [contract]);

  const formatDate = (dateString: any) => {
    if (!dateString || isNaN(new Date(dateString).getTime())) {
      return "";
    }
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div>
      <div className="create-milstone">
        <ModalWrapper
          modalId={"exampleHiredProposal"}
          title={user?.profile?.length > 0 && user?.profile[0]?.type === "TR"
                    ? "Create Milestone"
                    : "Milestones"}
          closeRef={closeRef}
          handleClose={!submitReviewMilestoneCheck ? () => closeFn(false) : null}
          isLarge={true}
        >
          {!submitReviewMilestoneCheck && 
            <>
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">SR</th>
                      <th scope="col-2">Title</th>
                      <th scope="col-3">Description</th>
                      {(team?.id && (
                        (user?.profile[0]?.type === "TE") ||
                        (user?.profile[0]?.type === "TR" && !(
                          milestone?.length > 0 && milestone.every((m: any) => m?.status === "APPROVAL_PENDING")
                        ))
                      )) ? (
                        <th scope="col">Member Name</th>
                      ) : null}
                      {task?.amountType == "HOURLY" && <th>Hours</th>}
                      <th scope="col">Amount</th>
                      <th scope="col">Date</th>
                      <th scope="col">Status</th>
                      {( ((
                        milestone?.length > 0 && milestone.every((m: any) => m?.status === "FUNDED"|| m?.status === "PAID")
                      ))) ? (
                        <th scope="col" style={{ textAlign: "center" }}>Review</th>
                      ) : null}
                      {!(
                        user?.profile[0]?.type === "TE" &&
                        task?.amountType === "HOURLY"
                      ) && (
                          <th scope="col-2" className="text-center">
                            Action
                          </th>
                        )}
                    </tr>
                  </thead>
                  <tbody className="">
                    {milestone?.length > 0 &&
                      milestone.map((data: any, index: number) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            {user?.profile[0]?.type === "TR" &&
                              task?.amountType === "FIXED" &&
                              milestone[index]?.status === "APPROVAL_PENDING" ||
                              (user?.profile[0]?.type === "TE" && proposal?.team?.id && milestone[index]?.status == "APPROVAL_PENDING") ? (
                              <input
                                type="text"
                                value={
                                  task?.amountType === "HOURLY"
                                    ? `Week ${data?.week || ''}`
                                    : data?.title || ''
                                }
                                readOnly={
                                  (user?.profile[0]?.type === "TE" &&
                                    !team?.id) ||
                                  areAllMilestonesApproved
                                }
                                className="form-control text-white milestone-placeholder"
                                id="exampleFormControlInput2"
                                placeholder="Title"
                                onChange={(e) => handleTitle(e, index)}
                              />
                            ) : (
                              <span className="text-white">
                                {task?.amountType === "HOURLY"
                                  ? `Week ${data?.week}`
                                  : data?.title}
                              </span>
                            )}
                          </td>
                          <td>
                            {task?.amountType === "HOURLY" ? (
                              <GradientButton
                                className="m-1"
                                onClick={() => setId(index)}
                              >
                                Hours Log
                              </GradientButton>
                              // <button
                              //   className="btn rounded-pill btn-outline-info mx-1 my-1"
                              //   onClick={() => setId(index)}
                              // >
                              //   Hours Log
                              // </button>
                            ) : user?.profile[0]?.type === "TR" &&
                              task?.amountType === "FIXED" &&
                              milestone[index]?.status == "APPROVAL_PENDING" ||
                              (user?.profile[0]?.type === "TE" && proposal?.team?.id && milestone[index]?.status == "APPROVAL_PENDING") ? (
                              <textarea
                                value={data?.details || ''}
                                readOnly={
                                  (user?.profile[0]?.type === "TE" &&
                                    !team?.id) ||
                                  areAllMilestonesApproved
                                }
                                className="form-control text-white milestone-placeholder"
                                id="exampleFormControlInput2"
                                placeholder="Description"
                                rows={1}
                                style={{ resize: 'none', overflow: 'hidden' }}
                                onInput={(e) => {
                                  const target = e.target as HTMLTextAreaElement;
                                  target.style.height = 'auto';
                                  target.style.height = target.scrollHeight + 'px';
                                }}
                                onChange={(e) => handleDetails(e, index)}
                              />
                            ) : (
                              <span className="text-white">
                                {data?.details}
                              </span>
                            )}
                          </td>
                          {team?.id && user?.profile[0]?.type === "TE" ? (
                            <td>
                              <select
                                value={data?.teamMemberProfileId || data?.teProfileId}
                                className={`form-select form-select-sm border-0 py-2 px-4 ${milestone[index]?.status === "APPROVAL_PENDING"
                                  ? "bg-gray text-white"
                                  : "bg-gray-300 text-gray-500"
                                  }`}
                                id="taskDropdown"
                                disabled={milestone[index]?.status !== "APPROVAL_PENDING"}
                                defaultValue=""
                                onChange={(e) => handleTeam(e?.target?.value, index)}
                              >
                                <option value="" disabled>
                                  Select Member
                                </option>
                                {(() => {
                                  const uniqueMembers = new Map();
                                  team?.teamMembers?.forEach((dataTeam: any) => {
                                    const memberId = dataTeam?.memberProfileId;
                                    if (memberId && !uniqueMembers.has(memberId)) {
                                      uniqueMembers.set(memberId, dataTeam);
                                    }
                                  });
                                  return Array.from(uniqueMembers.values()).map((dataTeam: any) => (
                                    <option
                                      value={dataTeam?.memberProfileId}
                                      key={dataTeam?.id}
                                    >
                                      {dataTeam?.profile?.user?.firstName} {dataTeam?.profile?.user?.lastName}
                                    </option>
                                  ));
                                })()}
                              </select>
                            </td>
                          ) : (
                            (milestone[index]?.status === "APPROVED" || milestone[index]?.status === "FUNDED" || milestone[index]?.status === "PAYMENT_PENDING" || milestone[index]?.status === "PAID") &&
                              user?.profile[0]?.type === "TR" &&
                              team?.id ? (
                              <td>
                                <span>
                                  {team?.teamMembers?.find(
                                    (member: any) => member?.memberProfileId === (task?.amountType==='HOURLY' ?data?.teProfileId :data?.teamMemberProfileId )
                                  )?.profile?.user?.firstName || "N/A"}{" "}
                                  {team?.teamMembers?.find(
                                    (member: any) => member?.memberProfileId === (task?.amountType==='HOURLY' ?data?.teProfileId :data?.teamMemberProfileId )
                                  )?.profile?.user?.lastName || ""}
                                </span>
                              </td>
                            ) : null
                          )}
                          {task?.amountType === "HOURLY" && (
                            <td>
                              <span className="mt-2">
                                {Math.floor(data?.totalHours / 60)}h{" "}
                                {data?.totalHours % 60}m
                              </span>
                            </td>
                          )}
                          <td>
                            {user?.profile[0]?.type === "TR" &&
                              task?.amountType === "FIXED" &&
                              milestone[index]?.status == "APPROVAL_PENDING" ||
                              (user?.profile[0]?.type === "TE" && proposal?.team?.id && milestone[index]?.status == "APPROVAL_PENDING") ? (
                              <input
                                type="number"
                                value={
                                  task?.amountType == "HOURLY"
                                    ? data?.maxAmount || ''
                                    : data?.amount || ''
                                }
                                readOnly={
                                  (user?.profile[0]?.type === "TE" &&
                                    !team?.id) ||
                                  areAllMilestonesApproved
                                }
                                className="form-control text-white milestone-placeholder"
                                id="exampleFormControlInput1"
                                placeholder="$"
                                onChange={(e) => handleChange(e, index)}
                              />
                            ) : (
                              <span className="text-white">
                                {task?.amountType == "HOURLY"
                                  ? data?.maxAmount
                                  : data?.amount}
                              </span>
                            )}
                          </td>
                          <td>
                            {user?.profile[0]?.type === "TR" &&
                              task?.amountType === "FIXED" &&
                              milestone[index]?.status == "APPROVAL_PENDING" ||
                              (user?.profile[0]?.type === "TE" && proposal?.team?.id && milestone[index]?.status == "APPROVAL_PENDING") ? (
                              <input
                                type="date"
                                className="form-control text-white milestone-placeholder"
                                style={{
                                  colorScheme: 'dark',
                                  '--webkit-calendar-picker-indicator-color': 'white',
                                  '--webkit-calendar-picker-indicator-filter': 'invert(1)'
                                } as React.CSSProperties}
                                disabled={
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
                                onClick={(e) => {
                                  if (!e.currentTarget.disabled) {
                                    e.currentTarget.showPicker?.();
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-white">
                                {formatDate(data?.date || data?.createdAt)}
                              </span>
                            )}
                          </td>
                          <td>
                            <span 
                              className={`btn rounded-pill d-inline-flex border-0 ${
                                data?.status === "APPROVAL_PENDING"
                                  ? "text-warning bg-waring-pending"
                                  : data?.status === "ACCEPTED"
                                  ? "text-white bg-gradient-success"
                                  : "text-warning bg-waring-pending"
                              }`}
                              style={{cursor: 'default'}}
                            >
                              {data?.status === "APPROVAL_PENDING"
                                ? "Pending"
                                : data?.status}
                            </span>
                          </td>
                          {(milestone?.length > 0 && milestone.every((m: any) => m?.status === "FUNDED" ||m?.status === "PAID" )) && (
                            <td style={{ textAlign: "center" }}>
                              {milestone[index]?.milestonereview?.rating ? (
                                <span>
                                  {renderStars(milestone[index]?.milestonereview?.rating)}
                                </span>
                              ) : (
                                <>
                                  {user?.profile[0]?.type === "TR" && (
                                    <GradientButton
                                      className="m-1"
                                      onClick={() => submitReviewMilestoneModal(milestone[index])}
                                    >
                                      Submit Review
                                    </GradientButton>
                                    // <button
                                    //   className="btn rounded-pill btn-outline-info mx-1 my-1"
                                    //   onClick={() => submitReviewMilestoneModal(milestone[index])}
                                    // >
                                    //   Submit Review
                                    // </button>
                                  )}
                                  {user?.profile[0]?.type === "TE" && <span>—</span>}
                                </>
                              )}
                            </td>
                          )}
                          {(!areAllMilestonesApproved || user?.profile[0]?.type === "TR" || user?.profile[0]?.type === "TE") && 
                            <td>
                              <div className="m-0 d-flex align-items-center justify-content-center gap-1">
                                {!areAllMilestonesApproved &&
                                  task?.amountType !== "HOURLY" &&
                                  (user?.profile[0]?.type === "TR" ||
                                    (user?.profile[0]?.type === "TE" &&
                                      team?.id)) &&
                                  milestone[index]?.status == "APPROVAL_PENDING" && (
                                    <>
                                      <Icon
                                        icon="line-md:plus-square-filled"
                                        className={`btn-sm ${totalAmount === amount ? "disabled" : ""}`}
                                        width={24}
                                        height={24}
                                        onClick={() => {
                                          const incomplete =
                                            !data.amount ||
                                            !data.date ||
                                            !data.title ||
                                            !data.details;
                                          if (incomplete) {
                                            setError(
                                              "Please fill in all fields for this milestone before adding a new one."
                                            );
                                            return;
                                          }
                                          setError("");
                                          setMilestones((prev: any) => [
                                            ...prev,
                                            {
                                              amount: "",
                                              status: "APPROVAL_PENDING",
                                              title: "",
                                              details: "",
                                              date: "",
                                            },
                                          ]);
                                        }}
                                      />
                                      <Icon
                                        icon="line-md:minus-square-filled"
                                        className="mx-1 btn-sm"
                                        width={24}
                                        height={24}
                                        onClick={() => onDelete(data.id, index)}
                                      />
                                    </>
                                  )}
                                {user?.profile?.length > 0 &&
                                  user?.profile[0]?.type === "TE" &&
                                  task?.amountType == "FIXED" ? (
                                  milestone[index]?.isTEApproved ? (
                                    <span className="p-2">✔</span>
                                  ) : (
                                    <button
                                      className="btn rounded-pill bg-gradient-success text-white border-0 mx-1 my-1"
                                      onClick={() => handleApprove(index)}
                                    >
                                      Accept
                                    </button>
                                  )
                                ) : (
                                  null
                                )}
                                {user?.profile?.[0]?.type === "TR" &&
                                  (task?.amountType === "HOURLY" ||
                                    milestone[index]?.isTEApproved) ? (
                                  <button
                                    className="btn rounded-pill bg-gradient2 border-0 mx-1 my-1"
                                    disabled={hasActiveDispute || milestone[index]?.status === "PAID"}
                                    onClick={() => handlePayNow(data)}
                                  >
                                    {milestone[index]?.status === "FUNDED"
                                      ? "Pay Now"
                                      : milestone[index]?.status === "PAID"
                                        ? "PAID"
                                        : milestone[index]?.status ===
                                          "PAYMENT_PENDING" ||
                                          milestone[index]?.status === "APPROVED"
                                          ? "Fund Now"
                                          : ""}
                                  </button>
                                ) : (
                                  ""
                                )}
                              </div>
                            </td>
                          }
                        </tr>
                      ))}
                    <tr>
                      <td colSpan={colSpanValue} className="text-start">
                        <span className="pt-3 pb-3">
                          Total Amount :
                          <span className="text-white ms-2">
                            ${String(totalAmount)}
                          </span>
                        </span>
                        {(user?.profile[0]?.type === "TR" || (user?.profile[0]?.type === "TE" && team?.id)) ? (
                          <div className="d-flex justify-content-between flex-wrap">
                            <div className="text-danger fs-12">
                              * Total amount should be equal to proposal amount
                            </div>
                            {user?.profile?.[0]?.type === "TR" && (
                              <div className="fs-12" style={{ color: '#999999'}}>
                                Note: Platform service fee of 20% will be deducted on each
                                milestone
                              </div>
                            )}
                          </div>
                        ) : null}
                        {(user?.profile[0]?.type === "TE" && team?.id) ? (
                          <div className="fw-bold text-warning fs-14">
                            * You need to submit the milestones first before ACCEPTING them
                          </div>
                        ) : null}
                        {user?.profile[0]?.type === "TR" ? null : (
                            !areAllMilestonesApproved &&
                            ((task?.status !== "COMPLETED" &&
                              task?.status !== "INPROGRESS") ||
                              (task?.amountType === "HOURLY" &&
                                task?.status === "INPROGRESS")) && (
                              <div className="mt-3 mb-3">
                                <input
                                  type="checkbox"
                                  checked={checkConditions}
                                  id={"Teams"}
                                  // className="form-check-input bg-dark border-light"
                                  className="form-check-input"
                                  onChange={() => {
                                    if (checkConditions) {
                                      setCheckConditions(false);
                                      termsConditions(false);
                                    } else {
                                      setCheckConditions(true);
                                      termsConditions(true);
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={"Terms"}
                                  className="form-check-label ms-2"
                                >
                                  <HtmlData
                                    data={"I agree to the terms and conditions"}
                                    className="text-white fs-14"
                                  />
                                </label>
                              </div>
                            )
                          )}

                        {(user?.profile[0]?.type === "TR" ||
                          (user?.profile[0]?.type === "TE" && team?.id)) &&
                          task?.status !== "COMPLETED" &&
                          task?.status !== "INPROGRESS" &&
                          !areAllMilestonesApproved && (
                            <div className="d-flex justify-content-end mt-3">
                              <button
                                type="button"
                                className="btn btn-primary bg-gradient1 text-white border-0 mt-2"
                                disabled={hasActiveDispute || totalAmount !== amount || isSubmitting}
                                onClick={handleSubmit}
                              >
                                {isSubmitting ? "Submitting..." : "Submit"}
                              </button>
                            </div>
                        )}

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
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          }
          {submitReviewMilestoneCheck && <SubmitReviewMilestone setsubmitReviewMilestoneCheck={setsubmitReviewMilestoneCheck} reviewMilestone={reviewMilestone} taskId={task?.id} revieweeTeamId={team?.id} getContract={getContract} task={task} />}
        </ModalWrapper>
        {/* <div
          className="modal fade"
          id="exampleHiredProposal"
          aria-hidden="true"
          aria-labelledby="exampleModalHiredProposal"
          tabIndex={-1}
        >
          {!submitReviewMilestoneCheck && <div className="modal-dialog modal-dialog-centered modal-dialog modal-xl">
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
              </div>
              <div className="modal-body">
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="table-responsive">
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">SR</th>
                        <th scope="col-2">Title</th>
                        <th scope="col-3">Description</th>
                        {(team?.id && (
                          (user?.profile[0]?.type === "TE") ||
                          (user?.profile[0]?.type === "TR" && !(
                            milestone?.length > 0 && milestone.every((m: any) => m?.status === "APPROVAL_PENDING")
                          ))
                        )) ? (
                          <th scope="col">Member Name</th>
                        ) : null}
                        {task?.amountType == "HOURLY" && <th>Hours</th>}
                        <th scope="col">Amount</th>
                        <th scope="col">Date</th>
                        <th scope="col">Status</th>
                        {( ((
                          milestone?.length > 0 && milestone.every((m: any) => m?.status === "FUNDED"|| m?.status === "PAID")
                        ))) ? (
                          <th scope="col" style={{ textAlign: "center" }}>Review</th>
                        ) : null}
                        {!(
                          user?.profile[0]?.type === "TE" &&
                          task?.amountType === "HOURLY"
                        ) && (
                            <th scope="col-2" className="text-center">
                              Action
                            </th>
                          )}
                      </tr>
                    </thead>
                    <tbody className="table-dark">
                      {milestone?.length > 0 &&
                        milestone.map((data: any, index: number) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              {user?.profile[0]?.type === "TR" &&
                                task?.amountType === "FIXED" &&
                                milestone[index]?.status === "APPROVAL_PENDING" ||
                                (user?.profile[0]?.type === "TE" && proposal?.team?.id && milestone[index]?.status == "APPROVAL_PENDING") ? (
                                <input
                                  type="text"
                                  value={
                                    task?.amountType === "HOURLY"
                                      ? `Week ${data?.week || ''}`
                                      : data?.title || ''
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
                              ) : (
                                <span className="text-white">
                                  {task?.amountType === "HOURLY"
                                    ? `Week ${data?.week}`
                                    : data?.title}
                                </span>
                              )}
                            </td>
                            <td>
                              {task?.amountType === "HOURLY" ? (
                                <button
                                  className="btn rounded-pill btn-outline-info mx-1 my-1"
                                  onClick={() => setId(index)}
                                >
                                  Hours Log
                                </button>
                              ) : user?.profile[0]?.type === "TR" &&
                                task?.amountType === "FIXED" &&
                                milestone[index]?.status == "APPROVAL_PENDING" ||
                                (user?.profile[0]?.type === "TE" && proposal?.team?.id && milestone[index]?.status == "APPROVAL_PENDING") ? (
                                <textarea
                                  value={data?.details || ''}
                                  readOnly={
                                    (user?.profile[0]?.type === "TE" &&
                                      !team?.id) ||
                                    areAllMilestonesApproved
                                  }
                                  className="form-control text-white"
                                  id="exampleFormControlInput2"
                                  placeholder="Description"
                                  rows={1}
                                  style={{ resize: 'none', overflow: 'hidden' }}
                                  onInput={(e) => {
                                    const target = e.target as HTMLTextAreaElement;
                                    target.style.height = 'auto';
                                    target.style.height = target.scrollHeight + 'px';
                                  }}
                                  onChange={(e) => handleDetails(e, index)}
                                />
                              ) : (
                                <span className="text-white">
                                  {data?.details}
                                </span>
                              )}
                            </td>
                            {team?.id && user?.profile[0]?.type === "TE" ? (
                              <td>
                                <select
                                  value={data?.teamMemberProfileId || data?.teProfileId}
                                  className={`form-select form-select-sm border-0 py-2 px-4 ${milestone[index]?.status === "APPROVAL_PENDING"
                                    ? "bg-gray text-white"
                                    : "bg-gray-300 text-gray-500"
                                    }`}
                                  id="taskDropdown"
                                  disabled={milestone[index]?.status !== "APPROVAL_PENDING"}
                                  defaultValue=""
                                  onChange={(e) => handleTeam(e?.target?.value, index)}
                                >
                                  <option value="" disabled>
                                    Select Member
                                  </option>
                                  {(() => {
                                    const uniqueMembers = new Map();
                                    team?.teamMembers?.forEach((dataTeam: any) => {
                                      const memberId = dataTeam?.memberProfileId;
                                      if (memberId && !uniqueMembers.has(memberId)) {
                                        uniqueMembers.set(memberId, dataTeam);
                                      }
                                    });
                                    return Array.from(uniqueMembers.values()).map((dataTeam: any) => (
                                      <option
                                        value={dataTeam?.memberProfileId}
                                        key={dataTeam?.id}
                                      >
                                        {dataTeam?.profile?.user?.firstName} {dataTeam?.profile?.user?.lastName}
                                      </option>
                                    ));
                                  })()}
                                </select>
                              </td>
                            ) : (
                              (milestone[index]?.status === "APPROVED" || milestone[index]?.status === "FUNDED" || milestone[index]?.status === "PAYMENT_PENDING" || milestone[index]?.status === "PAID") &&
                                user?.profile[0]?.type === "TR" &&
                                team?.id ? (
                                <td>
                                  <span>
                                    {team?.teamMembers?.find(
                                      (member: any) => member?.memberProfileId === (task?.amountType==='HOURLY' ?data?.teProfileId :data?.teamMemberProfileId )
                                    )?.profile?.user?.firstName || "N/A"}{" "}
                                    {team?.teamMembers?.find(
                                      (member: any) => member?.memberProfileId === (task?.amountType==='HOURLY' ?data?.teProfileId :data?.teamMemberProfileId )
                                    )?.profile?.user?.lastName || ""}
                                  </span>
                                </td>
                              ) : null
                            )}
                            {task?.amountType === "HOURLY" && (
                              <td>
                                <span className="mt-2">
                                  {Math.floor(data?.totalHours / 60)}h{" "}
                                  {data?.totalHours % 60}m
                                </span>
                              </td>
                            )}
                            <td>
                              {user?.profile[0]?.type === "TR" &&
                                task?.amountType === "FIXED" &&
                                milestone[index]?.status == "APPROVAL_PENDING" ||
                                (user?.profile[0]?.type === "TE" && proposal?.team?.id && milestone[index]?.status == "APPROVAL_PENDING") ? (
                                <input
                                  type="number"
                                  value={
                                    task?.amountType == "HOURLY"
                                      ? data?.maxAmount || ''
                                      : data?.amount || ''
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
                              ) : (
                                <span className="text-white">
                                  {task?.amountType == "HOURLY"
                                    ? data?.maxAmount
                                    : data?.amount}
                                </span>
                              )}
                            </td>
                            <td>
                              {user?.profile[0]?.type === "TR" &&
                                task?.amountType === "FIXED" &&
                                milestone[index]?.status == "APPROVAL_PENDING" ||
                                (user?.profile[0]?.type === "TE" && proposal?.team?.id && milestone[index]?.status == "APPROVAL_PENDING") ? (
                                <input
                                  type="date"
                                  className="bg-gray text-white border-0 p-1"
                                  style={{
                                    colorScheme: 'dark',
                                    '--webkit-calendar-picker-indicator-color': 'white',
                                    '--webkit-calendar-picker-indicator-filter': 'invert(1)'
                                  } as React.CSSProperties}
                                  disabled={
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
                                  onClick={(e) => {
                                    if (!e.currentTarget.disabled) {
                                      e.currentTarget.showPicker?.();
                                    }
                                  }}
                                />
                              ) : (
                                <span className="text-white">
                                  {formatDate(data?.date || data?.createdAt)}
                                </span>
                              )}
                            </td>
                            <td>
                              {data?.status === "APPROVAL_PENDING"
                                ? "Pending"
                                : data?.status}
                            </td>
                            {(milestone?.length > 0 && milestone.every((m: any) => m?.status === "FUNDED" ||m?.status === "PAID" )) && (
                              <td style={{ textAlign: "center" }}>
                                {milestone[index]?.milestonereview?.rating ? (
                                  <span>
                                    {renderStars(milestone[index]?.milestonereview?.rating)}
                                  </span>
                                ) : (
                                  <>
                                    {user?.profile[0]?.type === "TR" && (
                                      <button
                                        className="btn rounded-pill btn-outline-info mx-1 my-1"
                                        onClick={() => submitReviewMilestoneModal(milestone[index])}
                                      >
                                        Submit Review
                                      </button>
                                    )}
                                    {user?.profile[0]?.type === "TE" && <span>—</span>}
                                  </>
                                )}
                              </td>
                            )}
                            <td className="d-flex align-items-center justify-content-center">
                              {!areAllMilestonesApproved &&
                                task?.amountType !== "HOURLY" &&
                                (user?.profile[0]?.type === "TR" ||
                                  (user?.profile[0]?.type === "TE" &&
                                    team?.id)) &&
                                milestone[index]?.status == "APPROVAL_PENDING" && (
                                  <>
                                    <Icon
                                      icon="line-md:plus-square-filled"
                                      className={`text-info mx-1 btn-sm ${totalAmount === amount ? "disabled" : ""}`}
                                      width={24}
                                      height={24}
                                      onClick={() => {
                                        const incomplete =
                                          !data.amount ||
                                          !data.date ||
                                          !data.title ||
                                          !data.details;
                                        if (incomplete) {
                                          setError(
                                            "Please fill in all fields for this milestone before adding a new one."
                                          );
                                          return;
                                        }
                                        setError("");
                                        setMilestones((prev: any) => [
                                          ...prev,
                                          {
                                            amount: "",
                                            status: "APPROVAL_PENDING",
                                            title: "",
                                            details: "",
                                            date: "",
                                          },
                                        ]);
                                      }}
                                    />
                                    <Icon
                                      icon="line-md:minus-square-filled"
                                      className="text-info mx-1 btn-sm"
                                      width={24}
                                      height={24}
                                      onClick={() => onDelete(data.id, index)}
                                    />
                                  </>
                                )}
                              {user?.profile?.length > 0 &&
                                user?.profile[0]?.type === "TE" &&
                                task?.amountType == "FIXED" ? (
                                milestone[index]?.isTEApproved ? (
                                  <span className="mx-1">✔</span>
                                ) : (
                                  <button
                                    className="btn rounded-pill btn-outline-info mx-1 my-1"
                                    onClick={() => handleApprove(index)}
                                  >
                                    Accept
                                  </button>
                                )
                              ) : (
                                null
                              )}
                              {user?.profile?.[0]?.type === "TR" &&
                                (task?.amountType === "HOURLY" ||
                                  milestone[index]?.isTEApproved) ? (
                                <button
                                  className="btn rounded-pill btn-outline-info mx-1 my-1"
                                  disabled={hasActiveDispute || milestone[index]?.status === "PAID"}
                                  onClick={() => handlePayNow(data)}
                                >
                                  {milestone[index]?.status === "FUNDED"
                                    ? "Pay Now"
                                    : milestone[index]?.status === "PAID"
                                      ? "PAID"
                                      : milestone[index]?.status ===
                                        "PAYMENT_PENDING" ||
                                        milestone[index]?.status === "APPROVED"
                                        ? "Fund Now"
                                        : ""}
                                </button>
                              ) : (
                                ""
                              )}
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td colSpan={10}>
                          <span className="pt-3 pb-3">
                            Total Amount :
                            <span className="text-white ms-2">
                              ${String(totalAmount)}
                            </span>
                          </span>
                          {(user?.profile[0]?.type === "TR" || (user?.profile[0]?.type === "TE" && team?.id)) ? (
                            <div className="text-danger fs-12">
                              * Total amount should be equal to proposal amount
                            </div>
                          ) : null}
                          {(user?.profile[0]?.type === "TE" && team?.id) ? (
                            <div className="fw-bold text-warning fs-14">
                              * You need to submit the milestones first before ACCEPTING them
                            </div>
                          ) : null}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {user?.profile[0]?.type === "TR" ? (
                    <div className="text-warning fs-12">
                      Note: Platform service fee of 20% will be deducted on each
                      milestone
                    </div>
                  ) : (
                    !areAllMilestonesApproved &&
                    ((task?.status !== "COMPLETED" &&
                      task?.status !== "INPROGRESS") ||
                      (task?.amountType === "HOURLY" &&
                        task?.status === "INPROGRESS")) && (
                      <div className="mb-3">
                        <input
                          type="checkbox"
                          checked={checkConditions}
                          id={"Teams"}
                          className="form-check-input bg-dark border-light"
                          onChange={() => {
                            if (checkConditions) {
                              setCheckConditions(false);
                              termsConditions(false);
                            } else {
                              setCheckConditions(true);
                              termsConditions(true);
                            }
                          }}
                        />
                        <label
                          htmlFor={"Terms"}
                          className="form-check-label ms-2"
                        >
                          <HtmlData
                            data={"I agree to the terms and conditions"}
                            className="text-white"
                          />
                        </label>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <div className="d-grid gap-2"></div>
                {(user?.profile[0]?.type === "TR" ||
                  (user?.profile[0]?.type === "TE" && team?.id)) &&
                  task?.status !== "COMPLETED" &&
                  task?.status !== "INPROGRESS" &&
                  !areAllMilestonesApproved && (
                    <button
                      type="button"
                      className="btn btn-primary"
                      disabled={hasActiveDispute || totalAmount !== amount || isSubmitting}
                      onClick={handleSubmit}
                    >
                      {isSubmitting ? "Submitting..." : "Submit"}
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
          </div>}
          {submitReviewMilestoneCheck && <SubmitReviewMilestone setsubmitReviewMilestoneCheck={setsubmitReviewMilestoneCheck} reviewMilestone={reviewMilestone} taskId={task?.id} revieweeTeamId={team?.id} getContract={getContract} task={task} />}

        </div> */}

        {isAccept && (
          <StripeModal isOpen={isAccept} closeFn={closeFn} data={payData} />
        )}
        <HourlyLogModal task={task} weekIndex={weekIndex} />

      </div>
    </div>
  );
};

export default Hire;