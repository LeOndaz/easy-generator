/**
 *
 *
 * This file is stolen from a personal project I worked on.
 *
 */

import { HttpException } from '@nestjs/common';
import 'reflect-metadata';

type ExceptionCtor<T extends HttpException = HttpException> = new (
  payload: any,
) => T;

interface ErrorMapItem<E = any> {
  error: new (...a: any[]) => E;
  /**
   * Either an `HttpException` class **or** a mapper that returns one.
   */
  throw:
    | ExceptionCtor
    | ((err: E) => HttpException & { constructor: ExceptionCtor });
}

/**
 * Wrap the method with a try/catch that translates domain errors to
 * `HttpException`s defined in `errorMap`.
 *
 * All metadata produced by other decorators is preserved automatically,
 * because:
 *   • `@MapErrors` runs **first** (closest to the method), swaps
 *     `descriptor.value` with `wrapped`, and returns.
 *   • Every decorator above it (@Post, @ApiOperation, …) receives the
 *     *wrapped* function and attaches its metadata to it, so nothing is lost.
 */
export function MapErrors(errorMap: ErrorMapItem[]) {
  return (
    _target: unknown,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>,
  ): TypedPropertyDescriptor<any> => {
    const originalMethod = descriptor.value;
    if (typeof originalMethod !== 'function') {
      return descriptor;
    }

    const wrapped = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (err) {
        for (const item of errorMap) {
          if (err instanceof item.error) {
            const thrower = item.throw as any;

            // ── case ①: class extending HttpException ─────────────────────────
            if (
              typeof thrower === 'function' &&
              (thrower === HttpException ||
                thrower.prototype instanceof HttpException)
            ) {
              throw new thrower({
                code: (err as any).code ?? item.error.name,
                message: err.message,
              });
            }

            // ── case ②: mapping callback returning HttpException ──────────────
            if (typeof thrower === 'function') {
              const mapped = thrower(err);
              if (!(mapped instanceof HttpException)) {
                throw new Error(
                  `MapErrors: mapping callback must return HttpException`,
                );
              }
              throw mapped;
            }
          }
        }
        throw err; // fall-through: no mapping found
      }
    };

    try {
      Object.defineProperty(wrapped, 'name', {
        value: originalMethod.name,
        configurable: true,
      });
    } catch {}

    descriptor.value = wrapped;
    return descriptor;
  };
}
