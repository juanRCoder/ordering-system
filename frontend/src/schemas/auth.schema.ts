import z from 'zod';

export const loginSchema = z.object({
  email: z.email('Email invalido'),
  password: z
    .string()
    .min(6, 'Contraseña demasiado corta (min 6 caracteres)')
    .max(12, 'Contraseña demasiado larga (max 12 caracteres)'),
});

export type LoginFormType = z.infer<typeof loginSchema>;

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(4, 'Nombre demasiado corto (min 4 caracteres)')
    .max(16, 'Nombre demasiado largo (max 16 caracteres)'),
});

export type RegisterFormType = z.infer<typeof registerSchema>;
