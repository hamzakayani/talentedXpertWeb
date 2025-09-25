"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { RootState, useAppDispatch } from "@/store/Store";
import { useSelector } from "react-redux";
import { requests } from "@/services/requests/requests";
import apiCall from "@/services/apiCall/apiCall";
import ImageFallback from "@/components/common/ImageFallback/ImageFallback";
import HtmlData from "@/components/common/HtmlData/HtmlData";
import Hire from "@/components/common/Modals/Hire";
import SubmitReview from "@/components/common/Modals/SubmitReview";
import Contract from "@/components/common/Modals/Contract";
import { setThread } from "@/reducers/ThreadSlice";
import ConnectNotVerified from "@/components/common/Modals/ConnectNotVerified";
import { Modal } from "bootstrap";

import ReportHours from "./ReportHours";
import { useNavigation } from "@/hooks/useNavigation";
import { toast } from "react-toastify";
import DeleteConfirmation from "@/components/common/Modals/DeleteConfirmation";
import RatingStar from "@/components/common/RatingStar/RatingStar";
import DisputeModal from "@/components/common/Modals/DisputeModal";
import defaultUserImg from "../../../../public/assets/images/default-user.jpg";
import { dynamicBlurDataUrl } from "@/services/utils/dynamicBlurImage";
import { getTimeago } from "@/services/utils/util";
import BackButton from "@/components/common/backButton/BackButton";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, DollarCircleIcon } from "@hugeicons/core-free-icons";
import ProposalsList from "./ProposalsList";

