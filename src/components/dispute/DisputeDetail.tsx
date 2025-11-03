"use client";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { RootState, useAppDispatch } from "@/store/Store";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import HtmlData from "../common/HtmlData/HtmlData";
import Link from "next/link";

const DisputeDetail = () => {
  const { disputeId } = useParams();
  const user = useSelector((state: RootState) => state.user);
  const [dispute, setDispute] = useState<any>([{}]);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const getdisputes = async (Id: number) => {
    try {
      const response = await apiCall(
        requests?.dispute,
        { id: Number(Id) },
        "get",
        false,
        dispatch,
        user,
        router
      );
      setDispute(response?.data?.data?.disputes[0] || {});
    } catch (error) {
      console.warn("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    if (disputeId) {
      getdisputes(Number(disputeId));
    }
  }, [disputeId]);

  return (
    <div>
      <div
        className="card rounded-4"
        style={{ background: "#1b1b1b", border: "1px solid rgb(51, 51, 51)" }}
      >
        <div className="viewtask-card card-header px-4">
          <div className="card-left-heading d-flex align-items-center">
            <button
              className="btn btn-link text-light rounded-pill me-1"
              onClick={() => router.back()}
            >
              <Icon icon="mdi:arrow-left" className="m" />
            </button>
            <h5 className="text-light m-0">View Dispute Details</h5>
          </div>
          <div className="box m-2 bg-black keyfun p-3">
            <h4 className="text-white">{dispute?.task?.name}</h4>
            <HtmlData data={dispute?.description} className="text-white" />
            {dispute?.documents?.map((doc: any) => (
              // onClick={() => getPrivateFile(doc)}
              <div key={doc.fileUrl}>
                <Link
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.key}
                </Link>
              </div>
            ))}
            <div className="btn-border mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeDetail;
