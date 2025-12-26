export const dataForServer = (values: any) => {
  return {
    name: values?.name || "",
    details: values?.details || "",
    startDate: values?.startDate ? `${values.startDate.split('T')[0]}T00:00:00.000Z` : '',
    endDate: values?.endDate ? `${values.endDate.split('T')[0]}T23:59:59.999Z` : '',
    amountType: values?.amountType || "",
    amount: Number(values?.amount),
    // categories: values?.subCategory?.map((cat: any) => cat?.value) || [],
    categories: Array.isArray(values?.subCategory) && values?.subCategory?.length > 0 ? values?.subCategory?.map((cat: any) => cat?.value) || [] : values?.category !== '' ? [Number(values?.category)] : [],
    taskType: values?.taskType || "",
    requesterProfileId: Number(values?.requesterProfileId),
    status: values?.status || "POSTED",
    promoted: values?.promoted === "true" ? true : values?.promoted === "false" ? false : false,
    disability: values?.disability === "true" ? true : values?.disability === "false" ? false : false,
    documents: values?.documents || [],
    ...(values?.taskType !== "ONLINE" && {
      taskLocation: {
        cityId: Number(values?.city) || null,
        stateId: Number(values?.state) || null,
        zip: values?.zip || "",
        street: values?.street || "",
        countryId: Number(values?.country) || null,
        longitude: Number(values?.longitude) || null,
        latitude: Number(values?.latitude) || null,
        address: values?.address || "",
      },
    }),
    interviewQuestions: values?.interviewQuestions || [],
    questionIdsToDelete: values?.questionIdsToDelete?.length > 0 ? values?.questionIdsToDelete : undefined,
  };
};
