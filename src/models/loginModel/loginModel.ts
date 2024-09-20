export const dataForServer = (values:any) => {

    return {
        "email" : values?.email,
        "password" : values?.password,
        "rememberMe" : values?.rememberMe,
    }


}