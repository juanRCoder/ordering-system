import type { TypeSupplyType } from '@/interfaces/typesSupplies.interface';

class TypeSuppliesService {
  private API = import.meta.env.VITE_API_DEV;

  async create(data: TypeSupplyType) {
    const response = await fetch(`${this.API}/types-supplies`, {
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
    return result.data;
  }

  async getAll() {
    const response = await fetch(`${this.API}/types-supplies`);

    const result = await response.json();
    if (!response.ok) {
      throw {
        status: response.status,
        code: result.code,
        message: result.message,
      };
    }
    return result.data;
  }
}

export default new TypeSuppliesService();
