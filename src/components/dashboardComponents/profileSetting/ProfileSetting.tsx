"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { RootState, useAppDispatch } from "@/store/Store";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { uploadFileToS3 } from "@/services/uploadFileToS3/uploadFileToS3";
import FileUpload from "@/components/common/upload/FileUpload";
import { requests } from "@/services/requests/requests";
import apiCall from "@/services/apiCall/apiCall";
import PromotedModal from "../PromotedModal";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { z } from "zod";
import { editProfileSchema } from "@/schemas/editProfile-schema/editProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import CreatableSelect from "react-select/creatable";
import { dataForServer } from "@/models/editProfileModel/editProfileModel";
import { toast } from "react-toastify";
import { setUser } from "@/reducers/UserSlice";
import dynamic from "next/dynamic";
import Address from "@/components/common/Address/Address";
import ConnectStripeBtn from "@/components/common/connectStripeBtn/ConnectStripeBtn";
import { isValidLatLng } from "@/services/utils/util";
import PhoneInputComponent from "@/components/common/PhoneInput/PhoneInput";
import InnerCard from "./InnerCard";
import { useDeleteUser, useFetchUserInfo } from "@/hooks/users/useUsers";
import { useAddSkill, useFetchSkills } from "@/hooks/skills/useSkills";
import { useGenerateBio } from "@/hooks/ai/useGenerateBio";
import {
  Add01Icon,
  ArrowRight02Icon,
  Calendar03Icon,
  Camera01Icon,
  Cancel01Icon,
  Delete03Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { GenerateAIButton } from "@/components/common/generateAIButton/GenerateAIButton";
import GlobalLoader from "@/components/common/GlobalLoader/GlobalLoader";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import { clearToken, saveToken, setAuthState } from "@/reducers/AuthSlice";
import { setThread } from "@/reducers/ThreadSlice";
import { useQueryClient } from "@tanstack/react-query";
const QuillEditor = dynamic(
  () => import("@/components/common/TextEditor/TextEditor"),
  { ssr: false }
);

const ProfileSetting = () => {
  type FormSchematype = z.infer<typeof editProfileSchema>;
  const [skills, setSkills] = useState<any>([]);
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [countries, setCountries] = useState<any>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any>({});
  const dispatch = useAppDispatch();

  const isAuth = useSelector((state: RootState) => state.auth.isAuthenticated);
  let user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [wordCount, setWordCount] = useState(0);
  const isOrganization = user?.userType === "ORGANIZATION" ? true : false;

  const [editorTxt, setEditorTxt] = useState("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredSkills, setFilteredSkills] = useState<any[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [promotionResponse, setPromotionResponse] = useState<any>(null);
  const profileImageInputRef = useRef<HTMLInputElement | null>(null);
  const [isProfileImageCleared, setIsProfileImageCleared] =
    useState<boolean>(false);
  const [isProfileImageUploading, setIsProfileImageUploading] =
    useState<boolean>(false);

  const fetchUserDetails = useFetchUserInfo({ enabled: isAuth });
  const fetchSkills = useFetchSkills();
  const addSkillMutation = useAddSkill();
  const generateBioMutation = useGenerateBio();

  const [deleteModal, setDeleteModal] = useState(false);
  const deleteUserMutation = useDeleteUser();
  const queryClient = useQueryClient();

  const handleProfilePick = () => profileImageInputRef.current?.click();
  const handleProfileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsProfileImageCleared(false);
    try {
      setIsProfileImageUploading(true);
      await handleFileSelect(files as File[], files, () => {});
    } finally {
      setIsProfileImageUploading(false);
    }
  };
  const handleProfileRemove = () => {
    setDocuments({});
    setValue("profilePicture", {});
    setIsProfileImageCleared(true);
  };
  const getUserDetails = async () => {
    const newData = await fetchUserDetails.refetch();
    if (newData.isSuccess && newData.data) {
      dispatch(setUser(newData.data));
    }
  };

  useEffect(() => {
    if (isValidLatLng(user?.address?.latitude, user?.address?.longitude)) {
      setCurrentLocation({
        latitude: Number(user.address.latitude),
        longitude: Number(user.address.longitude),
      });
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          setLocationError(
            "Unable to retrieve your location. Please allow access."
          );
        }
      );
    } else {
      setLocationError("Geolocation is not supported.");
    }
  }, []);

  const formatedDate = (date: string) => {
    const formattedDate = new Date(date).toISOString().split("T")[0];
    return formattedDate;
  };
  const handleclose = () => {
    setShowModal(false);
  };

  useEffect(() => {
    getAllSkills(null);
    if (user?.profilePicture) {
      setValue("profilePicture", user?.profilePicture);
      setDocuments(user?.profilePicture);
    }

    // getCountries();
    // getStates(user?.address?.countryId, user?.address?.stateId);
    // getCities(user?.address?.stateId, user?.address?.cityId);
    if (user?.about) {
      setEditorTxt(user.about);
    }

    setCurrentLocation({
      latitude: Number(user?.address?.latitude || 24.99816),
      longitude: Number(user?.address?.longitude || 56.27207),
    });
    setValue("longitude", user?.address?.longitude || "56.27207");
    setValue("latitude", user?.address?.latitude || "24.99816");
  }, [user]);

  useEffect(() => {
    if (user?.skills?.length > 0 && skills?.length > 0) {
      const preSelectedSkills = skills.filter(
        (skill: any) =>
          user?.skills?.some((uSkill: any) => uSkill?.skillId === skill.value) // Match skillId with value
      );
      setValue("skills", preSelectedSkills); // Set pre-selected skills to the form
    }
  }, [skills, user?.skills]);

  const {
    register,
    setValue,
    getValues,
    setError,
    watch,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormSchematype>({
    defaultValues: {
      firstName: user?.firstName,
      lastName: user?.lastName,
      mobile: user?.mobile || "",
      organizationName: user?.organizationName || "",
      organizationType: user?.organizationType || "",
      email: user?.email,
      title: user?.title || "",
      about: user?.about,
      education:
        user?.education?.length > 0
          ? user.education?.map((edu: any) => ({
              institution: edu.institution || "",
              degree: edu.degree || "",
              date: formatedDate(edu.date) || "",
              id: edu.id || "",
            }))
          : "",
      experience:
        user?.experience?.length > 0
          ? user?.experience?.map((exp: any) => ({
              companyName: exp.companyName || "",
              role: exp.role || "",
              startDate: formatedDate(exp.startDate) || "",
              endDate: exp.isPresent ? "" : formatedDate(exp.endDate) || "",
              description: exp.description || "",
              isPresent: exp.isPresent,
              id: exp.id || "",
            }))
          : "",
      educationIdsToDelete: [],
      experienceIdsToDelete: [],
      disabilityDetail: user?.disabilityDetail || "",
      // profileType: user?.profile?.length > 0 && user?.profile[0]?.type,
      userType: user?.userType,
      skills: user?.skills || [],
      disability: user?.disability,
      skillsIdsToDelete: [],
      isPromoted:
        user?.profile?.length > 0 && user?.profile[0]?.promoted
          ? "true"
          : "false",
      city: user?.address?.cityName || "",
      state: user?.address?.stateName || "",
      country: user?.address?.countryName || "",
      address: user?.address?.address || "",
      longitude: user?.address?.logitude,
      latitude: user?.address?.latitude,
      zip: user?.address?.zip || "",
    },
    resolver: zodResolver(editProfileSchema),
    mode: "all",
  });

  useEffect(() => {
    if (!user) return;
    //   setValue("firstName", user?.firstName);
    //   setValue("lastName", user?.lastName);
    //   setValue("mobile", user?.mobile || "");
    //   setValue("organizationName", user?.organizationName || "");
    //   setValue("organizationType", user?.organizationType || "");
    //   setValue("email", user?.email);
    //   setValue("title", user?.title || "");
    //   setValue("about", user?.about || "");

    //   // Set editor text when user about is available
    //   if (user?.about) {
    //     setEditorTxt(user.about);
    //   }

    //   setValue(
    //     "education",
    //     user?.education?.length > 0
    //       ? user.education.map((edu: any) => ({
    //           institution: edu.institution || "",
    //           degree: edu.degree || "",
    //           date: formatedDate(edu.date) || "",
    //           id: edu.id || "",
    //         }))
    //       : []
    //   );
    //   setValue(
    //     "experience",
    //     user?.experience?.length > 0
    //       ? user.experience.map((exp: any) => ({
    //           companyName: exp.companyName || "",
    //           role: exp.role || "",
    //           startDate: formatedDate(exp.startDate) || "",
    //           endDate: exp.isPresent ? "" : formatedDate(exp.endDate) || "",
    //           description: exp.description || "",
    //           isPresent: exp.isPresent,
    //           id: exp.id || "",
    //         }))
    //       : []
    //   );
    //   setValue("disabilityDetail", user?.disabilityDetail || "");
    //   setValue("userType", user?.userType);

    //   // Only set skills if both user skills and available skills are present
    //   if (user?.skills?.length > 0 && skills?.length > 0) {
    //     const preSelectedSkills = skills.filter((skill: any) =>
    //       user?.skills?.some((uSkill: any) => uSkill?.skillId === skill.value)
    //     );
    //     setValue("skills", preSelectedSkills);
    //   } else {
    //     setValue("skills", []);
    //   }

    //   setValue("disability", user?.disability);
    //   setValue(
    //     "isPromoted",
    //     user?.profile?.length > 0 && user?.profile[0]?.promoted ? "true" : "false"
    //   );

    // 🟢 Location fields
    if (user.address) {
      if (user.address.city) setValue("city", user.address.cityName);
      if (user.address.state) setValue("state", user.address.stateName);
      if (user.address.country) setValue("country", user.address.countryName);
      if (user.address.address) setValue("address", user.address.address);
      if (user.address.longitude && user.address.latitude) {
        setValue("longitude", String(user.address.longitude));
        setValue("latitude", String(user.address.latitude));
      }
      if (user.address.zip) setValue("zip", user.address.zip);
    }
  }, [user, skills, setValue]);

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education", // Field array name
  });

  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience", // Field array name
  });

  const {
    fields: skillsFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills", // Field array name
  });

  const handleFileSelect = async (
    files: File[],
    fileObjs: any[],
    onProgress: (progress: number) => void
  ): Promise<number[]> => {
    const uploadedFileIds = files
      ? await uploadFileToS3(files, fileObjs, onProgress, true)
      : 0;
    setDocuments(uploadedFileIds[0]);
    setValue("profilePicture", uploadedFileIds[0]);
    return uploadedFileIds;
  };

  const getAllSkills = async (name: any) => {
    const response = fetchSkills?.data || [];
    if (name?.length > 0) {
      const filteredSkills = response?.data?.skills?.filter((skill: any) =>
        name.includes(skill.name)
      );
      setValue(
        "skills",
        filteredSkills?.map((skill: any) => ({
          label: skill.name,
          value: skill.id,
        })) || []
      );
    }
    setSkills(
      response?.data?.skills?.map((skill: any) => ({
        label: skill.name,
        value: skill.id,
      })) || []
    );
  };

  const getCountries = async () => {
    await apiCall(requests.countries, {}, "get", false, null, null, null)
      .then(async (res: any) => {
        setCountries(res?.data);
        setTimeout(() => {
          if (user?.address?.countryId) {
            setValue("country", user?.address?.countryId?.toString());
          }
        }, 300);
      })
      .catch((err) => console.warn(err));
  };

  const getStates = async (countId: number | null, stateId: any) => {
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
          if (stateId) {
            setValue("state", String(user?.address?.stateId));
          }
        }, 300);
      })
      .catch((err) => console.warn(err));
  };
  const getCities = async (stateId: number | null, cityId: any) => {
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
          if (cityId) {
            setValue("city", String(user?.address?.cityId));
          }
        }, 300);
      })
      .catch((err) => console.warn(err));
  };

  const onSubmit: SubmitHandler<FormSchematype> = async (data: any) => {
    console.log(data);
    const formData = dataForServer(data);
    await apiCall(
      requests.editUser + user?.id,
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
              toast.error(msg ? msg : "Something went wrong, please try again")
            );
          } else {
            toast.error(
              message ? message : "Something went wrong, please try again"
            );
          }
        } else {
          if (user?.profile?.length > 0 && user?.profile[0]?.type === "TE") {
            getUserDetails();
            toast.success("Profile Updated Successfully");
            // setShowModal(true);
            return;
          } else {
            getUserDetails();
            toast.success("Profile Updated Successfully");
            // window.location.reload();
            router.push("/dashboard");
          }
        }
      })
      .catch((err) => {
        // setIsFormSubmitted(false)
        console.warn(err);
      });
  };

  const handlePromotionResponse = async (promoted: any) => {
    setShowModal(false);
    if (promoted) {
      setValue("isPromoted", "true");
      await getUserDetails();
      await onSubmit(getValues());
      // toast.success("Profile Updated Successfully");
    }
    // router.push("/dashboard");
  };

  const handleGenerateAI = async () => {
    setLoading(true);
    if (watch("title") === "") {
      setError("title", { message: "Please Enter the Title" });
      setLoading(false);
      return;
    }

    if (watch("title") !== "") {
      const response = await apiCall(
        requests.createBio,
        { prompt: `${watch("title")}` },
        "post",
        false,
        dispatch,
        null,
        null
      );
      if (response?.data) {
        if (response?.data?.coreSkills?.length > 0) {
          const addedSkills = await addSkillMutation.mutateAsync(
            response.data.coreSkills
          );

          if (addedSkills?.data) {
            await getAllSkills(null);
          }
        }
        if (response?.data?.professionalBio) {
          let words = response?.data?.professionalBio
            .trim()
            .split(/\s+/)
            .filter((word: any) => word.length > 0);
          if (words.length > 500) {
            words = words.slice(0, 500);
          }
          setWordCount(words.length);
          setEditorTxt(response?.data?.professionalBio || "");

          setValue("about", response?.data?.professionalBio || "");
        }
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    if (editorTxt !== undefined && editorTxt !== null) {
      setValue("about", editorTxt);
    }
  }, [editorTxt]);

  const handleEditorTxt = (value: any) => {
    setEditorTxt(value.replace(/<[^>]*>/g, "").trim() !== "" ? value : "");
    let words = value
      .trim()
      .split(/\s+/)
      .filter((word: string) => word.length > 0);

    if (words.length > 500) {
      words = words.slice(0, 500);
    }
    setWordCount(words.length);
  };

  // Search filter for skills
  useEffect(() => {
    if (searchTerm) {
      const filtered = skills.filter((skill: any) =>
        skill.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  }, [searchTerm, skills]);

  const profilePromote = () => {
    setShowModal(true);
  };

  const handleDiscard = () => {
    if (!user) return;

    // Reset form to original user data
    reset({
      firstName: user.firstName,
      lastName: user.lastName,
      mobile: user.mobile || "",
      organizationName: user.organizationName || "",
      organizationType: user.organizationType || "",
      email: user.email,
      title: user.title || "",
      about: user.about || "",
      education:
        user.education?.map((edu: any) => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          date: formatedDate(edu.date) || "",
          id: edu.id || "",
        })) || [],
      experience:
        user.experience?.map((exp: any) => ({
          companyName: exp.companyName || "",
          role: exp.role || "",
          startDate: formatedDate(exp.startDate) || "",
          endDate: exp.isPresent ? "" : formatedDate(exp.endDate) || "",
          description: exp.description || "",
          isPresent: exp.isPresent,
          id: exp.id || "",
        })) || [],
      disabilityDetail: user.disabilityDetail || "",
      userType: user.userType,
      skills: user.skills || [],
      disability: user.disability,
      isPromoted:
        user.profile?.length > 0 && user.profile[0]?.promoted
          ? "true"
          : "false",
      city: user.address?.cityName || "",
      state: user.address?.stateName || "",
      country: user.address?.countryName || "",
      address: user.address?.address || "",
      longitude: user.address?.longitude || "",
      latitude: user.address?.latitude || "",
      zip: user.address?.zip || "",
    });

    // 🟢 Reset editor text
    setEditorTxt(user.about || "");

    // 🟢 Reset profile image
    setDocuments(user.profilePicture || {});
    setIsProfileImageCleared(false);

    // 🟢 Reset search and skills
    setSearchTerm("");

    setFilteredSkills([]);
    toast.info("Changes discarded");
  };

  const handleDeleteAccount = async () => {
    if (user?.id) {
      try {
        await deleteUserMutation.mutateAsync(user.id, {
          onSuccess: (data) => {
            console.log(data);
            toast.success(data?.message ?? "Account deleted successfully.");
            dispatch(saveToken(null));
            dispatch(setAuthState(false));
            dispatch(setThread(null));
            dispatch(clearToken());
            dispatch(setUser(null));
            localStorage.removeItem("persist:root");
            localStorage.clear();
            queryClient.removeQueries({ queryKey: ["userinfo"] }); // Clear React Query cache
            router.replace("/");
          },
          onError: (error: any) => {
            const errorMessage = Array.isArray(error?.response?.data?.message)
              ? error?.response?.data?.message?.map((msg: any) => msg).join("")
              : error?.response?.data?.message || error?.message;
            toast.error(
              errorMessage || "Something went wrong while deleting account."
            );
          },
        });
      } catch (error: any) {
        const errorMessage = Array.isArray(error?.response?.data?.message)
          ? error?.response?.data?.message?.map((msg: any) => msg).join("")
          : error?.response?.data?.message || error?.message;
        toast.error(errorMessage);
      }
    }
  };
  console.log("errors", experienceFields, educationFields);
  return (
    <section className="addtask">
      <form
        className="card b1-bg border_black_300 pb-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h4 className="card-header text-light d-flex flex-column flex-md-row gap-2 justify-content-between py-3 border-0">
          Profile Settings
          {/* Buttons Section - Right */}
          <div className="d-flex flex-column align-items-end gap-2">
            <div className="d-flex gap-2">
              <button
                className="btn btn-danger rounded-lg minw_104 border-0 minw_inherit btn_padding_mobile"
                type="button"
                onClick={() => setDeleteModal(true)}
              >
                Delete Account
              </button>
              <button
                className="btn btn-dark rounded-lg minw_104 minw_inherit btn_padding_mobile"
                type="button"
                onClick={handleDiscard}
              >
                Discard
              </button>
              <button
                type="submit"
                className="btn rounded-lg bg_gradient minw_104 minw_inherit btn_padding_mobile"
              >
                Save
              </button>
            </div>
            {user?.profile?.length > 0 && (
              <div className="dropdown paymentinformation">
                <button
                  className="btn btn-sm border-0 bg-primary dropdown-toggle text-warning"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Stripe Account Info
                </button>
                <div className="dropdown-menu profile-settings bg-dark">
                  <div className="dropdown-item">
                    <ConnectStripeBtn isSetting={true} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </h4>
        <div className="profile_setting_form maxw_888 m-auto w-100 px-3">
          {user?.profile?.length > 0 && user?.profile[0]?.type === "TE" && (
            <div className="ms-auto w-100 text-end mb-3">
              <div
                className="text-end text_gradient d-flex align-items-center gap-2 justify-content-end cursor"
                onClick={profilePromote}
              >
                Promote Profile{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="12"
                  viewBox="0 0 18 12"
                  fill="none"
                >
                  <path
                    d="M16.0078 6L1.00781 6"
                    stroke="url(#paint0_linear_1166_8968)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M12.0078 1L16.3007 5.29289C16.634 5.62623 16.8007 5.79289 16.8007 6C16.8007 6.20711 16.634 6.37377 16.3007 6.70711L12.0078 11"
                    stroke="url(#paint1_linear_1166_8968)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <defs>
                    <linearGradient
                      id="paint0_linear_1166_8968"
                      x1="16.0078"
                      y1="6.5"
                      x2="1.00781"
                      y2="6.5"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#7ADBFF" />
                      <stop offset="0.942308" stop-color="#C9C3FD" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_1166_8968"
                      x1="17.0078"
                      y1="6"
                      x2="12.0078"
                      y2="6"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stop-color="#7ADBFF" />
                      <stop offset="0.942308" stop-color="#C9C3FD" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          )}

          <div className="accordion" id="accordionPanelsStayOpenExample">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  Personal Information
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseOne"
                className="accordion-collapse collapse show"
              >
                <div className="accordion-body">
                  <div className="">
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{ marginBottom: "50px" }}
                    >
                      {/* Profile Image Section - Left Center */}
                      <div className="d-flex align-items-center m-auto flex-column">
                        <div className="text-center">
                          <input
                            ref={profileImageInputRef}
                            type="file"
                            accept="image/*"
                            className="d-none"
                            onChange={handleProfileChange}
                          />
                          <div
                            className="d-flex align-items-center gap-4 position-relative"
                            style={{
                              width: "70px",
                              height: "70px",
                              backgroundColor: "#000",
                              borderRadius: "100%",
                              justifyContent: "center",
                            }}
                          >
                            {isProfileImageUploading ? (
                              <div className="d-flex align-items-center justify-content-center rounded-circle">
                                <div
                                  className="spinner-border text-light"
                                  style={{
                                    width: "1.75rem",
                                    height: "1.75rem",
                                  }}
                                  role="status"
                                >
                                  <span className="visually-hidden">
                                    Loading...
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <Image
                                src={
                                  (isProfileImageCleared
                                    ? "/assets/images/default-user.[png]"
                                    : documents?.fileUrl ||
                                      user?.profilePicture?.fileUrl ||
                                      "/assets/images/default-user.png") as string
                                }
                                alt="Profile preview"
                                width={70}
                                height={70}
                                className="img-round"
                                style={{ borderRadius: 100 }}
                              />
                            )}
                            <div className="d-flex gap-2 position-absolute bottom-0">
                              <button
                                type="button"
                                className="btn btn-dark border-0 shadow-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
                                style={{
                                  minWidth: 16,
                                  height: 16,
                                  lineHeight: 0,
                                  background:
                                    "linear-gradient(90deg, rgb(106, 90, 249) 0%, rgb(0, 194, 255) 100%)",
                                }}
                                onClick={handleProfilePick}
                                disabled={isProfileImageUploading}
                                title="Change image"
                              >
                                <HugeiconsIcon icon={Camera01Icon} size={12} />
                              </button>
                              {!isProfileImageCleared &&
                                (documents?.fileUrl ||
                                  user?.profilePicture?.fileUrl) && (
                                  <button
                                    type="button"
                                    className="btn btn-danger border-0 shadow-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
                                    style={{
                                      minWidth: 16,
                                      height: 16,
                                      lineHeight: 0,
                                    }}
                                    onClick={handleProfileRemove}
                                    disabled={isProfileImageUploading}
                                    title="Remove image"
                                  >
                                    {/* <Icon
                                      icon="mdi:trash-can-outline"
                                      width={16}
                                      height={16}
                                    /> */}
                                    <HugeiconsIcon
                                      icon={Delete03Icon}
                                      size={12}
                                    />
                                  </button>
                                )}
                            </div>
                          </div>
                        </div>
                        <span className="mt-2 text-white">
                          Upload profile picture
                        </span>
                      </div>
                    </div>

                    <div className="">
                      {isOrganization && (
                        <div className="mb-3">
                          <label
                            htmlFor="exampleFormControlInput1"
                            className="form-label text-light fs-12"
                          >
                            Organization Name{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <input
                            {...register("organizationName")}
                            type="text"
                            className="form-control  bg-light invert text-dark border-0"
                            id="exampleFormControlInput1"
                            placeholder="Organization Name"
                          />
                          {errors.organizationName && (
                            <div className="text-danger pt-2">
                              {errors.organizationName.message}
                            </div>
                          )}
                        </div>
                      )}
                      {isOrganization && (
                        <div className="mb-3">
                          <label
                            htmlFor="organizationType"
                            className="form-label text-light fs-12 "
                          >
                            Organization Type{" "}
                            <span style={{ color: "red" }}>*</span>
                          </label>
                          <select
                            {...register("organizationType")}
                            className="form-select bg-light invert"
                            id="taskDropdown"
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Organization Type{" "}
                            </option>
                            <option value="COMPANY">Company</option>
                            <option value="GOVERNMENT">Government</option>
                            <option value="NON_PROFIT">
                              Non-Profit Organization
                            </option>
                          </select>
                          {errors.organizationType && (
                            <div className="text-danger pt-2">
                              {errors.organizationType.message}
                            </div>
                          )}
                        </div>
                      )}
                      <div className="row g-3">
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              {...register("firstName")}
                              type="text"
                              className="form-control text-white-50 bg-transparent border borderlightgray"
                              id="exampleFormControlInput1"
                              placeholder="First Name"
                            />
                            <label htmlFor="firstName" className="">
                              First Name <span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                          {errors.firstName && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.firstName.message}
                            </div>
                          )}
                        </div>
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              {...register("lastName")}
                              type="text"
                              className="form-control text-white-50 bg-transparent border borderlightgray"
                              id="exampleFormControlInput1"
                              placeholder="Last Name"
                            />
                            <label htmlFor="lastName">
                              last Name <span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                          {errors.lastName && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.lastName.message}
                            </div>
                          )}
                        </div>
                        <div className="col-12">
                          <div className="form-floating">
                            <input
                              {...register("title")}
                              type="text"
                              className="form-control text-white-50 bg-transparent border borderlightgray"
                              id="exampleFormControlInput1"
                              placeholder="Title"
                            />
                            <label htmlFor="title">
                              Profile Title :{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                          {errors.title && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.title.message}
                            </div>
                          )}
                        </div>
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              type="text"
                              className="form-control text-white-50 bg-transparent border borderlightgray"
                              id="exampleFormControlInput1"
                              placeholder="Email"
                              readOnly
                              value={user?.email}
                            />
                            <label htmlFor="email">
                              Email Address{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                          {errors.email && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.email.message}
                            </div>
                          )}
                        </div>
                        <div className="col-6">
                          <div className="form-floating">
                            <PhoneInputComponent
                              value={watch("mobile")}
                              onChange={(value) =>
                                setValue("mobile", value || "")
                              }
                              label="Mobile Number"
                              placeholder="Enter phone number"
                              error={errors.mobile?.message}
                            />
                            <label htmlFor="mobile">
                              Phone Number{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div
                            className=""
                            style={{
                              border: "solid 1px #8a8a8a",
                              borderRadius: 4,
                              padding: 10,
                            }}
                          >
                            <label className="form-label text-light fs-12">
                              About <span style={{ color: "red" }}>*</span>
                            </label>

                            <QuillEditor
                              className=" bg-white text-white invert border-0"
                              style={{ height: "150px" }}
                              placeholder="About"
                              value={editorTxt}
                              setValue={handleEditorTxt}
                            />
                            <div className="d-flex justify-content-between align-items-center mt-1">
                              <p className="invert text-dark m-0">
                                {wordCount}/200 words
                              </p>
                              <GenerateAIButton
                                handleClick={handleGenerateAI}
                                disabled={loading}
                                info={
                                  "About us will be generate based on the Profile Title"
                                }
                              />
                            </div>
                            {errors.about && (
                              <div
                                className="text-danger mt-1"
                                style={{ fontSize: "12px" }}
                              >
                                {errors.about.message}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseTwo"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseTwo"
                >
                  Education & Certifications
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseTwo"
                className="accordion-collapse collapse show"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-12 text-end">
                      <button
                        type="button"
                        className="btn rounded-lg bg_gradient minw_104"
                        onClick={() => {
                          appendEducation({
                            institution: "",
                            degree: "",
                            date: "",
                          });
                        }}
                      >
                        <HugeiconsIcon icon={Add01Icon} /> Add
                      </button>
                    </div>
                    {/* {errors.education && (
                      <div className="text-danger">{errors?.education?.message}</div>
                    )} */}
                    {educationFields.map((field, index) => (
                      <React.Fragment key={field.id ?? index}>
                        <div className="col-12">
                          <div className="form-floating">
                            <input
                              {...register(
                                `education.${index}.institution` as const
                              )}
                              type="text"
                              className="form-control text-white-50 bg-transparent border borderlightgray"
                              placeholder="Enter Institution"
                            />
                            <label
                              htmlFor={`education.${index}.institution`}
                              className=""
                            >
                              Institution<span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                          {errors.education?.[index]?.institution && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.education[index]?.institution?.message}
                            </div>
                          )}
                        </div>
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              {...register(
                                `education.${index}.degree` as const
                              )}
                              type="text"
                              className="form-control text-white-50 bg-transparent border borderlightgray"
                              placeholder="Enter Degree"
                            />
                            <label
                              htmlFor={`education.${index}.degree`}
                              className=""
                            >
                              Degree<span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                          {errors.education?.[index]?.degree && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.education[index]?.degree?.message}
                            </div>
                          )}
                        </div>
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              {...register(`education.${index}.date` as const)}
                              type="date"
                              className="form-control text-white-50 bg-transparent border borderlightgray position-relative"
                              placeholder="Enter Date"
                            />
                            {/* <HugeiconsIcon
                              icon={Calendar03Icon}
                              size={20}
                              className="position-absolute top-50 translate-middle-y text-placeholder me-2 text-white-50"
                            /> */}
                            <label
                              htmlFor={`education.${index}.date`}
                              className=""
                            >
                              Date<span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                          {errors.education?.[index]?.date && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.education[index]?.date?.message}
                            </div>
                          )}
                        </div>
                        <div className="col-12 text-end">
                          <button
                            type="button"
                            className="btn btn-sm fs-12 rounded-lg bg-gradient-danger text-white border-0"
                            onClick={() => {
                              const fieldId = getValues(
                                `education.${index}.id`
                              );
                              if (fieldId) {
                                // Existing item: add to delete list
                                setValue("educationIdsToDelete", [
                                  ...(getValues("educationIdsToDelete") || []),
                                  fieldId,
                                ]);
                              }
                              // Remove from array regardless
                              removeEducation(index);
                            }}
                          >
                            <HugeiconsIcon icon={Cancel01Icon} size={12} />{" "}
                            Remove
                          </button>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseThree"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseThree"
                >
                  Experience
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseThree"
                className="accordion-collapse collapse show"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-12 text-end">
                      <button
                        type="button"
                        className="btn rounded-lg bg_gradient minw_104"
                        onClick={() =>
                          appendExperience({
                            role: "",
                            companyName: "",
                            startDate: "",
                            endDate: "",
                            description: "",
                            isPresent: false,
                          })
                        }
                      >
                        <HugeiconsIcon icon={Add01Icon} /> Add
                      </button>
                    </div>
                    {/* {errors.experience && (
                      <div className="text-danger">{errors.experience?.message}</div>
                    )} */}
                    {experienceFields.map((field, index) => (
                      <React.Fragment key={field.id ?? index}>
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              {...register(`experience.${index}.role` as const)}
                              type="text"
                              className="form-control text-white-50 bg-transparent border borderlightgray"
                              placeholder="Enter Job Title"
                            />
                            <label
                              htmlFor={`experience.${index}.role`}
                              className=""
                            >
                              Job Title<span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                          {errors.experience?.[index]?.role && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.experience[index]?.role?.message}
                            </div>
                          )}
                        </div>
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              {...register(
                                `experience.${index}.companyName` as const
                              )}
                              type="text"
                              className="form-control text-white-50 bg-transparent border borderlightgray"
                              placeholder="Enter Company Name"
                            />
                            <label
                              htmlFor={`experience.${index}.companyName`}
                              className=""
                            >
                              Company Name
                              <span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                          {errors.experience?.[index]?.companyName && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.experience[index]?.companyName?.message}
                            </div>
                          )}
                        </div>

                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              {...register(
                                `experience.${index}.startDate` as const
                              )}
                              type="date"
                              className="form-control text-white-50 bg-transparent border borderlightgray"
                              placeholder="Enter Start Date"
                            />
                            {/* <HugeiconsIcon
                              icon={Calendar03Icon}
                              size={20}
                              className="position-absolute top-50 translate-middle-y text-placeholder me-2 text-white-50"
                            /> */}
                            <label
                              htmlFor={`experience.${index}.startDate`}
                              className=""
                            >
                              Start Date<span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                          {errors.experience?.[index]?.startDate && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.experience[index]?.startDate?.message}
                            </div>
                          )}
                        </div>
                        <div className="col-6">
                          <div className="form-floating">
                            <input
                              {...register(
                                `experience.${index}.endDate` as const
                              )}
                              type="date"
                              className="form-control text-white-50 bg-transparent border borderlightgray"
                              placeholder="Enter End Date"
                            />
                            {/* <HugeiconsIcon
                              icon={Calendar03Icon}
                              size={20}
                              className="position-absolute top-50 translate-middle-y text-placeholder me-2 text-white-50"
                            /> */}
                            <label
                              htmlFor={`experience.${index}.endDate`}
                              className=""
                            >
                              End Date<span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                          {errors.experience?.[index]?.endDate && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.experience[index]?.endDate?.message}
                            </div>
                          )}
                          <div className="form-check mt-1 text-light fs-12 justify-content-end ">
                            <input
                              {...register(
                                `experience.${index}.isPresent` as const
                              )}
                              className="form-check-input bg-transparent border-light"
                              type="checkbox"
                              value=""
                              id={`experience.${index}.isPresent`}
                              size={16}
                            />
                            <label
                              className="form-check-label text-white fw-normal"
                              htmlFor={`experience.${index}.isPresent`}
                            >
                              <small>Present</small>
                            </label>
                          </div>
                        </div>
                        <div className="col-12">
                          <div className="form-floating">
                            <textarea
                              {...register(
                                `experience.${index}.description` as const
                              )}
                              className="form-control text-white-50 bg-transparent border borderlightgray"
                              placeholder="Leave a comment here"
                              id="floatingTextarea"
                              style={{ height: "100px" }}
                            ></textarea>
                            <label
                              htmlFor={`experience.${index}.description`}
                              className=""
                              style={{ height: "40px" }}
                            >
                              Description{" "}
                              <span style={{ color: "red" }}>*</span>
                            </label>
                          </div>
                          {/* <div className="col-12 text-end mt-0">
                            <GenerateAIButton
                              handleClick={handleGenerateAI}
                              disabled={loading}
                            />
                          </div> */}
                          {errors.experience?.[index]?.description && (
                            <div
                              className="text-danger mt-1"
                              style={{ fontSize: "12px" }}
                            >
                              {errors.experience[index]?.description?.message}
                            </div>
                          )}
                        </div>
                        <div className="col-12 text-end">
                          <button
                            type="button"
                            // className="btn rounded-lg bg-gradient-danger text-white border-0 minw_104"
                            className="btn btn-sm fs-12 rounded-lg bg-gradient-danger text-white border-0"
                            onClick={() => {
                              const fieldId = getValues(
                                `experience.${index}.id`
                              );
                              console.log("fieldId", fieldId);
                              if (fieldId) {
                                // Existing item: add to delete list
                                setValue("experienceIdsToDelete", [
                                  ...(getValues("experienceIdsToDelete") || []),
                                  fieldId,
                                ]);
                              }
                              // Remove from array regardless
                              removeExperience(index);
                            }}
                          >
                            <HugeiconsIcon icon={Cancel01Icon} size={12} />{" "}
                            Remove
                          </button>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseFour"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseFour"
                >
                  Skills
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseFour"
                className="accordion-collapse collapse show"
              >
                <div className="accordion-body">
                  <div className="row g-3">
                    <div className="col-12">
                      <div className="skilltags mb-3">
                        {skillsFields.map((field, index) => (
                          <div key={field.id} className="tag">
                            <small>{field.label}</small>{" "}
                            <HugeiconsIcon
                              icon={Cancel01Icon}
                              size={10}
                              onClick={() => {
                                const fieldValue = field.value;
                                if (fieldValue && fieldValue > 0) {
                                  setValue("skillsIdsToDelete", [
                                    ...(getValues("skillsIdsToDelete") || []),
                                    fieldValue,
                                  ]);
                                }
                                removeSkill(index);
                              }}
                              className="cursor-pointer" // Add style for clickable
                            />
                          </div>
                        ))}
                      </div>
                      <div className="form-floating position-relative">
                        <input
                          type="text"
                          className="form-control text-white-50 bg-transparent border borderlightgray"
                          placeholder="Search and add skills..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        {filteredSkills.length > 0 && (
                          <div
                            className="position-absolute w-100 bg-dark border borderlightgray mt-1 z-1"
                            style={{ maxHeight: "200px", overflowY: "auto" }}
                          >
                            <ul className="list-unstyled m-0 p-2">
                              {filteredSkills.map((skill: any) => (
                                <li
                                  key={skill.value}
                                  className="p-2 hover-bg-light cursor-pointer text-white-50"
                                  onClick={() => {
                                    // Check if already added
                                    const isDuplicate = skillsFields.some(
                                      (f, idx) =>
                                        getValues(`skills.${idx}.value`) ===
                                        skill.value
                                    );
                                    if (!isDuplicate) {
                                      appendSkill({
                                        value: skill.value,
                                        label: skill.label,
                                      });
                                    }
                                    setSearchTerm("");
                                    setFilteredSkills([]);
                                  }}
                                >
                                  {skill.label}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <label htmlFor="firstName" className="">
                          Skills<span style={{ color: "red" }}>*</span>
                        </label>
                      </div>
                      {errors.skills && !skillsFields.length && (
                        <div className="text-danger pt-2">
                          {errors.skills.message ||
                            "At least one skill is required"}
                        </div>
                      )}
                    </div>

                    <div className="col-12 text-end">
                      <button
                        type="button"
                        className="btn rounded-lg bg_gradient minw_104"
                        onClick={() => {
                          if (
                            searchTerm.trim() &&
                            !skillsFields.some(
                              (f) =>
                                f.label?.toLowerCase() ===
                                searchTerm.toLowerCase()
                            )
                          ) {
                            appendSkill({ label: searchTerm.trim(), value: 0 });
                            setSearchTerm("");
                          }
                        }}
                        disabled={!searchTerm.trim()}
                      >
                        <HugeiconsIcon icon={Add01Icon} /> Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseFive"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseFive"
                >
                  Others
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseFive"
                className="accordion-collapse collapse show"
              >
                <div className="accordion-body">
                  <div className="mb-3">
                    <div className="form-check mb-3 text-light fs-12">
                      <input
                        {...register("disability")}
                        className="form-check-input bg-transparent border-light"
                        type="checkbox"
                        value=""
                        id="isDisabled"
                      />
                      <label
                        className="form-check-label text-white fw-medium"
                        htmlFor="disability"
                      >
                        <span>
                          I declare that I am a person with disability
                        </span>
                      </label>
                    </div>
                  </div>
                  {watch("disability") && (
                    <div className="mb-3">
                      <div className="form-floating">
                        <input
                          {...register("disabilityDetail")}
                          type="text"
                          className="form-control text-white-50 bg-transparent border borderlightgray"
                          id="disabilityDetail"
                          placeholder="Please specify your disability"
                        />
                        <label htmlFor="disabilityDetail" className="">
                          Please specify your disability{" "}
                          <span style={{ color: "red" }}>*</span>
                        </label>
                      </div>
                      {errors.disabilityDetail && (
                        <div
                          className="text-danger mt-1"
                          style={{ fontSize: "12px" }}
                        >
                          {errors.disabilityDetail.message}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseSix"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseSix"
                >
                  Address
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseSix"
                className="accordion-collapse collapse show"
              >
                <div className="accordion-body">
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
              </div>
            </div>
          </div>
        </div>
        {loading && <GlobalLoader />}
        {showModal && (
          <PromotedModal
            show={showModal}
            handleClose={handleclose}
            handleResponse={handlePromotionResponse}
            title="Promote your profile"
            isPromote={user?.profile?.[0]?.promoted}
          >
            {!user?.profile?.[0]?.promoted && (
              <p>Please connect your account for 10$ per month</p>
            )}
          </PromotedModal>
        )}
        {deleteModal && (
          <DeleteConfirmationModal
            isOpen={deleteModal}
            onConfirm={handleDeleteAccount}
            onClose={() => setDeleteModal(false)}
            type="account"
          />
        )}
      </form>
    </section>
  );
};

export default ProfileSetting;
