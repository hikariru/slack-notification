export interface HttpClient {
  get<T>(url: string, options?: RequestInit, timeoutMs?: number): Promise<T>;
  getWithAuth<T>(url: string, token: string, options?: RequestInit, timeoutMs?: number): Promise<T>;
}

export class FetchHttpClient implements HttpClient {
  async get<T>(url: string, options?: RequestInit, timeoutMs: number = 30000): Promise<T> {
    const defaultOptions: RequestInit = {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'X-Requested-With': 'XMLHttpRequest',
      },
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options?.headers,
      },
      signal: controller.signal,
    };

    try {
      const response = await fetch(url, mergedOptions);
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json() as Promise<T>;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Request timeout after ${timeoutMs}ms`);
      }
      throw error;
    }
  }

  async getWithAuth<T>(url: string, token: string, options?: RequestInit, timeoutMs?: number): Promise<T> {
    const authOptions: RequestInit = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const mergedOptions: RequestInit = {
      ...options,
      headers: {
        ...options?.headers,
        ...authOptions.headers,
      },
    };

    return this.get<T>(url, mergedOptions, timeoutMs);
  }
}

export const httpClient = new FetchHttpClient();
