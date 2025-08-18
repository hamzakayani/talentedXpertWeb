import { ForgotPasswordSchemaType } from "@/schemas/forgotPassword-schema/forgotPasswordSchema";

export const dataForServer = (data: ForgotPasswordSchemaType) => {
  return {
    email: data.email,
  };
}; 