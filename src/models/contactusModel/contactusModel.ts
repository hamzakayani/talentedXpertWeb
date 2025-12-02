export const dataForServer = (values: any) => {

  return {
    email: values?.email,
    firstName: values?.firstName || undefined,
    lastName: values?.lastName || undefined,
    comment: values?.comments || '',    
  };
};