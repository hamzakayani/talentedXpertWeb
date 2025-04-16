import React, { FC, useState } from "react";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { RootState, useAppDispatch } from "@/store/Store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const CheckoutForm: FC<any> = ({ data, paymentIntentId, handleClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(true);

  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  console.log("stripe", stripe);
  console.log("elements", elements);
  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log("handle submit called");

    setIsFormSubmitted(true);

    if (!stripe || !elements) {
      console.log("stripe or elements not found");

      setIsFormSubmitted(false);
      return;
    }

    if (stripe && elements) {
      await elements.submit();

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        elements,
      });

      if (error) {
        console.log("errorrrr");

        if (
          error?.type === "card_error" ||
          error?.type === "validation_error"
        ) {
        } else {
          toast.error("An unexpected error occured. Please try again later");
        }
        setIsFormSubmitted(false);
      } else {
        confirmPayment(paymentMethod);
      }
    }
  };

  const confirmPayment = async (paymentMethod: any) => {
    console.log("confirm payment called");
    const params = {
      paymentIntentId: paymentIntentId,
      paymentMethodId: paymentMethod?.id,
    };

    await apiCall(
      `${requests.confirmpayment}`,
      params,
      "post",
      false,
      dispatch,
      user,
      router
    )
      .then((res) => {
        console.log("res for other api", res);
        if (res.data.success)
          // toast.success(res?.data?.data);
          handleClose();
      })
      .catch((err) => console.warn(err));
  };

  return (
    <form className="text-start mt-30 pb-30">
      {(!stripe || !elements) && <SkeletonLoader count={2} />}
      {stripe && elements && (
        <>
          {
            <div className="text-warning fs-12">
              Platform service fee: $ {(data?.amount * 5) / 100}{" "}
            </div>
          }
          <PaymentElement
            id="payment"
            className="mb-3"
            onReady={() => {
              console.log("PaymentElement ready");
              setIsShow(false);
            }}
          />
          <div className="form-group">
            <button
              disabled={isFormSubmitted || !stripe || !elements || isShow}
              className="btn btn-primary text-white mb-3 w-100"
              // type="submit"
              onClick={handleSubmit}
              name="del"
            >
              {!stripe && !elements ? "Loading..." : "Submit"}
            </button>
          </div>
        </>
      )}
    </form>
  );
};

export default CheckoutForm;
