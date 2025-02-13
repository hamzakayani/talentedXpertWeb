export const dataForServer = (values: any) => {
  const isIndividual = values?.userType === "INDIVIDUAL";

  return {
    firstName: values?.firstName,
    lastName: values?.lastName,
    skills: values?.skills?.map((skill: any) => skill?.value) || [],
    email: values?.email,
    title: values?.title,
    password: values?.password || undefined,
    profileType: values?.profileType,
    mobile: values?.mobile,
    about: values?.about,
    disability: values?.disability || false,
    promoted: values?.isPromoted === "true" ? true : values?.isPromoted === "false" ? false : "",
    userType: values?.userType || "INDIVIDUAL",
    profilePicture: values?.profilePicture || {},
    disabilityDetail: values?.disabilityDetail || "",
    roleId: values?.roleId || 3,
    education: values?.education || [],
    educationIdsToDelete: values?.educationIdsToDelete || undefined,
    experience: values?.experience || [],
    experienceIdsToDelete: values?.experienceIdsToDelete || undefined,
    ...(isIndividual ? {} : { 
      organizationName: values?.organizationName, 
      organizationType: values?.organizationType 
    }),
    address: {
      cityId: Number(values?.city) || 0,
      stateId: Number(values?.state) || 0,
      zip: values?.zip || "",
      street: values?.street || "",
      countryId: Number(values?.country) || 0,
      longitude: Number(values?.longitude) || 0,
      latitude: Number(values?.latitude) || 0,
      address: values?.address || "",
    }
  };
};
