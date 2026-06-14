import type {
  CategoryType,
  UpdateCategoryType,
} from '@/interfaces/categories.interface';

class CategoriesService {
  private API = import.meta.env.VITE_API_DEV;

  async create(data: CategoryType) {
    const response = await fetch(`${this.API}/categories`, {
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
  }

  async getAll() {
    const response = await fetch(`${this.API}/categories`);

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
    const response = await fetch(`${this.API}/categories/${id}`);

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

  async update(id: string, data: UpdateCategoryType) {
    const response = await fetch(`${this.API}/categories/${id}`, {
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

export default new CategoriesService();
