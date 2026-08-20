import { describe, it, expect } from 'vitest';
import { decodeToken } from '../token';

describe('decodeToken', () => {
  it('decodifica un JWT válido', () => {
    const payload = { sub: '123', email: 'test@example.com', role: 'ADMIN' };
    const encoded = btoa(JSON.stringify(payload));
    const token = `header.${encoded}.signature`;

    const result = decodeToken(token);
    expect(result).toEqual(payload);
  });

  it('retorna null para token sin puntos', () => {
    expect(decodeToken('not-a-jwt')).toBeNull();
  });

  it('retorna null para base64 inválido', () => {
    expect(decodeToken('header.!!!invalid!!!.sig')).toBeNull();
  });

  it('retorna null para base64 válido pero JSON inválido', () => {
    const notJson = btoa('not-json');
    expect(decodeToken(`header.${notJson}.sig`)).toBeNull();
  });

  it('retorna null para string vacío', () => {
    expect(decodeToken('')).toBeNull();
  });

  it('retorna null para token con solo un punto', () => {
    expect(decodeToken('header.')).toBeNull();
  });
});
