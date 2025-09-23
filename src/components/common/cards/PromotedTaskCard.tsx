import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react/dist/iconify.js";
import HtmlData from "@/components/common/HtmlData/HtmlData";
import RatingStar from "@/components/common/RatingStar/RatingStar";
import { useNavigation } from "@/hooks/useNavigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/Store";
import { WheelchairIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import ImageFallback from "../ImageFallback/ImageFallback";
import { dynamicBlurDataUrl } from "@/services/utils/dynamicBlurImage";

type PromotedTaskCardProps = {
  data: any;
  activeTab: string;
  isDark?: boolean;
  btn: string;
  isDashboard?: boolean;
};

const PromotedTaskCard: React.FC<PromotedTaskCardProps> = ({ data, activeTab, isDark, btn, isDashboard = false }) => {
  const { navigate } = useNavigation();
  const user = useSelector((state: RootState) => state.user);
  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState("");

  useEffect(() => {
    if (data?.profilePicture?.fileUrl || data?.requesterProfile?.user?.profilePicture?.fileUrl) {
      fetchBlurDataURL();
    }
  }, [data?.profilePicture?.fileUrl, data?.requesterProfile?.user?.profilePicture?.fileUrl]);
  
  const fetchBlurDataURL = useCallback(async () => {
    if (data?.profilePicture?.fileUrl || data?.requesterProfile?.user?.profilePicture?.fileUrl) {
      const blurUrl = await dynamicBlurDataUrl(data?.profilePicture?.fileUrl || data?.requesterProfile?.user?.profilePicture?.fileUrl);
      setProfileImageBlurDataURL(blurUrl);
    }
  }, [data?.profilePicture?.fileUrl, data?.requesterProfile?.user?.profilePicture?.fileUrl]);

  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const tagContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Function to handle the scroll buttons' visibility
  const checkScrollButtons = () => {
    if (tagContainerRef.current) {
      const { scrollLeft, scrollWidth, offsetWidth } = tagContainerRef.current;
      setCanScrollLeft(scrollLeft > 0); // If it's scrolled, enable left button
      setCanScrollRight(
        scrollWidth > offsetWidth && scrollLeft < scrollWidth - offsetWidth // If there's more content to the right, enable right button
      );
    }
  };

  const handleNextScroll = () => {
    if (tagContainerRef.current) {
      tagContainerRef.current.scrollLeft += 150;
      checkScrollButtons();
    }
  };

  const handlePrevScroll = () => {
    if (tagContainerRef.current) {
      tagContainerRef.current.scrollLeft -= 150;
      checkScrollButtons();
    }
  };

  useEffect(() => {
    checkScrollButtons();
  }, []);

  return (
    <div className={`promoted_task mb-2 d-flex flex-column h-100 ${isDashboard ? `bg-dashbord-card p-4 ${data?.disability ? 'border-gradient3' : ''}` : 'p-4'}`}>
      {data?.disability && 
        <div className={`disablity bg-gradient3 rounded-5 w-auto py-1 px-4 d-flex align-items-center gap-2 maxw-auto position-absolute ${isDashboard ? "text-dark" : ''}`}>
          <HugeiconsIcon icon={WheelchairIcon} />
          <span className="fw-medium">Disability</span>
        </div>
      }
      <div className="usertext">
        <div className="d-flex align-items-start justify-content-between">
          <div
            className="d-flex gap-3 align-items-start"
            style={{ minWidth: 0 }}
          >
            <div
              className="userimg overflow-hidden flex-shrink-0"
              style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #00BBFF, #5947FF)', padding: '2px' }}
            >
              <ImageFallback
                // src="/assets/images/default-user.jpg"
                src={data?.profilePicture?.fileUrl || data?.requesterProfile?.user?.profilePicture?.fileUrl}
                alt="userimg"
                width={72}
                height={72}
                style={{ objectFit: 'cover', fontSize: "34px", }}
                blurDataURL={profileImageBlurDataURL}
                loading="lazy"
                userName={activeTab === "talentedxpert" || activeTab === "talentrequestor" ? `${data?.firstName} ${data?.lastName}` || null : `${data?.requesterProfile?.user?.firstName} ${data?.requesterProfile?.user?.lastName}` || null}
              />
            </div>
            <Link
              className="mb-0 text-white d-block"
              style={{ minWidth: 0 }}
              href={activeTab === "talentedxpert" ? `${isDashboard ? '/dashboard' : ''}/talented-xperts/${data.id}` : activeTab === "talentrequestor" ? `${isDashboard ? '/dashboard' : ''}/talent-requestors/${data.id}` : `${isDashboard ? '/dashboard' : ''}/tasks/${data?.id}`}
              onClick={() => navigate(activeTab === "talentedxpert" ? `${isDashboard ? '/dashboard' : ''}/talented-xperts/${data.id}` : activeTab === "talentrequestor" ? `${isDashboard ? '/dashboard' : ''}/talent-requestors/${data.id}` : `${isDashboard ? '/dashboard' : ''}/tasks/${data?.id}`)}
            >
              <h4
                className="mb-1"
                style={{
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {activeTab === "talentedxpert" || activeTab === "talentrequestor" ? `${data?.firstName} ${data?.lastName}` : data?.name}
              </h4>
              <p className="fw-normal mb-1">{activeTab === "talentedxpert" || activeTab === "talentrequestor" ? data?.title : data?.taskType}</p>
            </Link>
          </div>
          {data?.promoted || data?.profile?.find((prof: any) => activeTab === 'talentrequestor' ? prof?.type === 'TR' : prof?.type === 'TE')?.promoted &&
            <span className={`ribbin ${isDark ? "text-dark" : ''}`}>Promoted</span>
          }
        </div>
      </div>
      <HtmlData
        data={activeTab === "talentedxpert" || activeTab === "talentrequestor" ? data?.about || '' : data?.details || ''}
        className="text-white line-clamp-3 fw-normal ff-figtree mt-3"
      />
      <hr className="text-light" />
      <div
        className="tags mb-2 overflow-hidden position-relative"
        style={{ display: "flex", alignItems: "center" }}
        onMouseEnter={() => setShowScrollButtons(true)}
        onMouseLeave={() => setShowScrollButtons(false)}
      >
        {/* Scroll Left Button */}
        {showScrollButtons && canScrollLeft && (
          <button
            className="btn btn-outline-light rounded-circle position-absolute start-0 top-50 translate-middle-y z-index-10"
            style={{
              left: 0,
              zIndex: 5,
              width: "26px", 
              height: "26px", 
              padding: 0, 
              borderRadius: "50%", 
              display: "flex",
              alignItems: "center", 
              justifyContent: "center",
            }}
            onClick={handlePrevScroll}
          >
            <Icon icon="line-md:arrow-left" style={{ fontSize: "20px" }} />
          </button>
        )}

        {/* Tags */}
        <div
          className="tags-container d-flex gap-2"
          ref={tagContainerRef}
          style={{
            scrollbarWidth: "thin",
            maxWidth: "100%",
            overflowX: "auto", // Enable horizontal scroll
            whiteSpace: "nowrap", // Prevent tags from wrapping to the next line
            flexWrap: "nowrap", // Keep tags in one line
          }}
        >
          {["Product Designer", "UX/UI", "Brand Design", "Design System", "Web Development", "Mobile Apps", "UI/UX Design"].map((tag, index) => (
            <div key={index} className="tag px-2 border border-light text-white rounded-1 d-inline-block ff-figtree" style={{ textAlign: "center" }}>
              <small>{tag}</small>
            </div>
          ))}
        </div>

        {/* Scroll Right Button */}
        {showScrollButtons && canScrollRight && (
          <button
            className="btn btn-outline-light rounded-circle position-absolute end-0 top-50 translate-middle-y z-index-10"
            style={{
              right: 0,
              zIndex: 5,
              width: "26px", 
              height: "26px", 
              padding: 0, 
              borderRadius: "50%", 
              display: "flex",
              alignItems: "center", 
              justifyContent: "center",
            }}
            onClick={handleNextScroll}
          >
            <Icon icon="line-md:arrow-right" style={{ fontSize: "20px" }} />
          </button>
        )}
      </div>
      {/* <div className="tags mb-2">
        <div
          className="tag border border-light text-white rounded-1 d-inline-block ff-figtree"
          style={{ textAlign: "center" }}
        >
          <small>Product Designer</small>
        </div>
        <div
          className="tag border border-light text-white rounded-1 d-inline-block ff-figtree"
          style={{ textAlign: "center" }}
        >
          <small> UX/UI</small>
        </div>
        <div
          className="tag border border-light text-white rounded-1 d-inline-block ff-figtree"
          style={{ textAlign: "center" }}
        >
          <small> Brand Design</small>
        </div>
        <div
          className="tag border border-light text-white rounded-1 d-inline-block ff-figtree"
          style={{ textAlign: "center" }}
        >
          <small>Design System</small>
        </div>
      </div> */}
      <div className="d-flex align-items-center justify-content-between mt-auto">
        <RatingStar rating={activeTab === 'talentedxpert' || activeTab === "talentrequestor" ? data?.profile?.find((prof: any) => activeTab === 'talentrequestor' ? prof?.type === 'TR' : prof?.type === 'TE')?.averageRating : data?.requesterProfile?.averageRating} data={activeTab === "talentedxpert" || activeTab === "talentrequestor" ? data?.profile?.find((prof: any) => activeTab === 'talentrequestor' ? prof?.type === 'TR' : prof?.type === 'TE')?.[0] : data } />
        {(user?.profile && user?.profile[0].type == "TE") || !isAuth ? (
          <Link
            className="btn btn-outline-light rounded-pill btn-sm w-auto mt-1 ff-figtree fw-normal"
            style={{ textAlign: "center" }}
            href={isAuth ? activeTab === "talentedxpert" ? `${isDashboard ? '/dashboard' : ''}/talented-xperts/${data.id}` : activeTab === "talentrequestor" ? `${isDashboard ? '/dashboard' : ''}/talent-requestors/${data.id}` : `${isDashboard ? '/dashboard' : ''}/tasks/${data?.id}` : "/signin"}
            onClick={() => navigate(isAuth ? activeTab === "talentedxpert" ? `${isDashboard ? '/dashboard' : ''}/talented-xperts/${data.id}` : activeTab === "talentrequestor" ? `${isDashboard ? '/dashboard' : ''}/talent-requestors/${data.id}` : `${isDashboard ? '/dashboard' : ''}/tasks/${data?.id}` : "/signin")}
          >
            <small>{btn}</small>{" "}
            <Icon icon="line-md:arrow-right" className="ms-1 ff-figtree" />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default PromotedTaskCard;
