import { loginSchema, registerSchema } from '@/schemas/auth.schema';
import type z from 'zod';

export type LoginFormType = z.infer<typeof loginSchema>;
export type RegisterFormType = z.infer<typeof registerSchema>;
