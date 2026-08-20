import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema } from '../auth.schema';

describe('loginSchema', () => {
  it('acepta credenciales válidas', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('rechaza email inválido', () => {
    const result = loginSchema.safeParse({
      email: 'invalid-email',
      password: '123456',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza contraseña menor a 6 caracteres', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza contraseña mayor a 12 caracteres', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '1234567890123',
    });
    expect(result.success).toBe(false);
  });

  it('acepta contraseña de exactamente 6 caracteres', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('acepta contraseña de exactamente 12 caracteres', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '123456789012',
    });
    expect(result.success).toBe(true);
  });

  it('retorna mensaje de error en español para email', () => {
    const result = loginSchema.safeParse({
      email: 'invalid',
      password: '123456',
    });
    if (!result.success) {
      const emailError = result.error.issues.find((i) => i.path[0] === 'email');
      expect(emailError?.message).toBe('Email invalido');
    }
  });

  it('retorna mensaje de error en español para contraseña corta', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    });
    if (!result.success) {
      const passError = result.error.issues.find(
        (i) => i.path[0] === 'password'
      );
      expect(passError?.message).toBe(
        'Contraseña demasiado corta (min 6 caracteres)'
      );
    }
  });
});

describe('registerSchema', () => {
  const validRegister = {
    email: 'test@example.com',
    password: '123456',
    name: 'Juan',
    slug: 'mi-negocio',
    business_name: 'Mi Negocio',
    phone: '123456789',
  };

  it('acepta registro válido', () => {
    const result = registerSchema.safeParse(validRegister);
    expect(result.success).toBe(true);
  });

  it('rechaza name menor a 4 caracteres', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      name: 'Ab',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza name mayor a 16 caracteres', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      name: 'A'.repeat(17),
    });
    expect(result.success).toBe(false);
  });

  it('rechaza slug menor a 4 caracteres', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      slug: 'ab',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza slug mayor a 20 caracteres', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      slug: 'a'.repeat(21),
    });
    expect(result.success).toBe(false);
  });

  it('rechaza business_name menor a 2 caracteres', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      business_name: 'A',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza business_name mayor a 30 caracteres', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      business_name: 'A'.repeat(31),
    });
    expect(result.success).toBe(false);
  });

  it('rechaza phone menor a 9 caracteres', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      phone: '1234567',
    });
    expect(result.success).toBe(false);
  });

  it('rechaza phone mayor a 15 caracteres', () => {
    const result = registerSchema.safeParse({
      ...validRegister,
      phone: '1'.repeat(16),
    });
    expect(result.success).toBe(false);
  });

  it('requiere campos de login (email y password)', () => {
    const result = registerSchema.safeParse({
      name: 'Juan',
      slug: 'mi-negocio',
      business_name: 'Mi Negocio',
      phone: '123456789',
    });
    expect(result.success).toBe(false);
  });
});
