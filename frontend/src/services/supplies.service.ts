import type {
  CreateSupplyType,
  UpdateSupplyType,
} from '@/interfaces/supplies.interface';

class SuppliesService {
  private API = import.meta.env.VITE_API_DEV;

  async create(data: CreateSupplyType) {
    const response = await fetch(`${this.API}/supplies`, {
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
    return result;
  }

  async getByTypeId(type_id: string) {
    const response = await fetch(`${this.API}/supplies/category/${type_id}`);

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

  async getById(id: string) {
    const response = await fetch(`${this.API}/supplies/${id}`);

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

  async updateStatus(id: string) {
    const response = await fetch(`${this.API}/supplies/${id}/status`, {
      method: 'PATCH',
      credentials: 'include',
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

  async update(id: string, data: UpdateSupplyType) {
    const response = await fetch(`${this.API}/supplies/${id}`, {
      method: 'PATCH',
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
  }
}

export default new SuppliesService();
