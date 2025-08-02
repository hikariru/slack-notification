export interface HttpClient {
  get<T>(url: string, options?: RequestInit): Promise<T>;
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
}

export const httpClient = new FetchHttpClient();
