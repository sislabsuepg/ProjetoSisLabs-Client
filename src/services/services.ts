// import axios from 'axios';
// import { useAuthStore } from 'src/store/authentication/auth';
// import { clearSessionStorage } from 'src/utils/handleSessionStorage';
// import { User } from 'store/authentication/auth/types';

// export const axiosInstance = axios.create({
//   baseURL: `${process.env.NEXT_PUBLIC_API}`,
// });

// const axiosLoginInterceptor = axios.create({
//   baseURL: `${process.env.NEXT_PUBLIC_API}`,
// });

// axiosLoginInterceptor.interceptors.response.use(
//   (response) => {
//     useAuthStore.getState().updateToken({
//       access_token: response?.data?.access_token,
//       refresh_token: response?.data?.refresh_token,
//     });

//     return response;
//   },
//   (err) => {
//     throw err;
//   },
// );
// axiosLogoutInterceptor.interceptors.response.use(
//   function (config) {
//     const access_token = useAuthStore.getState().access_token!;

//     if (access_token) {
//       config.headers!.Authorization = `Bearer ${access_token}`;
//       clearSessionStorage();
//       useAuthStore.getState().eraseState();
//     }

//     return config;
//   },
//   function (error) {
//     return Promise.reject(error);
//   },
// );

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (err) => {
//     throw err;
//   },
// );

// export const apiOnline = {
//   get<T = any>(endpoint: string) {
//     return axiosInstance.get<T>(endpoint);
//   },
//   post<T = any>(endpoint: string, body: any, headers?: any) {
//     return axiosInstance.post<T>(endpoint, body, headers);
//   },
//   put<T = any>(endpoint: string, body: any) {
//     return axiosInstance.put<T>(endpoint, body);
//   },
//   delete<T = any>(endpoint: string) {
//     return axiosInstance.delete<T>(endpoint);
//   },
//   login(endpoint: string, body: any) {
//     return axiosLoginInterceptor.post<{
//       usuario: User;
//       access_token: string;
//       refresh_token: string;
//       status: {
//         code: number;
//         user_message?: string;
//       };
//     }>(`/auth${endpoint}`, body);
//   },
//   validateToken() {
//     return axiosInstance.get('/auth/validar');
//   },
//   logout() {
//     return axiosInstance.post('/auth/logout');
//   },
// };
