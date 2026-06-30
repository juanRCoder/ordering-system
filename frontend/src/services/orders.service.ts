import type { NewOrderType, updateOrder } from '@/interfaces/orders.interface';

class OrdersService {
  private API = import.meta.env.VITE_API_DEV;

  async create(data: NewOrderType, slug: string) {
    const response = await fetch(`${this.API}/orders/${slug}`, {
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
    const response = await fetch(`${this.API}/orders`, {
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

  async getById(id: string) {
    const response = await fetch(`${this.API}/orders/${id}`, {
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

  async update(data: updateOrder) {
    const response = await fetch(`${this.API}/orders/${data.id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: data.status,
        payment_type: data.payment_type,
        order_type: data.order_type,
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
