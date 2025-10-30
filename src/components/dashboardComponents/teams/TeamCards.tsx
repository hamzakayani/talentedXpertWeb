"use client";
import React, { FC, useState } from "react";
import { Icon } from "@iconify/react";
import NoFound from "@/components/common/NoFound/NoFound";
import InviteMemberModal from "@/components/common/Modals/InviteMemberModal";
import HtmlData from "@/components/common/HtmlData/HtmlData";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { RootState, useAppDispatch } from "@/store/Store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigation } from "@/hooks/useNavigation";
import { setThread } from "@/reducers/ThreadSlice";
import Image from "next/image";
import profileImg from "../../../../public/assets/images/profile-img.png";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  BubbleChatIcon,
  MoreVerticalIcon,
  UserMultiple02Icon,
  ViewIcon,
} from "@hugeicons/core-free-icons";

const TeamCards: FC<any> = ({ data, type, handleAction }) => {
  const user = useSelector((state: RootState) => state.user);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectTeam, setSelectTeam] = useState<any>({});
  const { navigate } = useNavigation();

  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleInvite = (row: any) => {
    setShowModal(true);
    setSelectTeam(row);
  };

  const closeInvite = () => {
    setShowModal(false);
    setSelectTeam({});
  };

  const getMessageThread = async (row: any) => {
    console.log("row team", row);
    try {
      const response = await apiCall(
        requests.getThread,
        {
          // teamId: row.id,
        },
        "get",
        false,
        dispatch,
        user,
        router
      );
      const matchingThread = response?.data?.threads?.find(
        (thread: any) => thread.teamId === row.id
      );
      if (matchingThread) {
        dispatch(setThread(matchingThread));
        router.push(`/dashboard/messages/${matchingThread?.id}`);
      } else {
        let data = {
          teamId: row.id,
          threadType: "TEAM",
        };

        const res = await apiCall(
          requests.createThread,
          data,
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

  const handleAcceptReject = async (status: string, id: number) => {
    await apiCall(
      `${requests.invitation}/${id}`,
      { invitationStatus: status },
      "put",
      true,
      dispatch,
      user,
      router
    )
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
          toast.success(res?.data?.message);
          handleAction(type);
        }
      })
      .catch((err) => {
        console.warn(err);
      });
  };

  return (
    <div className="teamcards my-4">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-gap-3">
        <div className="col">
          <div className="card">
            <div className="d-flex gap-3">
              <div className="profile flex-shrink-0 position-relative">
                <Image
                  src={profileImg}
                  alt="Profileimg"
                  className="img-fluid"
                />
                <span
                  className="position-absolute bottom-0 start-100 translate-middle rounded-circle"
                  style={{ background: "#22C55E", padding: "5px" }}
                >
                  <span className="visually-hidden">New alerts</span>
                </span>
              </div>
              <div className="detail">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-medium m-0">Design Team</h6>
                  <button className="dots btn btn-link p-0">
                    <HugeiconsIcon
                      icon={MoreVerticalIcon}
                      size={20}
                      className="ms-auto text-white flex-shrink-0 cursor-pointer"
                    />
                  </button>
                </div>
                <span className="fw-light lh-normal">
                  {" "}
                  Creative UI/UX Design team focused on modern web applications
                  and...
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 text-white">
              <HugeiconsIcon icon={UserMultiple02Icon} />
              <span>8 members</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn rounded-lg text-white border-0 btn-sm text-[14px] px-3"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(0, 187, 255, 0.32) 0%, rgba(89, 71, 255, 0.32) 100%)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={Add01Icon} size={16} /> Add
              </button>
              <button
                type="button"
                className="btn rounded-lg text-white border-0 btn-sm px-3"
                style={{
                  background: "rgba(24, 33, 48, 0.4)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={ViewIcon} size={16} /> View
              </button>
              <button
                type="button"
                className="btn rounded-lg btn-success border-0 btn-sm px-3"
                style={{
                  background: "rgba(34, 197, 94, 0.4)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={BubbleChatIcon} size={16} /> Message
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="d-flex gap-3">
              <div className="profile flex-shrink-0">
                <Image
                  src={profileImg}
                  alt="Profileimg"
                  className="img-fluid"
                />
              </div>
              <div className="detail">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-medium m-0">Design Team</h6>
                  <button className="dots btn btn-link p-0">
                    <HugeiconsIcon
                      icon={MoreVerticalIcon}
                      size={20}
                      className="ms-auto text-white flex-shrink-0 cursor-pointer"
                    />
                  </button>
                </div>
                <span className="fw-light lh-normal">
                  {" "}
                  Creative UI/UX Design team focused on modern web applications
                  and...
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 text-white">
              <HugeiconsIcon icon={UserMultiple02Icon} />
              <span>8 members</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn rounded-lg text-white border-0 btn-sm text-[14px] px-3"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(0, 187, 255, 0.32) 0%, rgba(89, 71, 255, 0.32) 100%)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={Add01Icon} size={16} /> Add
              </button>
              <button
                type="button"
                className="btn rounded-lg text-white border-0 btn-sm px-3"
                style={{
                  background: "rgba(24, 33, 48, 0.4)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={ViewIcon} size={16} /> View
              </button>
              <button
                type="button"
                className="btn rounded-lg btn-success border-0 btn-sm px-3"
                style={{
                  background: "rgba(34, 197, 94, 0.4)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={BubbleChatIcon} size={16} /> Message
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="d-flex gap-3">
              <div className="profile flex-shrink-0">
                <Image
                  src={profileImg}
                  alt="Profileimg"
                  className="img-fluid"
                />
              </div>
              <div className="detail">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-medium m-0">Design Team</h6>
                  <button className="dots btn btn-link p-0">
                    <HugeiconsIcon
                      icon={MoreVerticalIcon}
                      size={20}
                      className="ms-auto text-white flex-shrink-0 cursor-pointer"
                    />
                  </button>
                </div>
                <span className="fw-light lh-normal">
                  {" "}
                  Creative UI/UX Design team focused on modern web applications
                  and...
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 text-white">
              <HugeiconsIcon icon={UserMultiple02Icon} />
              <span>8 members</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn rounded-lg text-white border-0 btn-sm text-[14px] px-3"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(0, 187, 255, 0.32) 0%, rgba(89, 71, 255, 0.32) 100%)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={Add01Icon} size={16} /> Add
              </button>
              <button
                type="button"
                className="btn rounded-lg text-white border-0 btn-sm px-3"
                style={{
                  background: "rgba(24, 33, 48, 0.4)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={ViewIcon} size={16} /> View
              </button>
              <button
                type="button"
                className="btn rounded-lg btn-success border-0 btn-sm px-3"
                style={{
                  background: "rgba(34, 197, 94, 0.4)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={BubbleChatIcon} size={16} /> Message
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="d-flex gap-3">
              <div className="profile flex-shrink-0">
                <Image
                  src={profileImg}
                  alt="Profileimg"
                  className="img-fluid"
                />
              </div>
              <div className="detail">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-medium m-0">Design Team</h6>
                  <button className="dots btn btn-link p-0">
                    <HugeiconsIcon
                      icon={MoreVerticalIcon}
                      size={20}
                      className="ms-auto text-white flex-shrink-0 cursor-pointer"
                    />
                  </button>
                </div>
                <span className="fw-light lh-normal">
                  {" "}
                  Creative UI/UX Design team focused on modern web applications
                  and...
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 text-white">
              <HugeiconsIcon icon={UserMultiple02Icon} />
              <span>8 members</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn rounded-lg text-white border-0 btn-sm text-[14px] px-3"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(0, 187, 255, 0.32) 0%, rgba(89, 71, 255, 0.32) 100%)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={Add01Icon} size={16} /> Add
              </button>
              <button
                type="button"
                className="btn rounded-lg text-white border-0 btn-sm px-3"
                style={{
                  background: "rgba(24, 33, 48, 0.4)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={ViewIcon} size={16} /> View
              </button>
              <button
                type="button"
                className="btn rounded-lg btn-success border-0 btn-sm px-3"
                style={{
                  background: "rgba(34, 197, 94, 0.4)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={BubbleChatIcon} size={16} /> Message
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="d-flex gap-3">
              <div className="profile flex-shrink-0">
                <Image
                  src={profileImg}
                  alt="Profileimg"
                  className="img-fluid"
                />
              </div>
              <div className="detail">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-medium m-0">Design Team</h6>
                  <button className="dots btn btn-link p-0">
                    <HugeiconsIcon
                      icon={MoreVerticalIcon}
                      size={20}
                      className="ms-auto text-white flex-shrink-0 cursor-pointer"
                    />
                  </button>
                </div>
                <span className="fw-light lh-normal">
                  {" "}
                  Creative UI/UX Design team focused on modern web applications
                  and...
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 text-white">
              <HugeiconsIcon icon={UserMultiple02Icon} />
              <span>8 members</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn rounded-lg text-white border-0 btn-sm text-[14px] px-3"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(0, 187, 255, 0.32) 0%, rgba(89, 71, 255, 0.32) 100%)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={Add01Icon} size={16} /> Add
              </button>
              <button
                type="button"
                className="btn rounded-lg text-white border-0 btn-sm px-3"
                style={{
                  background: "rgba(24, 33, 48, 0.4)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={ViewIcon} size={16} /> View
              </button>
              <button
                type="button"
                className="btn rounded-lg btn-success border-0 btn-sm px-3"
                style={{
                  background: "rgba(34, 197, 94, 0.4)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={BubbleChatIcon} size={16} /> Message
              </button>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card">
            <div className="d-flex gap-3">
              <div className="profile flex-shrink-0">
                <Image
                  src={profileImg}
                  alt="Profileimg"
                  className="img-fluid"
                />
              </div>
              <div className="detail">
                <div className="d-flex justify-content-between align-items-center">
                  <h6 className="fw-medium m-0">Design Team</h6>
                  <button className="dots btn btn-link p-0">
                    <HugeiconsIcon
                      icon={MoreVerticalIcon}
                      size={20}
                      className="ms-auto text-white flex-shrink-0 cursor-pointer"
                    />
                  </button>
                </div>
                <span className="fw-light lh-normal">
                  {" "}
                  Creative UI/UX Design team focused on modern web applications
                  and...
                </span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 text-white">
              <HugeiconsIcon icon={UserMultiple02Icon} />
              <span>8 members</span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn rounded-lg text-white border-0 btn-sm text-[14px] px-3"
                style={{
                  background:
                    "linear-gradient(270deg, rgba(0, 187, 255, 0.32) 0%, rgba(89, 71, 255, 0.32) 100%)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={Add01Icon} size={16} /> Add
              </button>
              <button
                type="button"
                className="btn rounded-lg text-white border-0 btn-sm px-3"
                style={{
                  background: "rgba(24, 33, 48, 0.4)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={ViewIcon} size={16} /> View
              </button>
              <button
                type="button"
                className="btn rounded-lg btn-success border-0 btn-sm px-3"
                style={{
                  background: "rgba(34, 197, 94, 0.4)",
                  fontSize: "14px",
                }}
              >
                <HugeiconsIcon icon={BubbleChatIcon} size={16} /> Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamCards;
