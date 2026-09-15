import axios, { type InternalAxiosRequestConfig } from "axios";
import { baseURL } from "@/constants/urls";
import useGlobalLoader from "@/store/useGlobalLoader";
import type { ApiCallOptions, ApiResponse } from "@/types/api";

const incCount = useGlobalLoader.getState().increaseCounter;
const decCount = useGlobalLoader.getState().decreaseCounter;

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.headers?.loader !== false) incCount();
    return config;
  },
  (error) => {
    if (error.config?.headers?.loader !== false) decCount();
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    if (response.config?.headers?.loader !== false) decCount();
    return response;
  },
  (error) => {
    if (error.config?.headers?.loader !== false) decCount();

    const errorResponse = {
      message: "An error occurred",
      status: error.response?.status as number | undefined,
      data: error.response?.data as unknown,
    };

    if (error.response) {
      switch (error.response.status) {
        case 401:
          errorResponse.message =
            error.response.data?.message || "Invalid credentials!";
          break;
        case 403:
          errorResponse.message = "Access forbidden.";
          break;
        case 404:
          errorResponse.message = "Resource not found.";
          break;
        case 500:
          errorResponse.message = "Server error. Please try again later.";
          break;
        default:
          errorResponse.message =
            error.response.data?.message || "An error occurred";
      }
    } else if (error.request) {
      errorResponse.message = "Check your internet connection.";
    } else {
      errorResponse.message = error.message;
    }

    return Promise.reject(errorResponse);
  }
);

export const apiCall = async <T = unknown>(
  method: string,
  url: string,
  options: ApiCallOptions = {}
): Promise<ApiResponse<T>> => {
  const { data, params, contentType, headers = {} } = options;

  const config = {
    method: method.toLowerCase(),
    url,
    data,
    params,
    headers: {
      ...headers,
      "Content-Type": contentType || "application/json",
    },
  };

  try {
    const response = await apiClient(config);
    return {
      success: true,
      data: response.data as T,
      status: response.status,
    };
  } catch (error: unknown) {
    const err = error as { message?: string; status?: number; data?: T };
    return {
      success: false,
      message: err.message,
      status: err.status,
      data: err.data,
    };
  }
};

export default apiClient;
