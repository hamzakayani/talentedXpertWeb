"use client";
import { dataForServer } from "@/models/taskModel/taskModel";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { RootState, useAppDispatch } from "@/store/Store";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import PromoteStripeModal from "../PromoteStripeWidget/PromoteStripeModal";
import ModalWrapper from "../ModalWrapper/ModalWrapper";
import GradientButton from "../GradientButton/GradientButton";
import InputField from "../InputField/InputField";
const Promotion = ({
  isOpen,
  onClose,
  register,
  watch,
  setValue,
  activeStep,
  setActiveStep,
  data,
  reset,
  setIsFormSubmitted,
  type,
  id,
}: any) => {
  const user = useSelector((state: RootState) => state.user);
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [stripemodalopen, setstripemodalopen] = useState<boolean>(false);
  const [addtaskid, setaddtaskid] = useState(null);
  const [wallet, setWallet] = useState<any>({});

  const [disableBtn, setDisableBtn] = useState<boolean>(false);

  const [promotionDays, setPromotionDays] = useState<number | "">("");
  const promotionRate = 1; // $1 per day
  const totalAmount = promotionDays ? promotionDays * promotionRate : 0;

  const closeRef = useRef<any>(null);

  const isPromoted = watch("promoted");

  const closeFn = () => {
    // isClose ? await getMilestones(payData?.contractId) : ''
    setstripemodalopen(false);
    // setError('')
    // setPayData({})
  };
  const [dayOptions, setDayOptions] = useState<any[]>([]);

  useEffect(() => {
    if (data?.startDate && data?.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);

      if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
        const timeDiff = end.getTime() - start.getTime();
        const totalDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) + 1;

        const options = Array.from({ length: totalDays }, (_, i) => i + 1);
        setDayOptions(options);
      }
    }
  }, [data?.startDate, data?.endDate]);
  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  // Reset promotionDays when promotion is not selected
  useEffect(() => {
    if (isPromoted === "false") {
      setPromotionDays("");
    }
  }, [isPromoted]);

  const handleClose = () => {
    setIsFormSubmitted(false);
    setPromotionDays("");
    setDisableBtn(false)
    onClose();
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
  useEffect(() => {
    getWallet();
  }, []);

  const promotionFunction = async (Id: any) => {
    if (totalAmount > wallet?.availableBalance) {
      toast.error("Your wallet dosent have enough balance ");
      return;
    }
    try {
      setDisableBtn(true)
      const response = await apiCall(
        requests.promotion,
        {
          days: promotionDays,
          amount: totalAmount,
          taskId: id || Id,
          type: "TASK",
        },
        "post",
        true,
        dispatch,
        user,
        router
      );
      if (!response?.data?.success) {
        console.error("Payment error:", response.error);
        setDisableBtn(false)
      } else {
        toast.success(response?.data?.data?.message);
        setDisableBtn(false)
        handleClose();
        // handleResponse();
      }
    } catch (error) {
      console.error("Payment submission error:", error);
      setDisableBtn(false)
    } finally {
      setDisableBtn(false)
      // setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Include promotionDays and totalAmount in formData if promoted
    // const formData = dataForServer({
    //   ...data,
    //   promoted: watch('promoted'),
    //   ...(watch('promoted') === 'true' && {
    //     promotionDays: Number(promotionDays),
    //     promotionTotal: totalAmount,
    //   }),
    // })
    if ((isPromoted === "true" && type && promotionDays !== "") || 0) {
      promotionFunction(id);
      return;
    }
    if ((promotionDays === "" || 0) && isPromoted === "true") {
      toast.error("Select no of days for which you want to promote the task");
      return;
    }
    const formData = dataForServer({
      ...data,
      promoted: false,
    });

    setDisableBtn(true)
    await apiCall(
      `${type ? requests.editTask + id : requests.addtask}`,
      formData,
      `${type ? "put" : "post"}`,
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
              toast.error(msg ? msg : "Something went wrong, please try again")
            );
          } else {
            toast.error(
              message ? message : "Something went wrong, please try again"
            );
          }
          setIsFormSubmitted(false);
          setDisableBtn(false)
        } else {
          if (isPromoted === "true") {
            setaddtaskid(res?.data?.task.id);
            promotionFunction(res?.data?.task.id);
            handleClose();
          }
          toast.success(res?.data?.message);
          setIsFormSubmitted(false);
          setDisableBtn(false)
          reset({});
          
          // Invalidate and refetch tasks queries
          queryClient.invalidateQueries({ queryKey: ["tasks"] });
          queryClient.invalidateQueries({ queryKey: ["statusTasks"] });
          queryClient.invalidateQueries({ queryKey: ["taskCount"] });
          queryClient.invalidateQueries({ queryKey: ["multipleTaskCount"] });
          
          handleClose();
          router.push("/dashboard/tasks");
        }
      })
      .catch((err) => {
        setIsFormSubmitted(false);
        console.warn(err);
      });
  };
  const afterpaymentapicall = () => {
    const formData = dataForServer({
      ...data,
      promoted: watch("promoted"),
    });

    toast.success("Task created successfully");
    setIsFormSubmitted(false);
    reset({});
    handleClose();
    router.push("/dashboard/tasks");
    // apiCall(
    //   requests.editTask + (addtaskid ? addtaskid : id),
    //   formData,
    //   "put",
    //   true,
    //   dispatch,
    //   user,
    //   router
    // )
    //   .then((res: any) => {
    //     let message: any;
    //     if (res?.error) {
    //       message = res?.error?.message;
    //       if (Array.isArray(message)) {
    //         message?.map((msg: string) =>
    //           toast.error(msg ? msg : "Something went wrong, please try again")
    //         );
    //       } else {
    //         toast.error(
    //           message ? message : "Something went wrong, please try again"
    //         );
    //       }
    //       setIsFormSubmitted(false);
    //     } else {
    //       toast.success(res?.data?.message);
    //       setIsFormSubmitted(false);
    //       reset({});
    //       handleClose();
    //       router.push("/dashboard/tasks");
    //     }
    //   })
    //   .catch((err) => {
    //     setIsFormSubmitted(false);
    //     console.warn(err);
    //   });
  };
  return (
    <>
      {open && (
        <ModalWrapper
          modalId={"exampleModalToggle2"}
          title={"Would you like to promote your task?"}
          handleClose={handleClose}
          closeRef={closeRef}
        >
          <div className="mb-3 mt-0">
            <div className="form-check-inline radio me-4">
              <label className="form-check-label" htmlFor="promoteYes">
                <input
                  {...register("promoted")}
                  value="true"
                  className="form-check-input me-2"
                  type="radio"
                  name="promoted"
                  id="promoteYes"
                />
                Yes
              </label>
            </div>
            <div className="form-check-inline radio me-3">
              <label className="form-check-label" htmlFor="promoteNo">
                <input
                  {...register("promoted")}
                  value="false"
                  className="form-check-input me-2"
                  type="radio"
                  name="promoted"
                  id="promoteNo"
                />
                No
              </label>
            </div>
          </div>
          {isPromoted === "true" && (
            <div className="mb-3">
              <InputField
                label="How many days would you like to promote the task?"
                name="promotionDays"
                className="text-dark"
                value={promotionDays}
                control={undefined}
                select
                required
                options={[
                  { id: "Select number of days", name: "" },
                  ...dayOptions.map((day) => ({
                    id: `${day}`,
                    name: `${day} ${day === 1 ? "day" : "days"}`,
                  })),
                ]}
                onChange={(e: any) =>
                  setPromotionDays(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
              />
              {wallet.availableBalance < totalAmount && isPromoted && (
                <p className="text-danger">Insufficient balance in wallet</p>
              )}
              <div className="mt-2">
                <p>Rate: $1 per day</p>
                {promotionDays && <p>Total Amount: ${totalAmount}</p>}
              </div>
            </div>
          )}
          <div className="d-flex justify-content-end">
            <GradientButton disabled={wallet?.availableBalance < totalAmount && isPromoted === "true" || disableBtn} className="w-auto" onClick={handleSubmit}>Submit</GradientButton>
          </div>
          {/* {stripemodalopen && (
            <PromoteStripeModal
              isOpen={stripemodalopen}
              closeFn={closeFn}
              saveapicall={afterpaymentapicall}
              data={{
                days: promotionDays,
                amount: totalAmount,
                taskId: id || addtaskid,
                type: "TASK",
              }}
            />
          )} */}
        </ModalWrapper>
      )}
    </>
  );
};

export default Promotion;
