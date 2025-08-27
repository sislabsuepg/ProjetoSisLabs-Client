import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API || "http://localhost:3400",
  withCredentials: true,
});

export const apiOnline = {
  async get<T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await api.get<T>(endpoint, config);
    return response.data;
  },

  async post<T = unknown, B = unknown>(
    endpoint: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await api.post<T>(
      endpoint,
      body,
      config
    );
    return response.data;
  },

  async put<T = unknown, B = unknown>(
    endpoint: string,
    body?: B,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await api.put<T>(endpoint, body, config);
    return response.data;
  },

  async delete<T = unknown>(
    endpoint: string,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await api.delete<T>(endpoint, config);
    return response.data;
  },
};
