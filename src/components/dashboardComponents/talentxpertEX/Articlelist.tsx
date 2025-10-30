"use client";
import React from "react";
import { Icon } from "@iconify/react";
import ListCards from "../Articles/ListCards";
import Link from "next/link";
import { useNavigation } from "@/hooks/useNavigation";

export const Articlelist = () => {
  const { navigate } = useNavigation();

  return (
    <section className="dashboard-card">
      <div className="d-flex align-items-center justify-content-between">
        <h2 className="panel-title me-5">My Articles</h2>
        <Link
          href="/dashboard/articles/add"
          onClick={() => navigate("/dashboard/articles/add")}
          className="btn rounded-pill bg-gradient4 border-0 py-2 px-3 shadow-sm d-inline-flex align-items-center gap-2"
        >
          <Icon icon="line-md:plus" width={18} height={18} />
          Add New Article
        </Link>
      </div>
      <div className="row row-gap-4 my-3">
        <ListCards type={"big"} />
      </div>
    </section>
  );
};
