import z from 'zod';

export const supplyOrderSchema = z.object({
  id: z.string().uuid(),
  price: z.number(),
  quantity: z.number().int().positive(),
  observations: z.string().optional(),
});

export const newOrderSchema = z
  .object({
    supplies: z.array(supplyOrderSchema),
    guest_name: z.string(),
    total: z.number().min(0, 'El total debe ser mayor o igual a 0'),
    order_id: z.string().nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.order_id) return true;
      return data.guest_name.trim().length > 0;
    },
    {
      message: 'El nombre del cliente es requerido',
      path: ['guest_name'],
    }
  );
