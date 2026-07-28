import z from 'zod';

export const loginSchema = z.object({
  email: z.email('Email invalido'),
  password: z
    .string()
    .min(6, 'Contraseña demasiado corta (min 6 caracteres)')
    .max(12, 'Contraseña demasiado larga (max 12 caracteres)'),
});

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .min(4, 'Nombre demasiado corto (min 4 caracteres)')
    .max(16, 'Nombre demasiado largo (max 16 caracteres)'),
  slug: z
    .string()
    .min(4, 'Slug demasiado corto (min 4 caracteres)')
    .max(20, 'Slug demasiado largo (max 20 caracteres)'),
  business_name: z
    .string()
    .min(2, 'Nombre de negocio demasiado corto (min 2 caracteres)')
    .max(30, 'Nombre de negocio demasiado largo (max 30 caracteres)'),
  phone: z
    .string()
    .min(10, 'Número de teléfono demasiado corto (min 10 caracteres)')
    .max(15, 'Número de teléfono demasiado largo (max 15 caracteres)'),
});
