"use client";
import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useParams, useRouter } from "next/navigation";
import { RootState, useAppDispatch } from "@/store/Store";
import { useSelector } from "react-redux";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { getTimeago } from "@/services/utils/util";
import defaultUserImg from "../../../../public/assets/images/default-user.jpg";
import ImageFallback from "@/components/common/ImageFallback/ImageFallback";
import { dynamicBlurDataUrl } from "@/services/utils/dynamicBlurImage";
import { setThread } from "@/reducers/ThreadSlice";
import Link from "next/link";
import GradientButton from "@/components/common/GradientButton/GradientButton";
import Hire from "@/components/common/Modals/Hire";
import HtmlData from "@/components/common/HtmlData/HtmlData";
import DisputeModal from "@/components/common/Modals/DisputeModal";
import RejectProposal from "@/components/common/Modals/RejectProposal";
import SubmitReview from "@/components/common/Modals/SubmitReview";
import Contract from "@/components/common/Modals/Contract";
import MemberList from "../teams/ViewTeam/MemberList";
import RatingStar from "@/components/common/RatingStar/RatingStar";
import { useNavigation } from "@/hooks/useNavigation";
import GlobalLoader from "@/components/common/GlobalLoader/GlobalLoader";
import HoursHistory from "../viewTasks/HoursHistory";
import { toast } from "react-toastify";
import { Modal } from "bootstrap";
import BackButton from "@/components/common/backButton/BackButton";
import ModalWrapper from "@/components/common/ModalWrapper/ModalWrapper";

