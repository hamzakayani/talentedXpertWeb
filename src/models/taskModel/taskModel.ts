export const dataForServer = (values: any) => {
  
    return {
      name: values?.name || "",
      details: values?.details || "",
      startDate: values?.startDate,
      endDate: values?.endDate,
      amountType: values?.amountType || "", 
      amount: Number(values?.amount),
      categoryId: Number(values?.categoryId),
      industryId: null,
      taskType: values?.taskType || "",
      disability: Boolean(values?.disability) || false, 
      requesterProfileId: Number(values?.requesterProfileId),
      status: values?.status || "POSTED", 
      promoted: Boolean(values?.promoted) || false, 
      documents: values?.documents || "",
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
      interviewQuestions: values?.interviewQuestions|| [],
    };
  };
  