export interface HttpClient {
  get<T>(url: string, options?: RequestInit, timeoutMs?: number): Promise<T>;
  getWithAuth<T>(url: string, token: string, options?: RequestInit, timeoutMs?: number): Promise<T>;
}

export interface HttpClientConfig {
  timeout: number;
  maxRetries: number;
  retryDelay: number;
  retryMultiplier: number;
}

export interface RetryableError extends Error {
  isRetryable: boolean;
  statusCode?: number;
}

import logger from "./logger";

export class FetchHttpClient implements HttpClient {
  private config: HttpClientConfig;

  constructor(config: Partial<HttpClientConfig> = {}) {
    this.config = {
      timeout: 10000, // 10秒
      maxRetries: 3,
      retryDelay: 1000, // 1秒
      retryMultiplier: 2,
      ...config,
    };
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof Error) {
      // ネットワークエラー、タイムアウト、5xx系エラーはリトライ対象
      return (
        error.name === "AbortError" ||
        error.message.includes("fetch") ||
        ("statusCode" in error && typeof error.statusCode === "number" && error.statusCode >= 500)
      );
    }
    return false;
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private async executeWithRetry<T>(operation: () => Promise<T>, attempt: number = 1): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt >= this.config.maxRetries || !this.isRetryableError(error)) {
        throw error;
      }

      const delay = this.config.retryDelay * this.config.retryMultiplier ** (attempt - 1);
      logger.warn(
        `Request failed, retrying in ${delay}ms (attempt ${attempt}/${this.config.maxRetries})`,
        error
      );

      await this.sleep(delay);
      return this.executeWithRetry(operation, attempt + 1);
    }
  }

  async get<T>(url: string, options?: RequestInit, timeoutMs?: number): Promise<T> {
    const timeout = timeoutMs || this.config.timeout;

    return this.executeWithRetry(async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const defaultOptions: RequestInit = {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
          "X-Requested-With": "XMLHttpRequest",
        },
        signal: controller.signal,
      };

      const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
          ...defaultOptions.headers,
          ...options?.headers,
        },
      };

      try {
        const response = await fetch(url, mergedOptions);
        clearTimeout(timeoutId);

        if (!response.ok) {
          const error = new Error(
            `HTTP ${response.status}: ${response.statusText}`
          ) as RetryableError;
          error.isRetryable = response.status >= 500;
          error.statusCode = response.status;
          throw error;
        }

        return response.json() as Promise<T>;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === "AbortError") {
          const timeoutError = new Error(`Request timeout after ${timeout}ms`) as RetryableError;
          timeoutError.isRetryable = true;
          throw timeoutError;
        }
        throw error;
      }
    });
  }

  async getWithAuth<T>(
    url: string,
    token: string,
    options?: RequestInit,
    timeoutMs?: number
  ): Promise<T> {
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

export const httpClient = new FetchHttpClient({
  timeout: Number(process.env.HTTP_TIMEOUT) || 10000,
  maxRetries: Number(process.env.HTTP_MAX_RETRIES) || 3,
});
