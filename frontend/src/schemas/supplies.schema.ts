import z from 'zod';

export const createSupplySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z
    .number({
      error: 'Debe ser un número válido',
    })
    .min(1, 'El precio mínimo es S/. 1'),
  category_id: z.string().uuidv4().optional(),
  image_url: z.any().optional().nullable(),
  image_public_id: z.string().optional().nullable(),
});

export const updateSupplySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').optional(),
  description: z.string().optional(),
  price: z
    .number({
      error: 'Debe ser un número válido',
    })
    .min(1, 'El precio mínimo es S/. 1')
    .optional(),
  image_url: z.any().optional().nullable(),
  image_public_id: z.string().optional().nullable(),
  category_id: z.string().uuidv4().optional(),
});
