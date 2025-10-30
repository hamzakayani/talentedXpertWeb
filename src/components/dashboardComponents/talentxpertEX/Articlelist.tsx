"use client";
import React from "react";
import { Icon } from "@iconify/react";
import ListCards from "../Articles/ListCards";
import Link from "next/link";
import { useNavigation } from "@/hooks/useNavigation";

export const Articlelist = () => {
  const { navigate } = useNavigation();

  return (
    <section className="addtask">
      <div
        className="card rounded-4"
        style={{ background: "#1b1b1b", border: "1px solid rgb(51, 51, 51)" }}
      >
        <div className="card-header pt-3 text-light d-flex flex-wrap align-items-center justify-content-between border-0">
          <h6 className="mb-0 me-5">My Articles</h6>

          <Link
            href="/dashboard/articles/add"
            onClick={() => navigate("/dashboard/articles/add")}
            className="btn rounded-pill d-inline-flex align-items-center gap-2 py-2 px-3 shadow-sm border-0"
            style={{
              background: "linear-gradient(135deg, #D7E2FF 0%, #AFEEFF 100%)",
              color: "#333",
            }}
          >
            <Icon icon="line-md:plus" width={18} height={18} />
            Add New Article
          </Link>
        </div>
        <div className="card-body">
          <ListCards type={"big"} />
        </div>
      </div>
    </section>
  );
};
