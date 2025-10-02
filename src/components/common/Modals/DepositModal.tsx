import React, { useState } from "react";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import PromoteStripeModal from "../../common/PromoteStripeWidget/PromoteStripeModal";
import { useSelector } from "react-redux";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

const DepositModal = ({
  show,
  handleClose,
  handleResponse,
  title,
  children,
  dispatch,
  router,
}: any) => {
  const [showPayment, setShowPayment] = useState(false);
  const [days, setDays] = useState(1); // Default to 1 day
  const [amount, setAmount] = useState(1); // $1 per day default
  const [loading, setLoading] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const [stripemodalopen, setstripemodalopen] = useState<boolean>(false);
  const user = useSelector((state: any) => state.user);
  const closeFn = () => {
    // isClose ? await getMilestones(payData?.contractId) : ''
    setstripemodalopen(false);
    // setError('')
    // setPayData({})
  };

  const handleSubmitPayment = async () => {
    // setLoading(true);
    setstripemodalopen(true);
    // try {
    //     const response = await apiCall(
    //       requests.createDeposit,
    //       {'amount': Number(depositAmount) },
    //       "post",
    //       true,
    //       dispatch,
    //       user,
    //       router
    //     );
    //     if (response?.error) {
    //       console.error("Payment error:", response.error);
    //     } else {
    //       console.log('res', response)
    //     }
    // } catch (error) {
    //     console.error("Payment submission error:", error);
    // } finally {
    //     setLoading(false);
    // }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content b1-bg">
          <div className="modal-header border-0">
            <h6 className="modal-title text-light">{title}</h6>
            <button
              type="button"
              className="btn-close btn-gradient-close d-flex justify-content-center align-items-center me-0 ms-auto"
              onClick={handleClose}
              aria-label="Close"
            >
              <HugeiconsIcon
                icon={Cancel01Icon}
                style={{ color: "black" }}
                size={16}
              />
            </button>
          </div>
          <div className="modal-body text-light">
            {
              <div className="payment-section">
                {/* <div className="form-floating">
                  <label htmlFor="depositAmount" className="form-label">
                    Amount to Deposit ($)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="depositAmount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                    min="1"
                  />
                </div> */}
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control text-white-50 bg-transparent border borderlightgray"
                    id="depositAmount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    required
                    min="1"
                  />
                  <label htmlFor="depositAmount" className="">
                    Amount to Deposit ($)<span style={{ color: "red" }}>*</span>
                  </label>
                </div>

                <div className="d-flex justify-content-end mt-3">
                  <button
                    className="btn btn-dark rounded-lg minw_104 me-2"
                    onClick={() => handleClose()}
                  >
                    Cancle
                  </button>
                  <button
                    className="btn rounded-lg bg_gradient minw_104"
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
                      "Next"
                    )}
                  </button>
                </div>
                {stripemodalopen && (
                  <PromoteStripeModal
                    isOpen={stripemodalopen}
                    closeFn={closeFn}
                    saveapicall={handleResponse}
                    data={{
                      amount: Number(depositAmount),
                    }}
                    type="wallet"
                  />
                )}
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};
export default DepositModal;
