"use client";

import React, { useEffect, useState } from "react";
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
} from "@hugeicons/core-free-icons";
import { useNavigation } from "@/hooks/useNavigation";
import { RootState } from "@/reducers/Reducer";
import { useSelector } from "react-redux";
import { dynamicBlurDataUrl } from "@/services/utils/dynamicBlurImage";
import ImageFallback from "../ImageFallback/ImageFallback";

export type TabKey = "home" | "tasks" | "xperts" | "requestors" | "teams" | "disputes" | "wallet" | "notification";

export default function Sidebar({
    active,
    onChange,
}: {
    active: TabKey;
    onChange: (t: TabKey) => void;
}) {
    const { navigate } = useNavigation()
    const user = useSelector((state: RootState) => state.user)

    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState("");

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
        if (user?.profilePicture?.fileUrl) {
            fetchBlurDataURL();
        }
    }, [user?.profilePicture?.fileUrl]);
    
    const fetchBlurDataURL = async () => {
        if (user?.profilePicture?.fileUrl) {
            const blurUrl = await dynamicBlurDataUrl(user?.profilePicture?.fileUrl);
            setProfileImageBlurDataURL(blurUrl);
        }
    };

    return (
        <aside className="sidebar d-flex flex-column align-items-center">
            <div className="logo mb-4" role="img" aria-label="logo">
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

            <div className="mt-auto text-center w-100 pb-3">
                <div className="d-flex flex-column align-items-center">
                    <ImageFallback 
                        src={user?.profilePicture?.fileUrl}
                        // fallbackSrc="/assets/images/default-user.jpg"
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
            </div>
        </aside>
    );
}
