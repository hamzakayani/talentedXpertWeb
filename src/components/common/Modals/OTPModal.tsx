import { useState } from "react";

interface OTPModalProps {
    email: string;
    onSubmit: (otp: string) => void;
    onClose: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({ email, onSubmit, onClose }) => {
    const [otp, setOtp] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (otp.trim() === "") {
            setError("OTP cannot be empty."); // Show error if OTP is empty
            return;
        }

        setError(null); // Reset error if OTP is valid
        onSubmit(otp); // Pass OTP to the parent component
    };

    return (
        <div className="modal show" style={{ display: "block" }} aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Enter OTP</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <p>We’ve sent an OTP to {email}. Please enter the code below.</p>
                        <form>
                            <div className="form-floating">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="otp"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    placeholder="Enter OTP"
                                    maxLength={6}
                                />
                                <label htmlFor="otp">OTP</label>
                            </div>
                            {error && (
                                <div className="text-danger mt-2" style={{ fontSize: "12px" }}>
                                    {error}
                                </div>
                            )}

                            <button type="button" className="btn btn-black w-100 mt-3" disabled={otp.trim() === ""} onClick={handleSubmit}>
                                Verify OTP
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OTPModal;
