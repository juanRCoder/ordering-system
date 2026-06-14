import z from 'zod';

export const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
});

export const updateCategorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
});
