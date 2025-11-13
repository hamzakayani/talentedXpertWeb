import React, { useEffect, useState } from "react";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import PromoteStripeModal from "../common/PromoteStripeWidget/PromoteStripeModal";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFetchPromotion } from "@/hooks/promotion/usePromotion";

const PromotedModal = ({
  show,
  handleClose,
  handleResponse,
  title,
  children,
  dispatch,
  router,
  isPromote
}: any) => {
  // const [showPayment, setShowPayment] = useState(false);
  const [showPayment, setShowPayment] = useState(!isPromote);
  const [days, setDays] = useState(1); // Default to 1 day
  const [amount, setAmount] = useState(1); // $1 per day default
  const [loading, setLoading] = useState(false);
  const [wallet, setWallet] = useState<any>({});
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "creditCard" | null>(null);

  const user = useSelector((state: any) => state.user);

  // fetch current promotion details for user profile
  const promotionData = useFetchPromotion({
    params: { profileId: user?.profile?.[0]?.id, promotionType: 'PROFILE' },
    enabled: show // only fetch when modal is shown
  });

  const handleDaysChange = (e: any) => {
    const selectedDays = parseInt(e.target.value);
    console.log(selectedDays)
    setDays(selectedDays);
    setAmount(selectedDays);
  };

  useEffect(() => {
    if (promotionData?.data !== undefined && promotionData && promotionData?.data?.data?.status !== 'EXPIRED') {
      // If there's an active promotion, you might want to adjust the UI or state accordingly
      console.log("Active promotion details:", promotionData, promotionData?.data, promotionData?.data?.data);
      const startDate = new Date(promotionData?.data?.data?.startDate);
      const endDate = new Date(promotionData?.data?.data?.endDate);
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)); // Convert time difference to days
      console.log(diffDays)
      setDays(diffDays);
    }
  }, [promotionData?.data]);

  useEffect(() => {
    // Only show promotion options for users with "TX" role
    // if (user?.role !== 'TX') {
    //   toast.error("You do not have permission to promote this profile.");
    //   handleClose();
    // }
    getWallet();
  }, []);

  const handleYesClick = () => {
    setShowPayment(true);
  };

  const handleNoClick = () => {
    handleClose();
  };

  const handleSubmitPayment = async () => {
    if (amount > wallet?.availableBalance) {
      toast.error("Your wallet dosent have enough balance ");
      return;
    }
    try {
      const response = await apiCall(
        requests.promotion,
        { days, amount, type: "PROFILE" },
        "post",
        true,
        dispatch,
        user,
        router
      );
      if (!response?.data?.success) {
        console.error("Payment error:", response.error);
      } else {
        toast.success(response?.data?.data?.message);
        // promotionData?.ref
        handleClose();
        handleResponse(true);
      }
    } catch (error) {
      console.error("Payment submission error:", error);
    } finally {
      setLoading(false);
    }
  };
  const getWallet = async () => {
    await apiCall(
      `${requests.wallet}`,
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        if (res?.error) {
          return;
        } else {
          setWallet(res?.data?.data);
        }
      })
      .catch((err) => console.warn(err));
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark">
          <div className="modal-header border-bottom border-secondary">
            <h5 className="modal-title text-light">{title}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body text-light">
            {promotionData?.data !== undefined && promotionData?.data?.data?.status !== 'EXPIRED' ? (
              <>
                <div className="modal-title text-light mb-2">
                  Your profile is promoted for {days} {days > 1 ? "days" : "day"}
                </div>
              </>
            ) : promotionData?.isLoading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="payment-section">
                <h6 className="mb-3 text-light">
                  There will be an initial charge of $1 per day to promote the
                  profile.
                </h6>
                <h6 className="mb-3 text-light">Select Promotion Duration</h6>
                <div className="form-group mb-3">
                  <label htmlFor="days" className="form-label text-light">
                    Number of Days:
                  </label>
                  <select
                    id="days"
                    className="form-control bg-light text-dark"
                    value={days}
                    onChange={handleDaysChange}
                  >
                    {Array.from({ length: 30 }, (_, index) => index + 1).map(
                      (day) => (
                        <option key={day} value={day}>
                          {day} day{day > 1 ? "s" : ""}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="amount-display p-3 bg-secondary rounded mb-4 text-light">
                  <div className="d-flex justify-content-between">
                    <span>Daily Rate:</span>
                    <span>$1.00</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>Number of Days:</span>
                    <span>{days}</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold mt-2">
                    <span>Total Amount:</span>
                    <span>${amount.toFixed(2)}</span>
                  </div>
                </div>
                <h6 className="mb-3 text-light">Select Payment Method</h6>
                <div className="form-group mb-3">
                  <button
                    className="btn btn-success me-2"
                    onClick={() => setPaymentMethod("wallet")}
                    disabled={amount > wallet?.availableBalance}
                  >
                    Pay from Wallet
                  </button>
                  <button
                    className="btn btn-info"
                    onClick={() => setPaymentMethod("creditCard")}
                  >
                    Pay via Credit Card
                  </button>
                </div>
                {paymentMethod && (
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn btn-secondary me-2"
                      onClick={() => setShowPayment(false)}
                    >
                      Back
                    </button>
                    <button
                      className="btn btn-info"
                      type="button"
                      onClick={handleSubmitPayment}
                      disabled={loading}
                    >
                      {loading ? (
                        <span>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Processing...
                        </span>
                      ) : (
                        "Promote Profile"
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* {paymentMethod === "creditCard" && <PromoteStripeModal amount={amount} />} */}
      {paymentMethod === "creditCard" && <PromoteStripeModal isOpen={paymentMethod === "creditCard"} closeFn={() => {
        setPaymentMethod(null)
      }} data={{ days, amount, type: 'PROFILE' }} />}

    </div>
  );
};

export default PromotedModal;
