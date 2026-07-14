import type {
  LoginFormType,
  RegisterFormType,
} from '@/interfaces/auth.interface';
import { toast } from 'sonner';

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
    try {
      const response = await fetch(`${this.API}/auth/login`, {
        method: 'POST',
        credentials: 'include',
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
      return result.data;
    } catch (e) {
      toast.error(e);
    }
  }

  async logout() {
    const response = await fetch(`${this.API}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });

    const result = await response.json();
    if (!response.ok) {
      throw {
        status: response.status,
        code: result?.code,
        message: result?.message,
      };
    }
    return result.data;
  }
}

export default new AuthService();
