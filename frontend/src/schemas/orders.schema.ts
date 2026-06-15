import z from 'zod';

export const supplyOrderSchema = z.object({
  id: z.string().uuid(),
  price: z.number(),
  quantity: z.number().int().positive(),
  observations: z.string().optional(),
});

export const newOrderSchema = z.object({
  supplies: z.array(supplyOrderSchema),
  guest_name: z.string().min(1, 'El nombre del cliente es requerido'),
  total: z.number().min(0, 'El total debe ser mayor o igual a 0'),
});

export const orderUpdateStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['PENDING', 'FINISHED']),
  type_pay: z.enum(['CASH', 'YAPE']),
});
