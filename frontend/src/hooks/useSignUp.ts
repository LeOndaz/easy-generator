import { useContext } from 'react';
import { useAuthControllerSignUpV1, type SignInResponseDto, type SignUpDto } from '../api/api';
import { UserContext } from '../contexts/UserContext';
import { type UseMutationOptions } from '@tanstack/react-query';
import { type ApiError } from '../utils/client';
import { handleApiError } from '../utils/errorHandler';

type Options = Omit<UseMutationOptions<SignInResponseDto, Error, { data: SignUpDto }>, 'mutationFn'>;

export const useSignUp = (options?: Options) => {
  const { setUser } = useContext(UserContext);

  return useAuthControllerSignUpV1({
    mutation: {
      ...options,
      onSuccess: (data, ...rest) => {
        if (data.accessToken && data.refreshToken && data.user) {
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);
          setUser(data.user);
        }
        options?.onSuccess?.(data, ...rest);
      },
      onError: (error: ApiError, ...rest) => {
        handleApiError(error);
        options?.onError?.(error, ...rest);
      },
    },
  });
}; 