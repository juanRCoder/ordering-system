import type {
  LoginFormType,
  RegisterFormType,
} from '@/interfaces/auth.interface';

class AuthService {
  private API = import.meta.env.VITE_API_DEV;

  async register(data: RegisterFormType) {
    const response = await fetch(`${this.API}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw {
        status: response.status,
        code: result.code,
        message: result.message,
      };
    }
    return result;
  }

  async login(data: LoginFormType) {
    const response = await fetch(`${this.API}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      throw {
        status: response.status,
        code: result.code,
        message: result.message,
      };
    }
    return result;
  }
}

export default new AuthService();
