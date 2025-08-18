import { ResetPasswordSchemaType } from "@/schemas/resetPassword-schema/resetPasswordSchema";

export const dataForServer = (data: ResetPasswordSchemaType, token: string) => {
  return {
    token: token,
    password: data.password,
  };
}; 