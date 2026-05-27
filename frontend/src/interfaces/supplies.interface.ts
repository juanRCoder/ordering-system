import { createSupplySchema } from '@/schemas/supplies.schema';
import type z from 'zod';

export type CreateSupplyType = z.infer<typeof createSupplySchema>;

export interface SupplyResponse {
  id: string;
  name: string;
  description?: string;
  price: number;
  imagen_url?: string;
}
