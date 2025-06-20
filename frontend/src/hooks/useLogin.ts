import { useContext } from 'react';
import {
  useAuthControllerSignInV1,
  type SignInResponseDto,
  type SignInDto,
} from '../api/api';
import { UserContext } from '../contexts/UserContext';
import { type UseMutationOptions } from '@tanstack/react-query';
import { handleApiError } from '../utils/errorHandler';
import { type ApiError } from '../utils/client';

type Options = Omit<
  UseMutationOptions<SignInResponseDto, Error, { data: SignInDto }>,
  'mutationFn'
>;

export const useLogin = (options?: Options) => {
  const { setUser } = useContext(UserContext);

  return useAuthControllerSignInV1({
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
