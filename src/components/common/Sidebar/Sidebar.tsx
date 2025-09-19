"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Home01Icon,
  WorkflowSquare07Icon,
  UserGroupIcon,
  WalletIcon,
  Notification01Icon,
  Ticket02Icon,
  DiceIcon,
  Wallet02Icon,
  Logout01Icon,
  Settings01Icon,
  User03Icon,
} from "@hugeicons/core-free-icons";
import { useNavigation } from "@/hooks/useNavigation";
import { RootState } from "@/reducers/Reducer";
import { useSelector } from "react-redux";
import { dynamicBlurDataUrl } from "@/services/utils/dynamicBlurImage";
import ImageFallback from "../ImageFallback/ImageFallback";
import { createPortal } from "react-dom";
import { useAppDispatch } from "@/store/Store";
import { clearToken, saveToken, setAuthState } from "@/reducers/AuthSlice";
import { setThread } from "@/reducers/ThreadSlice";
import { setUser } from "@/reducers/UserSlice";
import { useFetchUserInfo, useUpdateUserInfo } from "@/hooks/users/useUsers";
import { usePathname } from "next/navigation";
import { toast } from "react-toastify";
import { setAxiosHeaders } from "@/services/axiosDefaults";
import logoimg from "../../../../public/assets/images/te-logo.png";

export type TabKey =
  | "home"
  | "tasks"
  | "xperts"
  | "requestors"
  | "teams"
  | "disputes"
  | "wallet"
  | "notification";

