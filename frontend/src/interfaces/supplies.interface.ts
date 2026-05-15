import { supplySchema } from '@/schemas/supplies.schema';
import type z from 'zod';

export type SupplyType = z.infer<typeof supplySchema>;

export interface SupplyResponse {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
}
