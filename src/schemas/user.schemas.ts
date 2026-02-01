import z from "zod";

export const UserBaseSchema = z.object({
  name: z.string().min(2).optional(),
  username: z
    .string()
    .min(2)
    .refine((value) => !value.includes(" "), {
      message: "Usuário não pode conter espaços",
    })
    .optional(),
  email: z.email().optional(),
});

export const UserRequestSchema = UserBaseSchema.extend({
  email: z.email("E-mail inválido"),
  username: z.string().min(2, "Campo obrigatório"),
  name: z.string().min(2, "Campo obrigatório"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  confirm_password: z.string().min(6),
}).refine((data) => data.password === data.confirm_password, {
  path: ["confirm_password"],
  message: "Confirmação de senhas incorreta",
});

export const UserLoginSchema = z.object({
  username: z.string().min(2, "Campo obrigatório"),
  password: z.string().min(2, "Campo obrigatório"),
});

export const UserUpdateSchema = UserRequestSchema.omit({
  password: true,
  confirm_password: true,
}).partial();

export const UserResponseSchema = z.object({
  email: z.email(),
  username: z.string(),
  name: z.string(),
  role: z.enum(["owner", "client", "admin"]),
});

export const UserVerificationSchema = z.object({
  password: z.string(),
  new_password: z.string().min(6),
});
