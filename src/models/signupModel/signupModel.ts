export const dataForServer = (values: any) => {
    return {
      email: values?.email,
      password: values?.password,
      profileType: values?.profileType,
      firstName: values?.firstName,
      lastName: values?.lastName,
      mobile: values?.mobile,
      confirmPassword: values?.confirmPassword, // Include if necessary
      education: values?.education?.map((edu: any) => ({
        institution: edu?.institution,
        degree: edu?.degree,
        date: edu?.date,
      })),
      additionalInfo: {
        about: values?.about,
        skills: values?.skills,
        disabilityDetail: values?.disabilityDetail,
        isDisabled: values?.isDisabled,
      },
    };
  };
  