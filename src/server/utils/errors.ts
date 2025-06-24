/**
 * Error handling utilities for consistent error management
 */

/**
 * Custom error class for application-specific errors
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code?: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Error class for validation errors
 */
export class ValidationError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

/**
 * Error class for data access errors
 */
export class DataAccessError extends AppError {
  constructor(message: string, details?: unknown) {
    super(message, 'DATA_ACCESS_ERROR', details);
    this.name = 'DataAccessError';
  }
}

/**
 * Error class for unauthorized access
 */
export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access', details?: unknown) {
    super(message, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Catch and handle errors in a consistent way
 * @param fn Function to execute
 * @returns Result of the function or error response
 */
export function tryCatch<T>(fn: () => T) {
  try {
    return fn();
  } catch (error) {
    if (error instanceof AppError) {
      console.error(`${error.name}: ${error.message}`, error.details);
      return {
        success: false,
        message: error.message,
        details: error.details,
      };
    }

    const err = error as Error;
    console.error(`Unhandled error: ${err.name}: ${err.message}`);
    return {
      success: false,
      message: `Error: ${err.name}: ${err.message}`,
    };
  }
}
