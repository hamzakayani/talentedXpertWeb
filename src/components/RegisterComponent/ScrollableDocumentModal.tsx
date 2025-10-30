import React, { FC, useState } from 'react'
import ModalWrapper from '../common/ModalWrapper/ModalWrapper';
import GradientButton from '../common/GradientButton/GradientButton';

interface ScrollableDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string | React.ReactNode;
  onReadComplete: () => void; // callback when fully scrolled
}

const ScrollableDocumentModal:FC<ScrollableDocumentModalProps> = ({ isOpen, onClose, title, content, onReadComplete })  =>{
    const [canCheck, setCanCheck] = useState(false); // user scrolled fully
    const [isChecked, setIsChecked] = useState(false);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollTop + clientHeight >= scrollHeight - 5 && !canCheck) {
            setCanCheck(true);
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsChecked(checked);
        if (checked) {
            onReadComplete();
        }
    };

    return (
        <>
            {isOpen && (
                <ModalWrapper modalId="documentModal" title={title} handleClose={onClose}>
                    <div className="p-2">
                        <div
                            className="border rounded p-3"
                            style={{ maxHeight: "400px", overflowY: "auto" }}
                            onScroll={handleScroll}
                        >
                            {typeof content === "string" ? (
                                <p className="text-white" style={{ fontSize: "14px" }}>
                                    {content}
                                </p>
                            ) : (
                                content
                            )}
                        </div>
                        <div className="d-flex align-items-center mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input me-2"
                                id={`${title}-read`}
                                disabled={!canCheck}
                                checked={isChecked}
                                onChange={handleCheckboxChange}
                            />
                            <label
                                htmlFor={`${title}-read`}
                                className="form-check-label text-white"
                                style={{ fontSize: "14px" }}
                            >
                                I have read and understood this document.
                            </label>
                        </div>
                        {!canCheck && (
                            <p className="text-muted small mt-2">
                                Scroll to the bottom to enable the checkbox.
                            </p>
                        )}
                        <div className="d-flex justify-content-end mt-3">
                            <GradientButton onClick={onClose} className="w-auto">
                                Close
                            </GradientButton>
                        </div>
                    </div>
                </ModalWrapper>
            )}
        </>
    );
}

export default ScrollableDocumentModal