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
        city: values?.city || "",
        state: values?.state || "",
        zip: values?.zip || "",
        street: values?.street || "",
        country: values?.country || "",
        longitude: values?.longitude || "",
        latitude: values?.latitude || "",
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
  