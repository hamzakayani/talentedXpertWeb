"use client";

import React, { useCallback, useEffect, useState } from "react";
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

export type TabKey = "home" | "tasks" | "xperts" | "requestors" | "teams" | "disputes" | "wallet" | "notification";

export default function Sidebar({
    active,
    onChange,
}: {
    active: TabKey;
    onChange: (t: TabKey) => void;
}) {
    const { navigate } = useNavigation()
    const pathname = usePathname()
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useAppDispatch()

    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState("");
    const [menuOpen, setMenuOpen] = useState(false);

    const updateUserMutation = useUpdateUserInfo()

    const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
    const fetchUserDetails = useFetchUserInfo({enabled: isAuth});

    const items: { key: TabKey; icon: any; link: string; label: string }[] = [
        { key: "home", icon: Home01Icon, link: "/dashboard", label: "Home" },
        { key: "tasks", icon: WorkflowSquare07Icon, link: "/dashboard/tasks", label: "Tasks" },
        ...(user?.profile?.length && user.profile[0]?.type === "TR"
            ? ([{ key: "xperts", icon: DiceIcon, link: "/dashboard/talented-xperts", label: "Xperts" }] as const)
            : ([{ key: "requestors", icon: DiceIcon, link: "/dashboard/talent-requestors", label: "Requestors" }] as const)),
        { key: "teams", icon: UserGroupIcon, link: "/dashboard/teams", label: "Teams" },
        { key: "disputes", icon: Ticket02Icon, link: "/dashboard/disputes", label: "Disputes" },
        { key: "wallet", icon: WalletIcon, link: "/dashboard/payments", label: "Wallet" },
        // { key: "notification", icon: Notification01Icon, link: "/dashboard/notifications", label: "Notification" },
    ];

    useEffect(() => {
        if (isAuth && !fetchUserDetails.isLoading) {
          getUserDetails();
        }
    }, [isAuth, fetchUserDetails.isLoading]);

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
        localStorage.removeItem('persist:root');
        localStorage.clear();
        navigate("/");
        setMenuOpen(false);
    };

    const handleDropdownClick = useCallback((path: string) => {
        navigate(path);
        setMenuOpen(false);
    }, [navigate]);

    const handleSwitch = useCallback(() => {
        const currentType = localStorage.getItem("profileType");
        const newType = currentType === "TR" ? "TE" : "TR";

        if (user?.profileType === "BOTH") {
            localStorage.setItem("profileType", newType);
            getUserDetails();
            navigate(pathname === "/dashboard" ? "/dashboard" : "/dashboard");
        } else {
            createOtherAccount(newType);
        }
        setMenuOpen(false);
    }, [user?.profileType, pathname, navigate]);

    const createOtherAccount = useCallback(async (newType: string) => {
        if (newType === "TE" && (!user?.education?.length || !user?.experience?.length || !user?.skills.length)) {
            toast.info("Complete your Education, Experience, and Skills to become an Expert.");
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
                    toast.error(`${err?.message || err || "Failed to switch profile type. Please try again."}`);
                }
            }
        );
    }, [user?.education, user?.experience, user?.skills, user?.id, updateUserMutation, navigate]);

    const getUserDetails = useCallback(() => {
        if (fetchUserDetails.isLoading) return;
        if (fetchUserDetails.isError) {
          console.warn(fetchUserDetails.error);
          return;
        }
        if(fetchUserDetails.data){
          dispatch(setUser(fetchUserDetails.data));          
        }
    }, [dispatch]);

    return (
        <aside className="sidebar d-flex flex-column align-items-center">
            <div className="logo mb-4" role="img" aria-label="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}> 
                {/* you can replace with <Image src="/logo.png" ... /> */}
            </div>

            <nav className="d-flex flex-column align-items-center w-100" aria-label="main navigation">
                {items.map((it) => (
                    <button
                        key={it.key}
                        onClick={() => {
                            navigate(it.link)
                            onChange(it.key)
                        }}
                        className={`nav-btn ${active === it.key ? "active" : ""}`}
                        title={it.label}
                        aria-current={active === it.key ? "page" : undefined}
                    >
                        <HugeiconsIcon icon={it.icon} size={24} color="currentColor" />
                        <div className="d-none d-lg-block small mt-1">{it.label}</div>
                    </button>
                ))}
            </nav>

            <div className="mt-auto text-center w-100 pb-3 position-relative">
                <div className="d-flex flex-column align-items-center cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
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
                    <div className="mt-2 d-none d-lg-block small text-truncate w-100 px-1">{user?.firstName} {user?.lastName}</div>
                </div>
                {menuOpen && createPortal(
                    <div className="dropdown-menu-custom shadow rounded p-3">
                        <div className="d-flex gap-1 rounded-pill overflow-hidden border border-light mb-2">
                            <button
                                className={`btn rounded-pill ${user?.profile?.[0]?.type === 'TE' ? "btn-light" : "btn-outline-light"} fs-10 fw-500`}
                                aria-current="page"
                                  onClick={handleSwitch}
                            >
                                TalentedXpert
                            </button>
                            <button 
                                className={`btn rounded-pill border-0 ${user?.profile?.[0]?.type === 'TR' ? "btn-light" : "btn-outline-light"} fs-10 fw-500 w-auto`}
                                onClick={handleSwitch}
                            >
                                TalentedRequestor
                            </button>
                        </div>
                        <button className="dropdown-item d-flex align-items-center" style={{ background: "transparent", color: "#ccc", padding: "8px 12px", borderRadius: "6px", transition: "background 0.2s" }} onClick={() => handleDropdownClick("/dashboard/payments/information")}>
                            <HugeiconsIcon icon={Wallet02Icon} size={20} className="me-2" />
                            Payment Information
                        </button>
                        <button className="dropdown-item d-flex align-items-center" style={{ background: "transparent", color: "#ccc", padding: "8px 12px", borderRadius: "6px", transition: "background 0.2s" }} onClick={() => handleDropdownClick(`/dashboard/${user?.profile?.[0]?.type === 'TR' ? "talent-requestors" : "talented-xperts"}/${user?.id}`)}>
                            <HugeiconsIcon icon={User03Icon} size={20} className="me-2" />
                            Your Profile
                        </button>
                        <button className="dropdown-item d-flex align-items-center" style={{ background: "transparent", color: "#ccc", padding: "8px 12px", borderRadius: "6px", transition: "background 0.2s" }} onClick={() => handleDropdownClick('/dashboard/profile-setting')}>
                            <HugeiconsIcon icon={Settings01Icon} size={20} className="me-2" />
                            Account Settings
                        </button>
                        <button className="dropdown-item d-flex align-items-center" style={{ background: "transparent", color: "#ccc", padding: "8px 12px", borderRadius: "6px", transition: "background 0.2s" }} onClick={handleLogout}>
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
