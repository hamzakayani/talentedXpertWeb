"use client";
import React, { useEffect, useState } from "react";
import InsightCard from "./shared/insightCard";
import MyActiveTask from "./MyActiveTask";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/Store";
import { insideTECard, insideTRCard } from "@/services/helpers/dashboard";
import { Activeandarticle } from "./talentxpertEX/Activeandarticle";
import PromotedModal from "./PromotedModal";
import { Button } from "bootstrap";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { useRouter } from "next/navigation";
import { setUser } from "@/reducers/UserSlice";
const Home = () => {
  const user = useSelector((state: RootState) => state.user);
  // const dispatch = useAppDispatch();
  // const router = useRouter();
  // const [showModal, setShowModal] = useState<boolean>(false);
  // const getUserDetails = async () => {
  //   await apiCall(
  //     requests.getUserInfo,
  //     {},
  //     "get",
  //     false,
  //     dispatch,
  //     user,
  //     router
  //   )
  //     .then((res: any) => {
  //       if (res?.error) {
  //         return;
  //       } else {
  //         dispatch(setUser(res?.data));
  //       }
  //     })
  //     .catch((err) => console.warn(err));
  // };
  // useEffect(() => {
  //   if (
  //     user?.profile?.length > 0 &&
  //     user?.profile[0]?.type === "TE" &&
  //     user?.profile[0]?.promoted
  //   ) {
  //     setShowModal(true);
  //   }
  // }, [user?.profile]);
  // const cancelpromotion = async () => {
  //   try {
  //     const response = await apiCall(
  //       requests.editUser + user?.id,
  //       { promoted: false },
  //       "put",
  //       false,
  //       dispatch,
  //       user,
  //       router
  //     );
  //     if (response.data) {
  //       getUserDetails();
  //       setShowModal(false);
  //     }
  //     //   setProposal(response?.data?.data?.proposals[0] || {});
  //   } catch (error) {
  //     console.warn("Error fetching tasks:", error);
  //   }
  // };
  // console.log("user", user);
  return (
    <>
      <div className="top-card ">
        {/* <button onClick={openModal}>Open Modal</button> */}

        {/* <PromotedModal
          show={showModal}
          handleClose={cancelpromotion}
          title="Connect Account"
        >
          <p>Please connect your account for 10$ per month</p>
        </PromotedModal> */}
        <InsightCard
          insideCard={
            user?.profile?.length > 0 && user?.profile[0]?.type === "TR"
              ? insideTRCard
              : insideTECard
          }
        />
      </div>
      {user?.profile?.length > 0 && user?.profile[0]?.type === "TR" ? (
        <MyActiveTask />
      ) : (
        <Activeandarticle />
      )}
    </>
  );
};

export default Home;
