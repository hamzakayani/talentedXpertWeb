"use client";
import {
  loadStripe,
  Stripe,
  StripeElementsOptionsClientSecret,
  StripeElementsOptionsMode,
} from "@stripe/stripe-js";
import React, { FC, useEffect, useRef, useState } from "react";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store/Store";
import { useRouter } from "next/navigation";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import { Elements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe(
  `${process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY}`
);

const PromoteStripeModal: FC<any> = ({ isOpen, closeFn, data }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const closeRef = useRef(null);

  const [stripe, setStripe] = useState<Stripe | null>(null);

  const [clientSecret, setClientSecret] = useState("");
  const [paymentIntendId, setPaymentIntendId] = useState("");

  const user = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  const router = useRouter();

  useEffect(() => {
    const resolveStripePromise = async () => {
      const stripeInstance = await stripePromise;
      setStripe(stripeInstance);
      fetchClientSecret();
    };

    resolveStripePromise();
  }, []);

  const fetchClientSecret = () => {
    fetch('/create-checkout-session', { method: 'POST' })
      .then((response) => response.json())
      .then((json) => {
        console.log(json.checkoutSessionClientSecret)
        setClientSecret(json.checkoutSessionClientSecret)
      })
  };

  useEffect(() => {
    setOpenModal(true);
  }, [isOpen]);

  useEffect(() => { }, [data]);

  const handleClose = () => {
    setOpenModal(false);
    closeFn(true);
  };

  const onClose = () => {
    setOpenModal(false);
    closeFn(false);
  };

  return (
    <>
      {openModal && (
        <ModalWrapper
          modalId={"PaymentModal"}
          title={"Accept"}
          closeRef={closeRef}
          handleClose={onClose}
        >
          <div className="row px-4">
            <div className="">
              {stripe && (!clientSecret) && <SkeletonLoader count={5} />}
              {stripe && clientSecret && (
                <Elements
                  stripe={stripePromise}
                  options={
                    {
                      clientSecret,
                      paymentMethodCreation: "manual", // paymentMethodCreation can be omitted if you are not using it
                      loader: "always", // `loader` should be a string literal if it expects specific values
                    } as
                    | StripeElementsOptionsClientSecret
                    | StripeElementsOptionsMode
                  }
                >
                  <CheckoutForm data={data} handleClose={handleClose} />
                </Elements>
              )}
            </div>
          </div>
        </ModalWrapper>
      )}
    </>
  );
};

export default PromoteStripeModal;
