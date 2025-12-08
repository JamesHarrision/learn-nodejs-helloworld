import { isEmailExist } from "services/client/auth.service";
import * as z from "zod";

const emailRule = z
  .string()
  .min(1, { message: "Email không được để trống" })
  .email("Email nhập vào không hợp lệ")
  .refine(async (e) => {
    // Where checkIfEmailIsValid makes a request to the backend
    // to see if the email is valid.
    const existingUser =  await isEmailExist(e);
    return !existingUser;
  }, {
    message: "Email này đã tồn tại",
    path: ["email"]
  });

export const passwordRule = z
  .string()
  .min(6, "Mật khẩu ít nhất 6 ký tự")
  .max(20, "Mật khẩu không quá 20 ký tự")
  .regex(/[A-Z]/, "Mật khẩu cần ít nhất 1 ký tự hoa")
  .regex(/[a-z]/, "Mật khẩu cần ít nhất 1 ký tự thường")
  .regex(/\d/, "Mật khẩu cần ít nhất 1 ký tự số")
  .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, "Mật khẩu cần ít nhất 1 ký tự đặc biệt");

export const RegisterSchema = z.object({
  fullName: z.string().trim().min(1, { message: "Tên không được bỏ trống" }),
  email: emailRule,
  password: passwordRule,
  confirmPassword: z.string(),
}).superRefine(({ password, confirmPassword }, ctx) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "Mật khẩu xác nhận không giống",
      path: ["confirmPassword"],
    });
  }
});

export const EmailSchema = z.object({
  email: emailRule
});

export const PasswordSchema = z.object({
  password: passwordRule
});

export type TRegisterSchema = z.infer<typeof RegisterSchema>;