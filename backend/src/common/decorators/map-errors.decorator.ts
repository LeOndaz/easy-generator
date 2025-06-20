import { HttpException } from '@nestjs/common';

interface ErrorMapItem {
  error: any;
  throw: ((err: any) => HttpException) | (new (...args: any[]) => HttpException);
}

export function MapErrors(errorMap: ErrorMapItem[]) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        for (const item of errorMap) {
          if (error instanceof item.error) {
            if (typeof item.throw === 'function') {
              // Check if it's a class constructor or a plain function
              const isClass = /^\s*class\s+/.test(item.throw.toString());
              if (isClass) {
                // It's an exception class, instantiate it with the default body
                throw new (item.throw as new (payload: any) => HttpException)({
                  code: error.code,
                  message: error.message,
                });
              } else {
                // It's a mapping function, call it
                throw (item.throw as (err: any) => HttpException)(error);
              }
            }
          }
        }
        // If no mapping was found, re-throw the original error
        throw error;
      }
    };

    return descriptor;
  };
} 