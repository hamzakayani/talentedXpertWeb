"use client";
import HtmlData from "@/components/common/HtmlData/HtmlData";
import NoFound from "@/components/common/NoFound/NoFound";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { RootState, useAppDispatch } from "@/store/Store";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FC, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import { useNavigation } from "@/hooks/useNavigation";

const ListCards: FC<any> = ({
  type,
  checkbox,
  setArticleId,
  articleId,
  setValue,
}) => {
  const user = useSelector((state: RootState) => state.user);
  const [article, setArticle] = useState<any>([]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { navigate } = useNavigation();

  const getArticles = async () => {
    try {
      if (user?.profile?.[0]?.id) {
        const response = await apiCall(
          requests?.articles,
          { profileId: user?.profile[0]?.id },
          "get",
          false,
          dispatch,
          user,
          router
        );
        setArticle(response?.data?.data?.articles || []);
      }
    } catch (error) {
      console.warn("Error fetching articles:", error);
    }
  };

  useEffect(() => {
    if (user?.profile?.[0]?.id) {
      getArticles();
    }
  }, [user?.profile?.[0]?.id]);

  const handleShare = (platform: string, url: string, title: string) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
        break;
    }
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {article.length > 0 ? (
        article.map((article: any, index: number) => {
          const articleUrl = `${process.env.DOMAIN}/dashboard/articles/${article.id}`;
          return (
            <div
              key={article?.id}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "clamp(8px, 2vw, 6px) 0",
                borderBottom:
                  index < article.length - 1 ? "1px solid #444" : "none",
                gap: "clamp(8px, 2vw, 16px)",
              }}
            >
              {checkbox && (
                <input
                  type="checkbox"
                  checked={articleId?.includes(article.id)}
                  onChange={() => {
                    setArticleId((prev: any[]) =>
                      prev.includes(article.id)
                        ? prev.filter((id) => id !== article.id)
                        : [...prev, article.id]
                    );
                  }}
                  style={{
                    width: "16px",
                    height: "16px",
                    backgroundColor: "transparent",
                    border: "1px solid white",
                    borderRadius: "2px",
                    accentColor: "#007bff",
                  }}
                />
              )}

              <div
                style={{
                  flex: 1,
                  color: "white",
                  fontSize: "clamp(12px, 2vw, 14px)",
                  lineHeight: "1.4",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {/* <HtmlData data={article?.description || article?.title} className="job-description" style={{ display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: 4, overflow: "hidden" }}/> */}
                {article?.title}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* View Button */}
                <Link
                  href={`/dashboard/articles/${article?.id}`}
                  onClick={() => navigate(`/dashboard/articles/${article?.id}`)}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "clamp(4px, 1vw, 8px)",
                    padding: "clamp(4px, 1.5vw, 4px) clamp(8px, 2.5vw, 12px)",
                    border: "1px solid white",
                    borderRadius: "clamp(12px, 4vw, 20px)",
                    color: "white",
                    textDecoration: "none",
                    fontSize: "clamp(10px, 2vw, 14px)",
                    backgroundColor: "transparent",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "rgba(255, 255, 255, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  View
                  <Icon icon="mdi:arrow-right" width="12" />
                </Link>

                {/* Share Icons */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center", color:'#fff' }}>
                  <Icon
                    icon="mdi:facebook"
                    width="18"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleShare("facebook", articleUrl, article.title)
                    }
                  />
                  <Icon
                    icon="mdi:twitter"
                    width="18"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleShare("twitter", articleUrl, article.title)
                    }
                  />
                  <Icon
                    icon="mdi:linkedin"
                    width="18"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleShare("linkedin", articleUrl, article.title)
                    }
                  />
                  <Icon
                    icon="mdi:whatsapp"
                    width="18"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleShare("whatsapp", articleUrl, article.title)
                    }
                  />
                </div>
              </div>
            </div>
          )
        })
      ) : (
        <NoFound message={"Articles not found"} />
      )}
    </>
  );
};

export default ListCards;
