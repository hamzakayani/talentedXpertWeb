import React, { FC, useState } from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';

const CheckoutForm: FC<any> = ({ data, paymentIntentId, handleClose }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false)
    const [isShow, setIsShow] = useState<boolean>(true)

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        setIsFormSubmitted(true)

        if (!stripe || !elements) {
            setIsFormSubmitted(false)
            return;
        }

        if (stripe && elements) {

            await elements.submit();

            const { error, paymentMethod } = await stripe.createPaymentMethod({
                elements,
            });

            if (error) {
                if (error?.type === "card_error" || error?.type === "validation_error") {
                } else {
                    toast.error("An unexpected error occured. Please try again later")
                }
                setIsFormSubmitted(false)
            } else {
                // confirmPayment(paymentMethod)
            }
        }
    };

    return (
        <form className="text-start mt-30 pb-30" onSubmit={handleSubmit}>
            {(!stripe || !elements) && <SkeletonLoader count={2} />}
            {stripe && elements && (
                <>                
                    <PaymentElement id="payment" className='mb-3' onReady={() => setIsShow(false)} />
                    <div className="form-group">
                        <button disabled={isFormSubmitted || !stripe || !elements || isShow} className="btn btn-gradient-info text-white mb-3 w-100" type='submit' name="del">{(!stripe && !elements) ? "Loading..." : "Submit"}</button>
                    </div>
                </>
            )}
        </form>
    )
}

export default CheckoutForm