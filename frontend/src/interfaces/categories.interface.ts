import type {
  categorySchema,
  updateCategorySchema,
} from '@/schemas/categories.schema';
import type z from 'zod';

export type CategoryType = z.infer<typeof categorySchema>;
export type UpdateCategoryType = z.infer<typeof updateCategorySchema>;

export interface CategoryResponse {
  id: string;
  name: string;
  supplies_quantity?: number;
}
