import { describe, it, expect, vi, afterEach } from 'vitest';
import { relativeTime, dayTime } from '../time';

describe('relativeTime', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('retorna "segundos" para menos de 1 minuto', () => {
    vi.useFakeTimers();
    const now = new Date('2024-01-15T12:00:00');
    vi.setSystemTime(now);

    const fiveSecondsAgo = new Date(now.getTime() - 5000).toISOString();
    expect(relativeTime(fiveSecondsAgo)).toBe('segundos');
  });

  it('retorna "segundos" justo antes del minuto', () => {
    vi.useFakeTimers();
    const now = new Date('2024-01-15T12:00:00');
    vi.setSystemTime(now);

    const fiftyNineSecondsAgo = new Date(now.getTime() - 59000).toISOString();
    expect(relativeTime(fiftyNineSecondsAgo)).toBe('segundos');
  });

  it('retorna "1 minuto" en exactamente 1 minuto', () => {
    vi.useFakeTimers();
    const now = new Date('2024-01-15T12:00:00');
    vi.setSystemTime(now);

    const oneMinuteAgo = new Date(now.getTime() - 60000).toISOString();
    expect(relativeTime(oneMinuteAgo)).toBe('1 minuto');
  });

  it('retorna minutos en plural', () => {
    vi.useFakeTimers();
    const now = new Date('2024-01-15T12:00:00');
    vi.setSystemTime(now);

    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000).toISOString();
    expect(relativeTime(fiveMinutesAgo)).toBe('5 minutos');
  });

  it('retorna "1 hora" en exactamente 1 hora', () => {
    vi.useFakeTimers();
    const now = new Date('2024-01-15T12:00:00');
    vi.setSystemTime(now);

    const oneHourAgo = new Date(now.getTime() - 60 * 60000).toISOString();
    expect(relativeTime(oneHourAgo)).toBe('1 hora');
  });

  it('retorna horas en plural', () => {
    vi.useFakeTimers();
    const now = new Date('2024-01-15T12:00:00');
    vi.setSystemTime(now);

    const fiveHoursAgo = new Date(now.getTime() - 5 * 60 * 60000).toISOString();
    expect(relativeTime(fiveHoursAgo)).toBe('5 horas');
  });

  it('retorna "1 día" en exactamente 1 día', () => {
    vi.useFakeTimers();
    const now = new Date('2024-01-15T12:00:00');
    vi.setSystemTime(now);

    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60000).toISOString();
    expect(relativeTime(oneDayAgo)).toBe('1 día');
  });

  it('retorna días en plural', () => {
    vi.useFakeTimers();
    const now = new Date('2024-01-15T12:00:00');
    vi.setSystemTime(now);

    const threeDaysAgo = new Date(
      now.getTime() - 3 * 24 * 60 * 60000
    ).toISOString();
    expect(relativeTime(threeDaysAgo)).toBe('3 días');
  });
});

describe('dayTime', () => {
  it('formatea hora correctamente (AM)', () => {
    const result = dayTime('2024-01-15T09:30:00');
    expect(result).toMatch(/\d{1,2}:\d{2}\s?a\.m\./);
  });

  it('formatea hora correctamente (PM)', () => {
    const result = dayTime('2024-01-15T14:30:00');
    expect(result).toMatch(/\d{1,2}:\d{2}\s?p\.m\./);
  });

  it('retorna string en minúsculas', () => {
    const result = dayTime('2024-01-15T14:30:00');
    expect(result).toBe(result.toLowerCase());
  });
});
