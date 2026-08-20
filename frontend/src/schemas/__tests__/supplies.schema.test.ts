import { describe, it, expect } from 'vitest';
import { createSupplySchema, updateSupplySchema } from '../supplies.schema';

describe('createSupplySchema', () => {
  const validSupply = {
    name: 'Ceviche',
    price: 25,
  };

  it('acepta un supply válido', () => {
    const result = createSupplySchema.safeParse(validSupply);
    expect(result.success).toBe(true);
  });

  it('acepta con description y category_id', () => {
    const result = createSupplySchema.safeParse({
      ...validSupply,
      description: '描述',
      category_id: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza nombre vacío', () => {
    const result = createSupplySchema.safeParse({
      ...validSupply,
      name: '',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza precio en cero', () => {
    const result = createSupplySchema.safeParse({
      ...validSupply,
      price: 0,
    });
    expect(result.success).toBe(false);
  });

  it('rechaza precio menor a 1', () => {
    const result = createSupplySchema.safeParse({
      ...validSupply,
      price: 0.99,
    });
    expect(result.success).toBe(false);
  });

  it('acepta precio mínimo de 1', () => {
    const result = createSupplySchema.safeParse({
      ...validSupply,
      price: 1,
    });
    expect(result.success).toBe(true);
  });

  it('rechaza precio negativo', () => {
    const result = createSupplySchema.safeParse({
      ...validSupply,
      price: -10,
    });
    expect(result.success).toBe(false);
  });

  it('rechaza category_id que no es UUID', () => {
    const result = createSupplySchema.safeParse({
      ...validSupply,
      category_id: 'not-a-uuid',
    });
    expect(result.success).toBe(false);
  });

  it('acepta image_url null', () => {
    const result = createSupplySchema.safeParse({
      ...validSupply,
      image_url: null,
    });
    expect(result.success).toBe(true);
  });

  it('retorna error en español para precio', () => {
    const result = createSupplySchema.safeParse({
      ...validSupply,
      price: 0,
    });
    if (!result.success) {
      const priceError = result.error.issues.find((i) => i.path[0] === 'price');
      expect(priceError?.message).toBe('El precio mínimo es S/. 1');
    }
  });
});

describe('updateSupplySchema', () => {
  it('acepta objeto vacío (todo opcional)', () => {
    const result = updateSupplySchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it('acepta solo name', () => {
    const result = updateSupplySchema.safeParse({ name: 'Nuevo nombre' });
    expect(result.success).toBe(true);
  });

  it('acepta solo price válido', () => {
    const result = updateSupplySchema.safeParse({ price: 30 });
    expect(result.success).toBe(true);
  });

  it('rechaza price menor a 1 si se provee', () => {
    const result = updateSupplySchema.safeParse({ price: 0.5 });
    expect(result.success).toBe(false);
  });

  it('rechaza name vacío si se provee', () => {
    const result = updateSupplySchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('acepta category_id válido', () => {
    const result = updateSupplySchema.safeParse({
      category_id: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(result.success).toBe(true);
  });

  it('acepta image_url null', () => {
    const result = updateSupplySchema.safeParse({ image_url: null });
    expect(result.success).toBe(true);
  });
});
