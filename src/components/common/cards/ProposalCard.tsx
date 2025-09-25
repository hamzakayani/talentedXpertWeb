'use client'
import { useNavigation } from '@/hooks/useNavigation';
import { dynamicBlurDataUrl } from '@/services/utils/dynamicBlurImage';
import React, { FC, useCallback, useEffect, useState } from 'react'
import { Calendar04Icon, DollarCircleIcon, WheelchairIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import ImageFallback from '../ImageFallback/ImageFallback';
import Link from 'next/link';
import HtmlData from '../HtmlData/HtmlData';
import { Icon } from "@iconify/react";
import { getTimeago } from '@/services/utils/util';

type ProposalCardProps = {
    data: any;
    isDark?: boolean;
    btn: string;
    isDashboard?: boolean;
}

const ProposalCard:FC<ProposalCardProps> = ({ data, isDark, btn, isDashboard = false }) => {
    const { navigate } = useNavigation();

    const [profileImageBlurDataURL, setProfileImageBlurDataURL] = useState("");
    
    useEffect(() => {
        if (data?.expertProfile?.user?.profilePicture?.fileUrl) {
            fetchBlurDataURL();
        }
    }, [data?.expertProfile?.user?.profilePicture?.fileUrl]);
      
    const fetchBlurDataURL = useCallback(async () => {
        if (data?.expertProfile?.user?.profilePicture?.fileUrl) {
            const blurUrl = await dynamicBlurDataUrl(data?.expertProfile?.user?.profilePicture?.fileUrl);
            setProfileImageBlurDataURL(blurUrl);
        }
    }, [data?.expertProfile?.user?.profilePicture?.fileUrl]);

    return (
        <div className={`promoted_task new-card mb-2 d-flex flex-column h-100 ${isDashboard ? `bg-dashbord-card p-4 relative ${data?.expertProfile?.user?.disability ? 'border-gradient3' : ''}` : 'p-4'}`}
            style={isDashboard ? { border: '1px solid  #555'} : {}}
        >
            {data?.expertProfile?.user?.disability && 
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
                                src={data?.expertProfile?.user?.profilePicture?.fileUrl}
                                alt="userimg"
                                width={72}
                                height={72}
                                style={{ objectFit: 'cover', fontSize: "34px", }}
                                blurDataURL={profileImageBlurDataURL}
                                loading="lazy"
                                userName={`${data?.expertProfile?.user?.firstName} ${data?.expertProfile?.user?.lastName}` || null}
                            />
                        </div>
                         <Link
                            className="mb-0 text-white d-block"
                            style={{ minWidth: 0 }}
                            href={`${isDashboard ? '/dashboard' : ''}/talented-xperts/${data?.expertProfile?.id}`}
                            onClick={() => navigate(`${isDashboard ? '/dashboard' : ''}/talented-xperts/${data?.expertProfile?.id}`)}
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
                                {data?.expertProfile?.user?.firstName} {data?.expertProfile?.user?.lastName}
                            </h4>
                            <p className="fw-normal mb-1">{data?.expertProfile?.user?.title}</p>
                        </Link>
                    </div>
                    <span
                        className={`badge text-end mt-5 
                            ${
                            data?.status === "HIRED"
                               ? "text-bg-success"
                               : data?.status === "SHORTLISTED"
                               ? "text-bg-primary"
                               : data?.status === "REJECTED"
                               ? "text-bg-danger"
                               : ""
                            }`
                        }
                    >
                        {data?.status}
                    </span>
                    {data?.expertProfile?.promoted &&
                        <span className={`ribbin ${isDark ? "text-dark" : ''}`}>Promoted</span>
                    }
                </div>
            </div>
            <HtmlData
                data={data?.details || ''}
                className="text-white line-clamp-3 fw-normal ff-figtree mt-3"
            />
            <div className="d-flex justify-content-between align-items-center flex-wrap ">
                {/* Posted */}
                <div className="d-flex justify-content-between align-items-center mb-md-1">
                    <span
                        className="d-inline-flex align-items-center fs-12"
                        style={{ gap: 5 }}
                    >
                        <HugeiconsIcon
                            icon={Calendar04Icon}
                            width={17}
                            height={17}
                        />
                        Submitted{" "}
                    </span>
                    <p className="m-0 ms-1 fs-12">{getTimeago(data?.createdAt)}</p>
                </div>
                {/* Budget */}
                <div className="d-flex justify-content-between align-items-center mb-md-1">
                    <span
                        className="d-inline-flex align-items-center fs-12"
                        style={{ gap: 5 }}
                    >
                        <HugeiconsIcon
                            icon={DollarCircleIcon}
                            size={17}
                            strokeWidth={1.5}
                        />{" "}
                        Budget{" "}
                    </span>
                    <p className="m-0 ms-1 fs-12">
                        ${data?.amount}
                    </p>
                </div>
            </div>
            <div className="divider"></div>
            {/* Expert Information */}
            <div className="requester-info">
                <div className="requester-left">
                    {/* Rating */}
                    <div className="rating-text">
                        {data?.expertProfile?.averageRating || 0}/5 Expert Rating
                    </div>
                    {/* Star Rating */}
                    <div className="star-rating">
                        {[
                            ...Array(Math.floor(data?.expertProfile?.averageRating || 0)),
                        ].map((_, i) => (
                            <Icon key={i} icon="solar:star-bold" className="star-filled" />
                        ))}
                        {[
                            ...Array(
                                5 - Math.floor(data?.expertProfile?.averageRating || 0)
                            ),
                        ].map((_, i) => (
                            <Icon
                                key={i}
                                icon="solar:star-outline"
                                className="star-outline"
                            />
                        ))}
                    </div>
                </div>
            
                {/* Right Side Stats */}
                <div className="requester-stats">
                    {btn ? (
                        <Link
                            className="btn btn-outline-light rounded-pill btn-sm w-auto mt-1 ff-figtree fw-normal"
                            style={{ textAlign: "center" }}
                            href={`${isDashboard ? '/dashboard' : ''}/tasks/${data?.task?.id}/proposals/${data?.id}`}
                            onClick={() => navigate(`${isDashboard ? '/dashboard' : ''}/tasks/${data?.task?.id}/proposals/${data?.id}`)}
                        >
                            <small>{btn}</small>{" "}
                            <Icon icon="line-md:arrow-right" className="ms-1 ff-figtree" />
                        </Link>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default ProposalCard