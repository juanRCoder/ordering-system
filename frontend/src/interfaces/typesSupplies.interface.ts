import type {
  typeSupplySchema,
  updateTypeSupplySchema,
} from '@/schemas/typesSupplies.schema';
import type z from 'zod';

export type TypeSupplyType = z.infer<typeof typeSupplySchema>;
export type UpdateTypeSupplyType = z.infer<typeof updateTypeSupplySchema>;

export interface TypeSupplyResponse {
  id: string;
  name: string;
  layout: string;
  supplies_quantity?: number;
}
