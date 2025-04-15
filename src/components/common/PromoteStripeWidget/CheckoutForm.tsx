// import React, { FC, useState } from "react";
// import {
//   PaymentElement,
//   useElements,
//   useStripe,
// } from "@stripe/react-stripe-js";
// import { toast } from "react-toastify";
// import SkeletonLoader from "../SkeletonLoader/SkeletonLoader";
// import apiCall from "@/services/apiCall/apiCall";
// import { requests } from "@/services/requests/requests";
// import { RootState, useAppDispatch } from "@/store/Store";
// import { useSelector } from "react-redux";
// import { useRouter } from "next/navigation";

// const CheckoutForm: FC<any> = ({ data, handleClose }) => {
//   const stripe = useStripe();
//   const elements = useElements();

//   const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
//   const [isShow, setIsShow] = useState<boolean>(true);

//   const dispatch = useAppDispatch();
//   const user = useSelector((state: RootState) => state.user);
//   const router = useRouter();

//   const handleSubmit = async (event: any) => {
//     event.preventDefault();
//     setIsFormSubmitted(true);

//     if (!stripe || !elements) {
//       setIsFormSubmitted(false);
//       return;
//     }

//     if (stripe && elements) {
//       await elements.submit();

//       const { error, paymentMethod } = await stripe.createPaymentMethod({
//         elements,
//       });

//       if (error) {
//         if (
//           error?.type === "card_error" ||
//           error?.type === "validation_error"
//         ) {
//         } else {
//           toast.error("An unexpected error occured. Please try again later");
//         }
//         setIsFormSubmitted(false);
//       } else {
//       }
//     }
//   };

//   return (
//     <form className="text-start mt-30 pb-30" onSubmit={handleSubmit}>
//       {(!stripe || !elements) && <SkeletonLoader count={2} />}
//       {stripe && elements && (
//         <>
//           {
//             <div className="text-warning fs-12">
//               Platform service fee: $ {(data?.amount * 5) / 100}{" "}
//             </div>
//           }
//           <PaymentElement
//             id="payment"
//             className="mb-3"
//             onReady={() => setIsShow(false)}
//           />
//           <div className="form-group">
//             <button
//               disabled={isFormSubmitted || !stripe || !elements || isShow}
//               className="btn btn-primary text-white mb-3 w-100"
//               type="submit"
//               name="del"
//             >
//               {!stripe && !elements ? "Loading..." : "Submit"}
//             </button>
//           </div>
//         </>
//       )}
//     </form>
//   );
// };

// export default CheckoutForm;

import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FC } from 'react';

const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY}`); // Your publishable key

const CheckoutForm: FC<any> = ({ data, handleClose }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (stripe && elements) {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        return;
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: 'John Doe',
        },
      });

      if (error) {
        console.error(error);
      } else {
        console.log('PaymentMethod ID:', paymentMethod.id);
      }

    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <CardElement />
        <button type="submit" disabled={!stripe}>
          Pay
        </button>
    </form>
  );
}

export default CheckoutForm;
