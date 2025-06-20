import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

const toUnderscoreCase = (str: string) =>
  str.replace(/\s+/g, '_').toUpperCase();

interface CodedError {
  code: string;
  message: string;
}

function isCodedError(payload: unknown): payload is CodedError {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'code' in payload &&
    'message' in payload
  );
}

interface NestError {
  message: string | string[];
}

function isNestError(payload: unknown): payload is NestError {
  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('message' in payload)
  ) {
    return false;
  }

  const message = payload.message;
  return typeof message === 'string' || Array.isArray(message);
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseBody: object;

    if (exception instanceof HttpException) {
      const errorResponse = exception.getResponse();

      if (isCodedError(errorResponse)) {
        // Case 1: Our custom error format { code, message }
        responseBody = {
          code: errorResponse.code,
          message: errorResponse.message,
        };
      } else if (isNestError(errorResponse)) {
        // Case 2: NestJS default error format { message, ... }
        responseBody = { message: errorResponse.message };
      } else if (typeof errorResponse === 'string') {
        // Case 3: Error response is just a string
        responseBody = { message: errorResponse };
      } else {
        // Fallback for other unexpected object shapes
        responseBody = { message: 'An internal server error occurred.' };
      }
    } else {
      // Case 4: Not an HttpException
      this.logger.error(
        `Unhandled Exception: ${JSON.stringify(exception)}`,
        (exception as Error).stack,
        `${request.method} ${request.url}`,
      );
      responseBody = { message: 'An internal server error occurred.' };
    }

    response.status(status).json(responseBody);
  }
} 