"use client";
import React from "react";
import PromotedTasks from "./PromotedTasks";
import PromotedTalentExperts from "./PromotedTalentExperts";
import Categories from "./Categories";
import MainDescription from "./MainDescription";
import TalentedXpertWork from "./TalentedXpertWork";
import BecomeXpert from "./BecomeXpert";
import ClientTestimonial from "./ClientTestimonial";
import TalentedRequestorWork from "./TalentedRequestorWork";
import WhyBusiness from "./WhyBusiness";

const Home = () => {
  return (
    <main className="main px-4">
      <MainDescription />
      <Categories />
      <TalentedXpertWork />
      <WhyBusiness />
      {/* <PromotedTalentExperts />
      <TalentedRequestorWork /> */}
      <PromotedTasks />
      <ClientTestimonial />
      {/* <BecomeXpert /> */}
    </main>
  );
};

export default Home;
