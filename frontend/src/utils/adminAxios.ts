import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

// Backend base URL
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/admin`;

const adminAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Sends cookies automatically
});

// ✅ Fixed Request Interceptor
adminAxios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can modify headers here if needed
    // Example: config.headers['X-Custom-Header'] = 'foobar';
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor for token refresh logic
adminAxios.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`,
          {
            withCredentials: true, // Ensure refresh token cookie is sent
          }
        );

        // Retry the original failed request
        return adminAxios(originalRequest);
      } catch (refreshError) {
        console.error("Admin refresh token failed:", refreshError);
        // Optionally redirect or logout
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default adminAxios;