const ViewTasks = () => {
  const [proposal, setProposal] = useState<any>({});
  const [contracts, setContracts] = useState<any>({});
  const [milestones, setMilestones] = useState<any>([]);
  const [dispute, setDispute] = useState<any>([]);
  const [hoursSubmit, setHoursSubmit] = useState<boolean>(false);
  const [details, setDetails] = useState<any>();
  const [hasMatchingThread, setHasMatchingThread] = useState<boolean>(false); // New state for thread existence
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const { id } = useParams();
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [addReview, setAddReview] = useState<boolean>(false);
  const [areAllMilestonesApproved, setAreAllMilestonesApproved] =
    useState<boolean>(false);
  const [proposalCount, setPrposalCount] = useState<number>(0);
  const [stripeDetail, setStripeDetail] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState("");
  const [skip, setSkip] = useState<boolean>(true);
  const [team, setTeam] = useState<any>([]);
  const { navigate } = useNavigation();
  const time = getTimeago(details?.createdAt);
  const [openDesc, setOpenDesc] = useState<boolean>(true);
  const [openQs, setOpenQs] = useState<boolean>(false);

  const [milstoneModal, setMilestoneModal] = useState<boolean>(false);
  const [disputeModal, setDisputeModal] = useState<boolean>(false);

  const getMessageThread = async (proposal: any, navigate: boolean = false) => {
    try {
      const response = await apiCall(
        requests.getThread,
        {
          taskId: proposal?.taskId,
        },
        "get",
        false,
        dispatch,
        user,
        router
      );
      const matchingThread = response?.data?.threads?.find(
        (thread: any) => thread.expertProfileId === proposal.expertProfileId
      );

      console.log("check of thread", hasMatchingThread);
      if (matchingThread) {
        setHasMatchingThread(true); // Set state to true if thread exists
        dispatch(setThread(matchingThread));
        if (navigate) {
          router.push(`/dashboard/messages/${matchingThread?.id}`);
        }
      } else {
        setHasMatchingThread(false); // Set state to false if no thread exists
      }
    } catch (error) {
      console.warn("Error fetching threads", error);
      setHasMatchingThread(false);
    }
  };

  useEffect(() => {
    if (isAuth && proposal?.taskId) {
      getMessageThread(proposal); // Check for thread on proposal change
    }
  }, [isAuth, proposal]);

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

  useEffect(() => {
    fetchBlurDataURL();
  }, [details?.requesterProfile?.user?.profilePicture]);

  const fetchBlurDataURL = async () => {
    if (details?.requesterProfile?.user?.profilePicture?.fileUrl) {
      const blurUrl = await dynamicBlurDataUrl(
        details?.requesterProfile?.user?.profilePicture.fileUrl
      );
      setProfileImageBlurDataURL(blurUrl);
    }
  };

  const getTeam = async (id: number) => {
    await apiCall(
      requests.teams,
      { id: id },
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        if (res?.data?.data?.teams?.length > 0) {
          setTeam({
            ...res?.data?.data?.teams[0],
            teamMembers: [
              ...res?.data?.data?.teams[0].teamMembers,
              {
                id: res?.data?.data?.teams[0]?.id,
                memberProfileId:
                  res?.data?.data?.teams[0]?.createdByProfile?.id,
                profile: res?.data?.data?.teams[0]?.createdByProfile,
              },
            ],
          });
        }
      })
      .catch((err) => console.warn(err));
  };

  const getTask = async (id: number) => {
    await apiCall(
      requests.getTaskId + id,
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        const taskData = res?.data?.data?.task || [];
        setDetails(taskData);

        // Set milestones for hourly tasks immediately
        if (taskData?.amountType === "HOURLY") {
          setMilestones(taskData?.weeklyMilestones || []);
        }
      })
      .catch((err) => console.warn(err));
  };

  const getContract = async () => {
    if (!proposal?.id) return;

    await apiCall(
      requests.getContract,
      { proposalId: Number(proposal?.id) },
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        const contractData = res?.data?.data.contracts[0] || [];
        setContracts(contractData);

        // Set milestones for non-hourly tasks
        if (contractData?.id && details?.amountType !== "HOURLY") {
          setMilestones(contractData?.milestones || []);
        }
      })
      .catch((err) => console.warn(err));
  };

  const getdisputes = async (id: number) => {
    const data = { taskId: id };
    try {
      const response = await apiCall(
        requests?.dispute,
        data,
        "get",
        false,
        dispatch,
        user,
        router
      );
      setDispute(response?.data?.data?.disputes || []);
    } catch (error) {
      console.warn("Error fetching disputes:", error);
    }
  };

  const closeContract = () => {
    // setShowModal(false);
    getContract();
  };

  const getProposal = async (id: number) => {
    let params: any = "?taskId=" + id;
    params += "&limit=" + 1;
    params += "&page= " + 1;
    await apiCall(
      `${requests.getProposals}${params}`,
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        setProposal(res?.data?.data?.proposals[0] || {});
        setPrposalCount(res?.data?.data?.count || 0);
      })
      .catch((err) => console.warn(err));
  };

  const onDelete = async (id: number) => {
    apiCall(requests.editTask + id, "", "delete", false, dispatch, user, router)
      .then((res: any) => {
        let message: any;
        if (res?.error) {
          message = res?.error?.message;
          if (Array.isArray(message)) {
            message?.map((msg: string) =>
              toast.error(msg ? msg : "Something went wrong, please try again")
            );
          } else {
            toast.error(
              message ? message : "Something went wrong, please try again"
            );
          }
        } else {
          router.push("/dashboard/tasks");
        }
      })
      .catch((err) => console.warn(err));
  };

  useEffect(() => {
    if (isAuth) {
      getProposal(Number(id));
      getConnectAccount();
    }
  }, [isAuth, id]);

  useEffect(() => {
    if (isAuth && proposal?.id) getContract();
    if (isAuth && proposal?.teamId) getTeam(proposal?.teamId);
  }, [proposal, isAuth]);

  useEffect(() => {
    getTask(Number(id));
    if (isAuth) getdisputes(Number(id));
  }, [id, hoursSubmit]);

  useEffect(() => {
    if (milestones?.length > 0) {
      setAddReview(
        milestones?.every((milestone: any) => milestone.status === "PAID") &&
          details?.reviews?.length !== 2 &&
          (!dispute || dispute.length === 0 || !dispute.some((d: any) => d.id))
      );

      setAreAllMilestonesApproved(
        milestones?.every(
          (milestone: any) =>
            milestone.status === "APPROVED" ||
            milestone.status === "PAID" ||
            milestone.status === "FUNDED"
        ) || false
      );
    }
  }, [milestones, details, dispute]);

  // Ensure milestones are properly set when details or contracts change
  useEffect(() => {
    if (details?.id) {
      if (details?.amountType === "HOURLY" && details?.weeklyMilestones) {
        setMilestones(details.weeklyMilestones);
      } else if (contracts?.id && contracts?.milestones) {
        setMilestones(contracts.milestones);
      }
    }
  }, [details, contracts]);

  const formatedDate = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const closeMileStoneModal = () => {
    setMilestoneModal(false);
  };

  // Derive a friendly duration label from start/end dates
  const getDurationLabel = () => {
    try {
      if (!details?.startDate || !details?.endDate) return "";
      const start = new Date(details.startDate);
      const end = new Date(details.endDate);
      const diffMs = Math.max(0, end.getTime() - start.getTime());
      const months = Math.max(
        1,
        Math.round(diffMs / (1000 * 60 * 60 * 24 * 30))
      );
      return `${months} month${months > 1 ? "s" : ""} duration`;
    } catch {
      return "";
    }
  };

  const closeDisputeModal = () => {
    setDisputeModal(false);
  };

  return (
    <div>
      <div
        className="dashboard-card"
        style={{
          minHeight: 86,
          position: "relative",
          border: "1px solid #333333",
        }}
      >
        <div className="d-flex align-items-center mb-3">
          <BackButton
            fontSize="24px"
            color="white"
            style={{ marginLeft: "-8px" }}
          />
          <h4 className="mb-0 ms-2" style={{ color: "var(--color_tertiary)" }}>
            {details?.name || "Task Details"}
          </h4>
        </div>

        <div className="d-flex flex-wrap align-items-center gap-3 mb-4">
          {details?.taskType && (
            <small className="text-white-50 onlinetag">
              {details?.taskType}
            </small>
          )}
          {details?.categories[0]?.category?.name && (
            <small
              className="text-white-50 "
              style={{
                borderColor: "var(--color_grey)",
                color: "var(--color_tertiary)",
              }}
            >
              {details?.categories[0]?.category?.name}
            </small>
          )}
          {getDurationLabel() && (
            <small
              className="text-white-50 d-inline-flex align-items-center"
              style={{ gap: 6 }}
            >
              <Icon
                icon="hugeicons:clock-01"
                width={16}
                height={16}
                style={{ color: "currentColor" }}
              />
              {getDurationLabel()}
            </small>
          )}
        </div>

        <div className="row g-3">
          <div className="col-12 col-lg-8">
            <div className="p-4 stat-card">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="d-flex align-items-center">
                  <Link
                    className="text-lg-end card-profile d-block"
                    href={`/dashboard/talent-requestors/${details?.requesterProfile?.userId}`}
                    onClick={() =>
                      navigate(
                        `/dashboard/talent-requestors/${details?.requesterProfile?.userId}`
                      )
                    }
                  >
                    <ImageFallback
                      src={
                        details?.requesterProfile?.user?.profilePicture?.fileUrl
                      }
                      alt="img"
                      className="img-round me-3"
                      width={56}
                      height={56}
                      loading="lazy"
                      blurDataURL={profileImageBlurDataURL}
                      userName={
                        details?.requesterProfile?.user
                          ? `${details?.requesterProfile?.user?.firstName} ${details?.requesterProfile?.user?.lastName}`
                          : null
                      }
                    />
                  </Link>
                  <div>
                    <p
                      className="mb-1 fw-medium"
                      style={{ color: "var(--color_tertiary)" }}
                    >
                      {details?.requesterProfile?.user?.firstName}{" "}
                      {details?.requesterProfile?.user?.lastName}
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      <RatingStar
                        rating={
                          details?.requesterProfile?.averageRating
                            ? details?.requesterProfile?.averageRating
                            : 0
                        }
                      />
                      {/* <div className="text-white small">Tasks Completed: {details?.requesterProfile?.tasksCompleted || 0}</div> */}
                      {/* 
                      <span className="text-white-50 small">{details?.requesterProfile?.averageRating?.toFixed ? details?.requesterProfile?.averageRating?.toFixed(1) : details?.requesterProfile?.averageRating || 0}</span> */}
                    </div>
                  </div>
                </div>
                <div className="text-end mt-3 mt-lg-0 d-flex flex-column gap-2">
                  {details?.createdAt && (
                    <div className="text_grayish small">
                      Member since {new Date(details?.createdAt).getFullYear()}
                    </div>
                  )}
                  <div className="text-success small">✓ Payment Verified</div>
                </div>
              </div>

              {/* <div className="d-flex flex-wrap align-items-center gap-3 mt-3">
                {details?.status && (
                  <span className={`badge rounded-pill ${details?.status === 'INPROGRESS' ? 'text-bg-warning' : details?.status === 'COMPLETED' ? 'text-bg-success' : details?.status === 'POSTED' ? 'text-bg-primary' : details?.status === 'CLOSED' ? 'text-bg-danger' : 'bg-dark border'}`}>
                          {details?.status}
                        </span>
                )}
              </div> */}
            </div>

            <div
              className="mt-3 bg_neutral_800"
              style={{
                border: "1px solid var(--color_grey)",
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <button
                type="button"
                className="w-100 d-flex justify-content-between align-items-center p-3 bg-dark text-start bg_neutral_800"
                onClick={() => setOpenDesc(!openDesc)}
                aria-expanded={openDesc}
                style={{
                  color: "var(--color_tertiary)",
                  border: "none",
                  width: "100%",
                  maxWidth: 774,
                  height: 43,
                  borderRadius: 8,
                  opacity: 1,
                  background: "#333333",
                }}
              >
                <p className="m-0 fw-medium">Project Description</p>
                <Icon
                  icon="mdi:chevron-down"
                  style={{
                    transition: "transform 200ms ease",
                    transform: openDesc ? "rotate(0deg)" : "rotate(180deg)",
                  }}
                />
              </button>
              {openDesc && (
                <div className="py-1 px-3">
                  <HtmlData data={details?.details} className="text-white" />
                </div>
              )}
            </div>

            {details?.interviewQuestions?.length > 0 && (
              <div
                className="mt-3 bg_neutral_800"
                style={{
                  border: "1px solid var(--color_grey)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  className="w-100 d-flex justify-content-between align-items-center p-3 bg-dark text-start bg_neutral_800"
                  onClick={() => setOpenQs(!openQs)}
                  aria-expanded={openQs}
                  style={{
                    color: "var(--color_tertiary)",
                    border: "none",
                    width: "100%",
                    maxWidth: 774,
                    height: 43,
                    borderRadius: 8,
                    opacity: 1,
                    background: "#333333",
                  }}
                >
                  <p className="m-0 fw-medium">Interview Questions</p>
                  <Icon
                    icon="mdi:chevron-down"
                    style={{
                      transition: "transform 200ms ease",
                      transform: openQs ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  />
                </button>
                {openQs && (
                  <div className="p-3">
                    {/* <div className="form-floating mb-2">
                      <input
                        type="text"
                        className="form-control"
                        id="text"
                        placeholder="Your Answer..."
                        value="Your Answer..."
                      />

                      <label htmlFor="floatingInput">
                        What is your experience with React Native development?{" "}
                        <span>*</span>
                      </label>
                    </div> */}
                    <ul
                      className="mb-0"
                      style={{ listStyle: "none", padding: 0 }}
                    >
                      {details?.interviewQuestions?.map(
                        (q: any, idx: number) => (
                          <li key={idx} className="mb-2 text-white-50">
                            <span> {q?.question}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {isAuth && details?.documents?.length > 0 && (
              <div
                className="mt-3"
                style={{
                  border: "1px solid var(--color_grey)",
                  borderRadius: 12,
                }}
              >
                <div className="p-3">
                  <h6
                    className="mb-3"
                    style={{ color: "var(--color_tertiary)" }}
                  >
                    Documents
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {details?.documents?.map((doc: any) => {
                      const url: string = doc?.fileUrl || "";
                      const name: string =
                        doc?.key || url.split("/").pop() || "Document";
                      const ext = (name.split(".").pop() || "").toLowerCase();
                      let icon = "mdi:file-document-outline";
                      if (
                        ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
                          ext
                        )
                      )
                        icon = "mdi:file-image-outline";
                      else if (ext === "pdf") icon = "mdi:file-pdf-box";
                      else if (["xls", "xlsx", "csv"].includes(ext))
                        icon = "mdi:file-excel-box";
                      else if (["ppt", "pptx"].includes(ext))
                        icon = "mdi:file-powerpoint-box";
                      else if (["zip", "rar", "7z"].includes(ext))
                        icon = "mdi:folder-zip-outline";
                      else if (["mp4", "mov", "avi", "mkv"].includes(ext))
                        icon = "mdi:file-video-outline";

                      return (
                        <Link
                          key={doc.fileUrl}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "8px 12px",
                            border: "1px solid #333333",
                            borderRadius: 999,
                            color: "var(--color_tertiary)",
                            background: "rgba(255,255,255,0.02)",
                          }}
                        >
                          <span
                            style={{
                              display: "inline-flex",
                              width: 22,
                              height: 22,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 6,
                              background: "rgba(255,255,255,0.06)",
                              border: "1px solid #333333",
                            }}
                          >
                            <Icon icon={icon} width={16} height={16} />
                          </span>
                          <span
                            style={{
                              maxWidth: 220,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {isAuth && details?.requesterProfileId === user?.profile?.[0]?.id && <ProposalsList />}

            {details?.reviews?.length > 0 &&
              details?.reviews?.map(
                (review: any) =>
                  isAuth && (
                    <div
                      className="mt-3 p-3"
                      key={review?.reviewerProfileId}
                      style={{
                        background: "var(--color_black)",
                        border: "1px solid var(--color_grey)",
                        borderRadius: 12,
                      }}
                    >
                      <div className="d-flex">
                        <Link
                          href={`/dashboard/talented-xperts/${review?.reviewerProfile?.userId}`}
                          onClick={() =>
                            navigate(
                              `/dashboard/talented-xperts/${review?.reviewerProfile?.userId}`
                            )
                          }
                        >
                          <ImageFallback
                            src={
                              review?.reviewerProfile?.user?.profilePicture
                                ?.fileUrl
                            }
                            alt="img"
                            className="user-img img-round me-3"
                            width={40}
                            height={40}
                            priority
                            userName={
                              review?.reviewerProfile?.user
                                ? `${review?.reviewerProfile?.user?.firstName} ${review?.reviewerProfile?.user?.lastName}`
                                : null
                            }
                          />
                        </Link>
                        <div className="text-light">
                          <h6 className="mb-1">
                            {review?.reviewerProfile?.user?.firstName}{" "}
                            {review?.reviewerProfile?.user?.lastName}
                          </h6>
                          <RatingStar rating={review?.rating} />
                          <span className="d-block mt-2 text-white-50">
                            {review?.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
              )}

            {isAuth &&
              details?.amountType === "HOURLY" &&
              details?.weeklyMilestones?.length > 0 &&
              details?.weeklyMilestones[0]?.status == "FUNDED" &&
              user?.profile[0].type === "TE" && (
                <div className="mt-3">
                  <ReportHours
                    task={details}
                    hoursSubmit={hoursSubmit}
                    setHoursSubmit={setHoursSubmit}
                    proposalAmount={proposal?.amount}
                  />
                </div>
              )}
          </div>

          <div className="col-12 col-lg-4">
            <div className="p-3 stat-card">
              <h4 className="mb-3" style={{ color: "var(--color_tertiary)" }}>
                Project Details
              </h4>
              <div className="d-flex flex-column gap-2 text-white-50">
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    className="d-inline-flex align-items-center"
                    style={{ gap: 10 }}
                  >
                    <HugeiconsIcon
                      icon={DollarCircleIcon}
                      size={21}
                      color="#ffffff"
                      strokeWidth={1.5}
                    />{" "}
                    Budget
                  </span>
                  <p className="text-white m-0">
                    ${details?.amount}
                    {details?.amountType === "HOURLY" ? " / hr" : ""}
                  </p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    className="d-inline-flex align-items-center"
                    style={{ gap: 10 }}
                  >
                    <Icon
                      icon="hugeicons:calendar-01"
                      width={20}
                      height={20}
                      style={{ color: "#ffffff" }}
                    />
                    Posted
                  </span>
                  <p className="text-white m-0">{time}</p>
                </div>
                {details?.endDate && (
                  <div className="d-flex justify-content-between align-items-center">
                    <span
                      className="d-inline-flex align-items-center"
                      style={{ gap: 10 }}
                    >
                      <Icon
                        icon="hugeicons:calendar-02"
                        width={20}
                        height={20}
                        style={{ color: "#ffffff" }}
                      />
                      Deadline
                    </span>
                    <p className="text-white m-0">
                      {formatedDate(details?.endDate)}
                    </p>
                  </div>
                )}
                <hr className="my-1" />
                <div className="d-flex justify-content-between align-items-center">
                  <span>Experience Level</span>
                  <p className="text-white m-0">
                    {details?.experienceLevel || "—"}
                  </p>
                </div>
                {details?.amountType === "HOURLY" && (
                  <div className="d-flex justify-content-between align-items-center">
                    <span>Hours per week</span>
                    <span className="text-white">30+ hours/week</span>
                  </div>
                )}
              </div>

              {details?.categories?.length > 0 && (
                <div className="mt-3">
                  <p className="text-white mb-2 fw-medium">Skills Required</p>
                  <div className="d-flex flex-wrap gap-2">
                    {details?.categories?.map((cat: any, idx: number) => (
                      <span
                        key={idx}
                        className="badge rounded-pill bg-transparent fw-normal border"
                        style={{
                          borderColor: "var(--color_grey)",
                          color: "var(--color_tertiary)",
                        }}
                      >
                        {cat?.category?.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 d-grid">
                {!isAuth ||
                (user?.profile?.[0]?.type === "TE" && !proposal?.id) ? (
                  <Link
                    className=""
                    href={`/dashboard/tasks/${id}/add-proposal`}
                    onClick={() =>
                      isAuth
                        ? stripeDetail
                          ? navigate(`/dashboard/tasks/${id}/add-proposal`)
                          : "#"
                        : navigate("/signin")
                    }
                    style={{
                      background:
                        "linear-gradient(90deg, #6a5af9 0%, #00c2ff 100%)",
                      color: "#fff",
                      textDecoration: "none",
                      paddingTop: "6px",
                      paddingRight: "16px",
                      paddingBottom: "6px",
                      paddingLeft: "16px",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                      borderRadius: "8px",
                      width: "295px",
                      height: "36px",
                      opacity: 1,
                      boxShadow: "0 6px 16px rgba(0, 194, 255, 0.25)",
                      transition: "transform 150ms ease, box-shadow 150ms ease",
                    }}
                    onMouseEnter={(e: any) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow =
                        "0 10px 24px rgba(0, 194, 255, 0.35)";
                    }}
                    onMouseLeave={(e: any) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow =
                        "0 6px 16px rgba(0, 194, 255, 0.25)";
                    }}
                  >
                    <span className="fw-medium">Submit Proposal</span>
                    {/* <Icon icon="mdi:arrow-right" width={18} height={18} /> */}
                    <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
                  </Link>
                ) : (isAuth && user?.profile?.[0]?.type === "TE" && proposal?.id) && (
                  <>
                    <Link
                      // className="btn btn-outline-info rounded-pill mb-2"
                      href={`/dashboard/tasks/${id}/proposals/${proposal?.id}`}
                      onClick={() =>
                        navigate(
                          `/dashboard/tasks/${id}/proposals/${proposal?.id}`
                        )
                      } 
                      style={{
                        background:
                          "linear-gradient(90deg, #6a5af9 0%, #00c2ff 100%)",
                        color: "#fff",
                        textDecoration: "none",
                        paddingTop: "6px",
                        paddingRight: "16px",
                        paddingBottom: "6px",
                        paddingLeft: "16px",
                        border: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        borderRadius: "8px",
                        width: "295px",
                        height: "36px",
                        opacity: 1,
                        boxShadow: "0 6px 16px rgba(0, 194, 255, 0.25)",
                        transition: "transform 150ms ease, box-shadow 150ms ease",
                      }}
                      onMouseEnter={(e: any) => {
                        e.currentTarget.style.transform = "translateY(-1px)";
                        e.currentTarget.style.boxShadow =
                          "0 10px 24px rgba(0, 194, 255, 0.35)";
                      }}
                      onMouseLeave={(e: any) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow =
                          "0 6px 16px rgba(0, 194, 255, 0.25)";
                      }}
                    >
                      View Proposal
                      <HugeiconsIcon icon={ArrowRight02Icon} size={20} />
                    </Link>
                    {/* {contracts?.id && (
                      <button
                        className="btn btn-outline-info rounded-pill"
                        onClick={() => setShowModal(true)}
                      >
                        View Contract{" "}
                        {contracts?.id && contracts?.isTEApproved ? "✔✔" : "✔"}
                      </button>
                    )} */}
                  </>
                )}
              </div>

              {/* {proposal?.id && details?.status === "INPROGRESS" && (
                <div className="mt-2">
                  {dispute?.length > 0 ? (
                    <button
                      className="btn btn-outline-info rounded-pill w-100"
                      onClick={() => setDisputeModal(true)}
                    >
                      Dispute
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-info rounded-pill w-100"
                      onClick={() => setDisputeModal(true)}
                    >
                      Add Dispute
                    </button>
                  )}
                </div>
              )} */}
            </div>
          </div>
        </div>

        {isAuth && (
          <>
            {proposal?.id && contracts?.id && milstoneModal && (
              <Hire
                milestone={milestones}
                setMilestones={setMilestones}
                proposal={proposal}
                amount={proposal?.amount}
                contract={contracts}
                type={true}
                task={details}
                team={team}
                getContract={getContract}
                handleClose={closeMileStoneModal}
              />
            )}
            <SubmitReview
              taskId={id}
              revieweeId={Number(details?.requesterProfileId)}
            />
            {showModal && (
              <Contract
                taskId={Number(id)}
                proposalId={proposal?.id}
                taskStatus={details?.status}
                isOpen={showModal}
                onClose={closeContract}
                getContractTask={getContract}
              />
            )}

            <DeleteConfirmation
              onClickFunction={onDelete}
              type={"task"}
              id={details?.id}
            />
            {(details?.status === "INPROGRESS" ||
              details?.status === "COMPLETED") &&
              disputeModal && (
                <DisputeModal
                  type={false}
                  taskId={Number(id)}
                  proposalId={proposal?.id}
                  handleClose={closeDisputeModal}
                />
              )}
          </>
        )}
      </div>
    </div>
  );
};

export default ViewTasks;
