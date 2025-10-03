"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  SubmitHandler,
  useForm,
  Controller,
  useFieldArray,
} from "react-hook-form";
import { addtaskSchema } from "@/schemas/addtask-schema/addtaskSchema";
import { z } from "zod";
import Questions from "./Questions";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { useParams, useRouter } from "next/navigation";
import { RootState, useAppDispatch } from "@/store/Store";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { AmountType, TaskType } from "@/services/enums/enums";
import FileUpload from "@/components/common/upload/FileUpload";
import { uploadFileToS3 } from "@/services/uploadFileToS3/uploadFileToS3";
import Promotion from "@/components/common/Modals/Promotion";
import dynamic from "next/dynamic";
import {
  TextField,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepIconProps,
  StepConnector,
  stepConnectorClasses,
  stepLabelClasses,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import InputField from "@/components/common/InputField/InputField";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`& .${stepConnectorClasses.line}`]: {
    height: 2,
    border: 0,
    borderTop: `2px dashed #404040`,
    backgroundColor: "transparent",
    borderRadius: 1,
  },
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      // backgroundImage: 'linear-gradient(to right, #00D4AA, #39f)',
      borderTop: "2px dashed #39f",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: "none",
      borderTop: "2px dashed #39f",
    },
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: "#1A1A1A",
  border: "2px solid #404040",
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage: "linear-gradient(136deg, #39f 0%, #00D4AA 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
    borderColor: "transparent",
    border: "none",
  }),
  ...(ownerState.completed && {
    backgroundImage: "linear-gradient(136deg, #39f 0%, #00D4AA 100%)",
    borderColor: "transparent",
    border: "0",
  }),
}));

function ColorlibStepIcon(
  props: StepIconProps & { iconElement: React.ReactElement }
) {
  const { active, completed, className, iconElement } = props;

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {React.cloneElement(iconElement, {
        stroke: completed || active ? "#FFFFFF" : "#999999",
      })}
    </ColorlibStepIconRoot>
  );
}

