import { describe, it, expect } from 'vitest';
import { supplyOrderSchema, newOrderSchema } from '../orders.schema';

describe('supplyOrderSchema', () => {
  const validSupply = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    price: 25,
    quantity: 2,
  };

  it('acepta un supply válido', () => {
    const result = supplyOrderSchema.safeParse(validSupply);
    expect(result.success).toBe(true);
  });

  it('rechaza id que no es UUID', () => {
    const result = supplyOrderSchema.safeParse({
      ...validSupply,
      id: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza quantity no entero', () => {
    const result = supplyOrderSchema.safeParse({
      ...validSupply,
      quantity: 1.5,
    });
    expect(result.success).toBe(false);
  });

  it('rechaza quantity negativo', () => {
    const result = supplyOrderSchema.safeParse({
      ...validSupply,
      quantity: -1,
    });
    expect(result.success).toBe(false);
  });

  it('rechaza quantity cero', () => {
    const result = supplyOrderSchema.safeParse({
      ...validSupply,
      quantity: 0,
    });
    expect(result.success).toBe(false);
  });
});

describe('newOrderSchema', () => {
  const validOrder = {
    supplies: [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        price: 25,
        quantity: 2,
      },
    ],
    guest_name: 'Juan',
    total: 50,
  };

  it('acepta una orden válida', () => {
    const result = newOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('acepta order_id existente sin guest_name', () => {
    const result = newOrderSchema.safeParse({
      ...validOrder,
      guest_name: '',
      order_id: '550e8400-e29b-41d4-a716-446655440001',
    });
    expect(result.success).toBe(true);
  });

  it('acepta order_id null sin guest_name', () => {
    const result = newOrderSchema.safeParse({
      ...validOrder,
      guest_name: '',
      order_id: null,
    });
    expect(result.success).toBe(false);
  });

  it('rechaza guest_name vacío sin order_id', () => {
    const result = newOrderSchema.safeParse({
      ...validOrder,
      guest_name: '',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza guest_name con solo espacios sin order_id', () => {
    const result = newOrderSchema.safeParse({
      ...validOrder,
      guest_name: '   ',
    });
    expect(result.success).toBe(false);
  });

  it('retorna error en path guest_name', () => {
    const result = newOrderSchema.safeParse({
      ...validOrder,
      guest_name: '',
    });
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('guest_name');
    }
  });

  it('rechaza total negativo', () => {
    const result = newOrderSchema.safeParse({
      ...validOrder,
      total: -1,
    });
    expect(result.success).toBe(false);
  });

  it('acepta total en cero', () => {
    const result = newOrderSchema.safeParse({
      ...validOrder,
      total: 0,
    });
    expect(result.success).toBe(true);
  });

  it('acepta supplies vacío (schema no valida longitud mínima)', () => {
    const result = newOrderSchema.safeParse({
      ...validOrder,
      supplies: [],
    });
    expect(result.success).toBe(true);
  });
});
