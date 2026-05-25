import type z from 'zod';
import type { orderSchema } from '@/schemas/orders.schema';

export type NewOrderType = z.infer<typeof orderSchema>;

export interface OrderResponse {
  status: number;
  data: {
    id: string;
  };
}

export interface OrderListResponseType {
  id: string;
  guest_name: string;
  created_at: string;
  status: 'PENDING' | 'FINISHED';
  supplies: {
    quantity: number;
    name: string;
    price: number;
  }[];
  observations: string | null;
  total: number;
}
