import type z from 'zod';
import type {
  newOrderSchema,
  orderUpdateStatusSchema,
} from '@/schemas/orders.schema';

export type NewOrderType = z.infer<typeof newOrderSchema>;

export type OrderListResponseType = {
  id: string;
  guest_name: string;
  created_at: string;
  status: 'PENDING' | 'FINISHED';
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
  type_pay: 'CASH' | 'YAPE';
};

export type updateOrder = z.infer<typeof orderUpdateStatusSchema>;
