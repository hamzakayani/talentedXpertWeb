export const dataForServer = (values: any) => {

  return {
    email: values?.email,
    password: values?.password,
    profileType: values?.profileType,
    firstName: values?.firstName || undefined,
    lastName: values?.lastName || undefined,
    title: values?.title,
    organizationName: values?.organizationName,
    organizationType: values?.organizationType,
    mobile: values?.mobile,
    about: values?.about,
    disability: values?.isDisabled || false,
    disabilityDetail: values?.disabilityDetail|| '',
    userType: values?.userType || "INDIVIDUAL", // Default value if needed
    profilePicture: values?.profilePicture || "", // Optional field, add default if needed
    roleId: values?.roleId || 3,
    websiteLink: values?.websiteLink || '',
    // address: {
    //   city: values?.address?.city || "",
    //   state: values?.address?.state || "",
    //   zip: values?.address?.zip || "",
    //   street: values?.address?.street || "",
    //   country: values?.address?.country || "",
    //   // locationPin: values?.address?.locationPin || "",
    //   // buildingNo: values?.address?.buildingNo || "",
    //   // suiteNo: values?.address?.suiteNo || "",
    //   // province: values?.address?.province || "",
      
    // },
    promoted: values?.isPromoted === "true" ? true : values?.isPromoted === "false" ? false : false,
    education: values?.education || [],
    experience: values?.experience?.map((exp: any) => ({
      companyName: exp?.companyName || "",
      role: exp?.role || "",
      startDate: exp?.startDate || new Date().toISOString(), 
      endDate: exp?.endDate || new Date().toISOString(), 
    })) || [],
    skills: values?.skills?.map((skill:any) => skill?.value) || []
    
  };
};
