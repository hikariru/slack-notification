export interface HttpClient {
  get<T>(url: string, options?: RequestInit): Promise<T>;
  getWithAuth<T>(url: string, token: string, options?: RequestInit): Promise<T>;
}

export class FetchHttpClient implements HttpClient {
  async get<T>(url: string, options?: RequestInit): Promise<T> {
    const defaultOptions: RequestInit = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'X-Requested-With': 'XMLHttpRequest',
      },
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options?.headers,
      },
    };

    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  }

  async getWithAuth<T>(url: string, token: string, options?: RequestInit): Promise<T> {
    const authOptions: RequestInit = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const mergedOptions = {
      ...options,
      headers: {
        ...options?.headers,
        ...authOptions.headers,
      },
    };

    return this.get<T>(url, mergedOptions);
  }
}

export const httpClient = new FetchHttpClient();
