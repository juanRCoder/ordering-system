import type { LoginFormType, RegisterFormType } from '@/schemas/auth.schema';

class AuthService {
  private API = import.meta.env.VITE_API_DEV;

  async register(data: RegisterFormType) {
    const response = await fetch(`${this.API}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result || 'Error');

    return result;
  }

  async login(data: LoginFormType) {
    const response = await fetch(`${this.API}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result || 'Error');

    return result;
  }
}

export default new AuthService();
