import type { SupplyType } from '@/interfaces/supplies.interface';

class SuppliesService {
  private API = import.meta.env.VITE_API_DEV;

  async create(data: SupplyType) {
    const response = await fetch(`${this.API}/supplies`, {
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

  async getByTypeId(type_id: string) {
    const response = await fetch(`${this.API}/supplies/${type_id}`);

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

export default new SuppliesService();
