import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { useAppDispatch } from "@/store/Store";
import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
interface MyModalProps {
  show: boolean;
  setShowModal: any;
  handleClose: () => void;
  handleSwitch: any;
  title?: string;
  user?: any;
  children?: React.ReactNode;
}

const MyModal: React.FC<MyModalProps> = ({
  show,
  setShowModal,
  handleClose,
  handleSwitch,
  title,
  user,
  children,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
  };

  const handleSubmit = async () => {
    if (selectedOption) {
      await apiCall(
        requests.editUser + user?.id,
        { profileType: "BOTH", promoted: true },
        "put",
        true,
        dispatch,
        user,
        router
      )
        .then((res: any) => {
          let message: any;
          if (res?.error) {
            message = res?.error?.message;

            if (Array.isArray(message)) {
              message?.map((msg: string) =>
                toast.error(
                  msg ? msg : "Something went wrong, please try again"
                )
              );
            } else {
              toast.error(
                message ? message : "Something went wrong, please try again"
              );
            }
          } else {
            setShowModal(false);
            handleSwitch();
          }
        })
        .catch((err) => {
          console.warn(err);
        });
    } else {
      setShowModal(false);
      handleSwitch();
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title ?? "Modal Title"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children ?? "Modal body content goes here."}

        {/* Radio Buttons */}
        <div className="mt-3">
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="selection"
              id="yesOption"
              value="Yes"
              checked={selectedOption === "Yes"}
              onChange={handleRadioChange}
            />
            <label className="form-check-label" htmlFor="yesOption">
              Yes
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="selection"
              id="noOption"
              value="No"
              checked={selectedOption === "No"}
              onChange={handleRadioChange}
            />
            <label className="form-check-label" htmlFor="noOption">
              No
            </label>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MyModal;
