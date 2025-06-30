import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { logOut } from "../features/user/services/AuthServices";
import { logout } from "../features/auth/auth.slice";
import { store } from "../store/store";
import toast from "react-hot-toast";
// Backend base URL
const BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/company`;

const companyAxios: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Sends cookies automatically
});

// ✅ Fixed Request Interceptor
companyAxios.interceptors.request.use(
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
companyAxios.interceptors.response.use(
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
        return companyAxios(originalRequest);
      } catch (refreshError) {
        console.error("company refresh token failed:", refreshError);
        // Optionally redirect or logout
        return Promise.reject(refreshError);
      }
    }
    if (error.response?.status === 403) {
      // Optional: Show alert or use custom toast
      toast.error("Access denied: You are blocked. Redirecting to login.");
      await logOut();
      store.dispatch(logout());
      // Redirect to login page with optional query param/message
      // window.location.href = "/login?error=blocked";

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default companyAxios;
