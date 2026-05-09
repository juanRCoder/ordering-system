import z from 'zod';

export const loginSchema = z.object({
  email: z.email('invalid email'),
  password: z.string().min(6, 'password too short (6 characters minimum)'),
});

export type LoginFormType = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
  name: z.string().min(3, 'name too short (3 characters minimum)'),
});

export type RegisterFormType = z.infer<typeof registerSchema>;
