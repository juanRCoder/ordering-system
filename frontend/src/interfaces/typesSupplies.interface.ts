import { typeSupplySchema } from '@/schemas/typessupplies.schema';
import type z from 'zod';

export type TypeSupplyType = z.infer<typeof typeSupplySchema>;
