/**
 * Repository layer for user-related data operations
 */
import { DataAccessError } from '@/server/utils/errors';
import { validateSheetExists } from '@/server/utils/validation';
import { USER_ROLES, type User } from '@/shared/types/user';
import { USER_SHEET_HEADERS, USER_SHEET_NAME } from '../utils/constants';
import { createSheet, getAllRows } from './sheetUtils';

/**
 * Get all users from the user sheet
 * @returns Array of User objects
 */
export function getAllUsers(): User[] {
  try {
    const rows = getAllRows(USER_SHEET_NAME);

    return rows.map((row) => ({
      id: String(row[0] ?? ''),
      name: String(row[1] ?? ''),
      role: String(row[2] ?? 'student') as User['role'],
      belonging: String(row[3] ?? ''),
    }));
  } catch (error) {
    throw new DataAccessError('Failed to get users', error);
  }
}

/**
 * Get a user by their ID
 * @param userId ID of the user to find
 * @returns User object or null if not found
 */
export function getUserById(userId: string): User | null {
  try {
    const users = getAllUsers();
    return users.find((user) => user.id === userId) ?? null;
  } catch (error) {
    throw new DataAccessError(`Failed to get user with ID: ${userId}`, error);
  }
}

/**
 * Get a user by their email (which is their ID in this case)
 * @param email Email of the user to find
 * @returns User object or null if not found
 */
export function getUserByEmail(email: string): User | null {
  return getUserById(email);
}

/**
 * Create a new user
 * @param user User object to create
 */
export function createUser(user: User): void {
  const { isExist, sheet } = validateSheetExists(USER_SHEET_NAME);

  if (!isExist) {
    throw new DataAccessError(`Sheet "${USER_SHEET_NAME}" does not exist.`);
  }

  try {
    sheet.appendRow([user.id, user.name, user.role, user.belonging]);
  } catch (error) {
    throw new DataAccessError(`Failed to create user: ${user.id}`, error);
  }
}

/**
 * Validate if user sheet exists with correct headers
 * @returns Validation result
 */
export function validateUserSheet(): boolean {
  const { isExist, sheet } = validateSheetExists(USER_SHEET_NAME);

  if (!isExist) {
    return false;
  }

  try {
    const headers = sheet.getRange(1, 1, 1, USER_SHEET_HEADERS.length).getValues()[0];
    return headers.every((header: string, index: number) => header === USER_SHEET_HEADERS[index]);
  } catch (error) {
    throw new DataAccessError('Failed to validate user sheet', error);
  }
}

/**
 * Initialize user sheet with headers and validation rules
 * @returns Initialized user sheet
 */
export function initUserSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  try {
    const sheet = createSheet(USER_SHEET_NAME);

    // Set tab color
    sheet.setTabColor('#FFD1DC');

    // Set headers with styling
    const headerRange = sheet.getRange(1, 1, 1, USER_SHEET_HEADERS.length);
    headerRange.setValues([[...USER_SHEET_HEADERS]]);
    headerRange.setBorder(
      true,
      true,
      true,
      true,
      true,
      true,
      '#FF9AAA',
      SpreadsheetApp.BorderStyle.SOLID,
    );
    headerRange.setBackground('#FFD1DC');

    // Set column widths
    sheet.setColumnWidths(1, USER_SHEET_HEADERS.length, 100);

    // Set data validation for role column
    sheet.getRange(2, 3, sheet.getMaxRows() - 1, 1).setDataValidation(
      SpreadsheetApp.newDataValidation()
        .requireValueInList([...USER_ROLES], true)
        .build(),
    );

    // Freeze the header row
    sheet.setFrozenRows(1);

    return sheet;
  } catch (error) {
    throw new DataAccessError('Failed to initialize user sheet', error);
  }
}
