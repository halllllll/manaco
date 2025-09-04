/**
 * Repository layer for activity sheet initialization
 */
import { ACTIVITY_LIST_SHEET_HEADERS, DefaultActivityList } from '@/server/utils/constants';
import { DataAccessError } from '@/server/utils/errors';
import type { ActivityItem } from '@/shared/types/activity';
import { createSheet, getAllDataRange } from './sheetUtils';

/**
 * Initialize activity list sheet with headers and default values
 * @returns Initialized activity list sheet
 */
export function initActivityListSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  try {
    const sheet = createSheet('取り組みリスト');

    // Set headers with styling
    const headerRange = sheet.getRange(1, 1, 1, ACTIVITY_LIST_SHEET_HEADERS.length);
    headerRange.setValues([[...ACTIVITY_LIST_SHEET_HEADERS]]);
    headerRange.setFontWeight('bold');

    // Set column widths
    sheet.setColumnWidths(1, ACTIVITY_LIST_SHEET_HEADERS.length, 100);

    // Freeze the header row
    sheet.setFrozenRows(1);

    // Set default activity values and background colors exactly as in the original
    if (DefaultActivityList.length > 0) {
      const dataRange = sheet.getRange(2, 1, DefaultActivityList.length, 2);
      dataRange.setValues(DefaultActivityList.map((item) => [item.name, item.desc]));
      dataRange.setBackgrounds(DefaultActivityList.map((item) => [item.color, '#fff']));
    }

    return sheet;
  } catch (error) {
    throw new DataAccessError('Failed to initialize activity list sheet', { cause: error });
  }
}

export function getActivityItems(): ActivityItem[] {
  const dataRange = getAllDataRange('取り組みリスト');
  // セルの背景色を取得して文字列として扱う
  const backgrounds = dataRange.getBackgrounds().slice(1);
  const values = dataRange.getValues().slice(1); // Skip header row

  return values.map((row, i) => {
    return {
      name: row[0] as string,
      color: backgrounds[i][0] as string,
    };
  });
}
