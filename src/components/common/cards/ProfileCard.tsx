"use client";
import { dynamicBlurDataUrl } from "@/services/utils/dynamicBlurImage";
import { RootState } from "@/store/Store";
import { WheelchairIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ImageFallback from "../ImageFallback/ImageFallback";
import { Icon } from "@iconify/react";

export default function ProfileCard() {
  const user = useSelector((state: RootState) => state.user);
  const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState("");

  const fetchBlurDataURL = async () => {
    if (user?.profilePicture?.fileUrl) {
      const blurUrl = await dynamicBlurDataUrl(user?.profilePicture?.fileUrl);
      setProfileImageBlurDataURL(blurUrl);
    }
  };

  useEffect(() => {
    if (user?.profilePicture?.fileUrl) {
      fetchBlurDataURL();
    }
  }, [user?.profilePicture?.fileUrl]);

  return (
    <div
      className={`profile-card position-relative p-3 border-gradient3`}
      style={{ height: "145px !important" }}
    >
      {user?.disability && (
        <div
          className="disablity bg-gradient3 rounded-5 w-auto px-4 d-flex align-items-center gap-2 maxw-auto text-dark position-absolute"
          style={{
            top: "-13px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <HugeiconsIcon icon={WheelchairIcon} />
          <span className="fw-medium">Disability</span>
        </div>
      )}
      {user?.profile?.[0]?.isPromoted && (
        <span
          className="ribbin text-dark"
          style={{
            position: "absolute",
            top: "10px",
            right: "0",
            fontSize: "12px",
            fontWeight: "500",
            padding: "0px 15px",
            height: "30px",
            minWidth: "auto",
            marginRight: "0",
          }}
        >
          Promoted
        </span>
      )}
      <div className="d-flex align-items-center gap-3 flex-wrap h-100">
        <div
          className="flex-grow-1 d-flex flex-column h-100"
          style={{ textAlign: "left" }}
        >
          <div
            className="fw-semibold"
            style={{ marginTop: "10px", textTransform: "capitalize" }}
          >
            {user?.firstName} {user?.lastName}
          </div>
          <small className="mt-0" style={{ textTransform: "capitalize" }}>
            {user?.title}
          </small>
          <div className="mt-auto">
            <small className="text-white fs-12">
              Tasks Completed: {user?.profile?.[0]?.completedTasks?.length || 0}
            </small>
            <div className="d-flex align-items-center gap-2 fs-12">
              <div className="rating">
                {[...Array(5)].map((_, index) => (
                  <Icon
                    key={index}
                    icon="material-symbols-light:kid-star"
                    className={`${
                      index < user?.profile?.[0]?.averageRating ? "rated" : ""
                    }`}
                  />
                ))}
              </div>
              <small className="text-white mt-1">
                {user?.profile?.[0]?.averageRating}/5
              </small>
            </div>
          </div>
        </div>
        <div
          className="rounded-circle flex-shrink-0 d-flex align-items-center justify-content-center"
          style={{
            width: "72px",
            height: "72px",
            background: "linear-gradient(135deg, #00BBFF, #5947FF)",
            padding: "2px",
          }}
        >
          <ImageFallback
            src={user?.profilePicture?.fileUrl}
            alt="user"
            width={68}
            height={68}
            className="rounded-circle"
            style={{ objectFit: "cover", fontSize: "34px" }}
            blurDataURL={profileImageBlurDataURL}
            loading="lazy"
            userName={user ? `${user?.firstName} ${user?.lastName}` : null}
          />
        </div>
      </div>
    </div>
  );
}
