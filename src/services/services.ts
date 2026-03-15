import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const resolvedApiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API ||
  "http://localhost:3400";

const api = axios.create({
  baseURL: resolvedApiBaseUrl,
  withCredentials: true,
});

function normalizeEndpoint(endpoint: string): string {
  if (!endpoint) return "/";
  if (/^https?:\/\//i.test(endpoint)) return endpoint;

  const [path, ...queryParts] = endpoint.split("?");
  const normalizedPath = path.endsWith("/") ? path : `${path}/`;
  const query = queryParts.join("?");

  return query ? `${normalizedPath}?${query}` : normalizedPath;
}

export const apiOnline = {
  async get<T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await api.get<T>(
      normalizeEndpoint(endpoint),
      config,
    );
    return response.data;
  },

  async post<T = unknown, B = unknown>(
    endpoint: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await api.post<T>(
      normalizeEndpoint(endpoint),
      body,
      config,
    );
    return response.data;
  },

  async put<T = unknown, B = unknown>(
    endpoint: string,
    body?: B,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await api.put<T>(
      normalizeEndpoint(endpoint),
      body,
      config,
    );
    return response.data;
  },

  async delete<T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    const response: AxiosResponse<T> = await api.delete<T>(
      normalizeEndpoint(endpoint),
      config,
    );
    return response.data;
  },
};
