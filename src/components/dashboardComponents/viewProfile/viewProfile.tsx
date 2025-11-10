"use client";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import Link from "next/link";
import ProjectsSlider from "@/components/common/sliders/ProjectsSlider";
import { RootState, useAppDispatch } from "@/store/Store";
import { useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import defaultUserImg from "../../../../public/assets/images/default-user.jpg";
import ImageFallback from "@/components/common/ImageFallback/ImageFallback";
import Review from "@/components/common/Review/Review";
import RatingStar from "@/components/common/RatingStar/RatingStar";
import ListCards from "../Articles/ListCards";
import HtmlData from "@/components/common/HtmlData/HtmlData";
import { dynamicBlurDataUrl } from "@/services/utils/dynamicBlurImage";
import { useNavigation } from "@/hooks/useNavigation";
import { getTimeago } from "@/services/utils/util";
import BackButton from "@/components/common/backButton/BackButton";
import GradientButton from "@/components/common/GradientButton/GradientButton";
import InviteModal from "@/components/common/Modals/inviteModal";

const ViewProfile: FC<any> = ({ isDashboard }) => {
  const [details, setDetails] = useState<any>({});
  const [earnedOrSpent, setEarnedOrSpent] = useState<any>([]);
  const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState("");
  const { navigate } = useNavigation();

  const dispatch = useAppDispatch();
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.user)
  const router = useRouter();
  const { userType, id } = useParams();

  const [showModal, setShowModal] = useState<boolean>(false)
  const [userId, setId] = useState<any>()

  const getUser = async (id: number) => {
    await apiCall(
      requests.getUserInfo + id,
      {},
      "get",
      false,
      dispatch,
      {},
      router
    )
      .then((res: any) => {
        setDetails({
          ...res?.data,
          profile: res?.data?.profile?.filter((prof: any) =>
            userType === "talent-requestors"
              ? prof?.type === "TR"
              : prof?.type === "TE"
          ),
        });
      })
      .catch((err) => console.warn(err));
  };

  useEffect(() => {
    if (id || isAuth) {
      getUser(Number(id));
      getSpendingsOrEarnings();
    }
  }, [id, isAuth]);

  useEffect(() => {
    if (details?.profilePicture?.fileUrl) {
      fetchBlurDataURL();
    }
  }, [details?.profilePicture?.fileUrl]);

  const fetchBlurDataURL = async () => {
    if (details?.profilePicture?.fileUrl) {
      const blurUrl = await dynamicBlurDataUrl(
        details?.profilePicture?.fileUrl
      );
      setProfileImageBlurDataURL(blurUrl);
    }
  };

  const formatedDate = (date: string) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const getSpendingsOrEarnings = async () => {
    try {
      const response = await apiCall(
        `${
          userType === "talent-requestors"
            ? requests?.spendings
            : requests.totalEarnings
        }` +
          "/" +
          (id ? Number(id) : 0),
        {},
        "get",
        false,
        dispatch,
        {},
        router
      );
      setEarnedOrSpent(response.data);
    } catch (error) {
      console.warn("Error fetching articles:", error);
    }
  };

  const calculateTaskSuccess = () => {
    if (details?.profile?.length > 0) {
      const successRate = (details?.profile[0]?.averageRating / 5) * 100;
      return successRate;
    }
  };

  const closeInvite = () => {
    setShowModal(false)
  }

  return (
    <>
      <div 
        className={`dashboard-card ${isDashboard ? '' : 'text-dark'}`}
        style={{
          minHeight: 86,
          position: "relative",
          ...(isDashboard ? {border: "1px solid #333333"} : {}),
        }}
      >
        <div className="d-flex align-items-center mb-3 flex-wrap">
          <BackButton fontSize="24px" color={isDashboard ? "white" : 'black'} />
          <h4 className="mb-0 ms-2" style={{ color: `${isDashboard ? 'var(--color_tertiary)' : 'var(--color_black)'}` }}>
            View Profile
          </h4>
        </div>
        {details?.profile?.length > 0 ? (
          <div className="row g-3">
            <div className="col-12 col-lg-8">
              <div className="p-4 stat-card">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  <div className="d-flex align-items-center">
                    <div
                      className="text-lg-end card-profile d-block"
                    >
                      <ImageFallback
                        src={
                          details?.profilePicture?.fileUrl
                        }
                        fallbackSrc={defaultUserImg}
                        alt="img"
                        className="img-round me-3"
                        width={64}
                        height={64}
                        loading="lazy"
                        blurDataURL={profileImageBlurDataURL}
                        userName={
                          details
                            ? `${details?.firstName} ${details?.lastName}`
                            : null
                        }
                      />
                    </div>
                    <div>
                      <p
                        className="mb-0 fw-medium"
                        style={{ color: `${isDashboard ? 'var(--color_tertiary)' : 'var(--color_black)'}` }}
                      >
                        {details?.firstName} {details?.lastName}
                      </p>
                      <span 
                        className="small m-0"
                        style={{ color: `${isDashboard ? 'var(--color_tertiary)' : 'var(--color_black)'}` }}
                      >{details?.title}</span>
                      <div className="d-flex align-items-center gap-2">
                        <RatingStar
                          rating={
                            details?.profile?.[0]?.averageRating ?? 0
                          }
                          color={isDashboard ? 'text-light' : 'text-dark'}
                        />
                        <span className="ms-1">{`(${details?.profile[0]?.averageRating})`}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-end mt-3 mt-lg-0 d-flex flex-column gap-2">
                    {/* <div className="small">
                      Completed Tasks : {' '}
                      {details?.taskCount || 0}
                    </div> */}
                  </div>
                </div>
              </div>
              <div
                className={`mt-3 ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                style={{
                  border: "1px solid var(--color_grey)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  className={`w-100 d-flex justify-content-between align-items-center p-3 text-start ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                  // onClick={() => setOpenDesc(!openDesc)}
                  // aria-expanded={openDesc}
                  style={{
                    color: isDashboard ? "var(--color_tertiary)" : 'var(--color_black)',
                    border: "none",
                    width: "100%",
                    maxWidth: "100%",
                    height: 43,
                    borderRadius: 8,
                    opacity: 1,
                    background: "#333333",
                  }}
                >
                  <p className="m-0 fw-medium">About</p>
                  {/* <Icon
                    icon="mdi:chevron-down"
                    style={{
                      transition: "transform 200ms ease",
                      // transform: openDesc ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  /> */}
                </button>
                {/* {openDesc && ( */}
                  <div className="py-1 px-3">
                    <HtmlData data={details?.about} className={`${isDashboard ? 'text-white' : 'text-dark'}`} isDark={!isDashboard} />
                  </div>
                {/* )} */}
              </div>
              {/* Additional sections like Education, Experience, Reviews can be added here */}
              {userType == "talent-requestors" ? (
                ""
              ) : (
                <>
                  <div className={`mt-3 ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`} style={{ border: "1px solid var(--color_grey)", borderRadius: 12, overflow: "hidden" }}>
                    <button
                      type="button"
                      className={`w-100 d-flex justify-content-between align-items-center p-3 text-start ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                      // onClick={() => setOpenDesc(!openDesc)}
                      // aria-expanded={openDesc}
                      style={{
                        color: isDashboard ? "var(--color_tertiary)" : 'var(--color_black)',
                        border: "none",
                        width: "100%",
                        maxWidth: "100%",
                        height: 43,
                        borderRadius: 8,
                        opacity: 1,
                        background: "#333333",
                      }}
                    >
                      <p className="m-0 fw-medium">Education</p>
                      {/* <Icon
                        icon="mdi:chevron-down"
                        style={{
                          transition: "transform 200ms ease",
                          // transform: openDesc ? "rotate(0deg)" : "rotate(180deg)",
                        }}
                      /> */}
                    </button>
                    {/* {openDesc && ( */}
                      <div className="py-1 px-3">
                        {details?.education?.length > 0 ? (
                          details?.education?.map((edu: any, index: number) => (
                            <div key={index}>
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <p className="fw-bold mb-2">{edu?.institution}</p>
                                  <p className="mb-0">{edu?.degree}</p>
                                </div>
                                <p className="mb-0">{formatedDate(edu?.date)}</p>
                              </div>
                              {index !== details.education.length - 1 && (
                                <hr
                                  className="mt-2"
                                  style={{ borderColor: "#ccc", opacity: 0.7 }}
                                />
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-center mb-0">No Education found yet</p>
                        )}
                      </div>
                    {/* )} */}
                  </div>
                  <div className={`mt-3 ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`} style={{ border: "1px solid var(--color_grey)", borderRadius: 12, overflow: "hidden" }}>
                    <button
                      type="button"
                      className={`w-100 d-flex justify-content-between align-items-center p-3 text-start ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                      // onClick={() => setOpenDesc(!openDesc)}
                      // aria-expanded={openDesc}
                      style={{
                        color: isDashboard ? "var(--color_tertiary)" : 'var(--color_black)',
                        border: "none",
                        width: "100%",
                        maxWidth: "100%",
                        height: 43,
                        borderRadius: 8,
                        opacity: 1,
                        background: "#333333",
                      }}
                    >
                      <p className="m-0 fw-medium">Experience</p>
                      {/* <Icon
                        icon="mdi:chevron-down"
                        style={{
                          transition: "transform 200ms ease",
                          // transform: openDesc ? "rotate(0deg)" : "rotate(180deg)",
                        }}
                      /> */}
                    </button>
                    {/* {openDesc && ( */}
                      <div className="py-1 px-3">
                        {details?.experience?.length > 0 ? (
                          details?.experience?.map((exp: any, index: number) => (
                            <div key={index}>
                              <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <div className="d-flex justify-content-between w-100">
                                  <p className="fw-bold mb-0">{exp?.role}</p>
                                  <p className=" mb-0">
                                    {formatedDate(exp?.startDate)} -
                                    {exp?.isPresent
                                      ? "On going"
                                      : formatedDate(exp?.endDate)}
                                  </p>
                                </div>

                                <p className="mb-2">{exp?.companyName}</p>
                              </div>
                              <p className="mb-2">{exp?.description}</p>
                              {index !== details.experience.length - 1 && (
                                <hr
                                  className="mt-2"
                                  style={{ borderColor: "#ccc", opacity: 0.7 }}
                                />
                              )}
                            </div>
                          ))) : (
                          <p className="text-center mb-0">
                            No Experience found yet
                          </p>
                        )}
                      </div>
                    {/* )} */}
                  </div>
                </>
              )}
              <div
                className={`mt-3 ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                style={{
                  border: "1px solid var(--color_grey)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  className={`w-100 d-flex justify-content-between align-items-center p-3 text-start ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                  // onClick={() => setOpenDesc(!openDesc)}
                  // aria-expanded={openDesc}
                  style={{
                    color: isDashboard ? "var(--color_tertiary)" : 'var(--color_black)',
                    border: "none",
                    width: "100%",
                    maxWidth: "100%",
                    height: 43,
                    borderRadius: 8,
                    opacity: 1,
                    background: "#333333",
                  }}
                >
                  <p className="m-0 fw-medium">Reviews</p>
                  {/* <Icon
                    icon="mdi:chevron-down"
                    style={{
                      transition: "transform 200ms ease",
                      // transform: openDesc ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  /> */}
                </button>
                {/* {openDesc && ( */}
                  <div className="py-1 px-3">
                    {details?.profile?.length > 0 &&
                      details?.profile[0]?.reviewsReceived?.length > 0 ? (
                        <>
                          {details.profile[0]?.reviewsReceived
                            ?.slice(0, 3)
                            .map((review: any) => {
                              return (
                                <Review reviewReceive={review} key={review?.id} />
                              );
                            })}
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "20px",
                            }}
                          >
                            <Link
                              className="btn rounded-pill bg_gradient minw_104 mb-1"
                              href={`/${userType}/${id}/allReviews`}
                            >
                              View All
                            </Link>
                          </div>
                        </>
                      ) : (
                        <p className="text-center mb-0">No Reviews found yet</p>
                      )}
                  </div>
                {/* )} */}
              </div>
              <div
                className={`mt-3 ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                style={{
                  border: "1px solid var(--color_grey)",
                  borderRadius: 12,
                  overflow: "hidden",
                }}
              >
                <button
                  type="button"
                  className={`w-100 d-flex justify-content-between align-items-center p-3 text-start ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                  // onClick={() => setOpenDesc(!openDesc)}
                  // aria-expanded={openDesc}
                  style={{
                    color: isDashboard ? "var(--color_tertiary)" : 'var(--color_black)',
                    border: "none",
                    width: "100%",
                    maxWidth: "100%",
                    height: 43,
                    borderRadius: 8,
                    opacity: 1,
                    background: "#333333",
                  }}
                >
                  <p className="m-0 fw-medium">Tasks</p>
                  {/* <Icon
                    icon="mdi:chevron-down"
                    style={{
                      transition: "transform 200ms ease",
                      // transform: openDesc ? "rotate(0deg)" : "rotate(180deg)",
                    }}
                  /> */}
                </button>
                {/* {openDesc && ( */}
                  <div className="py-1 px-3">
                    {details?.profile?.length > 0 &&
                      details?.profile?.[0]?.completedTasks?.length > 0 ? (
                        <div className="Projects m-4">
                          <ProjectsSlider task={details?.profile[0].completedTasks} isDashboard={isDashboard} />
                          <div className="text-end mt-3">
                            <Link
                              className="btn rounded-pill  bg_gradient minw_104 ls"
                              href={`/${userType}/${id}/completedTasks`}
                            >
                              View All
                            </Link>
                          </div>
                        </div>
                      ) 
                      : (
                        <p className="text-center mb-0">No Tasks found yet</p>
                      )
                    }
                  </div>
                {/* )} */}
              </div>
              {userType !== "talent-requestors" ? (
                <div
                  className={`mt-3 ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                  style={{
                    border: "1px solid var(--color_grey)",
                    borderRadius: 12,
                    overflow: "hidden",
                  }}
                >
                  <button
                    type="button"
                    className={`w-100 d-flex justify-content-between align-items-center p-3 text-start ${isDashboard ? 'bg_neutral_800' : 'bg-light'}`}
                    // onClick={() => setOpenDesc(!openDesc)}
                    // aria-expanded={openDesc}
                    style={{
                      color: isDashboard ? "var(--color_tertiary)" : 'var(--color_black)',
                      border: "none",
                      width: "100%",
                      maxWidth: "100%",
                      height: 43,
                      borderRadius: 8,
                      opacity: 1,
                      background: "#333333",
                    }}
                  >
                    <p className="m-0 fw-medium">Articles</p>
                    {/* <Icon
                      icon="mdi:chevron-down"
                      style={{
                        transition: "transform 200ms ease",
                        // transform: openDesc ? "rotate(0deg)" : "rotate(180deg)",
                      }}
                    /> */}
                  </button>
                  {/* {openDesc && ( */}
                    <div className="py-1 px-3">
                      {details?.profile?.[0]?.articles.length > 0 ?
                        details?.profile?.[0]?.articles
                          .slice(0, 3)
                          .map((art: any, index: number) => (
                            <div
                              key={index}
                              className="articles-card promoted_card text-white me-2 mt-2"
                            >
                              <h4>{art.title}</h4>
                              <span>{getTimeago(art.createdAt)}</span>
                              <p className="line-clamp-2">
                                <HtmlData data={art.description} />
                              </p>
                            </div>
                      )) : (
                        <p className="text-center mb-0">
                          No articles found
                        </p>
                      )}
                      {details?.profile?.[0]?.articles.length > 2 && 
                        <div className="text-end mt-3">
                          <Link
                            className="btn rounded-pill bg_gradient minw_104 mb-1"
                            href={`/articles/${id}/completedTasks`}
                          >
                            View All
                          </Link>
                        </div>
                      }
                    </div>
                  {/* )} */}
                </div>
              ) : null}
            </div>
            <div className="col-12 col-lg-4">
              <div className="p-3 stat-card">
                <div className={`d-flex flex-column gap-2 ${isDashboard ? 'text-white-50' : 'text-dark-50'}`}>
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    className="d-inline-flex align-items-center"
                    style={{ gap: 10 }}
                  >
                    <Image
                      src="/assets/images/success.svg"
                      alt="img"
                      // className="me-2"
                      width={20}
                      height={20}
                      priority
                    />
                    Task Success
                  </span>
                  <p className={`${isDashboard ? 'text-white' : 'text-dark'} m-0`}>
                    {calculateTaskSuccess()}%
                  </p>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <span
                    className="d-inline-flex align-items-center"
                    style={{ gap: 10 }}
                  >
                    <Icon
                      icon="hugeicons:cash-02"
                      width={20}
                      height={20}
                      style={{ color: isDashboard ? "#ffffff" : '#000' }}
                    />
                    {userType === "talent-requestors" ? " Spent" : " Earned "}
                  </span>
                  <p className={`${isDashboard ? 'text-white' : 'text-dark'} m-0`}>
                    $ {earnedOrSpent?.totalEarned?.toFixed(2) ?? 0}                    
                  </p>
                </div>
                {details?.profile?.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center">
                    <span
                      className="d-inline-flex align-items-center"
                      style={{ gap: 10 }}
                    >
                      <Icon
                        icon="hugeicons:task-done-01"
                        width={20}
                        height={20}
                        style={{ color: isDashboard ? "#ffffff" : '#000' }}
                      />
                      Task Completed
                    </span>
                    <p className={`${isDashboard ? 'text-white' : 'text-dark'} m-0`}>
                      {" "}
                      <strong>
                        {details?.profile[0]?.completedTasks
                          ? details?.profile[0]?.completedTasks?.length
                          : "No"}
                      </strong>{" "}
                    </p>
                  </div>
                )}
                <hr className="my-1" />
                <div className="d-grid">
                  {/* {details?.profile?.[0]?.type == 'TR' && userType !== 'talent-requestors' &&  */}
                    <GradientButton 
                      className="btn rounded-pill btn-sm btn-outline-info mt-2" 
                      onClick={() => {
                        if(user?.profile?.[0]?.type == 'TR' && userType !== 'talent-requestors'){
                          setId(details?.profile?.[0]?.id)
                          setShowModal(true)
                        } else {
                          navigate('/signin')
                        }
                      }}
                    >
                      <Icon icon="hugeicons:sent-02" className='me-2' />
                      Contact Me
                    </GradientButton>
                  {/* } */}
                </div>
              </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
        {isAuth && showModal && <InviteModal userId={userId} isOpen={showModal} onClose={closeInvite} />}
      </div>
    </>
  );
};

export default ViewProfile;
