import { notification } from 'antd';
import { type ApiError } from './client';

// This is the shape of the data property inside an ApiError
interface BackendErrorPayload {
  code?: string;
  message: string | string[];
}

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const formatCodeToTitle = (code: string) => {
  return code.replace(/_/g, ' ').split(' ').map(capitalize).join(' ');
};

export const handleApiError = (error: ApiError) => {
  let errorTitle = 'Operation Failed';
  let errorMessage = 'An unexpected error occurred. Please try again.';

  const data = error.data;

  if (data) {
    // Case 1: Coded error from our backend (e.g., INVALID_CREDENTIALS)
    if (data.code) {
      errorTitle = formatCodeToTitle(data.code);
    }

    // Case 2: Validation errors (array of messages) or single string message
    if (Array.isArray(data.message)) {
      errorMessage = data.message.join('; ');
    } else {
      errorMessage = data.message;
    }
  }
  // Fallback for network errors or other non-API errors where `error.data` is not populated
  else if (error.message) {
    errorMessage = error.message;
  }

  notification.error({
    message: errorTitle,
    description: errorMessage,
  });
};
