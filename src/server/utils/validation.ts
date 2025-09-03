/**
 * Validation utilities for data validation
 */
import { type SHEET_NAME, ss } from './constants';
import { ValidationError } from './errors';

export interface SheetInfo {
  name: string;
  headers: string[];
}

export interface ValidationResult<T = unknown[][]> {
  isValid: boolean;
  messages: string[];
  data?: T;
  details?: Record<string, unknown>;
}

/**
 * Validates if a sheet exists in the active spreadsheet
 * @param sheetName Name of the sheet to validate
 * @returns Object indicating if the sheet exists and the sheet object if it does
 */
export function validateSheetExists(sheetName: SHEET_NAME):
  | {
      sheet: GoogleAppsScript.Spreadsheet.Sheet;
      isExist: true;
    }
  | {
      sheet: null;
      isExist: false;
    } {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    return { isExist: false, sheet: null };
  }
  return { isExist: true, sheet };
}

/**
 * Gets and validates headers of a sheet
 * @param sheetName Name of the sheet to validate
 * @param expectedHeaders Expected headers in the sheet
 * @returns Validation result
 */
export function getAndValidateHeaders<T>(
  sheetName: SHEET_NAME,
  expectedHeaders: string[],
): ValidationResult<T[]> {
  const { isExist, sheet } = validateSheetExists(sheetName);
  if (!isExist) {
    return {
      isValid: false,
      messages: [`Sheet "${sheetName}" does not exist.`],
    };
  }

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  if (headers.length !== expectedHeaders.length) {
    return {
      isValid: false,
      messages: [
        `Header count mismatch. Expected ${expectedHeaders.length}, but got ${headers.length}.`,
      ],
      details: {
        expected: expectedHeaders,
        actual: headers,
      },
    };
  }

  const missingHeaders = [];
  for (let i = 0; i < headers.length; i++) {
    if (headers[i] !== expectedHeaders[i]) {
      missingHeaders.push(`Header "${expectedHeaders[i]}" is missing or incorrect.`);
    }
  }

  if (missingHeaders.length > 0) {
    return {
      isValid: false,
      messages: [`Missing headers in ${sheetName} : ${missingHeaders.join(', ')}`],

      details: {
        missingHeaders,
        expected: expectedHeaders,
        actual: headers,
      },
    };
  }

  return {
    isValid: true,
    messages: [],
    data: headers as unknown as T[],
  };
}

/**
 * Validates that a value is not empty
 * @param value Value to validate
 * @param message Error message to throw if validation fails
 */
export function validateNotEmpty<T>(value: T, message: string): void {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
    throw new ValidationError(message);
  }
}

/**
 * Validates that a value is a number in range
 * @param value Value to validate
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @param message Error message to throw if validation fails
 */
export function validateNumberInRange(
  value: number,
  min: number,
  max: number,
  message: string,
): void {
  if (typeof value !== 'number' || Number.isNaN(value) || value < min || value > max) {
    throw new ValidationError(message);
  }
}
