import z from 'zod';

export const orderSupplySchema = z.object({
  id: z.string().uuid(),
  price: z.number(),
  quantity: z.number().int().positive(),
});

export const orderSchema = z.object({
  supplies: z.array(orderSupplySchema),
  observations: z.string().optional(),
  guest_name: z.string().min(1, 'El nombre del cliente es requerido'),
  total: z.number().min(0, 'El total debe ser mayor o igual a 0'),
});
