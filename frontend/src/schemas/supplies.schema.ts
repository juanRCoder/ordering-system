import z from 'zod';

export const createSupplySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
  price: z
    .number({
      error: 'Debe ser un número válido',
    })
    .min(1, 'El precio mínimo es S/. 1'),
  type_supply_id: z.string().uuidv4().optional(),
});
