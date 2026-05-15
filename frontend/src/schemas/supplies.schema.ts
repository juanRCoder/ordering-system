import z from 'zod';

export const supplySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  image_url: z
    .string()
    .url('URL de imagen invalida')
    .optional()
    .or(z.literal('')),
  type_supply_id: z.string().uuid('ID de categoría invalido'),
});
