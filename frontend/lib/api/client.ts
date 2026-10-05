import { ApiError } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  _retry?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  public getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("dairyflow_access_token");
  }

  public getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("dairyflow_refresh_token");
  }

  public setTokens(accessToken: string, refreshToken?: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("dairyflow_access_token", accessToken);
    if (refreshToken) {
      localStorage.setItem("dairyflow_refresh_token", refreshToken);
    }
  }

  public clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("dairyflow_access_token");
    localStorage.removeItem("dairyflow_refresh_token");
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private addRefreshSubscriber(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  public async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { params, headers, _retry, ...restOptions } = options;

    let url = `${this.baseUrl}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    const token = this.getAccessToken();
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }

    const mergedHeaders = {
      ...defaultHeaders,
      ...headers,
    };

    const response = await fetch(url, {
      ...restOptions,
      headers: mergedHeaders,
    });

    // Handle 401 Unauthorized with token refresh rotation
    const isAuthEndpoint =
      endpoint.includes("/auth/login") ||
      endpoint.includes("/auth/refresh") ||
      endpoint.includes("/auth/refresh-token") ||
      endpoint.includes("/auth/register");

    if (response.status === 401 && !_retry && !isAuthEndpoint) {
      const refreshToken = this.getRefreshToken();
      if (refreshToken) {
        if (this.isRefreshing) {
          // Wait for ongoing refresh to complete
          return new Promise<T>((resolve, reject) => {
            this.addRefreshSubscriber(async (newToken: string) => {
              try {
                const retryResponse = await this.request<T>(endpoint, {
                  ...options,
                  _retry: true,
                  headers: {
                    ...headers,
                    Authorization: `Bearer ${newToken}`,
                  },
                });
                resolve(retryResponse);
              } catch (err) {
                reject(err);
              }
            });
          });
        }

        this.isRefreshing = true;

        try {
          const refreshRes = await fetch(`${this.baseUrl}/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            const newAccess = data?.data?.accessToken;
            const newRefresh = data?.data?.refreshToken;

            if (newAccess) {
              this.setTokens(newAccess, newRefresh);
              this.onTokenRefreshed(newAccess);
              this.isRefreshing = false;

              // Retry original request with new token
              return this.request<T>(endpoint, {
                ...options,
                _retry: true,
                headers: {
                  ...headers,
                  Authorization: `Bearer ${newAccess}`,
                },
              });
            }
          }

          // If refresh failed: clear tokens and broadcast logout
          this.clearTokens();
          this.isRefreshing = false;
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("dairyflow:unauthorized"));
          }
        } catch {
          this.clearTokens();
          this.isRefreshing = false;
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("dairyflow:unauthorized"));
          }
        }
      } else {
        // No refresh token available
        this.clearTokens();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("dairyflow:unauthorized"));
        }
      }
    }

    if (!response.ok) {
      let errorData: ApiError;
      try {
        errorData = await response.json();
      } catch {
        errorData = {
          timestamp: new Date().toISOString(),
          status: response.status,
          error: response.statusText,
          message: response.status === 401
            ? "Authentication session expired or invalid"
            : response.status === 403
            ? "Access denied. Insufficient permissions."
            : "An unexpected error occurred",
          path: endpoint,
        };
      }
      throw errorData;
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  public get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", params });
  }

  public post<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public put<T>(endpoint: string, body?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  public delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
