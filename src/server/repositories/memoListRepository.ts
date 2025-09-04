/**
 * Repository layer for activity sheet initialization
 */
import { DefaultMemoList, MEMO_LIST_SHEET_HEADERS } from '@/server/utils/constants';
import { DataAccessError } from '@/server/utils/errors';
import type { Memo } from '@/shared/types/memo';
import { createSheet, getAllDataRange } from './sheetUtils';

/**
 * Initialize activity list sheet with headers and default values
 * @returns Initialized activity list sheet
 */
export function initMemoListSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  try {
    const sheet = createSheet('自由記述欄リスト');

    // Set headers with styling
    const headerRange = sheet.getRange(1, 1, 1, MEMO_LIST_SHEET_HEADERS.length);
    headerRange.setValues([[...MEMO_LIST_SHEET_HEADERS]]);
    headerRange.setFontWeight('bold');

    // Set column widths
    sheet.setColumnWidths(1, MEMO_LIST_SHEET_HEADERS.length, 100);

    // Freeze the header row
    sheet.setFrozenRows(1);

    // Set default activity values and background colors exactly as in the original
    if (DefaultMemoList.length > 0) {
      const dataRange = sheet.getRange(2, 1, DefaultMemoList.length, 2);
      dataRange.setValues(DefaultMemoList.map((item) => [item.label, item.placeholder]));
    }

    return sheet;
  } catch (error) {
    throw new DataAccessError('Failed to initialize activity list sheet', { cause: error });
  }
}

export function getMemos(): Memo[] {
  const dataRange = getAllDataRange('自由記述欄リスト');
  const values = dataRange.getValues().slice(1); // Skip header row

  return values.map((row) => {
    return {
      label: row[0] as string,
      placeholder: row[1] as string,
    };
  });
}
