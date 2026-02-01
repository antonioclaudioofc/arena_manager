import type z from "zod";
import type {
  UserLoginSchema,
  UserUpdateSchema,
  UserResponseSchema,
  UserRequestSchema,
} from "../schemas/user.schemas";

export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserRegister = z.infer<typeof UserRequestSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type User = z.infer<typeof UserResponseSchema>;