const ViewProposal = () => {
  let { id, proposalId } = useParams();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  const [proposal, setProposal] = useState<any>({});
  const [articles, setArticles] = useState<any>([]);
  const [contracts, setContracts] = useState<any>({});
  const [task, setTask] = useState<any>({});
  const [dispute, setDispute] = useState<any>([]);
  const [limit, setLimit] = useState<number>(10);
  const [page, setPage] = useState<number>(1);
  const [filters, setFilters] = useState<string>("");
  const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState("");
  const [type, setType] = useState<boolean>(false);
  const [wallet, setWallet] = useState<any>({});
  const [count, setCount] = useState<number>(0);
  const [milestones, setMilestones] = useState<any[]>([]);
  
  const [areAllMilestonesApproved, setAreAllMilestonesApproved] =
    useState<boolean>(false);
  const [areAllMilestonesPaid, setAreAllMilestonesPaid] =
    useState<boolean>(false);
  const [addReview, setAddReview] = useState<boolean>(false);
  const [proposalCount, setProposalCount] = useState<number>(0);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showHireConfirmModal, setShowHireConfirmModal] =
    useState<boolean>(false);
  const [teamHours, setTeamHours] = useState<{ [key: number]: number }>({});
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const revieweeId =
    user?.profile[0].type == "TR"
      ? Number(proposal?.expertProfileId)
      : Number(task?.requesterProfileId);
  const [team, setTeam] = useState<any>([]);
  const { navigate } = useNavigation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const hasActiveDispute =
    Array.isArray(dispute) &&
    dispute.some(
      (d: any) => d?.status === "INITIALIZED" || d?.status === "IN_REVIEW"
    );

  const [milstoneModal, setMilestoneModal] = useState<boolean>(false);
  const [disputeModal, setDisputeModal] = useState<boolean>(false);
  const time = getTimeago(proposal?.createdAt);
  const [openDesc, setOpenDesc] = useState<boolean>(true);
  const [openQs, setOpenQs] = useState<boolean>(false);


  // Toggle function for accordion items
  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const formatedDate = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getProposals = async () => {
    try {
      const response = await apiCall(
        requests.getProposals,
        { id: Number(proposalId) },
        "get",
        false,
        dispatch,
        user,
        router
      );
      setProposal(response?.data?.data?.proposals[0] || {});
      setArticles(response.data?.data?.proposals[0].articles || []);
    } catch (error) {
      console.warn("Error fetching tasks:", error);
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
          const teamData = {
            ...res?.data?.data?.teams[0],
            teamMembers: [...res?.data?.data?.teams[0].teamMembers],
          };
          setTeam(teamData);
          // Initialize teamHours state
          const initialTeamHours = teamData.teamMembers.reduce(
            (acc: any, member: any) => {
              acc[member.memberProfileId] = 0;
              return acc;
            },
            {}
          );
          setTeamHours(initialTeamHours);
        }
      })
      .catch((err) => console.warn(err));
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
        }
      })
      .catch((err) => console.warn(err));
  };

  const updateProposals = async (status: string, reason: string) => {
    let data: any = {
      status: status,
      taskId: Number(id),
      ...(status === "REJECTED" && { rejectionReason: reason }),
    };

    if (status === "HIRED" && task?.amountType === "HOURLY") {
      if (proposal?.teamId) {
        const weeklyMilestones = Object.entries(teamHours).map(
          ([profileId, maxHours]) => ({
            profileId: Number(profileId),
            maxHours,
            maxAmount: maxHours * proposal?.amount,
          })
        );

        data = {
          ...data,
          weeklyMilestones,
          maxHours: totalHours,
          maxAmount: totalAmount,
        };
      } else {
        // Create weeklyMilestones for individual expert
        const weeklyMilestones = [
          {
            profileId: proposal?.expertProfileId,
            maxHours: totalHours,
            maxAmount: totalAmount,
          },
        ];

        data = {
          ...data,
          weeklyMilestones,
          maxHours: totalHours,
          maxAmount: totalAmount,
        };
      }
    }

    try {
      const response = await apiCall(
        requests.updateProposal + Number(proposalId),
        data,
        "put",
        false,
        dispatch,
        user,
        router
      );
      if (status === "HIRED") {
        toast.success(
          "Your task is in progress. Now you need to fund the milestone."
        );
      }
      status !== "HIRED"
        ? router.push(`/dashboard/tasks/${id}/proposals`)
        : getProposals();
      getTask();
    } catch (error) {
      console.warn(error);
    }
  };

  const updateTask = async (status: string) => {
    if (
      status === "COMPLETED" &&
      (!task?.reviews?.length ||
        !task?.reviews?.some(
          (review: any) => review?.reviewerProfileId === user?.profile[0]?.id
        ))
    ) {
      toast.error("Kindly submit a review before completing the task");
      return;
    }
    const data = {
      status: status,
    };
    try {
      const response = await apiCall(
        requests.editTask + Number(id),
        data,
        "put",
        false,
        dispatch,
        user,
        router
      );

      if ((status = "COMPLETED")) {
        toast.success("Your Task is completed");
        router.push(`/dashboard/tasks`);
      }
    } catch (error) {
      console.warn(error);
    }
  };

  const getTask = async () => {
    await apiCall(
      requests.getTaskId + Number(id),
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        setTask(res?.data?.data?.task || []);
        setProposalCount(res?.data?.data?.task?.proposals?.length || 0);
        if (res?.data?.data?.task?.amountType === "HOURLY") {
          setMilestones(res?.data?.data?.task?.weeklyMilestones || []);
          setFilterParams();
        }
      })
      .catch((err) => console.warn(err));
  };

  const getContract = async () => {
    await apiCall(
      requests.getContract,
      { proposalId: Number(proposalId) },
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        setContracts(res?.data?.data?.contracts[0] || []);
        if (
          res?.data?.data?.contracts[0]?.milestones.length > 0 &&
          task?.amountType === "FIXED"
        ) {
          setMilestones(res?.data?.data?.contracts[0]?.milestones || []);
          setCount(res?.data?.data?.contracts[0]?.milestones.length || []);
          setType(true);
        }
      })
      .catch((err) => console.warn(err));
  };

  const getDisputes = async (id: number) => {
    const data = {
      taskId: id,
    };
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
      console.warn("Error fetching tasks:", error);
    }
  };

  const getMessageThread = async (proposal: any) => {
    try {
      const response = await apiCall(
        requests.getThread,
        { taskId: proposal?.taskId },
        "get",
        false,
        dispatch,
        user,
        router
      );
      const matchingThread = response?.data?.threads?.find(
        (thread: any) => thread.expertProfileId === proposal.expertProfileId
      );
      if (matchingThread) {
        dispatch(setThread(matchingThread));
        router.push(`/dashboard/messages/${matchingThread?.id}`);
      } else {
        let data = {
          taskId: proposal?.taskId,
          expertProfileId: proposal?.expertProfileId,
          threadType: "TASK",
        };

        let teamData = {
          teamId: proposal.teamId,
          threadType: "TEAM",
        };
        const res = await apiCall(
          requests.createThread,
          proposal.teamId ? teamData : data,
          "post",
          false,
          dispatch,
          user,
          router
        );
        dispatch(setThread(res?.data.thread));
        router.push(`/dashboard/messages/${res?.data.thread?.id}`);
      }
    } catch (error) {
      console.warn("Error fetching threads", error);
    }
  };

  useEffect(() => {
    getTask();
    getDisputes(Number(id));
  }, [id]);

  useEffect(() => {
    if (proposalId) {
      getContract();
      getWallet();
      getProposals();
    }
  }, [proposalId, task.id]);

  useEffect(() => {
    if (contracts?.id) {
      setFilterParams();
    }
  }, [limit, page, contracts, task]);

  useEffect(() => {
    if (proposal?.teamId) {
      getTeam(proposal?.teamId);
    }
  }, [proposal]);

  const setFilterParams = () => {
    let filters = "";
    filters += "?page=" + 1 || "";
    filters += limit > 0 ? "&limit=" + limit : "";
    filters += task?.id ? "&taskId=" + task?.id : "";
    filters += contracts?.id ? "&contractId=" + contracts?.id : "";
    setPage(1);
    setFilters(filters);
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
  };

  useEffect(() => {
    if (milestones?.length > 0) {
      setAreAllMilestonesApproved(
        milestones?.every(
          (milestone: any) =>
            milestone.status === "APPROVED" ||
            milestone.status === "PAID" ||
            milestone.status === "FUNDED"
        ) || false
      );
      setAreAllMilestonesPaid(
        milestones?.every((milestone: any) => milestone.status === "PAID") ||
        false
      );
      const active =
        Array.isArray(dispute) &&
        dispute.some(
          (d: any) => d?.status === "INITIALIZED" || d?.status === "IN_REVIEW"
        );
      setAddReview(
        milestones?.every((milestone: any) => milestone.status === "PAID") &&
        task?.reviews?.length !== 2 &&
        !active
      );
    }
  }, [milestones, dispute]);

  useEffect(() => {
    if (user?.profilePicture?.fileUrl || defaultUserImg) {
      fetchBlurDataURL();
    }
  }, [user?.profilePicture, defaultUserImg]);

  const fetchBlurDataURL = async () => {
    if (user?.profilePicture?.fileUrl || defaultUserImg) {
      const blurUrl = await dynamicBlurDataUrl(
        user?.profilePicture?.fileUrl || defaultUserImg
      );
      setProfileImageBlurDataURL(blurUrl);
    }
  };

  const closeContract = () => {
    getContract();
    setShowModal(false);
  };

  const closeMileStoneModal = () => {
    setMilestoneModal(false);
  };

  

  const handleHireClick = () => {
    setShowHireConfirmModal(true);
    setTotalHours(0);
    setTotalAmount(0);
    if (proposal?.teamId) {
      const initialTeamHours = team.teamMembers.reduce(
        (acc: any, member: any) => {
          acc[member.memberProfileId] = 0;
          return acc;
        },
        {}
      );
      setTeamHours(initialTeamHours);
    }
  };

  const handleConfirmHire = () => {
    setShowHireConfirmModal(false);
    updateProposals("HIRED", "");
  };

  const handleCancelHire = () => {
    setShowHireConfirmModal(false);
    setTeamHours({});
    setTotalHours(0);
    setTotalAmount(0);
  };

  const handleTeamHoursChange = (profileId: number, hours: number) => {
    setTeamHours((prev) => {
      const newTeamHours = { ...prev, [profileId]: hours };
      const total = Object.values(newTeamHours).reduce(
        (sum: number, h: any) => sum + (Number(h) || 0),
        0
      );
      setTotalHours(total);
      setTotalAmount(total * proposal?.amount);
      return newTeamHours;
    });
  };

  const closeDisputeModal = () => {
    setDisputeModal(false);
  };

  

  return (
    <div className="px-3 px-md-4 py-3"
      style={{
        background: "rgba(255, 255, 255, 0.02)",
        borderRadius: 12,
        padding: 18,
        minHeight: 86,
        position: "relative",
        border: "1px solid #333333",
      }}>

      <div className="d-flex align-items-center mb-3">
        <BackButton
          fontSize="24px"
          color="white"
          style={{ marginLeft: "-8px" }}
        />
        <h4 className="mb-0 ms-2" style={{ color: "var(--color_tertiary)" }}>
          {"Proposal Details"}
        </h4>
        
      </div>
      <div >
        <div className="row g-3">
          <div className="col-12 col-lg-8"
          >
            <div className="p-4 stat-card">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="d-flex align-items-center">
                  <div>
                    <Link
                      className="text-lg-end card-profile d-block"
                      href={`/dashboard/talent-xperts/${proposal?.expertProfile?.userId}`}
                      onClick={() =>
                        navigate(
                          `/dashboard/talent-xperts/${proposal?.expertProfile?.userId}`
                        )
                      }
                    >
                      <ImageFallback
                        src={
                          proposal?.expertProfile?.user?.profilePicture?.fileUrl
                        }
                        alt="img"
                        className="img-round me-3"
                        width={56}
                        height={56}
                        loading="lazy"
                        blurDataURL={profileImageBlurDataURL}
                        userName={
                          proposal?.expertProfile?.user
                            ? `${proposal?.expertProfile?.user?.firstName} ${proposal?.expertProfile?.user?.lastName}`
                            : null
                        }
                      />
                    </Link>
                  </div>
                  <div>
                    <p
                      className="mb-1 fw-medium"
                      style={{ color: "var(--color_tertiary)" }}
                    >
                      {proposal?.expertProfile?.user?.firstName}{" "}
                      {proposal?.expertProfile?.user?.lastName}
                    </p>
                    <div className="d-flex align-items-center gap-2">
                      <RatingStar
                        rating={
                          proposal?.expertProfile?.averageRating
                            ? proposal?.expertProfile?.averageRating
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
                  <span
                    className={`badge ms-0 ms-lg-3 ms-md-3 mb-3 text-bg-primary`}
                  >
                    {proposal.teamId
                      ? "TEAM"
                      : proposal?.expertProfile?.user?.userType}
                  </span>
                  {task?.amountType === "HOURLY" ? (
                    <h5 className="text-center">
                      $ {proposal?.amount} / hr
                    </h5>
                  ) : (
                    <h5 className="text-center">$ {proposal?.amount}</h5>
                  )}
                </div>
                {/* later */}
                {/* <div className="col-9">
                  <div className="priceanddate d-flex justify-content-between bordr">
                    <div className="stars mb-2">
                      <h4 className="m-0 p-0">{proposal?.task?.name}</h4>
                    </div>
                    <span
                      className={`badge ms-0 ms-lg-3 ms-md-3 mb-3 text-bg-primary`}
                    >
                      {proposal.teamId
                        ? "TEAM"
                        : proposal?.expertProfile?.user?.userType}
                    </span>
                    <div>
                      {task?.amountType === "HOURLY" ? (
                        <h5 className="text-center">
                          $ {proposal?.amount} / hr
                        </h5>
                      ) : (
                        <h5 className="text-center">$ {proposal?.amount}</h5>
                      )}
                    </div>
                  </div>
                  <HtmlData data={proposal?.details} className="text-white" />
                  {proposal?.rejectionReason &&
                    user?.profile?.length > 0 &&
                    user?.profile[0]?.type === "TE" && (
                      <div className="alert alert-danger mt-4">
                        <h5 className="mb-2 text-danger">Rejection Reason</h5>
                        <p className="mb-0">{proposal.rejectionReason}</p>
                      </div>
                    )}
                  {proposal?.documents?.map((doc: any) => (
                    <div key={doc.fileUrl}>
                      <Link
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {doc.key}
                      </Link>
                    </div>
                  ))}
                  <div className="accordion" id="accordionExamplee12">
                    {proposal?.answers?.map((data: any, index: number) => (
                      <div className="accordion-item" key={index}>
                        <h2 className="accordion-header">
                          <button
                            className={`accordion-button ${
                              openIndex === index ? "" : "collapsed"
                            } bg-black text-white`}
                            type="button"
                            onClick={() => toggleAccordion(index)}
                            aria-expanded={openIndex === index}
                            aria-controls={`collapsee${index}`}
                          >
                            {data?.question?.question}
                          </button>
                        </h2>
                        <div
                          id={`collapsee${index}`}
                          className={`accordion-collapse collapse ${
                            openIndex === index ? "show" : ""
                          }`}
                          data-bs-parent="#accordionExamplee12"
                        >
                          <div className="accordion-body bg-gray text-white border-bottom">
                            {data.answer}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {proposal?.teamId && (
                    <h5 className="mb-3">Team Information</h5>
                  )}
                  {proposal?.teamId && (
                    <MemberList
                      data={team?.teamMembers}
                      type="members"
                      teamLeadId={team?.createdByProfile?.id}
                    />
                  )}
                  {task?.status !== "CLOSED" && (
                    <div
                      className="btn-border mt-4"
                      style={{ justifyContent: "flex-end" }}
                    >
                      {user?.profile[0]?.type === "TR" ? (
                        <>
                          {proposal?.status !== "SHORTLISTED" && (
                            <button
                              className={`btn rounded-pill btn-outline-info mx-1 my-1 ${
                                contracts?.isTEApproved ? "disabled" : ""
                              }`}
                              onClick={() => updateProposals("SHORTLISTED", "")}
                            >
                              Shortlist
                            </button>
                          )}
                          {proposal?.status != "REJECTED" && (
                            <button
                              className={`btn rounded-pill btn-outline-info mx-1 my-1 ${
                                contracts?.isTEApproved ? "disabled" : ""
                              }`}
                              data-bs-target="#exampleModalToggle97"
                              data-bs-toggle="modal"
                            >
                              Reject
                            </button>
                          )}
                          {proposal?.status == "HIRED" && (
                            <Link
                              className={`btn rounded-pill btn-outline-info mx-1 my-1`}
                              href={`/dashboard/tasks/${id}/proposals`}
                              onClick={() =>
                                navigate(`/dashboard/tasks/${id}/proposals`)
                              }
                            >
                              Proposals ({proposalCount})
                            </Link>
                          )}
                          {proposal?.status != "REJECTED" && (
                            <button
                              className="btn rounded-pill btn-outline-info mx-1 my-1"
                              onClick={() => setShowModal(true)}
                            >
                              {contracts?.id && !contracts?.isTEApproved
                                ? "Edit "
                                : ""}{" "}
                              Contract {contracts?.isTEApproved ? "✔" : ""}{" "}
                              {contracts?.id ? "✔" : ""}
                            </button>
                          )}
                          {((contracts?.isTEApproved &&
                            task?.amountType === "FIXED") ||
                            (contracts?.isTEApproved &&
                              task?.amountType === "HOURLY" &&
                              proposal?.status === "HIRED")) && (
                            <button
                              className="btn rounded-pill btn-outline-info mx-1 my-1"
                              onClick={() => {
                                setMilestoneModal(true);
                              }}
                            >
                              Milestone {areAllMilestonesApproved ? "✔" : ""}{" "}
                              {milestones?.length > 0 &&
                              milestones[0]?.amount !== ""
                                ? "✔"
                                : ""}
                            </button>
                          )}
                          {((task?.amountType === "FIXED" &&
                            areAllMilestonesApproved &&
                            proposal?.status !== "HIRED") ||
                            (task?.amountType === "HOURLY" &&
                              contracts?.isTEApproved &&
                              proposal?.status !== "HIRED")) && (
                            <button
                              className="btn rounded-pill btn-outline-info mx-1 my-1"
                              onClick={handleHireClick}
                            >
                              Hire
                            </button>
                          )}
                          {areAllMilestonesPaid && (
                            <button
                              className={`btn rounded-pill btn-outline-info mx-1 ls ${
                                hasActiveDispute || task?.status == "COMPLETED"
                                  ? "disabled"
                                  : ""
                              }`}
                              onClick={() => updateTask("COMPLETED")}
                            >
                              Complete ✔
                            </button>
                          )}
                          <button
                            className="btn rounded-pill btn-outline-info mx-1 my-1"
                            onClick={() => getMessageThread(proposal)}
                          >
                            Message
                          </button>
                        </>
                      ) : (
                        <>
                          {contracts.id ? (
                            <button
                              className="btn rounded-pill btn-outline-info mx-1 my-1"
                              onClick={() => setShowModal(true)}
                            >
                              View Contract
                            </button>
                          ) : (
                            ""
                          )}
                          {milestones?.length > 0 &&
                            milestones[0]?.id &&
                            task?.id && (
                              <button
                                className="btn rounded-pill btn-outline-info mx-1 my-1"
                                onClick={() => setMilestoneModal(true)}
                              >
                                Milestone
                              </button>
                            )}
                        </>
                      )}
                      {task?.status == "INPROGRESS" && (
                        <button
                          className="btn rounded-pill btn-outline-info mx-1 my-1"
                          onClick={() => setDisputeModal(true)}
                        >
                          Dispute
                        </button>
                      )}
                      {addReview && task?.reviews?.length > 0
                        ? task?.reviews?.map((review: any) =>
                            addReview &&
                            review?.reviewerProfileId ===
                              user?.profile[0]?.id ? (
                              ""
                            ) : (
                              <button
                                key={review?.id}
                                className="btn rounded-pill btn-outline-info mx-1 my-1"
                                data-bs-target="#exampleModalToggle88"
                                data-bs-toggle="modal"
                                disabled={
                                  review?.reviewerProfileId ===
                                  user?.profile[0]?.id
                                }
                              >
                                {review?.reviewerProfileId ===
                                user?.profile[0]?.id
                                  ? "Review Submitted"
                                  : "Submit Review"}
                              </button>
                            )
                          )
                        : addReview && (
                            <button
                              className="btn rounded-pill btn-outline-info mx-1 my-1"
                              data-bs-target="#exampleModalToggle88"
                              data-bs-toggle="modal"
                            >
                              Submit Review
                            </button>
                          )}
                    </div>
                  )}
                  {proposal?.status === "HIRED" &&
                    milestones?.length > 0 &&
                    milestones[0]?.status === "PAYMENT_PENDING" &&
                    user?.profile?.length > 0 &&
                    user?.profile[0]?.type == "TR" && (
                      <div className="alert alert-warning mt-3" role="alert">
                        <strong>Action Required:</strong> Please fund the
                        milestones to proceed with the task.
                      </div>
                    )}
                  {hasActiveDispute && (
                    <div className="alert alert-warning mt-3" role="alert">
                      <strong>Work Halted:</strong> A dispute is active.
                      Payments, reviews, and completion are temporarily
                      disabled.
                    </div>
                  )}
                </div> */}
              </div>
            </div>
            <div className="mt-3 bg_neutral_800"
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
                  maxWidth: "100%",
                  height: 43,
                  borderRadius: 8,
                  opacity: 1,
                  background: "#333333",
                }}
              >
                <p className="m-0 fw-medium">Proposal Description</p>
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
                  <HtmlData data={proposal?.details} className="text-white" />
                  <div className="col-9">

                    {proposal?.rejectionReason &&
                      user?.profile?.length > 0 &&
                      user?.profile[0]?.type === "TE" && (
                        <div className="alert alert-danger mt-4">
                          <h5 className="mb-2 text-danger">Rejection Reason</h5>
                          <p className="mb-0">{proposal.rejectionReason}</p>
                        </div>
                      )}
                    {proposal?.documents?.map((doc: any) => (
                      <div key={doc.fileUrl}>
                        <Link
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {doc.key}
                        </Link>
                      </div>
                    ))}
                    
                    {proposal?.teamId && (
                      <h5 className="mb-3">Team Information</h5>
                    )}
                    {proposal?.teamId && (
                      <MemberList
                        data={team?.teamMembers}
                        type="members"
                        teamLeadId={team?.createdByProfile?.id}
                      />
                    )}
                    
                    {proposal?.status === "HIRED" &&
                      milestones?.length > 0 &&
                      milestones[0]?.status === "PAYMENT_PENDING" &&
                      user?.profile?.length > 0 &&
                      user?.profile[0]?.type == "TR" && (
                        <div className="alert alert-warning mt-3" role="alert">
                          <strong>Action Required:</strong> Please fund the
                          milestones to proceed with the task.
                        </div>
                      )}
                    {hasActiveDispute && (
                      <div className="alert alert-warning mt-3" role="alert">
                        <strong>Work Halted:</strong> A dispute is active.
                        Payments, reviews, and completion are temporarily
                        disabled.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {proposal?.answers?.length > 0 && <div className="mt-3 bg_neutral_800"
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
                  maxWidth: "100%",
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
                <div className="py-1 px-3">
                  <ul className="mb-0" style={{ listStyle: "none", padding: 0 }}>
                    {(
                      (proposal?.answers?.length ? proposal?.answers : proposal?.task?.interviewQuestions) || []
                    ).map((item: any, idx: number) => (
                      <li key={idx} className="mb-3">
                        <p className="mb-1 text-white">
                          {idx + 1}. {item?.question?.question || item?.question}
                        </p>
                        {item?.answer && (
                          <div className="small text-white-50">{item?.answer}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>}
          </div>
          
          <div className="col-12 col-lg-4">
          <div className="p-3 stat-card">
            <h4 className="mb-3" style={{ color: "var(--color_tertiary)" }}>
              Project Details
            </h4>
            <div className="d-flex flex-column gap-2 text-white-50">
              <div className="d-flex align-items-center">
                <div>
                  <Link
                    className="text-lg-end card-profile d-block"
                    href={`/dashboard/talent-requestors/${task?.requesterProfile?.userId}`}
                    onClick={() =>
                      navigate(
                        `/dashboard/talent-requestors/${task?.requesterProfile?.userId}`
                      )
                    }
                  >
                    <ImageFallback
                      src={
                        task?.requesterProfile?.user?.profilePicture?.fileUrl
                      }
                      alt="img"
                      className="img-round me-3"
                      width={56}
                      height={56}
                      loading="lazy"
                      blurDataURL={profileImageBlurDataURL}
                      userName={
                        task?.requesterProfile?.user
                          ? `${task?.requesterProfile?.user?.firstName} ${task?.requesterProfile?.user?.lastName}`
                          : null
                      }
                    />
                  </Link>
                </div>
                <div>
                  <p
                    className="mb-1 fw-medium"
                    style={{ color: "var(--color_tertiary)" }}
                  >
                    {task?.requesterProfile?.user?.firstName}{" "}
                    {task?.requesterProfile?.user?.lastName}
                  </p>
                  <div className="d-flex align-items-center gap-2">
                    <RatingStar
                      rating={
                        task?.requesterProfile?.averageRating
                          ? task?.requesterProfile?.averageRating
                          : 0
                      }
                    />
                    {/* <div className="text-white small">Tasks Completed: {details?.requesterProfile?.tasksCompleted || 0}</div> */}
                    {/* 
                      <span className="text-white-50 small">{details?.requesterProfile?.averageRating?.toFixed ? details?.requesterProfile?.averageRating?.toFixed(1) : details?.requesterProfile?.averageRating || 0}</span> */}
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span
                  className="d-inline-flex align-items-center text-white"
                  style={{ gap: 10 }}
                >
                  {task?.name}
                </span>
                <div className="text-white">
                  {task?.amountType === "HOURLY" ? (
                    <h5>$ {task?.amount} / hr</h5>
                  ) : (
                    <h5>$ {task?.amount}</h5>
                  )}
                </div>
              </div>
              <HtmlData data={task?.details} className="text-white" />
              {task?.status !== "CLOSED" && (
                      <div
                        className="btn-border mt-4"
                        style={{ justifyContent: "flex-end" }}
                      >
                        {user?.profile[0]?.type === "TR" ? (
                          <>
                            {proposal?.status !== "SHORTLISTED" && (
                              <GradientButton
                                className={`mx-1 my-1 ${contracts?.isTEApproved ? "disabled" : ""}`}
                                onClick={() => updateProposals("SHORTLISTED", "")}
                              >
                                Shortlist
                              </GradientButton>
                            )}
                            {proposal?.status != "REJECTED" && (
                              <GradientButton
                                className={`mx-1 my-1 ${contracts?.isTEApproved ? "disabled" : ""}`}
                                data-bs-target="#exampleModalToggle97"
                                data-bs-toggle="modal"
                              >
                                Reject
                              </GradientButton>
                            )}
                            {proposal?.status == "HIRED" && (
                              <GradientButton
                                className={`mx-1 my-1`}
                                href={`/dashboard/tasks/${id}/proposals`}
                                onClick={() =>
                                  navigate(`/dashboard/tasks/${id}/proposals`)
                                }
                              >
                                Proposals ({proposalCount})
                              </GradientButton>
                            )}
                            {proposal?.status != "REJECTED" && (
                              <GradientButton
                                className="mx-1 my-1"
                                onClick={() => setShowModal(true)}
                              >
                                {contracts?.id && !contracts?.isTEApproved
                                  ? "Edit "
                                  : ""}{" "}
                                Contract {contracts?.isTEApproved ? "✔" : ""}{" "}
                                {contracts?.id ? "✔" : ""}
                              </GradientButton>
                            )}
                            {((contracts?.isTEApproved &&
                              task?.amountType === "FIXED") ||
                              (contracts?.isTEApproved &&
                                task?.amountType === "HOURLY" &&
                                proposal?.status === "HIRED")) && (
                                <GradientButton
                                  className="mx-1 my-1"
                                  onClick={() => {
                                    setMilestoneModal(true);
                                  }}
                                >
                                  Milestone {areAllMilestonesApproved ? "✔" : ""}{" "}
                                  {milestones?.length > 0 &&
                                    milestones[0]?.amount !== ""
                                    ? "✔"
                                    : ""}
                                </GradientButton>
                              )}
                            {((task?.amountType === "FIXED" &&
                              areAllMilestonesApproved &&
                              proposal?.status !== "HIRED") ||
                              (task?.amountType === "HOURLY" &&
                                contracts?.isTEApproved &&
                                proposal?.status !== "HIRED")) && (
                                <GradientButton
                                  className="mx-1 my-1"
                                  onClick={handleHireClick}
                                >
                                  Hire
                                </GradientButton>
                              )}
                            {areAllMilestonesPaid && (
                              <GradientButton
                                className={`mx-1 ls ${hasActiveDispute || task?.status == "COMPLETED"
                                  ? "disabled"
                                  : ""
                                  }`}
                                onClick={() => updateTask("COMPLETED")}
                              >
                                Complete ✔
                              </GradientButton>
                            )}
                            <GradientButton
                              className="mx-1 my-1"
                              onClick={() => getMessageThread(proposal)}
                            >
                              Message
                            </GradientButton>
                          </>
                        ) : (
                          <>
                            {contracts.id ? (
                              <GradientButton
                                className="mx-1 my-1"
                                onClick={() => setShowModal(true)}
                              >
                                View Contract
                              </GradientButton>
                            ) : (
                              ""
                            )}
                            {milestones?.length > 0 &&
                              milestones[0]?.id &&
                              task?.id && (
                                <GradientButton
                                  className="mx-1 my-1"
                                  onClick={() => setMilestoneModal(true)}
                                >
                                  Milestone
                                </GradientButton>
                              )}
                          </>
                        )}
                        {task?.status == "INPROGRESS" && (
                          <GradientButton
                            className="mx-1 my-1"
                            onClick={() => setDisputeModal(true)}
                          >
                            Dispute
                          </GradientButton>
                        )}
                        {addReview && task?.reviews?.length > 0
                          ? task?.reviews?.map((review: any) =>
                            addReview &&
                              review?.reviewerProfileId ===
                              user?.profile[0]?.id ? (
                              ""
                            ) : (
                              <button
                                key={review?.id}
                                className="btn rounded-pill btn-outline-info mx-1 my-1"
                                data-bs-target="#exampleModalToggle88"
                                data-bs-toggle="modal"
                                disabled={
                                  review?.reviewerProfileId ===
                                  user?.profile[0]?.id
                                }
                              >
                                {review?.reviewerProfileId ===
                                  user?.profile[0]?.id
                                  ? "Review Submitted"
                                  : "Submit Review"}
                              </button>
                            )
                          )
                          : addReview && (
                            <button
                              className="btn rounded-pill btn-outline-info mx-1 my-1"
                              data-bs-target="#exampleModalToggle88"
                              data-bs-toggle="modal"
                            >
                              Submit Review
                            </button>
                          )}
                      </div>
                    )}
              
           
             
             
            </div>

           




          </div>
        </div>
          
        </div>
      </div>
      

      {disputeModal && (
        <DisputeModal
          type={false}
          taskId={id}
          proposalId={proposalId}
          handleClose={closeDisputeModal}
        />
      )}
      <SubmitReview taskId={Number(id)} revieweeId={revieweeId} />
      {showModal && (
        <Contract
          taskId={Number(id)}
          proposalId={proposalId}
          taskStatus={task?.status}
          isOpen={showModal}
          onClose={closeContract}
          task={task}
        />
      )}
      <RejectProposal updateProposals={updateProposals} id={Number(id)} />
      {task?.id && milstoneModal && (
        <Hire
          milestone={milestones}
          setMilestones={setMilestones}
          contract={contracts}
          type={type}
          amount={proposal?.amount}
          proposal={proposal}
          areAllMilestonesApproved={areAllMilestonesApproved}
          task={task}
          count={count}
          page={page}
          limit={limit}
          onPageChange={onPageChange}
          onLimitChange={onLimitChange}
          team={team}
          getTask={getTask}
          getContract={getContract}
          disputes={dispute}
          handleClose={closeMileStoneModal}
        />
      )}
      {showHireConfirmModal && (
        <ModalWrapper
          modalId={"hireConfirmModal"}
          handleClose={handleCancelHire}
          title={"Confirm Hire"}
        >
          {task?.amountType === "HOURLY" && proposal?.teamId ? (
            <>
              <p>Assign maximum hours for each team member:</p>
              {team?.teamMembers?.map((member: any) => (
                <div key={member.memberProfileId} className="mb-3">
                  <label className="form-label">
                    {member.profile?.user?.firstName}{" "}
                    {member.profile?.user?.lastName}
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    value={teamHours[member.memberProfileId] || 0}
                    onChange={(e) =>
                      handleTeamHoursChange(
                        member.memberProfileId,
                        Number(e.target.value)
                      )
                    }
                    min="0"
                    placeholder="Enter number of hours"
                  />
                </div>
              ))}
              <p>Total Hours: {totalHours}</p>
              <p>Total Amount: ${totalAmount.toFixed(2)}</p>
              <p>
                Are you sure you want to hire this team with the assigned hours?
              </p>
            </>
          ) : task?.amountType === "HOURLY" ? (
            <>
              <p>How many hours do you want this task to be performed?</p>
              <input
                type="number"
                className="form-control mb-3"
                value={totalHours}
                onChange={(e) => {
                  const hoursInput = Number(e.target.value);
                  setTotalHours(hoursInput);
                  setTotalAmount(hoursInput * proposal?.amount);
                }}
                min="0"
                placeholder="Enter number of hours"
              />
              <p>Total Amount: ${totalAmount.toFixed(2)}</p>
              <p>
                Are you sure you want to hire this expert for {totalHours} hours
                at ${proposal?.amount}/hr?
              </p>
            </>
          ) : (
            <p>Are you sure you want to hire this Talented Expert?</p>
          )}
          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              className="btn  bg-gradient-danger text-white border-0 px-4 rounded-3"
              onClick={handleCancelHire}
            >
              No
            </button>
            <button
              type="button"
              className="btn bg-gradient-success text-white border-0 px-4 rounded-3"
              onClick={handleConfirmHire}
              disabled={task?.amountType === "HOURLY" && totalHours <= 0}
            >
              Yes
            </button>
          </div>
        </ModalWrapper>
      )}
      {showHireConfirmModal && <div className="modal-backdrop fade show"></div>}
    </div>
  );
};

export default ViewProposal;
