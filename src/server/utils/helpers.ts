/**
 * Helper functions used throughout the server application
 */

/**
 * Converts a column number to A1 notation (e.g., 1 -> A, 27 -> AA)
 * @param columnNumber Column number to convert
 * @returns A1 notation string
 */
export const columnToA1 = (columnNumber: number): string => {
  if (columnNumber < 1) {
    throw new Error('Column number must be greater than 0');
  }

  let result = '';
  let num = columnNumber;

  while (num > 0) {
    // 1を引いて0ベースにする
    num--;
    // 26で割った余りから文字を決定
    result = String.fromCharCode(65 + (num % 26)) + result;
    // 26で割って次の桁へ
    num = Math.floor(num / 26);
  }

  return result;
};

/**
 * Helper function to ensure exhaustiveness checking in TypeScript
 * Use when handling discriminated unions to ensure all cases are covered.
 * @param value Value that should never occur
 */
export const assertNever = (_: never): never => {
  throw new Error('This code should not be called');
};

/**
 * Formats a date in the Asia/Tokyo timezone
 * @param date Date to format
 * @param format Format string
 * @returns Formatted date string
 */
export const formatDate = (date: Date, format = 'yyyy/MM/dd HH:mm:ss'): string => {
  return Utilities.formatDate(date, 'Asia/Tokyo', format);
};

/**
 * Creates a standard response object for consistent API responses
 */
export function createResponse<T>(success: boolean, data?: T, message?: string, details?: string) {
  if (success) {
    return {
      success: true,
      data,
    };
  }

  return {
    success: false,
    message: message || 'An error occurred',
    details,
  };
}
