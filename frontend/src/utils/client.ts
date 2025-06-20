import { notification } from 'antd';

type RequestConfig = {
  url: string;
  method: string;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  data?: any;
  signal?: AbortSignal;
};

// Use environment variable for API base URL, fallback to full URL for production
const BASE_URL = "http://localhost:3000";

/**
 * The structured error payload from the backend.
 * `code` is optional and only present for specific, coded business logic errors.
 * `message` can be a single string or an array for validation errors.
 */
interface BackendErrorPayload {
  code?: string;
  message: string | string[];
}

export interface ApiError extends Error {
  response?: Response;
  data?: BackendErrorPayload;
}

async function handleResponse(response: Response) {
  if (response.ok) {
    const text = await response.text();
    // Handle cases like 204 No Content
    return text ? JSON.parse(text) : {};
  }

  // If the response is not OK, parse the error body
  const error: ApiError = new Error(`HTTP error! status: ${response.status}`);
  error.response = response;
  try {
    const responseData = await response.json();
    error.data = responseData;
  } catch (e) {
    // invalid 
  }
  throw error;
}

export const customInstance = async <T>(config: RequestConfig): Promise<T> => {
  const token = localStorage.getItem("accessToken");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...config.headers,
  };

  // Build URL with query parameters
  let url = `${BASE_URL}${config.url}`;
  if (config.params) {
    const searchParams = new URLSearchParams();
    Object.entries(config.params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const response = await fetch(url, {
    method: config.method,
    headers,
    ...(config.data && { body: JSON.stringify(config.data) }),
    signal: config.signal,
  });

  return handleResponse(response);
};
