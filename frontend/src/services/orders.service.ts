import type { NewOrderType, updateOrder } from '@/interfaces/orders.interface';

class OrdersService {
  private API = import.meta.env.VITE_API_DEV;

  async create(data: NewOrderType) {
    const response = await fetch(`${this.API}/orders`, {
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

  async getAll() {
    const response = await fetch(`${this.API}/orders`);

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
    const response = await fetch(`${this.API}/orders/${id}`);

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

  async updateStatus(data: updateOrder) {
    const response = await fetch(`${this.API}/orders/${data.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: data.status,
        type_pay: data.type_pay,
      }),
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

export default new OrdersService();
