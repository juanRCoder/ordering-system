import type {
  CreateOrderPayload,
  updateOrder,
} from '@/interfaces/orders.interface';
import suppliesService from './supplies.service';

class OrdersService {
  private API = import.meta.env.VITE_API_DEV;

  async create(data: CreateOrderPayload, slug: string) {
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

  async getAll(page = 1, status: string = 'PENDING', dateFilter: string = '') {
    const result = await suppliesService.apiFetch(
      `${this.API}/orders?page=${page}&status=${status}&dateFilter=${dateFilter}`
    );
    return result;
  }

  async getById(id: string) {
    const result = await suppliesService.apiFetch(`${this.API}/orders/${id}`);
    return result.data;
  }

  async update(data: updateOrder) {
    const result = await suppliesService.apiFetch(
      `${this.API}/orders/${data.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: data.status,
          payment_type: data.payment_type,
          order_type: data.order_type,
        }),
      }
    );
    return result;
  }

  async delete(id: string) {
    const result = await suppliesService.apiFetch(`${this.API}/orders/${id}`, {
      method: 'DELETE',
    });
    return result;
  }

  async confirm(id: string, is_confirmed: boolean) {
    const result = await suppliesService.apiFetch(
      `${this.API}/orders/${id}/confirm`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_confirmed }),
      }
    );
    return result;
  }
}

export default new OrdersService();
