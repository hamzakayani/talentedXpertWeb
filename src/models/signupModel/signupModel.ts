export const dataForServer = (values: any) => {

  return {
    email: values?.email,
    password: values?.password,
    profileType: values?.profileType,
    firstName: values?.firstName,
    lastName: values?.lastName,
    mobile: values?.mobile,
    about: values?.about,
    disability: values?.disability || false, // Assuming it can be a boolean
    userType: values?.userType || "INDIVIDUAL", // Default value if needed
    profilePicture: values?.profilePicture || "", // Optional field, add default if needed
    roleId: values?.roleId || 3,
    address: {
      city: values?.address?.city || "",
      state: values?.address?.state || "",
      zip: values?.address?.zip || "",
      street: values?.address?.street || "",
      country: values?.address?.country || "",
      // locationPin: values?.address?.locationPin || "",
      // buildingNo: values?.address?.buildingNo || "",
      // suiteNo: values?.address?.suiteNo || "",
      // province: values?.address?.province || "",
      
    },
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
