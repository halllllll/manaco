/**
 * Repository layer for learning activity data operations
 */
import { DataAccessError } from '@/server/utils/errors';
import { formatDate } from '@/server/utils/helpers';
import { validateSheetExists } from '@/server/utils/validation';
import type { LearningActivity, LearningActivityRequest } from '@/shared/types/activity';
import type { Mood } from '@/shared/types/mood';
import { LEARNING_ACTIVITY_SHEET_HEADERS, LEARNING_ACTIVITY_SHEET_NAME } from '../utils/constants';
import { createSheet, getAllRows, withLock } from './sheetUtils';

/**
 * Initialize learning activity sheet with headers
 * @returns Initialized activity sheet
 */
export function initActivitySheet(): GoogleAppsScript.Spreadsheet.Sheet {
  try {
    const sheet = createSheet(LEARNING_ACTIVITY_SHEET_NAME);

    // Set headers with styling
    const headerRange = sheet.getRange(1, 1, 1, LEARNING_ACTIVITY_SHEET_HEADERS.length);
    headerRange.setValues([[...LEARNING_ACTIVITY_SHEET_HEADERS]]);
    headerRange.setFontWeight('bold');

    // Set column widths
    sheet.setColumnWidths(1, LEARNING_ACTIVITY_SHEET_HEADERS.length, 100);

    // Freeze the header row
    sheet.setFrozenRows(1);

    return sheet;
  } catch (error) {
    throw new DataAccessError('Failed to initialize activity sheet', error);
  }
}

/**
 * Get all activity logs from the learning activity sheet
 * @returns Array of activity logs with user IDs
 */
export function getAllActivityLogs(): (LearningActivity & { userId: string })[] {
  try {
    const rows = getAllRows(LEARNING_ACTIVITY_SHEET_NAME);

    return rows.map((row) => ({
      userId: String(row[1]),
      activityDate: String(row[2]),
      score: Number(row[3]),
      duration: Number(row[4]),
      mood: row[5] ? (String(row[5]) as Mood) : undefined,
      memo: row[6] ? String(row[6]) : undefined,
    }));
  } catch (error) {
    throw new DataAccessError('Failed to get activity logs', error);
  }
}

/**
 * Get learning activities for a specific user
 * @param userId ID of the user
 * @returns Array of learning activities for the user
 */
export function getActivitiesByUserId(userId: string): LearningActivity[] {
  try {
    const activities = getAllActivityLogs();
    return activities
      .filter((activity) => activity.userId.trim() === userId.trim())
      .map(({ userId, ...activity }) => activity); // Remove userId from the result
  } catch (error) {
    throw new DataAccessError(`Failed to get activities for user: ${userId}`, error);
  }
}

/**
 * Save a new learning activity
 * @param activity Learning activity to save
 * @returns Object indicating success or failure
 */
export function saveActivity(activity: LearningActivityRequest): { ok: boolean; message: string } {
  try {
    return withLock(() => {
      const { isExist, sheet } = validateSheetExists(LEARNING_ACTIVITY_SHEET_NAME);

      if (!isExist) {
        return { ok: false, message: `Sheet "${LEARNING_ACTIVITY_SHEET_NAME}" does not exist.` };
      }

      sheet.appendRow([
        formatDate(new Date()),
        activity.userId,
        activity.activityDate,
        activity.score,
        activity.duration,
        activity.mood,
        'TODO',
        activity.memo,
      ]);

      return { ok: true, message: 'Activity saved successfully' };
    });
  } catch (error) {
    const err = error as Error;
    return { ok: false, message: `${err.name}: ${err.message}` };
  }
}

/**
 * Validate if activity sheet exists with correct headers
 * @returns Validation result
 */
export function validateActivitySheet(): boolean {
  const { isExist, sheet } = validateSheetExists(LEARNING_ACTIVITY_SHEET_NAME);

  if (!isExist) {
    return false;
  }

  try {
    const headers = sheet.getRange(1, 1, 1, LEARNING_ACTIVITY_SHEET_HEADERS.length).getValues()[0];
    return headers.every(
      (header: string, index: number) => header === LEARNING_ACTIVITY_SHEET_HEADERS[index],
    );
  } catch (error) {
    throw new DataAccessError('Failed to validate activity sheet', error);
  }
}
