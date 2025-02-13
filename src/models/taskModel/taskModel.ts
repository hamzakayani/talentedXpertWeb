export const dataForServer = (values: any) => {
  
    return {
      name: values?.name || "",
      details: values?.details || "",
      startDate: values?.startDate,
      endDate: values?.endDate,
      amountType: values?.amountType || "",    
      amount: Number(values?.amount),
      categories: values?.subCategory?.map((cat:any) => cat?.value) || [],
      // industryId: null,
      taskType: values?.taskType || "",
      // disability: values?.disability === "true" ? true : values?.disability === "false" ? false : false,
      requesterProfileId: Number(values?.requesterProfileId),
      status: values?.status || "POSTED", 
      promoted: values?.promoted === "true" ? true : values?.promoted === "false" ? false : "",
      documents: values?.documents || [],
      taskLocation: {
        cityId: Number(values?.city) || 0,
        stateId: Number(values?.state) || 0,
        zip: values?.zip || "",
        street: values?.street || "",
        countryId: Number(values?.country) || 0,
        longitude: Number(values?.longitude) || 0,
        latitude: Number(values?.latitude) || 0,
        address: values?.address || "",
      },
      interviewQuestions: values?.interviewQuestions || [],
      questionIdsToDelete: values?.questionIdsToDelete?.length > 0 ? values?.questionIdsToDelete : undefined,
      // categoryIdsToDelete: values.categoryIdsToDelete?.length >0 ?  values.categoryIdsToDelete : undefined 
    };
  };
  // ...(values.categoryIdsToDelete
  //   ? { categoryIdsToDelete: values.categoryIdsToDelete }
  //   : {}),
  