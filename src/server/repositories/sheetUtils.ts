/**
 * Common utilities for repository operations on Google Sheets
 */
import { ss } from '@/server/utils/constants';
import { DataAccessError } from '@/server/utils/errors';
import { columnToA1 } from '@/server/utils/helpers';
import { validateSheetExists } from '@/server/utils/validation';

/**
 * Get all rows from a sheet as a 2D array
 * @param sheetName Name of the sheet to read from
 * @param includeHeader Whether to include the header row
 * @returns 2D array of values
 */
export function getAllRows(sheetName: string, includeHeader = false): unknown[][] {
  const { isExist, sheet } = validateSheetExists(sheetName);

  if (!isExist) {
    throw new DataAccessError(`Sheet "${sheetName}" does not exist.`);
  }

  try {
    // Try to use the Sheets API for better performance if available
    const values =
      Sheets.Spreadsheets?.Values?.get(
        sheet.getParent().getId(),
        `${sheetName}!A:${columnToA1(sheet.getLastColumn())}`,
      )?.values ?? sheet.getDataRange().getValues();

    return includeHeader ? values : values.slice(1);
  } catch (error) {
    throw new DataAccessError(`Failed to read data from sheet "${sheetName}"`, error);
  }
}

/**
 * Rangeを取得する
 */
export function getAllDataRange(sheetName: string): GoogleAppsScript.Spreadsheet.Range {
  const { isExist, sheet } = validateSheetExists(sheetName);

  if (!isExist) {
    throw new DataAccessError(`Sheet "${sheetName}" does not exist.`);
  }

  try {
    return sheet.getDataRange();
  } catch (error) {
    throw new DataAccessError(`Failed to get range from sheet "${sheetName}"`, error);
  }
}

/**
 * Append a row to a sheet
 * @param sheetName Name of the sheet to append to
 * @param rowData Array of values to append
 */
export function appendRow(sheetName: string, rowData: unknown[]): void {
  const { isExist, sheet } = validateSheetExists(sheetName);

  if (!isExist) {
    throw new DataAccessError(`Sheet "${sheetName}" does not exist.`);
  }

  try {
    sheet.appendRow(rowData);
  } catch (error) {
    throw new DataAccessError(`Failed to append row to sheet "${sheetName}"`, error);
  }
}

/**
 * Safe lock acquisition for sheet operations
 * @param operation Function to execute with lock
 * @returns Result of the operation
 */
export function withLock<T>(operation: () => T): T {
  const lock = LockService.getScriptLock();

  try {
    // Wait up to 30 seconds for the lock
    lock.waitLock(30000);
    return operation();
  } finally {
    // Always release the lock
    if (lock.hasLock()) {
      lock.releaseLock();
    }
  }
}

/**
 * Create a new sheet in the spreadsheet
 * @param name Name of the sheet to create
 * @returns The newly created sheet
 */
export function createSheet(name: string): GoogleAppsScript.Spreadsheet.Sheet {
  const targetSheet = ss.getSheetByName(name);

  if (targetSheet) {
    ss.deleteSheet(targetSheet);
  }

  return ss.insertSheet(name);
}

/**
 * Set headers for a sheet
 * @param sheet Sheet to set headers for
 * @param headers Array of header values
 * @param formatAsHeader Whether to format the header row as a header
 * @param backgroundColor Optional background color for the header
 * @param borderColor Optional border color for the header
 */
export function setHeaders(
  sheet: GoogleAppsScript.Spreadsheet.Sheet,
  headers: string[],
  formatAsHeader = true,
  backgroundColor?: string,
  borderColor?: string,
): void {
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers]);

  if (formatAsHeader) {
    headerRange.setFontWeight('bold');
  }

  if (backgroundColor) {
    headerRange.setBackground(backgroundColor);
  }

  if (borderColor) {
    headerRange.setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      borderColor,
      SpreadsheetApp.BorderStyle.SOLID,
    );
  }
}
