import {
  createSupplySchema,
  updateSupplySchema,
} from '@/schemas/supplies.schema';
import type z from 'zod';

export type CreateSupplyType = z.infer<typeof createSupplySchema>;
export type UpdateSupplyType = z.infer<typeof updateSupplySchema>;
export type StatusType = 'AVAILABLE' | 'UNAVAILABLE';

export interface SupplyResponse {
  id: string;
  name: string;
  image_url?: string;
  description?: string;
  price: number;
}

export interface UpdateSupplyStatusResponse {
  name: string;
  status: StatusType;
}
