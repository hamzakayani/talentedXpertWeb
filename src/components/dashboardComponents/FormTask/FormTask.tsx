"use client";
import React, { FC, useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import { addtaskSchema } from "@/schemas/addtask-schema/addtaskSchema";
import { z } from "zod";
import Questions from "./Questions";
import apiCall from "@/services/apiCall/apiCall";
import { requests } from "@/services/requests/requests";
import { useParams, useRouter } from "next/navigation";
import { RootState, useAppDispatch } from "@/store/Store";
import { useSelector } from "react-redux";
import { AmountType, TaskType } from "@/services/enums/enums";
import FileUpload from "@/components/common/upload/FileUpload";
import { uploadFileToS3 } from "@/services/uploadFileToS3/uploadFileToS3";
import Promotion from "@/components/common/Modals/Promotion";
import dynamic from "next/dynamic";
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
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
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

  const taskType = watch("taskType");

  const steps = [
    { 
      id: 0, 
      title: "Task Basics", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
          <polyline points="10,9 9,9 8,9"/>
        </svg>
      )
    },
    { 
      id: 1, 
      title: "Description", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
      )
    },
    { 
      id: 2, 
      title: "Requirements", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <circle cx="12" cy="16" r="1"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      )
    },
    { 
      id: 3, 
      title: "Submit a Task", 
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
      )
    }
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
            setLocationError("Unable to retrieve your location. Please allow location access.");
            console.error("Geolocation error:", error);
          }
        );
      } else {
        setLocationError("Geolocation is not supported by your browser.");
      }
    }
  }, []);

  const focusOnNextInvalidField = (errors: Record<string, any>) => {
    const fieldOrder = ["name", "details", "amount", "startDate", "endDate", "amountType", "category", "subCategory", "taskType"];

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
      if (categories.length > 0 && task?.categories?.length > 0) {
        if (task?.categories[0]?.category?.level == 1) {
          setValue("category", String(task?.categories[0]?.category?.id));
        } else {
          const preSelectedCategory = categories.filter((category: any) =>
            task?.categories?.some((uCat: any) => uCat?.category?.parentCategory?.id === category.id)
          );
          setValue("category", String(preSelectedCategory[0]?.id));
        }
      }
      if (subCategories.length > 0 && task?.categories?.length > 0) {
        const preSelectedSubCategory = task?.categories?.find(
          (uCat: any) => uCat?.category?.level === 2
        );
        if (preSelectedSubCategory) {
          setValue("subCategory", preSelectedSubCategory.category.id.toString());
        }
      }
    }
  }, [categories, task]);

  const getCategory = async (level: number, catId: number | null) => {
    await apiCall(
      `${requests.getCategory}?level=${level}${catId ? `&parentCategoryId=${catId}` : ""}`,
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
    await apiCall(`${requests.states}?countryId=${countId}`, {}, "get", false, dispatch, user, router)
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
    await apiCall(`${requests.cities}?stateId=${stateId}`, {}, "get", false, dispatch, user, router)
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
    await apiCall(requests?.getTaskId + id, {}, "get", false, dispatch, user, router)
      .then((res: any) => {
        if (res?.data?.data?.task) {
          setpromotionmodalcheck(res?.data?.data?.task?.promoted);
          const startformattedDate = new Date(res?.data?.data?.task?.startDate).toISOString().split("T")[0];
          const endformattedDate = new Date(res?.data?.data?.task?.endDate).toISOString().split("T")[0];
          setQuestionsArr(res?.data?.data?.task.interviewQuestions || []);
          setEditorTxt(res?.data?.data?.task?.details || "");
          setTask(res?.data?.data?.task);

          setValue("name", res?.data?.data?.task?.name || "");
          setValue("amount", res?.data?.data?.task?.amount?.toString() || "");
          setValue("details", res?.data?.data?.task?.details || "");
          setValue("startDate", startformattedDate || "");
          setValue("endDate", endformattedDate || "");
          setValue("promoted", res?.data?.data?.task?.promoted.toString() || "");
          setValue("amountType", res?.data?.data?.task.amountType || "");
          setValue("taskType", res?.data?.data?.task.taskType || "");
          setValue("status", res?.data?.data?.task.status || "");
          setValue("zip", res?.data?.data?.task?.taskLocation?.zip || "");
          setValue("category", res?.data?.data?.task.categoryId?.toString() || "");
          setCatId(res?.data?.data?.task.categoryId || null);
          setValue("interviewQuestions", res?.data?.data?.task.interviewQuestions || []);
          setValue("documents", res?.data?.data?.task?.documents || []);
          setValue("address", res?.data?.data?.task?.taskLocation?.address);
          
          if (res?.data?.data?.task?.taskLocation?.countryId) {
            getCountries(res?.data?.data?.task.taskLocation?.countryId);
          }
          if (res?.data?.data?.task.taskLocation?.cityId) {
            getCities(res?.data?.data?.task.taskLocation?.stateId, res?.data?.data?.task.taskLocation?.cityId);
          }
          if (res?.data?.data?.task.taskLocation?.stateId) {
            getStates(res?.data?.data?.task?.taskLocation?.countryId, res?.data?.data?.task.taskLocation?.stateId);
          }
          if (res?.data?.data?.task.taskLocation?.longitude) {
            setCurrentLocation({
              latitude: Number(res?.data?.data?.task.taskLocation?.latitude),
              longitude: Number(res?.data?.data?.task.taskLocation?.longitude),
            });
            setValue("longitude", res?.data?.data?.task.taskLocation?.longitude || "");
            setValue("latitude", res?.data?.data?.task.taskLocation?.latitude || "");
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
      const response = await apiCall(requests.createTaskDescription, { prompt: name }, "post", false, dispatch, null, null);
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
      errors.name || errors.details || errors.amount || errors.startDate || errors.endDate ||
      errors.amountType || errors.category || errors.taskType || errors.city ||
      errors.country || errors.address || errors.state || errors.zip ||
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
    setrerender(!rerender);
    setIsFormSubmitted(true);
    
    const formData = dataForServer({
      ...data,
      promoted: watch("promoted"),
    });

    // If this is an edit (type is truthy), update existing task
    if (type && id) {
      apiCall(requests.editTask + id, formData, "put", true, dispatch, user, router)
        .then((res: any) => {
          let message: any;
          if (res?.error) {
            message = res?.error?.message;
            if (Array.isArray(message)) {
              message?.map((msg: string) =>
                toast.error(msg ? msg : "Something went wrong, please try again")
              );
            } else {
              toast.error(message ? message : "Something went wrong, please try again");
            }
            setIsFormSubmitted(false);
          } else {
            toast.success(res?.data?.message || "Task updated successfully!");
            setIsFormSubmitted(false);
            reset({});
            router.push("/dashboard/tasks");
          }
        })
        .catch((err) => {
          toast.error("Something went wrong, please try again");
          setIsFormSubmitted(false);
        });
    } else {
      // Creating new task
      apiCall(requests.addtask, formData, "post", true, dispatch, user, router)
        .then((res: any) => {
          if (res?.error) {
            const message = res?.error?.message;
            if (Array.isArray(message)) {
              message?.map((msg: string) =>
                toast.error(msg ? msg : "Something went wrong, please try again")
              );
            } else {
              toast.error(message ? message : "Something went wrong, please try again");
            }
            setIsFormSubmitted(false);
          } else {
            toast.success(res?.data?.message || "Task created successfully!");
            setIsFormSubmitted(false);
            reset({});
            router.push("/dashboard/tasks");
          }
        })
        .catch((err) => {
          toast.error("Something went wrong, please try again");
          setIsFormSubmitted(false);
        });
    }
  };

  const handleFileSelect = async (
    files: File[],
    fileObjs: any[],
    onProgress: (progress: number) => void
  ): Promise<number[]> => {
    const uploadedFileIds = files ? await uploadFileToS3(files, fileObjs, onProgress, true) : 0;
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
    setValue("details", value.replace(/<[^>]*>/g, "").trim() !== "" ? value : "");
    clearErrors("details");
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setValue("latitude", String(lat));
    setValue("longitude", String(lng));
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
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
        return renderTaskBasics();
      case 1:
        return renderDescription();
      case 2:
        return renderRequirements();
      case 3:
        return renderSubmit();
      default:
        return renderTaskBasics();
    }
  };

  const renderTaskBasics = () => (
    <div className="row g-3">
      <div className="col-md-6">
        <div className="form-floating">
          <input
            {...register("name")}
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            id="taskName"
            placeholder="Enter task name"
            maxLength={50}
            style={{
              backgroundImage: "none",
              backgroundColor: "#1A1A1A",
              border: "1px solid #404040",
              color: "#FFFFFF"
            }}
          />
          <label htmlFor="taskName" style={{ color: "#999" }}>
            Task Name <span style={{ color: "#FF6B6B" }}>*</span>
          </label>
          {errors.name && (
            <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
              {errors.name.message}
            </div>
          )}
        </div>
      </div>
      
      <div className="col-md-6">
        <div className="form-floating">
          <select
            {...register("category")}
            className={`form-select ${errors.category ? "is-invalid" : ""}`}
            id="category"
            style={{
              backgroundImage: "none",
              backgroundColor: "#1A1A1A",
              border: "1px solid #404040",
              color: "#FFFFFF"
            }}
            onChange={(e) => {
              setCatId(e?.target?.value !== "" ? Number(e?.target?.value) : null);
              setValue("subCategory", "");
            }}
          >
            <option value="" style={{ backgroundColor: "#1A1A1A", color: "#999" }}>Select Category</option>
            {categories.map((data: any) => (
              <option value={data?.id} key={data?.id} style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>
                {data?.name}
              </option>
            ))}
          </select>
          <label htmlFor="category" style={{ color: "#999" }}>
            Category <span style={{ color: "#FF6B6B" }}>*</span>
          </label>
          {errors.category && (
            <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
              {errors.category.message}
            </div>
          )}
        </div>
      </div>

      <div className="col-md-6">
        <div className="form-floating">
          <select
            {...register("amountType")}
            className={`form-select ${errors.amountType ? "is-invalid" : ""}`}
            id="budgetType"
            style={{
              backgroundImage: "none",
              backgroundColor: "#1A1A1A",
              border: "1px solid #404040",
              color: "#FFFFFF"
            }}
          >
            <option value="" style={{ backgroundColor: "#1A1A1A", color: "#999" }}>Select budget type</option>
            {Object.keys(AmountType).map((key) => {
              const value = AmountType[key as keyof typeof AmountType];
              return (
                <option value={key} key={key} style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>
                  {value}
                </option>
              );
            })}
          </select>
          <label htmlFor="budgetType" style={{ color: "#999" }}>
            Budget Type <span style={{ color: "#FF6B6B" }}>*</span>
          </label>
          {errors.amountType && (
            <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
              {errors.amountType.message}
            </div>
          )}
        </div>
      </div>

      <div className="col-md-6">
        <div className="form-floating">
          <input
            {...register("amount")}
            type="text"
            className={`form-control ${errors.amount ? "is-invalid" : ""}`}
            id="totalBudget"
            placeholder={watch("amountType") === "HOURLY" ? "25 - 50" : "1000 - 5000"}
            maxLength={50}
            style={{
              backgroundImage: "none",
              backgroundColor: "#1A1A1A",
              border: "1px solid #404040",
              color: "#FFFFFF"
            }}
          />
          <label htmlFor="totalBudget" style={{ color: "#999" }}>
            {watch("amountType") === "HOURLY" ? "Hourly Rate ($)" : "Total Budget ($)"} <span style={{ color: "#FF6B6B" }}>*</span>
          </label>
          {errors.amount && (
            <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
              {errors.amount.message}
            </div>
          )}
        </div>
      </div>

      <div className="col-md-6">
        <div className="form-floating">
          <input
            {...register("startDate")}
            type="date"
            className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
            id="startDate"
            style={{
              backgroundImage: "none",
              backgroundColor: "#1A1A1A",
              border: "1px solid #404040",
              color: "#FFFFFF"
            }}
          />
          <label htmlFor="startDate" style={{ color: "#999" }}>
            Start Date <span style={{ color: "#FF6B6B" }}>*</span>
          </label>
          {errors.startDate && (
            <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
              {errors.startDate.message}
            </div>
          )}
        </div>
      </div>

      <div className="col-md-6">
        <div className="form-floating">
          <input
            {...register("endDate")}
            type="date"
            className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
            id="endDate"
            style={{
              backgroundImage: "none",
              backgroundColor: "#1A1A1A",
              border: "1px solid #404040",
              color: "#FFFFFF"
            }}
          />
          <label htmlFor="endDate" style={{ color: "#999" }}>
            End Date <span style={{ color: "#FF6B6B" }}>*</span>
          </label>
          {errors.endDate && (
            <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
              {errors.endDate.message}
            </div>
          )}
        </div>
      </div>

      <div className="col-md-6">
        <div className="form-floating">
          <select
            {...register("subCategory")}
            className={`form-select ${errors.subCategory ? "is-invalid" : ""}`}
            id="subCategory"
            style={{
              backgroundImage: "none",
              backgroundColor: "#1A1A1A",
              border: "1px solid #404040",
              color: "#FFFFFF"
            }}
          >
            <option value="" style={{ backgroundColor: "#1A1A1A", color: "#999" }}>Select Subcategory</option>
            {subCategories.map((data: any) => (
              <option value={data?.id} key={data?.id} style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>
                {data?.name}
              </option>
            ))}
          </select>
          <label htmlFor="subCategory" style={{ color: "#999" }}>
            Subcategory
          </label>
          {errors.subCategory && (
            <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
              {errors.subCategory.message}
            </div>
          )}
        </div>
      </div>

      <div className="col-md-6">
        <div className="form-floating">
          <select
            className="form-select"
            id="experienceLevel"
            style={{
              backgroundImage: "none",
              backgroundColor: "#1A1A1A",
              border: "1px solid #404040",
              color: "#FFFFFF"
            }}
          >
            <option value="" style={{ backgroundColor: "#1A1A1A", color: "#999" }}>Select experience level</option>
            <option value="beginner" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>Beginner</option>
            <option value="intermediate" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>Intermediate</option>
            <option value="expert" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>Expert</option>
          </select>
          <label htmlFor="experienceLevel" style={{ color: "#999" }}>
            Experience Level <span style={{ color: "#FF6B6B" }}>*</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderDescription = () => (
    <div className="row g-3">
      <div className="col-12">
        <div className="form-floating">
          <textarea
            {...register("details")}
            className={`form-control ${errors.details ? "is-invalid" : ""}`}
            id="taskDescription"
            placeholder="Describe your project in detail..."
            rows={8}
            style={{
              backgroundImage: "none",
              backgroundColor: "#1A1A1A",
              border: "1px solid #404040",
              color: "#FFFFFF",
              minHeight: "200px"
            }}
          />
          <label htmlFor="taskDescription" style={{ color: "#999" }}>
            Task Description <span style={{ color: "#FF6B6B" }}>*</span>
          </label>
          {errors.details && (
            <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
              {errors.details.message}
            </div>
          )}
        </div>
      </div>
      
      <div className="col-12">
        <div className="form-floating">
          <textarea
            className="form-control"
            id="expectedDeliverables"
            placeholder="What should be deliver at the end of the project..."
            rows={6}
            style={{
              backgroundImage: "none",
              backgroundColor: "#1A1A1A",
              border: "1px solid #404040",
              color: "#FFFFFF",
              minHeight: "150px"
            }}
          />
          <label htmlFor="expectedDeliverables" style={{ color: "#999" }}>
            Expected Deliverables <span style={{ color: "#FF6B6B" }}>*</span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderRequirements = () => (
    <div className="row g-3">
      <div className="col-md-6">
        <div className="form-floating">
          <select
            className="form-select"
            id="projectDuration"
            style={{
              backgroundImage: "none",
              backgroundColor: "#1A1A1A",
              border: "1px solid #404040",
              color: "#FFFFFF"
            }}
          >
            <option value="" style={{ backgroundColor: "#1A1A1A", color: "#999" }}>Select Duration</option>
            <option value="1-week" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>1 Week</option>
            <option value="2-weeks" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>2 Weeks</option>
            <option value="1-month" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>1 Month</option>
            <option value="3-months" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>3 Months</option>
            <option value="6-months" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>6 Months</option>
          </select>
          <label htmlFor="projectDuration" style={{ color: "#999" }}>
            Project Duration <span style={{ color: "#FF6B6B" }}>*</span>
          </label>
        </div>
      </div>

      <div className="col-md-6">
        <div className="form-floating">
          <select
            className="form-select"
            id="timezone"
            style={{
              backgroundImage: "none",
              backgroundColor: "#1A1A1A",
              border: "1px solid #404040",
              color: "#FFFFFF"
            }}
          >
            <option value="" style={{ backgroundColor: "#1A1A1A", color: "#999" }}>Select timezone</option>
            <option value="utc-12" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>UTC-12</option>
            <option value="utc-8" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>UTC-8 (PST)</option>
            <option value="utc-5" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>UTC-5 (EST)</option>
            <option value="utc+0" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>UTC+0 (GMT)</option>
            <option value="utc+5" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>UTC+5</option>
          </select>
          <label htmlFor="timezone" style={{ color: "#999" }}>
            Preferred timezone <span style={{ color: "#FF6B6B" }}>*</span>
          </label>
        </div>
      </div>

      <div className="col-12 mb-3">
        <label className="form-label mb-3" style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "400", display: "block" }}>
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
                marginRight: "12px"
              }}
            />
            <label className="form-check-label" htmlFor="online-req" style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "400" }}>
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
                marginRight: "12px"
              }}
            />
            <label className="form-check-label" htmlFor="onsite-req" style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "400" }}>
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
          <div className="form-floating">
            <textarea
              {...register("address")}
              className={`form-control ${errors.address ? "is-invalid" : ""}`}
              id="address"
              placeholder="Enter complete address for onsite work..."
              rows={3}
              style={{
                backgroundImage: "none",
                backgroundColor: "#1A1A1A",
                border: "1px solid #404040",
                color: "#FFFFFF",
                minHeight: "100px"
              }}
            />
            <label htmlFor="address" style={{ color: "#999" }}>
              Address <span style={{ color: "#FF6B6B" }}>*</span>
            </label>
            {errors.address && (
              <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
                {errors.address.message}
              </div>
            )}
          </div>
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
              marginRight: "12px"
            }}
          />
          <label htmlFor="disabilityCheckReq" className="form-check-label" style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: "400" }}>
            Do you want this task specific for Disable TalentedXperts?
          </label>
        </div>
        {errors.disability && (
          <div className="text-danger mt-2" style={{ fontSize: "12px" }}>
            {errors.disability.message}
          </div>
        )}
      </div>
    </div>
  );

  const renderSubmit = () => (
    <div className="text-center">
      <div className="mb-4">
        <h3 style={{ color: "#FFFFFF", marginBottom: "16px", fontSize: "24px", fontWeight: "600" }}>Ready to Submit</h3>
        <p style={{ color: "#999", fontSize: "14px" }}>Your task is ready to be posted</p>
      </div>
      
      <div className="row g-4">
        <div className="col-md-6">
          <div 
            style={{ 
              backgroundColor: "#1A1A1A", 
              border: "1px solid #404040",
              borderRadius: "12px",
              padding: "24px"
            }}
          >
            <h6 style={{ color: "#00D4AA", marginBottom: "16px", fontSize: "16px", fontWeight: "500" }}>Task Information</h6>
            <div style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.6" }}>
              <p className="mb-2"><strong style={{ color: "#fff" }}>Name:</strong> {watch("name") || "Not specified"}</p>
              <p className="mb-2"><strong style={{ color: "#fff" }}>Budget:</strong> ${watch("amount") || "0"}</p>
              <p className="mb-0"><strong style={{ color: "#fff" }}>Type:</strong> {watch("amountType") || "Not selected"}</p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div 
            style={{ 
              backgroundColor: "#1A1A1A", 
              border: "1px solid #404040",
              borderRadius: "12px",
              padding: "24px"
            }}
          >
            <h6 style={{ color: "#00D4AA", marginBottom: "16px", fontSize: "16px", fontWeight: "500" }}>Project Details</h6>
            <div style={{ color: "#ccc", fontSize: "14px", lineHeight: "1.6" }}>
              <p className="mb-2"><strong style={{ color: "#fff" }}>Location:</strong> {watch("taskType") || "Not selected"}</p>
              <p className="mb-2"><strong style={{ color: "#fff" }}>Category:</strong> {categories.find((cat: any) => cat.id == watch("category"))?.name || "Not selected"}</p>
              <p className="mb-0"><strong style={{ color: "#fff" }}>Description:</strong> {watch("details") ? "Provided" : "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#0D0D0D", minHeight: "100vh", padding: "0" }}>
      <style jsx>{`
        .form-floating > .form-control,
        .form-floating > .form-select {
          background-color: #1A1A1A !important;
          border: 1px solid #404040 !important;
          color: #FFFFFF !important;
          border-radius: 0.375rem !important;
        }
        .form-floating > .form-control:focus,
        .form-floating > .form-select:focus {
          border-color: #00D4AA !important;
          box-shadow: 0 0 0 0.25rem rgba(0, 212, 170, 0.25) !important;
        }
        .form-floating > label {
          color: #999 !important;
        }
        .form-floating > .form-control:focus ~ label,
        .form-floating > .form-control:not(:placeholder-shown) ~ label,
        .form-floating > .form-select:focus ~ label,
        .form-floating > .form-select:not([value=""]) ~ label {
          color: #00D4AA !important;
        }
        .form-floating > .form-control::placeholder {
          color: transparent !important;
        }
        .form-floating > textarea.form-control {
          min-height: calc(3.5rem + 2px) !important;
        }
        .form-check-input:checked {
          background-color: #00D4AA !important;
          border-color: #00D4AA !important;
        }
        .form-check-input:focus {
          border-color: #00D4AA !important;
          box-shadow: 0 0 0 0.25rem rgba(0, 212, 170, 0.25) !important;
        }
      `}</style>
      {/* Stepper Header */}
      <div style={{ backgroundColor: "#0D0D0D", padding: "60px 0 40px 0" }}>
        <div className="container">
          <div className="d-flex justify-content-center">
            <div className="d-flex align-items-center position-relative" style={{ maxWidth: "800px", width: "100%" }}>
              {/* Background Progress Line */}
              <div
                style={{
                  position: "absolute",
                  top: "30px",
                  left: "30px",
                  right: "30px",
                  height: "2px",
                  backgroundColor: "#404040",
                  zIndex: 1
                }}
              />
              {/* Active Progress Line */}
              <div
                style={{
                  position: "absolute",
                  top: "30px",
                  left: "30px",
                  width: `calc(${(currentStep / (steps.length - 1)) * 100}% - 60px + ${(currentStep / (steps.length - 1)) * 60}px)`,
                  height: "2px",
                  backgroundColor: "#00D4AA",
                  zIndex: 2,
                  transition: "width 0.4s ease"
                }}
              />
              
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className="d-flex flex-column align-items-center"
                  style={{ flex: 1, zIndex: 3, position: "relative" }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      backgroundColor: currentStep >= index ? "#00D4AA" : "#404040",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "16px",
                      transition: "all 0.4s ease",
                      boxShadow: currentStep >= index ? "0 4px 16px rgba(0, 212, 170, 0.3)" : "none"
                    }}
                  >
                    {currentStep > index ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : currentStep === index ? (
                      <div style={{ color: currentStep >= index ? "#000000" : "#999" }}>
                        {step.icon}
                      </div>
                    ) : (
                      <span style={{ 
                        color: "#999", 
                        fontSize: "18px", 
                        fontWeight: "700" 
                      }}>
                        {index + 1}
                      </span>
                    )}
                  </div>
                  <span
                    style={{
                      color: currentStep >= index ? "#00D4AA" : "#999",
                      fontSize: "14px",
                      fontWeight: "500",
                      textAlign: "center",
                      whiteSpace: "nowrap"
                    }}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: "0 0 60px 0" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 col-xl-8">
              <div
                style={{
                  backgroundColor: "#1A1A1A",
                  borderRadius: "20px",
                  border: "1px solid #404040",
                  padding: "48px",
                  margin: "0 20px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
                }}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  {renderStepContent()}
                  
                  {/* Navigation Buttons */}
                  <div className="d-flex justify-content-between align-items-center mt-5 pt-4">
                    <button
                      type="button"
                      className="btn d-flex align-items-center gap-2"
                      onClick={handleBack}
                      disabled={currentStep === 0}
                      style={{
                        backgroundColor: "transparent",
                        border: "1px solid #404040",
                        borderRadius: "12px",
                        color: currentStep === 0 ? "#666" : "#999",
                        padding: "14px 28px",
                        fontSize: "14px",
                        fontWeight: "500",
                        cursor: currentStep === 0 ? "not-allowed" : "pointer",
                        opacity: currentStep === 0 ? 0.5 : 1,
                        transition: "all 0.2s ease"
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15,18 9,12 15,6"/>
                      </svg>
                      Back
                    </button>
                    
                    {currentStep < steps.length - 1 ? (
                      <button
                        type="button"
                        className="btn d-flex align-items-center gap-2"
                        onClick={handleNext}
                        style={{
                          backgroundColor: "#00D4AA",
                          border: "none",
                          borderRadius: "12px",
                          color: "#000000",
                          padding: "14px 28px",
                          fontSize: "14px",
                          fontWeight: "600",
                          boxShadow: "0 4px 16px rgba(0, 212, 170, 0.4)",
                          transition: "all 0.2s ease"
                        }}
                      >
                        Next
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="9,18 15,12 9,6"/>
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isFormSubmitted}
                        className="btn d-flex align-items-center gap-2"
                        style={{
                          backgroundColor: "#00D4AA",
                          border: "none",
                          borderRadius: "12px",
                          color: "#000000",
                          padding: "14px 28px",
                          fontSize: "14px",
                          fontWeight: "600",
                          boxShadow: "0 4px 16px rgba(0, 212, 170, 0.4)",
                          opacity: isFormSubmitted ? 0.7 : 1,
                          transition: "all 0.2s ease"
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
  );
};

export default FormTask;