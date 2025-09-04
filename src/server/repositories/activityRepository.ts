/**
 * Repository layer for learning activity data operations
 */
import { DataAccessError } from '@/server/utils/errors';
import { formatDate } from '@/server/utils/helpers';
import { validateSheetExists } from '@/server/utils/validation';
import type { LearningActivity, LearningActivityRequest } from '@/shared/types/activity';
import type { MemoData } from '@/shared/types/memo';
import type { Mood } from '@/shared/types/mood';
import { LEARNING_ACTIVITY_SHEET_HEADERS, type SHEET_NAME } from '../utils/constants';
import { createSheet, getAllRows, withLock } from './sheetUtils';

/**
 * Initialize learning activity sheet with headers
 * @returns Initialized activity sheet
 */
export function initActivitySheet(): GoogleAppsScript.Spreadsheet.Sheet {
  try {
    const sheet = createSheet('学習ログ');

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
 * Parse memo data from JSON string to MemoData array
 * memoはSpreadsheetにはセル内にJSON文字列で保存されているのでそれをパースする
 * @param memoString JSON string representation of memo data
 * @returns Parsed memo data array or undefined
 */
function parseMemoData(memoString: string): MemoData[] | undefined {
  if (!memoString || memoString.trim() === '') {
    return undefined;
  }

  try {
    const parsed = JSON.parse(memoString);
    // Validate that it's an array of MemoData
    if (Array.isArray(parsed)) {
      return parsed as MemoData[];
    }
    return undefined;
  } catch (error) {
    console.warn('Failed to parse memo data:', error);
    return undefined;
  }
}

/**
 * Get all activity logs from the learning activity sheet
 * @returns Array of activity logs with user IDs
 */
export function getAllActivityLogs(): (LearningActivity & { userId: string })[] {
  try {
    const rows = getAllRows('学習ログ');
    return rows.map((row) => ({
      userId: String(row[1]),
      activityDate: String(row[2]),
      score: Number(row[3]),
      duration: Number(row[4]),
      mood: row[5] ? (String(row[5]) as Mood) : undefined,
      activityType: row[6]
        ? String(row[6])
            .split(',')
            .map((s) => s.trim())
        : [],
      memo: parseMemoData(String(row[7])),
    }));
  } catch (error) {
    const err = error as unknown as Error;
    console.error(error);
    throw new DataAccessError('Failed to get activity logs', err.stack);
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
      const sheetName: SHEET_NAME = '学習ログ';
      const { isExist, sheet } = validateSheetExists(sheetName);

      if (!isExist) {
        return { ok: false, message: `Sheet "${sheetName}" does not exist.` };
      }

      sheet.appendRow([
        formatDate(new Date()),
        activity.userId,
        activity.activityDate,
        activity.score,
        activity.duration,
        activity.mood,
        activity.activityType ? activity.activityType.join(', ') : '',
        // memoでーたは文字列として保存する。使用するときは使用する側の都合でparseする
        JSON.stringify(activity.memo),
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
  const { isExist, sheet } = validateSheetExists('学習ログ');

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