const QuillEditor = dynamic(
  () => import("@/components/common/TextEditor/TextEditor"),
  { ssr: false }
);
import CreatableSelect from "react-select/creatable";
import DocumentUploadTable from "@/components/common/DocumentUploadTable/DocumentUploadTable";
import GoogleMap from "./GoogleMap";
import GlobalLoader from "@/components/common/GlobalLoader/GlobalLoader";
import Address from "@/components/common/Address/Address";
import { useNavigation } from "@/hooks/useNavigation";
import { dataForServer } from "@/models/taskModel/taskModel";
import { toast } from "react-toastify";
import { ArrowLeft02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { GenerateAIButton } from "@/components/common/generateAIButton/GenerateAIButton";

type FormSchemaType = z.infer<typeof addtaskSchema>;

const FormTask: FC<any> = ({ type }) => {
  const [activeAccordions, setActiveAccordions] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [dataToPass, setDataToPass] = useState(null);
  const [rerender, setrerender] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { navigate } = useNavigation();
  const queryClient = useQueryClient();
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [isSubmitButtonClicked, setIsSubmitButtonClicked] =
    useState<boolean>(false);
  const [questionsArr, setQuestionsArr] = useState<any>([]);
  const [categories, setcategories] = useState<any>([]);
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [countries, setCountries] = useState<any>([]);
  const [task, setTask] = useState<any>([]);
  const [subCategories, setSubCategories] = useState<any>([]);
  const [documents, setDocuments] = useState<any>([]);
  const user = useSelector((state: RootState) => state.user);
  const [lastFocusedField, setLastFocusedField] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });
  const [locationError, setLocationError] = useState<string | null>(null);
  const [catId, setCatId] = useState<number | null>(null);
  const [pop, setPop] = useState<boolean>(false);
  const [promotionmodalcheck, setpromotionmodalcheck] = useState<any>(null);
  const { id } = useParams();
  const [editorTxt, setEditorTxt] = useState("");

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    clearErrors,
    control,
    formState: { errors },
    reset,
    watch,
    getValues,
    setError,
  } = useForm<FormSchemaType>({
    defaultValues: {
      name: "",
      amount: "",
      details: "",
      startDate: "",
      endDate: "",
      amountType: "FIXED",
      taskType: "ONLINE",
      status: "POSTED",
      documents: [],
      interviewQuestions: [],
      city: "",
      state: "",
      zip: "",
      street: "",
      country: "",
      address: "",
      category: "",
      subCategory: "",
      requesterProfileId: user?.profile[0]?.id?.toString() || "",
      promoted: "false",
      longitude: "",
      latitude: "",
      disability: "false",
      categoryIdsToDelete: [],
      questionIdsToDelete: [],
    },
    resolver: zodResolver(addtaskSchema),
    mode: "all",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "interviewQuestions",
  });

  const interviewQuestions = watch("interviewQuestions");

  const steps = [
    {
      id: 0,
      title: "Description",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      id: 1,
      title: "Task Basics",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14,2 14,8 20,8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10,9 9,9 8,9" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Requirements",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <circle cx="12" cy="16" r="1" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Submit a Task",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      ),
    },
  ];

  // All the existing functions remain the same
  useEffect(() => {
    if (!type) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setCurrentLocation({ latitude, longitude });
          },
          (error) => {
            setLocationError(
              "Unable to retrieve your location. Please allow location access."
            );
            console.error("Geolocation error:", error);
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser.");
      }
    }
  }, []);

  const focusOnNextInvalidField = (errors: Record<string, any>) => {
    const fieldOrder = [
      "name",
      "details",
      "category",
      "subCategory",
      "amountType",
      "amount",
      "startDate",
      "endDate",
      "taskType",
    ];

    if (!lastFocusedField) {
      const firstInvalidField = fieldOrder.find((field) => errors[field]);
      if (firstInvalidField) {
        focusField(firstInvalidField);
      }
      return;
    }

    const lastIndex = fieldOrder.indexOf(lastFocusedField);
    for (let i = lastIndex + 1; i < fieldOrder.length; i++) {
      const fieldName = fieldOrder[i];
      if (errors[fieldName]) {
        focusField(fieldName);
        return;
      }
    }

    const firstInvalidField = fieldOrder.find((field) => errors[field]);
    if (firstInvalidField) {
      focusField(firstInvalidField);
    }
  };

  const focusField = (fieldName: string) => {
    const element = document.getElementsByName(fieldName)[0];
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    setLastFocusedField(fieldName);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getCategory(1, null);
        await getCategory(2, null);
        if (type) {
          await getTask();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [type]);

  useEffect(() => {
    if (type) {
      // Temporarily disable this logic to test if direct categoryId setting works
      if (categories.length > 0 && task?.categories?.length > 0) {
        // Find the main category (level 1) from task categories
        const mainCategory = task.categories.find(
          (cat: any) => cat.category.level === 1
        );

        if (mainCategory) {
          setValue("category", mainCategory.category.id?.toString());
        } else {
          // Fallback: try to find parent category
          const preSelectedCategory = categories.filter((category: any) =>
            task?.categories?.some(
              (uCat: any) => uCat?.category?.parentCategory?.id === category.id
            )
          );
          if (preSelectedCategory.length > 0) {
            setValue("category", String(preSelectedCategory[0]?.id));
          }
        }
      }
      if (subCategories.length > 0 && task?.categories?.length > 0) {
        const preSelectedSubCategory = task?.categories?.find(
          (uCat: any) => uCat?.category?.level === 2
        );
        if (preSelectedSubCategory) {
          setValue(
            "subCategory",
            preSelectedSubCategory.category.id.toString()
          );
        }
      }
    }
  }, [categories, task]);

  const getCategory = async (level: number, catId: number | null) => {
    await apiCall(
      `${requests.getCategory}?level=${level}${
        catId ? `&parentCategoryId=${catId}` : ""
      }`,
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        if (level === 2) {
          setSubCategories(res?.data?.data?.categories || []);
        } else {
          setcategories(res?.data?.data?.categories || []);
        }
      })
      .catch((err) => console.warn(err));
  };

  const getCountries = async (id: any) => {
    await apiCall(requests.countries, {}, "get", false, null, null, null)
      .then((res: any) => {
        setCountries(res?.data);
        if (id) {
          setValue("country", String(id));
        }
      })
      .catch((err) => console.warn(err));
  };

  const getStates = async (countId: number | null, id: any) => {
    await apiCall(
      `${requests.states}?countryId=${countId}`,
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        setStates(res?.data);
        setTimeout(() => {
          if (id) {
            setValue("state", String(id));
          }
        }, 300);
      })
      .catch((err) => console.warn(err));
  };

  const getCities = async (stateId: number | null, id: any) => {
    await apiCall(
      `${requests.cities}?stateId=${stateId}`,
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        setCities(res?.data);
        setTimeout(() => {
          if (id) {
            setValue("city", String(id));
          }
        }, 300);
      })
      .catch((err) => console.warn(err));
  };

  useMemo(() => {
    getCategory(2, catId);
  }, [catId]);

  const getTask = async () => {
    await apiCall(
      requests?.getTaskId + id,
      {},
      "get",
      false,
      dispatch,
      user,
      router
    )
      .then((res: any) => {
        if (res?.data?.data?.task) {
          setpromotionmodalcheck(res?.data?.data?.task?.promoted);
          const startformattedDate = new Date(res?.data?.data?.task?.startDate)
            .toISOString()
            .split("T")[0];
          const endformattedDate = new Date(res?.data?.data?.task?.endDate)
            .toISOString()
            .split("T")[0];
          setValue(
            "interviewQuestions",
            res?.data?.data?.task.interviewQuestions || []
          );
          setEditorTxt(res?.data?.data?.task?.details || "");
          setTask(res?.data?.data?.task);

          setValue("name", res?.data?.data?.task?.name || "");
          setValue("amount", res?.data?.data?.task?.amount?.toString() || "");
          setValue("details", res?.data?.data?.task?.details || "");
          setValue("startDate", startformattedDate || "");
          setValue("endDate", endformattedDate || "");
          setValue(
            "promoted",
            res?.data?.data?.task?.promoted.toString() || ""
          );
          setValue("amountType", res?.data?.data?.task.amountType || "");
          setValue("taskType", res?.data?.data?.task.taskType || "");
          setValue("status", res?.data?.data?.task.status || "");
          setValue("zip", res?.data?.data?.task?.taskLocation?.zip || "");
          setValue(
            "category",
            res?.data?.data?.task.categoryId?.toString() || ""
          );
          setCatId(res?.data?.data?.task.categoryId || null);
          setValue(
            "interviewQuestions",
            res?.data?.data?.task.interviewQuestions || []
          );
          setValue("documents", res?.data?.data?.task?.documents || []);
          setValue("address", res?.data?.data?.task?.taskLocation?.address);

          if (res?.data?.data?.task?.taskLocation?.countryId) {
            getCountries(res?.data?.data?.task.taskLocation?.countryId);
          }
          if (res?.data?.data?.task.taskLocation?.cityId) {
            getCities(
              res?.data?.data?.task.taskLocation?.stateId,
              res?.data?.data?.task.taskLocation?.cityId
            );
          }
          if (res?.data?.data?.task.taskLocation?.stateId) {
            getStates(
              res?.data?.data?.task?.taskLocation?.countryId,
              res?.data?.data?.task.taskLocation?.stateId
            );
          }
          if (res?.data?.data?.task.taskLocation?.longitude) {
            setCurrentLocation({
              latitude: Number(res?.data?.data?.task.taskLocation?.latitude),
              longitude: Number(res?.data?.data?.task.taskLocation?.longitude),
            });
            setValue(
              "longitude",
              res?.data?.data?.task.taskLocation?.longitude || ""
            );
            setValue(
              "latitude",
              res?.data?.data?.task.taskLocation?.latitude || ""
            );
          }
        }
        setDocuments(res?.data?.data?.task.documents || []);
      })
      .catch((err) => console.warn(err));
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    const name = watch("name");
    if (!name) {
      setError("name", {
        type: "manual",
        message: "Task name is required to generate description using AI",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await apiCall(
        requests.createTaskDescription,
        { prompt: name },
        "post",
        false,
        dispatch,
        null,
        null
      );
      if (response?.data) {
        setEditorTxt(response?.data);
        setValue("details", `${response?.data}` || "");
      }
    } catch (error) {
      console.error("Error generating AI response:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCountries(null);
  }, []);

  useEffect(() => {
    if (
      errors.name ||
      errors.details ||
      errors.amount ||
      errors.startDate ||
      errors.endDate ||
      errors.amountType ||
      errors.category ||
      errors.taskType ||
      errors.city ||
      errors.country ||
      errors.address ||
      errors.state ||
      errors.zip ||
      errors.subCategory
    ) {
      setActiveAccordions(["collapseTwo"]);
      setTimeout(() => {
        setActiveAccordions(["collapseOne"]);
      }, 0);
      return;
    }
    if (errors.interviewQuestions) {
      setActiveAccordions(["collapseOne"]);
      setTimeout(() => {
        setActiveAccordions(["collapseTwo"]);
      }, 0);
      return;
    }
    if (Object.values(errors)?.length === 0) {
      setActiveAccordions(["collapseTwo"]);
      setTimeout(() => {
        setActiveAccordions(["collapseOne"]);
      }, 0);
      return;
    }
  }, [errors, rerender]);

  const handleAccordionToggle = (accordionId: string) => {
    setActiveAccordions([accordionId]);
  };

  const onSubmit: SubmitHandler<FormSchemaType> = async (data: any) => {
    // Only allow form submission if submit button was explicitly clicked
    if (!isSubmitButtonClicked) {
      return;
    }

    setrerender(!rerender);

    // Validate all fields before submission
    const isValid = await trigger();
    if (!isValid) {
      focusOnNextInvalidField(errors);
      return;
    }

    setIsFormSubmitted(true);

    const formData = dataForServer({
      ...data,
      promoted: watch("promoted"),
    });

    // If this is an edit (type is truthy), update existing task
    if (type && id) {
      apiCall(
        requests.editTask + id,
        formData,
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
            setIsFormSubmitted(false);
            setIsSubmitButtonClicked(false);
          } else {
            toast.success(res?.data?.message || "Task updated successfully!");
            setIsFormSubmitted(false);
            setIsSubmitButtonClicked(false);
            reset({});

            // Invalidate and refetch tasks queries
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["statusTasks"] });
            queryClient.invalidateQueries({ queryKey: ["taskCount"] });
            queryClient.invalidateQueries({ queryKey: ["multipleTaskCount"] });

            router.push("/dashboard/tasks");
          }
        })
        .catch((err) => {
          toast.error("Something went wrong, please try again");
          setIsFormSubmitted(false);
          setIsSubmitButtonClicked(false);
        });
    } else {
      if (currentStep === steps.length - 1 && !isFormSubmitted) {
        setIsFormSubmitted(true);
        setPop(true);
        setDataToPass(data);
        return;
      }
      // Creating new task
      apiCall(requests.addtask, formData, "post", true, dispatch, user, router)
        .then((res: any) => {
          if (res?.error) {
            const message = res?.error?.message;
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
            setIsFormSubmitted(false);
            setIsSubmitButtonClicked(false);
          } else {
            toast.success(res?.data?.message || "Task created successfully!");
            setIsFormSubmitted(false);
            setIsSubmitButtonClicked(false);
            reset({});

            // Invalidate and refetch tasks queries
            queryClient.invalidateQueries({ queryKey: ["tasks"] });
            queryClient.invalidateQueries({ queryKey: ["statusTasks"] });
            queryClient.invalidateQueries({ queryKey: ["taskCount"] });
            queryClient.invalidateQueries({ queryKey: ["multipleTaskCount"] });

            router.push("/dashboard/tasks");
          }
        })
        .catch((err) => {
          toast.error("Something went wrong, please try again");
          setIsFormSubmitted(false);
          setIsSubmitButtonClicked(false);
        });
    }
  };

  const handleFileSelect = async (
    files: File[],
    fileObjs: any[],
    onProgress: (progress: number) => void
  ): Promise<number[]> => {
    const uploadedFileIds = files
      ? await uploadFileToS3(files, fileObjs, onProgress, true)
      : 0;
    const temp: any = [...documents, ...uploadedFileIds];
    setDocuments(temp);

    if (uploadedFileIds.length > 0) {
      setValue("documents", temp);
    }

    return uploadedFileIds;
  };

  const handleDeleteFile = (id: any) => {
    const updatedDocuments = documents.filter((doc: any) => doc.fileUrl !== id);
    setDocuments(updatedDocuments);
    setValue("documents", updatedDocuments);
  };

  const handleEditorTxt = (value: any) => {
    setEditorTxt(value.replace(/<[^>]*>/g, "").trim() !== "" ? value : "");
    setValue(
      "details",
      value.replace(/<[^>]*>/g, "").trim() !== "" ? value : ""
    );
    clearErrors("details");
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setValue("latitude", String(lat));
    setValue("longitude", String(lng));
  };

  const handleNext = async () => {
    // Prevent form submission - only allow navigation between steps
    if (currentStep >= steps.length - 1) {
      return; // Don't proceed if already on last step
    }

    // Define fields to validate for each step
    let fieldsToValidate: (keyof FormSchemaType)[] = [];

    switch (currentStep) {
      case 0: // Description
        fieldsToValidate = ["name", "details"];
        break;
      case 1: // Task Basics
        fieldsToValidate = [
          "category",
          "subCategory",
          "amountType",
          "amount",
          "startDate",
          "endDate",
        ];
        break;
      case 2: // Requirements
        fieldsToValidate = ["taskType"];
        // Add address validation if taskType is ONSITE
        if (watch("taskType") === "ONSITE") {
          fieldsToValidate.push("address");
        }
        break;
      default:
        fieldsToValidate = [];
    }

    // Validate only the current step's fields
    const isValid =
      fieldsToValidate.length === 0 || (await trigger(fieldsToValidate));

    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isValid) {
      // Focus on the first invalid field in current step
      for (const field of fieldsToValidate) {
        if (errors[field]) {
          const element =
            document.getElementById(field) ||
            document.getElementsByName(field)[0];
          if (element) {
            element.focus();
            element.scrollIntoView({ behavior: "smooth", block: "center" });
            break;
          }
        }
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderDescription();
      case 1:
        return renderTaskBasics();
      case 2:
        return renderRequirements();
      case 3:
        return renderSubmit();
      default:
        return renderDescription();
    }
  };

  const renderTaskBasics = () => (
    <div className="row g-4">
      <div className="col-md-6">
        <InputField
          className="inputcontrol"
          name="category"
          control={control}
          select
          label="Category"
          variant="outlined"
          required
          options={[{ id: "", name: "Select Category" }, ...categories]}
          onChange={(e) => {
            setCatId(e.target.value !== "" ? Number(e.target.value) : null);
            setValue("category", e.target.value?.toString());
            setValue("subCategory", "");
          }}
          value={watch("category")}
        />
      </div>

      <div className="col-md-6">
        <InputField
          className="inputcontrol"
          name="subCategory"
          control={control}
          select
          label="Subcategory"
          variant="outlined"
          options={[{ id: "", name: "Select Subcategory" }, ...subCategories]}
        />
      </div>

      <div className="col-md-6">
        <InputField
          name="amountType"
          className="inputcontrol"
          control={control}
          select
          label="Budget Type"
          variant="outlined"
          required
          options={[
            { id: "", name: "Select budget type" },
            ...Object.keys(AmountType).map((key) => ({
              id: key,
              name: AmountType[key as keyof typeof AmountType],
            })),
          ]}
        />
      </div>

      <div className="col-md-6">
        <InputField
          className="inputcontrol"
          name="amount"
          control={control}
          label={
            watch("amountType") === "HOURLY"
              ? "Hourly Rate ($)"
              : "Total Budget ($)"
          }
          variant="outlined"
          required
          placeholder={
            watch("amountType") === "HOURLY" ? "25 - 50" : "Enter Amount"
          }
          inputProps={{ maxLength: 50 }}
        />
      </div>

      <div className="col-md-6">
        <InputField
          className="inputcontrol"
          name="startDate"
          control={control}
          label="Start Date"
          type="date"
          variant="outlined"
          required
        />
      </div>

      <div className="col-md-6">
        <InputField
          className="inputcontrol"
          name="endDate"
          control={control}
          label="End Date"
          type="date"
          variant="outlined"
          required
          inputProps={{
            min: watch("startDate") || new Date().toISOString().split("T")[0],
          }}
        />
      </div>
    </div>
  );

  const renderDescription = () => (
    <div className="row g-3">
      <div className="col-12">
        <InputField
          name="name"
          className="inputcontrol"
          control={control}
          label="Task Name"
          variant="outlined"
          required
          inputProps={{ maxLength: 50 }}
        />
      </div>

      <div className="col-12">
        <div
          className="mb-3 rounded-3 p-2"
          style={{ border: "#545454 1px solid" }}
        >
          <label
            className="form-label"
            style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "400" }}
          >
            Task Description <span style={{ color: "#FF6B6B" }}>*</span>
          </label>
          <QuillEditor
            className="bg-white text-white invert border-0"
            style={{ height: "200px" }}
            placeholder="Describe your project in detail..."
            value={editorTxt}
            setValue={handleEditorTxt}
          />
          <div className="d-flex justify-content-end align-items-center mt-1 mb-3">
            <GenerateAIButton
              disabled={loading}
              handleClick={handleGenerateAI}
            />
            {/* <button
              className="btn text-info btn-sm rounded-pill p-0"
              type="button"
              onClick={handleGenerateAI}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate through AI"}
            </button> */}
          </div>
          {errors.details && (
            <div className="text-danger pt-2">{errors.details.message}</div>
          )}
        </div>
      </div>

      <div className="col-12">
        <div
          className="mb-3 rounded-3 p-2"
          style={{ border: "#545454 1px solid" }}
        >
          <label
            className="form-label"
            style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "400" }}
          >
            File Upload (images and PDFs):
          </label>
          <FileUpload
            onFileSelect={handleFileSelect}
            label="Upload Files"
            accept="image/*,application/pdf"
            type="task"
          />
          <div className="mt-2">
            <DocumentUploadTable
              documents={documents}
              handleDeleteFile={handleDeleteFile}
              type={"Document"}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderRequirements = () => (
    <div className="row g-3">
      <div className="col-12 mb-3">
        <label
          className="form-label mb-3"
          style={{
            color: "#FFFFFF",
            fontSize: "14px",
            fontWeight: "400",
            display: "block",
          }}
        >
          Task Location <span style={{ color: "#FF6B6B" }}>*</span>
        </label>
        <div className="d-flex gap-4">
          <div className="form-check d-flex align-items-center">
            <input
              {...register("taskType")}
              className="form-check-input"
              type="radio"
              value="ONLINE"
              id="online-req"
              style={{
                backgroundColor: "#1A1A1A",
                borderColor: "#404040",
                width: "20px",
                height: "20px",
                marginRight: "12px",
              }}
            />
            <label
              className="form-check-label"
              htmlFor="online-req"
              style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "400" }}
            >
              Online
            </label>
          </div>
          <div className="form-check d-flex align-items-center">
            <input
              {...register("taskType")}
              className="form-check-input"
              type="radio"
              value="ONSITE"
              id="onsite-req"
              style={{
                backgroundColor: "#1A1A1A",
                borderColor: "#404040",
                width: "20px",
                height: "20px",
                marginRight: "12px",
              }}
            />
            <label
              className="form-check-label"
              htmlFor="onsite-req"
              style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "400" }}
            >
              Onsite
            </label>
          </div>
        </div>
        {errors.taskType && (
          <div className="text-danger mt-2" style={{ fontSize: "12px" }}>
            {errors.taskType.message}
          </div>
        )}
      </div>

      {watch("taskType") === "ONSITE" && (
        <div className="col-12">
          <Address
            setValue={setValue}
            errors={errors}
            register={register}
            getStates={getStates}
            states={states}
            getCities={getCities}
            cities={cities}
            countries={countries}
            currentLocation={currentLocation}
            control={control}
            type={true}
          />
        </div>
      )}

      <div className="col-12">
        <div className="form-check d-flex align-items-center">
          <input
            type="checkbox"
            className="form-check-input"
            id="disabilityCheckReq"
            checked={watch("disability") === "true"}
            onChange={(e) => {
              const newValue = e.target.checked ? "true" : "false";
              setValue("disability", newValue);
            }}
            style={{
              backgroundColor: "#1A1A1A",
              borderColor: "#404040",
              width: "20px",
              height: "20px",
              marginRight: "12px",
            }}
          />
          <label
            htmlFor="disabilityCheckReq"
            className="form-check-label"
            style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "400" }}
          >
            Do you want this task specific for Disabled TalentedXperts?
          </label>
        </div>
        {errors.disability && (
          <div className="text-danger mt-2" style={{ fontSize: "12px" }}>
            {errors.disability.message}
          </div>
        )}
      </div>

      <div className="col-12">
        <div className="mb-3">
          <label
            className="form-label"
            style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "400" }}
          >
            Interview Questions (Optional)
          </label>
          <Questions
            fields={fields}
            append={append}
            remove={remove}
            setValue={setValue}
            errors={errors}
            getValues={getValues}
            control={control}
          />
        </div>
      </div>
    </div>
  );

  const renderSubmit = () => (
    <>
      <div className="text-center">
        <div className="mb-4">
          <h3
            style={{
              color: "#FFFFFF",
              marginBottom: "16px",
              fontSize: "24px",
              fontWeight: "600",
            }}
          >
            Task Summary
          </h3>
          <p style={{ color: "#999", fontSize: "14px" }}>
            Review your task details before submission
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-6">
            <div
              style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #404040",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <h6
                style={{
                  color: "#39f",
                  marginBottom: "16px",
                  fontSize: "16px",
                  fontWeight: "500",
                  textAlign: "left",
                }}
              >
                Project Details
              </h6>
              <div
                style={{
                  color: "#ccc",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  textAlign: "left",
                }}
              >
                <p className="mb-2">
                  <strong style={{ color: "#fff" }}>Location:</strong>{" "}
                  {watch("taskType") || "Not selected"}
                </p>
                <p className="mb-2">
                  <strong style={{ color: "#fff" }}>Category:</strong>{" "}
                  {categories.find((cat: any) => cat.id == watch("category"))
                    ?.name || "Not selected"}
                </p>
                <p className="mb-2">
                  <strong style={{ color: "#fff" }}>Subcategory:</strong>{" "}
                  {subCategories.find(
                    (sub: any) => sub.id == watch("subCategory")
                  )?.name || "Not selected"}
                </p>
                <p className="mb-0">
                  <strong style={{ color: "#fff" }}>Description:</strong>{" "}
                  {watch("details") ? (
                    <span
                      dangerouslySetInnerHTML={{ __html: watch("details") }}
                    />
                  ) : (
                    "Not provided"
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div
              style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #404040",
                borderRadius: "12px",
                padding: "24px",
              }}
            >
              <h6
                style={{
                  color: "#39f",
                  marginBottom: "16px",
                  fontSize: "16px",
                  fontWeight: "500",
                  textAlign: "left",
                }}
              >
                Task Information
              </h6>
              <div
                style={{
                  color: "#ccc",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  textAlign: "left",
                }}
              >
                <p className="mb-2">
                  <strong style={{ color: "#fff" }}>Name:</strong>{" "}
                  {watch("name") || "Not specified"}
                </p>
                <p className="mb-2">
                  <strong style={{ color: "#fff" }}>Budget:</strong> $
                  {watch("amount") || "0"} (
                  {watch("amountType") || "Not selected"})
                </p>
                <p className="mb-2">
                  <strong style={{ color: "#fff" }}>Start Date:</strong>{" "}
                  {watch("startDate")
                    ? new Date(watch("startDate")).toLocaleDateString("en-GB")
                    : "Not selected"}
                </p>
                <p className="mb-0">
                  <strong style={{ color: "#fff" }}>End Date:</strong>{" "}
                  {watch("endDate")
                    ? new Date(watch("endDate")).toLocaleDateString("en-GB")
                    : "Not selected"}
                </p>
              </div>
            </div>
          </div>
          {watch("taskType") === "ONSITE" && watch("address") && (
            <div className="col-12">
              <div
                style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #404040",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <h6
                  style={{
                    color: "#39f",
                    marginBottom: "16px",
                    fontSize: "16px",
                    fontWeight: "500",
                    textAlign: "left",
                  }}
                >
                  Location Details
                </h6>
                <div
                  style={{
                    color: "#ccc",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    textAlign: "left",
                  }}
                >
                  <p className="mb-0">
                    <strong style={{ color: "#fff" }}>Address:</strong>{" "}
                    {watch("address")}
                  </p>
                </div>
              </div>
            </div>
          )}
          {documents.length > 0 && (
            <div className="col-md-6">
              <div
                style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #404040",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <h6
                  style={{
                    color: "#39f",
                    marginBottom: "16px",
                    fontSize: "16px",
                    fontWeight: "500",
                    textAlign: "left",
                  }}
                >
                  Uploaded Files
                </h6>
                <div
                  style={{
                    color: "#ccc",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    textAlign: "left",
                  }}
                >
                  <p className="mb-0">
                    <strong style={{ color: "#fff" }}>Files:</strong>{" "}
                    {documents.length} file(s) uploaded
                  </p>
                </div>
              </div>
            </div>
          )}
          {interviewQuestions.length > 0 && (
            <div className="col-md-6">
              <div
                style={{
                  border: "1px solid #404040",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <h6
                  style={{
                    color: "#39f",
                    marginBottom: "16px",
                    fontSize: "16px",
                    fontWeight: "500",
                    textAlign: "left",
                  }}
                >
                  Interview Questions
                </h6>
                <div
                  style={{
                    color: "#ccc",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    textAlign: "left",
                  }}
                >
                  <p className="mb-0">
                    <strong style={{ color: "#fff" }}>Questions:</strong>{" "}
                    {interviewQuestions.length} question(s) added
                  </p>
                  {interviewQuestions?.length > 0 &&
                    interviewQuestions?.map((ques: any, idx: number) => (
                      <p key={idx} className="mb-0">
                        <strong style={{ color: "#fff" }}>
                          Question {idx + 1}:
                        </strong>{" "}
                        {ques?.question}
                      </p>
                    ))}
                </div>
              </div>
            </div>
          )}
          {watch("disability") === "true" && (
            <div className="col-12">
              <div
                style={{
                  backgroundColor: "#1A1A1A",
                  border: "1px solid #404040",
                  borderRadius: "12px",
                  padding: "24px",
                }}
              >
                <h6
                  style={{
                    color: "#39f",
                    marginBottom: "16px",
                    fontSize: "16px",
                    fontWeight: "500",
                    textAlign: "left",
                  }}
                >
                  Special Requirements
                </h6>
                <div
                  style={{
                    color: "#ccc",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    textAlign: "left",
                  }}
                >
                  <p className="mb-0">
                    <strong style={{ color: "#fff" }}>
                      Disability-Specific:
                    </strong>{" "}
                    This task is specific for disabled TalentedXperts
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <div className="dashboard-card">
      <div>
        <style jsx>{`
          .form-floating > .form-control,
          .form-floating > .form-select {
            background-color: #1a1a1a !important;
            border: 1px solid #404040 !important;
            color: #ffffff !important;
            border-radius: 0.4rem !important;
            height: 48px !important;
            min-height: 48px !important;
          }
          .form-floating > .form-control:focus,
          .form-floating > .form-select:focus {
            border-color: #00d4aa !important;
            box-shadow: 0 0 0 0.25rem rgba(0, 212, 170, 0.25) !important;
          }
          .form-floating > label {
            color: #999 !important;
            padding: 0.5rem 0.75rem !important;
          }
          .form-floating > .form-control:focus ~ label,
          .form-floating > .form-control:not(:placeholder-shown) ~ label,
          .form-floating > .form-select:focus ~ label,
          .form-floating > .form-select:not([value=""]) ~ label {
            color: #00d4aa !important;
          }
          .form-floating > .form-control::placeholder {
            color: transparent !important;
          }
          .form-floating > textarea.form-control {
            min-height: 120px !important;
            height: auto !important;
          }
          .form-check-input:checked {
            background-color: #00d4aa !important;
            border-color: #00d4aa !important;
          }
          .form-check-input:focus {
            border-color: #00d4aa !important;
            box-shadow: 0 0 0 0.25rem rgba(0, 212, 170, 0.25) !important;
          }
          .text-danger {
            margin-top: 0.25rem !important;
          }
          .next-btn:hover {
            background: #6e6e6e !important;
          }
        `}</style>
        <style jsx global>{`
          .MuiInputLabel-asterisk {
            color: #ff6b6b !important;
          }
        `}</style>
        {/* Stepper Header */}
        <div>
          <div className="container mb-4">
            <h4 className="panel-title">Create Opportunities for Xperts</h4>
            <Stepper
              alternativeLabel
              activeStep={currentStep}
              connector={<ColorlibConnector />}
            >
              {steps.map((step) => (
                <Step key={step.id}>
                  <StepLabel
                    StepIconComponent={(props) => (
                      <ColorlibStepIcon
                        {...props}
                        iconElement={step.icon as React.ReactElement}
                      />
                    )}
                    sx={{
                      [`& .${stepLabelClasses.label}`]: {
                        color: "#999",
                        [`&.${stepLabelClasses.active}`]: {
                          color: "#FFFFFF",
                        },
                        [`&.${stepLabelClasses.completed}`]: {
                          color: "#FFFFFF",
                        },
                      },
                    }}
                  >
                    {step.title}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: "0 0 20px 0" }}>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-12 col-xl-12">
                <div
                  style={
                    {
                      // backgroundColor: "#1A1A1A",
                      // borderRadius: "12px",
                      // border: "1px solid #404040",
                      // padding: "24px",
                      // margin: "0 15px"
                    }
                  }
                >
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {renderStepContent()}

                    {/* Navigation Buttons */}
                    <div className="d-flex justify-content-between align-items-center mt-4 pt-2">
                      <button
                        type="button"
                        className="btn d-flex align-items-center gap-2"
                        onClick={handleBack}
                        disabled={currentStep === 0}
                        style={{
                          backgroundColor: "transparent",
                          border: "1px solid #404040",
                          borderRadius: "8px",
                          color: currentStep === 0 ? "#666" : "#FFFFFF",
                          padding: "6px 24px 6px 27px",
                          fontSize: "14px",
                          fontWeight: "500",
                          cursor: currentStep === 0 ? "not-allowed" : "pointer",
                          opacity: currentStep === 0 ? 0.5 : 1,
                          transition: "all 0.2s ease",
                          width: "125px",
                          height: "36px",
                          gap: "8px",
                        }}
                      >
                        <HugeiconsIcon icon={ArrowLeft02Icon} />
                        Back
                      </button>

                      {currentStep < steps.length - 1 ? (
                        <button
                          type="button"
                          className="btn d-flex align-items-center gap-2 next-btn"
                          onClick={handleNext}
                          style={{
                            background:
                              "linear-gradient(135deg, #00BBFF, #5947FF)",
                            border: "none",
                            borderRadius: "8px",
                            color: "#FFFFFF",
                            padding: "6px 17px 6px 31px",
                            fontSize: "14px",
                            fontWeight: "600",
                            transition: "all 0.2s ease",
                            width: "117px",
                            height: "36px",
                            gap: "8px",
                          }}
                        >
                          Next
                          <HugeiconsIcon icon={ArrowRight02Icon} />
                        </button>
                      ) : (
                        <button
                          type="submit"
                          disabled={isFormSubmitted}
                          className="btn d-flex align-items-center gap-2"
                          onClick={() => setIsSubmitButtonClicked(true)}
                          style={{
                            backgroundColor: "rgb(51 153 207)",
                            border: "none",
                            borderRadius: "8px",
                            color: "#FFFFFF",
                            padding: "10px 20px",
                            fontSize: "14px",
                            fontWeight: "600",
                            opacity: isFormSubmitted ? 0.7 : 1,
                            transition: "all 0.2s ease",
                          }}
                        >
                          {isFormSubmitted ? "Submitting..." : "Submit Task"}
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && <GlobalLoader />}
        {pop && (
          <Promotion
            isOpen={pop}
            onClose={() => setPop(false)}
            register={register}
            watch={watch}
            setValue={setValue}
            setActiveStep={() => setActiveStep(1)}
            activeStep={activeStep}
            data={dataToPass}
            reset={reset}
            setIsFormSubmitted={setIsFormSubmitted}
            type={type}
            id={id}
          />
        )}
      </div>
    </div>
  );
};

export default FormTask;
