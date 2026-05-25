import type z from 'zod';
import type {
  orderSchema,
  orderUpdateStatusSchema,
} from '@/schemas/orders.schema';

export type NewOrderType = z.infer<typeof orderSchema>;

export interface OrderResponse {
  status: number;
  data: {
    id: string;
  };
}

export type OrderListResponseType = {
  id: string;
  guest_name: string;
  created_at: string;
  status: 'PENDING' | 'FINISHED';
  total: number;
};

export type OrderDetailResponseType = OrderListResponseType & {
  supplies: {
    quantity: number;
    name: string;
    price: number;
  }[];
  observations: string | null;
  type_pay: 'CASH' | 'YAPE';
};

export type updateOrder = z.infer<typeof orderUpdateStatusSchema>;
