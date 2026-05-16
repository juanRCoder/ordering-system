import type z from 'zod';
import type { orderSchema } from '@/schemas/orders.schema';

export type OrderType = z.infer<typeof orderSchema>;

export interface OrderResponse {
  status: number;
  data: {
    id: string;
  };
}
