export const dataForServer = (values: any) => {

  return {
    firstName: values?.firstName,
    lastName: values?.lastName,
    skills: values?.skills?.map((skill:any) => skill?.value) || [],
    email: values?.email,
    password: values?.password || undefined,
    profileType: values?.profileType,
    mobile: values?.mobile,
    about: values?.about,
    disability: values?.disability || false, 
    promoted: values?.isPromoted === "true" ? true : values?.isPromoted === "false" ? false : "",
    userType: values?.userType || "INDIVIDUAL", 
    profilePicture: values?.profilePicture || {}, 
    disabilityDetail: values?.disabilityDetail || '', 
    roleId: values?.roleId || 3,
    address: values?.address || {},
    education: values?.education || [],
    educationIdsToDelete: values?.educationIdsToDelete || undefined,
    experience: values?.experience || [],
    experienceIdsToDelete: values?.experienceIdsToDelete || undefined,
    // skillsIdsToDelete: values?.skillsIdsToDelete || undefined
  };
};