export default function Sidebar({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  const { navigate } = useNavigation();
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const dropdownRef = useRef<HTMLDivElement>(null);

  const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const updateUserMutation = useUpdateUserInfo();

  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  const fetchUserDetails = useFetchUserInfo({ enabled: isAuth });

  const items: { key: TabKey; icon: any; link: string; label: string }[] = [
    { key: "home", icon: Home01Icon, link: "/dashboard", label: "Home" },
    {
      key: "tasks",
      icon: WorkflowSquare07Icon,
      link: "/dashboard/tasks",
      label: "Tasks",
    },
    ...(user?.profile?.length && user.profile[0]?.type === "TR"
      ? ([
          {
            key: "xperts",
            icon: DiceIcon,
            link: "/dashboard/talented-xperts",
            label: "Xperts",
          },
        ] as const)
      : ([
          {
            key: "requestors",
            icon: DiceIcon,
            link: "/dashboard/talent-requestors",
            label: "Requestors",
          },
          {
            key: "teams",
            icon: UserGroupIcon,
            link: "/dashboard/teams",
            label: "Teams",
          },
        ] as const)),
    {
      key: "disputes",
      icon: Ticket02Icon,
      link: "/dashboard/disputes",
      label: "Disputes",
    },
    {
      key: "wallet",
      icon: WalletIcon,
      link: "/dashboard/payments",
      label: "Wallet",
    },
    // { key: "notification", icon: Notification01Icon, link: "/dashboard/notifications", label: "Notification" },
  ];

  useEffect(() => {
    if (isAuth && !fetchUserDetails.isLoading && !user) {
      fetchUserDetails?.refetch();
      // getUserDetails();
    }
  }, [isAuth, fetchUserDetails.isLoading, user]);

  useEffect(() => {
    if (fetchUserDetails.isSuccess && fetchUserDetails.data) {
      dispatch(setUser(fetchUserDetails.data));
    }
  }, [fetchUserDetails]);

  useEffect(() => {
    if (user?.profilePicture?.fileUrl) {
      fetchBlurDataURL();
    }
  }, [user?.profilePicture?.fileUrl]);

  const fetchBlurDataURL = useCallback(async () => {
    if (user?.profilePicture?.fileUrl) {
      const blurUrl = await dynamicBlurDataUrl(user?.profilePicture?.fileUrl);
      setProfileImageBlurDataURL(blurUrl);
    }
  }, [user?.profilePicture?.fileUrl]);

  const handleLogout = () => {
    dispatch(saveToken(null));
    dispatch(setAuthState(false));
    dispatch(setThread(null));
    dispatch(clearToken());
    dispatch(setUser(null));
    localStorage.removeItem("persist:root");
    localStorage.clear();
    navigate("/");
    setMenuOpen(false);
  };

  const handleDropdownClick = useCallback(
    (path: string) => {
      navigate(path);
      setMenuOpen(false);
    },
    [navigate]
  );

  const handleSwitch = useCallback(() => {
    const currentType = localStorage.getItem("profileType");
    const newType = currentType === "TR" ? "TE" : "TR";

    if (user?.profileType === "BOTH") {
      localStorage.setItem("profileType", newType);
      dispatch(setUser(null));
      setAxiosHeaders();
      navigate(pathname === "/dashboard" ? "/dashboard" : "/dashboard");
      onChange("home");
      //   getUserDetails();
      navigate(pathname === "/dashboard" ? "/dashboard" : "/dashboard");
    } else {
      createOtherAccount(newType);
    }
    setMenuOpen(false);
  }, [user?.profileType, pathname, navigate]);

  const createOtherAccount = useCallback(
    async (newType: string) => {
      if (
        newType === "TE" &&
        (!user?.education?.length ||
          !user?.experience?.length ||
          !user?.skills.length)
      ) {
        toast.info(
          "Complete your Education, Experience, and Skills to become an Expert."
        );
        navigate("/dashboard/profile-setting");
        return;
      }

      updateUserMutation.mutate(
        { id: user?.id, profileType: "BOTH" },
        {
          onSuccess: () => {
            localStorage.setItem("profileType", newType);
            getUserDetails();
          },
          onError: (err) => {
            toast.error(
              `${
                err?.message ||
                err ||
                "Failed to switch profile type. Please try again."
              }`
            );
          },
        }
      );
    },
    [
      user?.education,
      user?.experience,
      user?.skills,
      user?.id,
      updateUserMutation,
      navigate,
    ]
  );

  const getUserDetails = () => {
    if (fetchUserDetails.isLoading) return;
    if (fetchUserDetails.isError) {
      console.warn(fetchUserDetails.error);
      return;
    }
    if (fetchUserDetails.data) {
      dispatch(setUser(fetchUserDetails.data));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <aside className="sidebar d-flex flex-column align-items-center">
      <div
        className="logo mb-4 gradient-box"
        role="img"
        aria-label="logo"
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        {/* you can replace with <Image src="/logo.png" ... /> */}
        <Image className="img-fluid" src={logoimg} alt="logo image" />
        {/* <svg
          xmlns="http://www.w3.org/2000/svg"
          width="46"
          height="39"
          viewBox="0 0 46 39"
          fill="none"
        >
          <path
            d="M37.4502 0H34.0077C33.3417 0 32.7195 0.331479 32.3479 0.884152L25.8662 10.5255C24.147 13.0827 24.0494 16.3999 25.6151 19.0539L32.9423 31.4737L26.1985 26.524C25.295 25.8608 24.0229 26.0695 23.3786 26.9866L21.8497 29.163C21.2175 30.0629 21.4305 31.3044 22.3265 31.9421L28.0779 36.0355C30.7873 37.9638 34.0301 39 37.3556 39H38.1728C41.2689 39 43.1912 35.6337 41.6178 32.9672L32.1657 16.949C31.3625 15.5877 31.4361 13.8812 32.3536 12.5942L39.0787 3.161C40.0226 1.83708 39.0761 0 37.4502 0Z"
            fill="url(#paint0_linear_185_6334)"
          />
          <path
            d="M8.36248 39H11.5941C12.2704 39 12.9009 38.6582 13.27 38.0915L19.5927 28.3834C21.2296 25.8699 21.323 22.652 19.8347 20.0478L12.6783 7.52632L19.1288 12.4135C20.041 13.1046 21.3461 12.8907 21.99 11.9446L23.4459 9.80537C24.0515 8.91541 23.8441 7.7057 22.9766 7.06833L17.583 3.10581C14.8367 1.08811 11.5178 0 8.10993 0H7.71936C4.64778 0 2.72235 3.31849 4.24671 5.98512L13.4605 22.1033C14.2243 23.4394 14.1538 25.0952 13.2792 26.3615L6.71681 35.8634C5.80057 37.1901 6.75018 39 8.36248 39Z"
            fill="url(#paint1_linear_185_6334)"
          />
          <defs>
            <linearGradient
              id="paint0_linear_185_6334"
              x1="20.707"
              y1="19.5"
              x2="45.1776"
              y2="19.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#D7E2FF" />
              <stop offset="1" stop-color="#E1F9FF" />
            </linearGradient>
            <linearGradient
              id="paint1_linear_185_6334"
              x1="24.5312"
              y1="19.5"
              x2="0.825367"
              y2="19.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#D7E2FF" />
              <stop offset="1" stop-color="#E1F9FF" />
            </linearGradient>
          </defs>
        </svg> */}
      </div>

      <nav
        className="d-flex flex-column align-items-center w-100"
        aria-label="main navigation"
      >
        {items.map((it) => (
          <button
            key={it.key}
            onClick={() => {
              navigate(it.link);
              onChange(it.key);
            }}
            className={`nav-btn ${active === it.key ? "active" : ""}`}
            title={it.label}
            aria-current={active === it.key ? "page" : undefined}
          >
            <HugeiconsIcon icon={it.icon} size={24} color="currentColor" />
            <span className="d-none d-lg-block mt-1">{it.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto text-center w-100 pb-3 position-relative">
        <div
          className="d-flex flex-column align-items-center cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <ImageFallback
            src={user?.profilePicture?.fileUrl}
            alt="avatar"
            width={44}
            height={44}
            className="rounded-circle"
            style={{ objectFit: "cover", width: 44, height: 44 }}
            loading="lazy"
            userName={user ? `${user?.firstName} ${user?.lastName}` : null}
            blurDataURL={profileImageBlurDataURL || undefined}
          />
          <div className="mt-2 d-none d-lg-block small text-truncate w-100 px-1">
            {user?.firstName} {user?.lastName}
          </div>
        </div>
        {menuOpen &&
          createPortal(
            <div
              className="dropdown-menu-custom shadow rounded p-3"
              ref={dropdownRef}
            >
              <div className="d-flex gap-1 rounded-pill overflow-hidden border border-light mb-2">
                <button
                  className={`btn rounded-pill ${
                    user?.profile?.[0]?.type === "TE"
                      ? "btn-light"
                      : "btn-outline-light"
                  } fs-10 fw-500`}
                  aria-current="page"
                  onClick={handleSwitch}
                >
                  TalentedXpert
                </button>
                <button
                  className={`btn rounded-pill border-0 ${
                    user?.profile?.[0]?.type === "TR"
                      ? "btn-light"
                      : "btn-outline-light"
                  } fs-10 fw-500 w-auto`}
                  onClick={handleSwitch}
                >
                  TalentedRequestor
                </button>
              </div>
              <button
                className="dropdown-item d-flex align-items-center"
                style={{
                  background: "transparent",
                  color: "#ccc",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "background 0.2s",
                }}
                onClick={() =>
                  handleDropdownClick("/dashboard/payments/information")
                }
              >
                <HugeiconsIcon icon={Wallet02Icon} size={20} className="me-2" />
                Payment Information
              </button>
              <button
                className="dropdown-item d-flex align-items-center"
                style={{
                  background: "transparent",
                  color: "#ccc",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "background 0.2s",
                }}
                onClick={() =>
                  handleDropdownClick(
                    `/dashboard/${
                      user?.profile?.[0]?.type === "TR"
                        ? "talent-requestors"
                        : "talented-xperts"
                    }/${user?.id}`
                  )
                }
              >
                <HugeiconsIcon icon={User03Icon} size={20} className="me-2" />
                Your Profile
              </button>
              <button
                className="dropdown-item d-flex align-items-center"
                style={{
                  background: "transparent",
                  color: "#ccc",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "background 0.2s",
                }}
                onClick={() =>
                  handleDropdownClick("/dashboard/profile-setting")
                }
              >
                <HugeiconsIcon
                  icon={Settings01Icon}
                  size={20}
                  className="me-2"
                />
                Account Settings
              </button>
              <button
                className="dropdown-item d-flex align-items-center"
                style={{
                  background: "transparent",
                  color: "#ccc",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "background 0.2s",
                }}
                onClick={handleLogout}
              >
                <HugeiconsIcon icon={Logout01Icon} size={20} className="me-2" />
                Log out
              </button>
            </div>,
            document.body
          )}
      </div>
    </aside>
  );
}
