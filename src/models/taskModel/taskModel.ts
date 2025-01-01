export const dataForServer = (values: any) => {
  
    return {
      name: values?.name || "",
      details: values?.details || "",
      startDate: values?.startDate,
      endDate: values?.endDate,
      amountType: values?.amountType || "",    
      amount: Number(values?.amount),
      categories: values?.subCategory?.map((cat:any) => cat?.value) || [],
      industryId: null,
      taskType: values?.taskType || "",
      disability: values?.disability === "true" ? true : values?.disability === "false" ? false : false,
      requesterProfileId: Number(values?.requesterProfileId),
      status: values?.status || "POSTED", 
      promoted: values?.promoted === "true" ? true : values?.promoted === "false" ? false : "",
      documents: values?.documents || [],
      taskLocation: {
        city: values?.taskLocation?.city || "",
        state: values?.taskLocation?.state || "",
        zip: values?.taskLocation?.zip || "",
        street: values?.taskLocation?.street || "",
        country: values?.taskLocation?.country || "",
        longitude: values?.taskLocation?.longitude || "",
        latitude: values?.taskLocation?.latitude || "",
        address: values?.taskLocation?.address || "",
      },
      interviewQuestions: values?.interviewQuestions || [],
      categoryIdsToDelete: values.categoryIdsToDelete?.length >0 ?  values.categoryIdsToDelete : undefined 
    };
  };
  // ...(values.categoryIdsToDelete
  //   ? { categoryIdsToDelete: values.categoryIdsToDelete }
  //   : {}),
  