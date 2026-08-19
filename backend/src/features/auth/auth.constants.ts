import { CookieOptions } from 'express';

export const ACCESS_TOKEN_TTL_MS = 1000 * 60 * 15;
export const REFRESH_TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;
export const ACCESS_TOKEN_EXPIRES_IN = '15m';
export const REFRESH_TOKEN_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

export const cookieOptions = (
  isProduction: boolean
): {
  access: CookieOptions;
  refresh: CookieOptions;
  clear: CookieOptions;
} => ({
  access: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: ACCESS_TOKEN_TTL_MS,
  },
  refresh: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: REFRESH_TOKEN_TTL_MS,
  },
  clear: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  },
});
