"use client";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import React, { FC } from "react";

const ModalWrapper: FC<any> = ({
  modalId,
  title,
  subMsg,
  children,
  closeRef,
  handleClose,
  isLarge,
}) => {
  return (
    <>
      <div
        className={"modal show fade"}
        id={modalId}
        tabIndex={-1}
        aria-hidden="true"
        aria-labelledby="accountModalLabel"
        aria-modal="true"
        role="dialog"
        style={{
          display: "block",
          // background: "rgba(0,0,0,0.5)"
        }}
      >
        <div
          className={`modal-dialog modal-dialog-centered ${
            isLarge ? "modal-xl" : ""
          }`}
        >
          <div
            className="modal-content modal-content-center"
            style={{ backgroundColor: "#1B1B1B" }}
          >
            <div className="modal-header border-0">
              <div className="bg-card-listing mx-0">
                <h6 className="modal-title text-white">{title}</h6>
                {subMsg && <p className="text-center mt-3">{subMsg}</p>}
              </div>
              <button
                ref={closeRef}
                className="btn-close btn-gradient-close d-flex justify-content-center align-items-center m-0 ms-auto"
                type="button"
                aria-label="Close"
                data-bs-dismiss="modal"
                onClick={() => handleClose()}
              >
                <HugeiconsIcon
                  icon={Cancel01Icon}
                  style={{ color: "black" }}
                  size={16}
                />
              </button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
      <div className={"modal-backdrop show fade"} />
    </>
  );
};

export default ModalWrapper;
