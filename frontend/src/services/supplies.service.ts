class SuppliesService {
  private API = import.meta.env.VITE_API_DEV;

  private isRefreshing = false;
  private refreshPromise: Promise<Response> | null = null;

  async apiFetch(url: string, options?: RequestInit) {
    let response = await fetch(url, { ...options, credentials: 'include' });

    if (response.status === 401) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;
        this.refreshPromise = fetch(`${this.API}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        }).finally(() => {
          this.isRefreshing = false;
        });
      }

      const refreshPromise = this.refreshPromise;
      if (!refreshPromise) {
        throw new Error('No se pudo iniciar el refresh');
      }

      const refreshRes = await refreshPromise;

      if (!refreshRes.ok) {
        window.location.href = '/auth';
        throw new Error('Sesión expirada');
      }

      response = await fetch(url, { ...options, credentials: 'include' });
    }

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

  async create(data: FormData) {
    const result = this.apiFetch(`${this.API}/supplies`, {
      method: 'POST',
      body: data,
    });
    return result;
  }

  async findByAdminId(categoryId: string, letters?: string, page = 1) {
    let url = `${this.API}/supplies?categoryId=${categoryId}&page=${page}`;

    if (letters) {
      url += `&letters=${letters}`;
    }

    const result = this.apiFetch(url, {
      method: 'GET',
    });
    return result;
  }

  async getBySlug(
    slug: string,
    categoryId?: string,
    letters?: string,
    page = 1
  ) {
    let url = `${this.API}/supplies/by-slug/${slug}?categoryId=${categoryId}&page=${page}`;

    if (letters) {
      url += `&letters=${letters}`;
    }

    const response = await fetch(url);

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
    const result = await this.apiFetch(`${this.API}/supplies/${id}/status`, {
      method: 'PATCH',
    });
    return result.data;
  }

  async update(id: string, data: FormData) {
    const result = await this.apiFetch(`${this.API}/supplies/${id}`, {
      method: 'PATCH',
      body: data,
    });
    return result.data;
  }
}

export default new SuppliesService();
