import type { typeSupplySchema } from '@/schemas/typesSupplies.schema';
import type z from 'zod';

export type TypeSupplyType = z.infer<typeof typeSupplySchema>;

export interface TypeSupplyResponse {
  id: string;
  name: string;
  layout: string;
}
