import type z from 'zod';
import type { newOrderSchema } from '@/schemas/orders.schema';

export type NewOrderType = z.infer<typeof newOrderSchema>;

export type OrderListResponseType = {
  id: string;
  guest_name: string;
  created_at: string;
  status: 'PENDING' | 'FINISHED';
  order_type: 'LOCAL' | 'WHATSAPP';
  total: number;
};

export type OrderDetailSupply = {
  quantity: number;
  name: string;
  price: number;
  observations: string | null;
};

export type OrderDetailResponseType = OrderListResponseType & {
  supplies: OrderDetailSupply[];
  payment_type: 'CASH' | 'YAPE';
  order_type: 'LOCAL' | 'WHATSAPP';
};

export type updateOrder = {
  id: string;
  status: string;
  payment_type: 'CASH' | 'YAPE';
  order_type: 'LOCAL' | 'WHATSAPP';
};
