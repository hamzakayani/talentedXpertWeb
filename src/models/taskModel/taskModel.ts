export const dataForServer = (values: any) => {
  return {
    name: values?.name || "",
    details: values?.details || "",
    startDate: values?.startDate,
    endDate: values?.endDate,
    amountType: values?.amountType || "",
    amount: Number(values?.amount),
    categories: values?.subCategory?.map((cat: any) => cat?.value) || [],
    taskType: values?.taskType || "",
    requesterProfileId: Number(values?.requesterProfileId),
    status: values?.status || "POSTED",
    promoted: values?.promoted === "true" ? true : values?.promoted === "false" ? false : false,
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
