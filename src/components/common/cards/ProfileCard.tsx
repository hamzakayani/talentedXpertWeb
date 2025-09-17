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
    <div
      className={`profile-card position-relative p-3 gradient-border-image ${
        user?.disability ? "border-gradient3" : ""
      } `}
    >
      {user?.disability && (
        <div className="disablity bg-gradient3 rounded-5 w-auto py-1 px-4 d-flex align-items-center gap-2 maxw-auto text-dark">
          <HugeiconsIcon icon={WheelchairIcon} />
          <span className="fw-medium">Disability</span>
        </div>
      )}
      <div className="d-flex align-items-center gap-3 flex-wrap h-100">
        <div className="flex-grow-1">
          <p className="fw-semibold mb-0">
            {user?.firstName} {user?.lastName}
          </p>
          <small className="">{user?.title}</small>
          <div className="mt-2">
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
        <ImageFallback
          src={user?.profilePicture?.fileUrl}
          alt="user"
          width={72}
          height={72}
          className="rounded-circle flex-shrink-0"
          style={{ objectFit: "cover" }}
          blurDataURL={profileImageBlurDataURL}
          loading="lazy"
          userName={user ? `${user?.firstName} ${user?.lastName}` : null}
        />
      </div>
    </div>
  );
}
