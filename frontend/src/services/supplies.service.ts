class SuppliesService {
  private API = import.meta.env.VITE_API_DEV;

  async create(data: FormData) {
    const response = await fetch(`${this.API}/supplies`, {
      method: 'POST',
      credentials: 'include',
      body: data,
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

  async findByAdminId(categoryId: string) {
    const response = await fetch(
      `${this.API}/supplies?categoryId=${categoryId}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

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

  async getBySlug(slug: string, categoryId: string) {
    const response = await fetch(
      `${this.API}/supplies/by-slug/${slug}?categoryId=${categoryId}`
    );

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

  async update(id: string, data: FormData) {
    const response = await fetch(`${this.API}/supplies/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      body: data,
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
