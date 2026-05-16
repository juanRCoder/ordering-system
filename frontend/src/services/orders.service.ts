import type { OrderType } from '@/interfaces/orders.interface';

class OrdersService {
  private API = import.meta.env.VITE_API_DEV;

  async create(data: OrderType) {
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
}

export default new OrdersService();
