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
import { useFetchUserInfo } from "@/hooks/users/useUsers";
import { useAddSkill, useFetchSkills } from "@/hooks/skills/useSkills";
import { useGenerateBio } from "@/hooks/ai/useGenerateBio";
const QuillEditor = dynamic(
  () => import("@/components/common/TextEditor/TextEditor"),
  { ssr: false }
);

const ProfileSetting = () => {
  type FormSchematype = z.infer<typeof editProfileSchema>;
  const [skills, setSkills] = useState<any>([]);
  const [educationIdsMap, setEducationIdsMap] = useState<{
    [key: number]: string;
  }>({});
  const [experienceIdsMap, setExperienceIdsMap] = useState<{
    [key: number]: string;
  }>({});
  const [states, setStates] = useState<any>([]);
  const [cities, setCities] = useState<any>([]);
  const [countries, setCountries] = useState<any>([]);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({ latitude: null, longitude: null });
  const [educationIdsToDelete, setEducationIdsToDelete] = useState<any>([]);
  const [experienceIdsToDelete, setExperienceIdsToDelete] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [skillsIdsToDelete, setSkillsIdsToDelete] = useState<any>([]);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any>({});
  const dispatch = useAppDispatch();
  let user = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const [wordCount, setWordCount] = useState(0);
  const isOrganization = user?.userType === "ORGANIZATION" ? true : false;

  const [editorTxt, setEditorTxt] = useState("");

  const [loading, setLoading] = useState<boolean>(false);
  const [promotionResponse, setPromotionResponse] = useState<any>(null);
  const profileImageInputRef = useRef<HTMLInputElement | null>(null);
  const [isProfileImageCleared, setIsProfileImageCleared] = useState<boolean>(false);
  const [isProfileImageUploading, setIsProfileImageUploading] = useState<boolean>(false);

  const fetchUserDetails = useFetchUserInfo();
  const fetchSkills = useFetchSkills();
  const addSkillMutation = useAddSkill()
  const generateBioMutation = useGenerateBio();

  const handleProfilePick = () => profileImageInputRef.current?.click();
  const handleProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if(fetchUserDetails.isSuccess && fetchUserDetails.data) {
      dispatch(setUser(fetchUserDetails.data));
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
          setLocationError("Unable to retrieve your location. Please allow access.");
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

    // if (user?.skills?.length > 0) {
    //     const preSelectedSkills = skills.filter((skill: any) =>
    //         user?.skills?.some((uSkill: any) => uSkill?.skillId === skill.value)  // Match skillId with value
    //     );
    //     setValue("skills", preSelectedSkills); // Set pre-selected skills to the form
    // }
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

  useEffect(() => {
    if (user?.education) {
      const map = user?.education.reduce(
        (acc: any, edu: any, index: number) => {
          acc[index] = edu.id;
          return acc;
        },
        {}
      );
      setEducationIdsMap(map);
    }

    if (user?.experience) {
      const tap = user?.experience.reduce(
        (acc: any, edu: any, index: number) => {
          acc[index] = edu.id;
          return acc;
        },
        {}
      );
      setExperienceIdsMap(tap);
    }
  }, [user?.education]);

  const {
    register,
    setValue,
    getValues,
    setError,
    watch,
    control,
    handleSubmit,
    formState: { errors },
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
      educationIdsToDelete: educationIdsToDelete,
      experienceIdsToDelete: [],
      disabilityDetail: user?.disabilityDetail || "",
      // profileType: user?.profile?.length > 0 && user?.profile[0]?.type,
      userType: user?.userType,
      skills: [],
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
    setValue("firstName", user?.firstName);
    setValue("lastName", user?.lastName);
    setValue("mobile", user?.mobile || "");
    setValue("organizationName", user?.organizationName || "");
    setValue("organizationType", user?.organizationType || "");
    setValue("email", user?.email);
    setValue("title", user?.title || "");
    setValue("about", user?.about || "");
    
    // Set editor text when user about is available
    if (user?.about) {
      setEditorTxt(user.about);
    }
    
    setValue("education", user?.education?.length > 0 ? user.education.map((edu: any) => ({
      institution: edu.institution || "",
      degree: edu.degree || "",
      date: formatedDate(edu.date) || "",
      id: edu.id || "",
    })) : []);
    setValue("experience", user?.experience?.length > 0 ? user.experience.map((exp: any) => ({
      companyName: exp.companyName || "",
      role: exp.role || "",
      startDate: formatedDate(exp.startDate) || "",
      endDate: exp.isPresent ? "" : formatedDate(exp.endDate) || "",
      description: exp.description || "",
      isPresent: exp.isPresent,
      id: exp.id || "",
    })) : []);
    setValue("disabilityDetail", user?.disabilityDetail || "");
    setValue("userType", user?.userType);
    
    // Only set skills if both user skills and available skills are present
    if (user?.skills?.length > 0 && skills?.length > 0) {
      const preSelectedSkills = skills.filter((skill: any) =>
        user?.skills?.some((uSkill: any) => uSkill?.skillId === skill.value)
      );
      setValue("skills", preSelectedSkills);
    } else {
      setValue("skills", []);
    }
    
    setValue("disability", user?.disability);
    setValue("isPromoted", user?.profile?.length > 0 && user?.profile[0]?.promoted ? "true" : "false");
    // setValue("city", user?.address?.cityId || "");
    // setValue("state", user?.address?.stateId || "");
    // setValue("country", user?.address?.countryId || "");
    // setValue("address", user?.address?.address || "");
    // setValue("longitude", user?.address?.longitude || "56.27207");
    // setValue("latitude", user?.address?.latitude || "24.99816");
    // setValue("zip", user?.address?.zip || "");

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

  const { fields, remove, prepend, append } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: experienceFields,
    remove: removeExperience,
    prepend: prependExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const handleFileSelect = async (
    files: File[],
    fileObjs: any[],
    onProgress: (progress: number) => void
  ): Promise<number[]> => {
    console.log('files', files)
    console.log('fileObjs', fileObjs)
    console.log('onProgress', onProgress)
    const uploadedFileIds = files
      ? await uploadFileToS3(files, fileObjs, onProgress, true)
      : 0;
    console.log('uploadedFileIds', uploadedFileIds)
    setDocuments(uploadedFileIds[0]);
    setValue("profilePicture", uploadedFileIds[0]);
    return uploadedFileIds;
  };

  const getAllSkills = async (name: any) => {  
    const response = fetchSkills?.data || [];
    if (name?.length > 0) {
      const filteredSkills = response?.data?.skills?.filter(
        (skill: any) => name.includes(skill.name)
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
            setShowModal(true);
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
    getUserDetails();
    toast.success("Profile Updated Successfully");
    router.push("/dashboard");
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
          const addedSkills = await addSkillMutation.mutateAsync(response.data.coreSkills);

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

  return (
    <section className="addtask">
      <div className="card">
        <div className="card-header bg-dark text-light">Profile Settings</div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="card-body bg-gray">
            <div className="container">
              <div className="d-flex justify-content-between align-items-center" style={{marginBottom: '50px'}}>
                {/* Profile Image Section - Left Center */}
                <div className="d-flex align-items-center" >
                  <div className="text-center">
                    <input
                      ref={profileImageInputRef}
                      type="file"
                      accept="image/*"
                      className="d-none"
                      onChange={handleProfileChange}
                    />
                    <div className="d-flex align-items-center gap-4">
                      {isProfileImageUploading ? (
                        <div className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: 120, height: 120, backgroundColor: '#2b2b2b', borderRadius: 100 }}>
                          <div className="spinner-border text-light" style={{ width: '1.75rem', height: '1.75rem' }} role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        <Image
                          src={
                            (
                              isProfileImageCleared
                                ? "/assets/images/default-user.jpg"
                                : (documents?.fileUrl || user?.profilePicture?.fileUrl || "/assets/images/default-user.jpg")
                            ) as string
                          }
                          alt="Profile preview"
                          width={120}
                          height={120}
                          className="img-round"
                          style={{ borderRadius: 100 }}
                        />
                      )}
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-dark border-0 shadow-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
                          style={{ minWidth:35, height: 32, lineHeight: 0, backgroundColor: "#2b2b2b"}}
                          onClick={handleProfilePick}
                          disabled={isProfileImageUploading}
                          title="Change image"
                        >
                          <Icon icon="mdi:pencil" width={16} height={16} />
                        </button>
                        {(!isProfileImageCleared && (documents?.fileUrl || user?.profilePicture?.fileUrl)) && (
                          <button
                            type="button"
                            className="btn btn-danger border-0 shadow-0 rounded-circle p-0 d-flex align-items-center justify-content-center"
                            style={{ minWidth:35, height: 32, lineHeight: 0 }}
                            onClick={handleProfileRemove}
                            disabled={isProfileImageUploading}
                            title="Remove image"
                          >
                            <Icon icon="mdi:trash-can-outline" width={16} height={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buttons Section - Right */}
                <div className="d-flex flex-column align-items-end gap-2">
                  <div className="d-flex gap-2">
                    <button
                      className="btn rounded-pill btn-outline-danger ls"
                      type="button"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="btn btn-info rounded-pill hero-btn"
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
              </div>
              <div className="row mb-4 pb-3">
                <div className="col-md-6 border-end">
                  <h5 className="mb-2 text-light pb-3">Personal Information</h5>
                  <div className="row">
                    <div className="col-12 ">
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
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label text-light fs-12"
                        >
                          First Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          {...register("firstName")}
                          type="text"
                          className="form-control  bg-light invert text-dark border-0"
                          id="exampleFormControlInput1"
                          placeholder="First Name"
                        />
                        {errors.firstName && (
                          <div className="text-danger pt-2">
                            {errors.firstName.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label text-light fs-12"
                        >
                          Last Name <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          {...register("lastName")}
                          type="text"
                          className="form-control  bg-light invert text-dark border-0"
                          id="exampleFormControlInput1"
                          placeholder="Last Name"
                        />
                        {errors.lastName && (
                          <div className="text-danger pt-2">
                            {errors.lastName.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label text-light fs-12"
                        >
                          Profile Title : <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          {...register("title")}
                          type="text"
                          className="form-control  bg-light invert text-dark border-0"
                          id="exampleFormControlInput1"
                          placeholder="Title"
                        />
                        {errors.title && (
                          <div className="text-danger pt-2">
                            {errors.title.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-light fs-12">
                          Email Address <span style={{ color: "red" }}>*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control  bg-light invert text-dark border-0"
                          id="exampleFormControlInput1"
                          placeholder="Email"
                          readOnly
                          value={user?.email}
                        />
                        {errors.email && (
                          <div className="text-danger pt-2">
                            {errors.email.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="exampleFormControlInput1"
                          className="form-label text-light fs-12"
                        >
                          Phone Number <span style={{ color: "red" }}>*</span>
                        </label>
                        <PhoneInputComponent
                          value={watch("mobile")}
                          onChange={(value) => setValue("mobile", value || "")}
                          label="Mobile Number"
                          placeholder="Enter phone number"
                          error={errors.mobile?.message}
                        />
                      </div>
                      <div className=" mb-3">
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
                        <div className="d-flex justify-content-between align-items-center mt-1 mb-3">
                          <p className="invert text-dark">{wordCount}/200 words</p>
                          <p
                            className="btn text-info btn-sm rounded-pill p-0"
                            onClick={handleGenerateAI}
                          >
                            Generate through AI
                          </p>
                        </div>
                        {errors.about && (
                          <div className="text-danger pt-2">
                            {errors.about.message}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>                               
                </div>
                <div className="col-md-6">
                  <h5 className="mb-2 text-light pb-3">Education & Experience</h5>
                  <div className="pb-3 mb-3">
                    <div className="experience-sec my-4 d-flex align-items-center justify-content-between">
                      <h3>Education & Certification</h3>
                      <Icon
                        icon="line-md:plus-square-filled"
                        width={28}
                        height={28}
                        onClick={() => {
                          prepend({ institution: "", degree: "", date: "" });
                          setEducationIdsMap((prevMap) => ({
                            [0]: Math.random().toString(36).substring(2),
                            ...Object.fromEntries(
                              Object.entries(prevMap).map(([k, v]) => [
                                parseInt(k) + 1,
                                v,
                              ])
                            ),
                          }));
                        }}
                        style={{ cursor: "pointer", color: "white" }}
                      />
                    </div>
                    {fields?.map((item: any, index: number) => (
                      <InnerCard 
                        key={item.id || index} 
                        onClick={() => {
                          remove(index);
                          const originalId = educationIdsMap[index];
                          setEducationIdsMap((prevMap) => {
                            const updatedMap = { ...prevMap };
                            delete updatedMap[index];
                            const newMap = Object.entries(updatedMap).reduce(
                              (acc: any, [k, v]) => {
                                acc[
                                  parseInt(k) - (parseInt(k) > index ? 1 : 0)
                                ] = v;
                                return acc;
                              },
                              {}
                            );
                            return newMap;
                          });
                          setEducationIdsToDelete((prev: any) => {
                            const updated =
                              typeof originalId === "number"
                                ? [...prev, originalId]
                                : [...prev];
                            setValue("educationIdsToDelete", updated);
                            return updated;
                          });
                        }} 
                      >
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label
                                htmlFor={`education.${index}.institution`}
                                className="form-label text-light fs-12"
                              >
                                Institution <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                {...register(`education.${index}.institution`)}
                                type="text"
                                className="form-control bg-light text-dark invert  border-0"
                                placeholder="Institution"
                              />
                              {errors.education?.[index]?.institution && (
                                <div className="text-danger pt-2">
                                  {errors.education?.[index]?.institution.message}
                                </div>
                              )}
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor={`education.${index}.date`}
                                className="form-label text-light fs-12"
                              >
                                Date <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                {...register(`education.${index}.date`)}
                                type="date"
                                onClick={(e) => {
                                  const input = e.currentTarget;
                                  input.showPicker?.();
                                }}
                                className="form-control text-dark invert border-0"
                                placeholder="28/03/2024"
                              />
                              {errors.education?.[index]?.date && (
                                <div className="text-danger pt-2">
                                  {errors.education?.[index]?.date.message}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label
                                htmlFor={`education.${index}.degree`}
                                className="form-label text-light fs-12"
                              >
                                Degree <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                {...register(`education.${index}.degree`)}
                                type="text"
                                className="form-control text-dark invert border-0"
                                placeholder="Degree"
                              />
                              {errors.education?.[index]?.degree && (
                                <div className="text-danger pt-2">
                                  {errors.education?.[index]?.degree.message}
                                </div>
                              )}
                            </div>
                            {/* <div
                              className="col-md-6 text-end"
                              style={{ marginTop: "2.15rem" }}
                            >
                              <Icon
                                icon="line-md:minus-square-filled"
                                width={28}
                                height={28}
                                onClick={(e) => {
                                  remove(index);
                                  const originalId = educationIdsMap[index];
                                  setEducationIdsMap((prevMap) => {
                                    const updatedMap = { ...prevMap };
                                    delete updatedMap[index];
                                    const newMap = Object.entries(updatedMap).reduce(
                                      (acc: any, [k, v]) => {
                                        acc[
                                          parseInt(k) - (parseInt(k) > index ? 1 : 0)
                                        ] = v;
                                        return acc;
                                      },
                                      {}
                                    );
                                    return newMap;
                                  });
                                  // if(typeof originalId === 'number'){
                                  //     setValue('educationIdsToDelete', [])
                                  // }
                                  setEducationIdsToDelete((prev: any) => {
                                    const updated =
                                      typeof originalId === "number"
                                        ? [...prev, originalId]
                                        : [...prev];
                                    setValue("educationIdsToDelete", updated);
                                    return updated;
                                  });
                                }}
                                style={{ cursor: "pointer", color: "white" }}
                              />
                            </div> */}
                          </div>
                        </div>
                      </InnerCard>
                    ))}
                  </div>
                  <div className="pb-3 mb-3">
                    <div className="experience-sec my-4 d-flex align-items-center justify-content-between" style={{borderBottom: 'none !important'}}>
                      <h3 className="mb-0">Experience</h3>
                      <Icon
                        icon="line-md:plus-square-filled"
                        width={28}
                        height={28}
                        onClick={() =>
                          prependExperience({
                            companyName: "",
                            role: "",
                            startDate: "",
                            endDate: "",
                            description: "",
                            id: 0,
                          })
                        }
                        style={{ cursor: "pointer", color: "white" }}
                      />
                    </div>
                    {experienceFields?.map((item: any, index: number) => (
                      <InnerCard 
                        key={item.id || index} 
                        onClick={() => {
                          removeExperience(index);
                          const originalId = experienceIdsMap[index];
                          setExperienceIdsMap((prevMap) => {
                            const updatedMap = { ...prevMap };
                            delete updatedMap[index];
                            const newMap = Object.entries(updatedMap).reduce(
                              (acc: any, [k, v]) => {
                                acc[parseInt(k) - (parseInt(k) > index ? 1 : 0)] =
                                  v;
                                return acc;
                              },
                              {}
                            );
                            return newMap;
                          });
                          setExperienceIdsToDelete((prev: any) => {
                            const updated =
                              typeof originalId === "number"
                                ? [...prev, originalId]
                                : [...prev];
                            setValue("experienceIdsToDelete", updated);
                            return updated;
                          });
                        }} 
                      >                        
                        <div className="row">
                          <div className="col-md-6">
                            <div className="mb-3">
                              <label
                                htmlFor={`experience.${index}.role`}
                                className="form-label text-light fs-12"
                              >
                                Job Title <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                {...register(`experience.${index}.role`)}
                                type="text"
                                className="form-control  bg-light invert text-dark  border-0"
                                id="exampleFormControlInput1"
                                placeholder="Job Title"
                              />
                              {errors.experience?.[index]?.role && (
                                <div className="text-danger pt-2">
                                  {errors.experience?.[index]?.role.message}
                                </div>
                              )}
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor={`experience.${index}.companyName`}
                                className="form-label text-light fs-12"
                              >
                                Company Name <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                {...register(`experience.${index}.companyName`)}
                                type="text"
                                className="form-control  bg-light invert text-dark  border-0"
                                id="exampleFormControlInput1"
                                placeholder="Company Name"
                              />
                              {errors.experience?.[index]?.companyName && (
                                <div className="text-danger pt-2">
                                  {errors.experience?.[index]?.companyName.message}
                                </div>
                              )}
                            </div>

                            <div className=" mb-3">
                              <label
                                htmlFor={`experience.${index}.description`}
                                className="form-label text-light fs-12"
                              >
                                Job Description <span style={{ color: "red" }}>*</span>
                              </label>
                              <textarea
                                {...register(`experience.${index}.description`)}
                                className="form-control  bg-light invert text-dark  border-0"
                                id="exampleFormControlTextarea1"
                                rows={3}
                                placeholder="Job Description"
                              ></textarea>
                              {errors.experience?.[index]?.description && (
                                <div className="text-danger pt-2">
                                  {errors.experience?.[index]?.description.message}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="col-md-6">
                            {/* <div className="mb-3">
                                                <label htmlFor="exampleFormControlInput1" className="form-label text-light fs-12">Employment type :</label>
                                                <select className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                    <option selected>Full-time</option>
                                                    <option value="1">Part-time</option>
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label text-light fs-12">Location type :</label>
                                                <select className="form-select bg-dark border-0 text-tertiary" aria-label="Default select example">
                                                    <option selected>On-site</option>
                                                    <option value="1">Remote</option>
                                                </select>
                                            </div> */}
                            <div className="mb-3">
                              <label
                                htmlFor={`experience.${index}.startDate`}
                                className="form-label text-light fs-12"
                              >
                                Start Date <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                {...register(`experience.${index}.startDate`)}
                                type="date"
                                onClick={(e) => {
                                  const input = e.currentTarget;
                                  input.showPicker?.();
                                }}
                                className="form-control  bg-light invert text-dark  border-0"
                                id="exampleFormControlInput1"
                                placeholder="Start Date"
                              />
                              {errors.experience?.[index]?.startDate && (
                                <div className="text-danger pt-2">
                                  {errors.experience?.[index]?.startDate.message}
                                </div>
                              )}
                            </div>
                            <div className="mb-3">
                              <label
                                htmlFor={`experience.${index}.endDate`}
                                className="form-label text-light fs-12"
                              >
                                End Date <span style={{ color: "red" }}>*</span>
                              </label>
                              <input
                                {...register(`experience.${index}.endDate`)}
                                type="date"
                                onClick={(e) => {
                                  const input = e.currentTarget;
                                  input.showPicker?.();
                                }}
                                className="form-control  bg-light invert text-dark  border-0"
                                id="exampleFormControlInput1"
                                min={watch(`experience.${index}.startDate`)}
                                onChange={(e) => {
                                  const isChecked = e.target.value;
                                  if (isChecked) {
                                    setValue(`experience.${index}.isPresent`, false);
                                  }
                                }}
                                placeholder="End Date"
                              />
                              {errors.experience?.[index]?.endDate && (
                                <div className="text-danger pt-2">
                                  {errors.experience?.[index]?.endDate.message}
                                </div>
                              )}
                              <div className="form-check d-flex align-items-center gap-1 mt-1">
                                <input
                                  {...register(`experience.${index}.isPresent`)}
                                  type="checkbox"
                                  className="form-check-input bg-transparent border-light me-2"
                                  id={`experience.${index}.isPresent`}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    if (isChecked) {
                                      setValue(`experience.${index}.endDate`, "");
                                    }
                                  }}
                                />
                                <label
                                  className="form-check-label text-light fs-12 "
                                  htmlFor={`experience.${index}.isPresent`}
                                >
                                  {" "}
                                  Present
                                </label>
                              </div>
                            </div>
                            {/* <Icon
                              icon="line-md:minus-square-filled"
                              width={28}
                              height={28}
                              onClick={() => {
                                removeExperience(index);
                                const originalId = experienceIdsMap[index];

                                setExperienceIdsMap((prevMap) => {
                                  const updatedMap = { ...prevMap };
                                  delete updatedMap[index];
                                  const newMap = Object.entries(updatedMap).reduce(
                                    (acc: any, [k, v]) => {
                                      acc[parseInt(k) - (parseInt(k) > index ? 1 : 0)] =
                                        v;
                                      return acc;
                                    },
                                    {}
                                  );
                                  return newMap;
                                });

                                // if(typeof originalId === 'number'){
                                //     setValue('educationIdsToDelete', [])
                                // }

                                setExperienceIdsToDelete((prev: any) => {
                                  const updated =
                                    typeof originalId === "number"
                                      ? [...prev, originalId]
                                      : [...prev];
                                  setValue("experienceIdsToDelete", updated);
                                  return updated;
                                });
                              }}
                              style={{ cursor: "pointer", color: "white" }}
                            /> */}
                          </div>
                        </div>
                      </InnerCard>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bordr mt-4"></div>
              <div className="experience-sec my-4">
                <h3>Other</h3>
              </div>
              <div className="row">
                <div className="col-md-6">
                  {/* {user?.profile?.length > 0 && user?.profile[0]?.type === 'TE' && <div className="mb-3">
                                        <label className='text-light fs-12 me-2'>Promotion :</label>
                                        <div className='d-flex align-items-center '>

                                            <div className="form-check me-3">
                                                <label className="form-check-label text-light fs-12" htmlFor="isPromoted">
                                                    <input {...register('isPromoted')} className="form-check-input" type="radio" value={'true'} name="isPromoted" id="isPromoted"
                                                    />
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="form-check me-3">
                                                <label className="form-check-label text-light fs-12" htmlFor="isPromoted">
                                                    <input {...register('isPromoted')} className="form-check-input text-dark" type="radio" value={'false'} name="isPromoted" id="isPromoted"
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>} */}

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
                        htmlFor="isDisabled"
                      >
                        I declare that I am a person with disability
                      </label>
                    </div>
                  </div>

                  {watch("disability") && (
                    <div>
                      <label
                        htmlFor="exampleFormControlInput1"
                        className="form-label text-light fs-12"
                      >
                        Disability Detail (Optional) :
                      </label>
                      <input
                        {...register("disabilityDetail")}
                        type="text"
                        className="form-control bg-light invert text-dark  border-0"
                        id="exampleFormControlInput1"
                        placeholder="Disability Detail (Optional)"
                      />
                    </div>
                  )}
                  <div className="mb-3">
                    {errors.disabilityDetail && (
                      <div className="text-danger pt-2">
                        {errors.disabilityDetail.message}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label text-light fs-12"
                    >
                      Skills <span style={{ color: "red" }}>*</span>
                    </label>
                    <Controller
                      name="skills"
                      control={control}
                      render={({ field }: any) => (
                        <CreatableSelect
                          {...field}
                          isMulti
                          options={skills || ""}
                          className="custom-select-container  bg-light invert text-dark "
                          classNamePrefix="custom-select"
                          value={field.value}
                          onChange={(selectedOptions: any) => {
                            const previousValue = getValues("skills") || [];
                            const deletedSkills = previousValue.filter(
                              (option: any) =>
                                !selectedOptions.some(
                                  (selected: any) =>
                                    selected.value === option.value
                                )
                            );

                            if (deletedSkills.length > 0) {
                              const deletedIds = deletedSkills.map(
                                (deletedSkill: any) => deletedSkill.value
                              );

                              setSkillsIdsToDelete((prev: any) => [
                                ...prev,
                                ...deletedIds,
                              ]);

                              setValue("skillsIdsToDelete", [
                                ...(getValues("skillsIdsToDelete") || []),
                                ...deletedIds,
                              ]);
                            }
                            field.onChange(selectedOptions);
                          }}
                        />
                      )}
                    />
                    {errors.skills && (
                      <div className="text-danger pt-2">
                        {errors.skills.message}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bordr mt-4"></div>
              <div className="experience-sec my-4">
                <h3>Address</h3>
              </div>
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

              <div className="row">
                <div className="button d-flex justify-content-end mt-5">
                  <div className="mb-3"></div>

                  <PromotedModal
                    show={showModal}
                    handleClose={handleclose}
                    handleResponse={handlePromotionResponse}
                    title="Promote your profile"

                  >
                    <p>Please connect your account for 10$ per month</p>
                  </PromotedModal>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ProfileSetting;
