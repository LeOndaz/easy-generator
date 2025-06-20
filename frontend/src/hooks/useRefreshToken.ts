import {
  useAuthControllerRefreshTokenV1,
  type RefreshTokenResponseDto,
  type RefreshTokenDto,
} from '../api/api';
import { type UseMutationOptions } from '@tanstack/react-query';

type Options = Omit<
  UseMutationOptions<RefreshTokenResponseDto, Error, { data: RefreshTokenDto }>,
  'mutationFn'
>;

export const useRefreshToken = (options?: Options) => {
  return useAuthControllerRefreshTokenV1({
    mutation: {
      ...options,
      onSuccess: (data, ...rest) => {
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
        options?.onSuccess?.(data, ...rest);
      },
      onError: (error, ...rest) => {
        options?.onError?.(error, ...rest);
      },
    },
  });
};
