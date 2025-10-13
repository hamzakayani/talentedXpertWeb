"use client";
import React, { useEffect, useState } from "react";
import HtmlData from "../HtmlData/HtmlData";
import Link from "next/link";
import { useNavigation } from "@/hooks/useNavigation";
import ModalWrapper from "../ModalWrapper/ModalWrapper";

const ConnectNotVerified = ({ id, step, isOpen, onClose }: any) => {
  const { navigate } = useNavigation();
  const [openModal, setOpenModal] = useState<boolean>(false);

  useEffect(() => {
    setOpenModal(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpenModal(false);
    onClose && onClose(); // Call the onClose prop if provided
  };

  return (
    <>
      {openModal && (
        <div className="ad-dispute">
          <ModalWrapper
            modalId={"exampleModalToggle45"}
            title={"Payment Method Required"}
            handleClose={handleClose}
          >
            <HtmlData
              data={"Kindly connect your stripe account"}
              className="text-white fs-16 mb-4"
            />
            <div className="text-end mt-3" data-bs-dismiss="modal">
              {step && id && (
                <Link
                  className="btn rounded-pill btn-outline-primary bg-gradient1 text-white mx-1 my-1"
                  href={`/dashboard/tasks/${id}/add-proposal`}
                  onClick={() => navigate(`/dashboard/tasks/${id}/add-proposal`)}
                >
                  Skip for Now
                </Link>
              )}
              <Link
                className="btn bg-gradient1 text-white mx-1 my-1 border-0"
                href={"/dashboard/payments/information"}
                onClick={() => navigate("/dashboard/payments/information")}
              >
                Ok
              </Link>
            </div>
          </ModalWrapper>
        </div>
      )}
    </>
  );
};

export default ConnectNotVerified;
