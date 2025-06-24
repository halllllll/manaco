/**
 * Repository layer for settings data operations
 */
import {
  DefaultSettingsItemValue,
  SETTINGS_SHEET_HEADERS,
  SETTINGS_SHEET_LABEL,
  SETTINGS_SHEET_NAME,
  type SettingsItem,
  type SettingsResult,
} from '@/server/utils/constants';
import { DataAccessError } from '@/server/utils/errors';
import { assertNever } from '@/server/utils/helpers';
import { validateSheetExists } from '@/server/utils/validation';
import type { AppSettings } from '@/shared/types/settings';
import { createSheet, getAllRows } from './sheetUtils';

/**
 * Get all settings from the settings sheet
 * @returns Array of setting items with values
 */
export function getAllSettings(): SettingsResult[] {
  try {
    const { isExist } = validateSheetExists(SETTINGS_SHEET_NAME);

    if (!isExist) {
      throw new DataAccessError(`Settings sheet "${SETTINGS_SHEET_NAME}" does not exist.`);
    }

    const rows = getAllRows(SETTINGS_SHEET_NAME);

    return rows.map((row) => {
      const item = row[0] as SettingsItem;
      const rawValue = String(row[1]); // Ensure we have a string to work with

      // Find the setting type from SETTINGS_SHEET_LABEL
      const settingItem = SETTINGS_SHEET_LABEL.find((setting) => setting.name === item);

      let value: Date | number | boolean;

      if (settingItem) {
        switch (settingItem.type) {
          case 'boolean':
            // Google Sheets stores booleans as strings 'TRUE' or 'FALSE'
            value = rawValue === 'TRUE';
            break;
          case 'number':
            value = Number(rawValue);
            break;
          case 'date':
            value = new Date(rawValue);
            break;
          default:
            // This should never happen due to TypeScript's exhaustiveness check
            value = rawValue as unknown as Date | number | boolean;
        }
      } else {
        // Default handling if setting type is not found
        if (rawValue === 'TRUE' || rawValue === 'FALSE') {
          value = rawValue === 'TRUE';
        } else if (!Number.isNaN(Number(rawValue))) {
          value = Number(rawValue);
        } else {
          value = rawValue as unknown as Date | number | boolean;
        }
      }

      return { item, value };
    });
  } catch (error) {
    throw new DataAccessError('Failed to get settings', error);
  }
}

/**
 * Convert raw settings data to AppSettings object
 * @param settingsData Raw settings data
 * @returns Structured AppSettings object
 */
export function mapSettingsToAppSettings(settingsData: SettingsResult[]): AppSettings {
  return settingsData.reduce((settings, item) => {
    const { item: label, value } = item;

    switch (label) {
      case '点数下限':
        settings.scoreMin = Number(value);
        break;
      case '点数上限':
        settings.scoreMax = Number(value);
        break;
      case 'きもち表示':
        settings.showMood = Boolean(value);
        break;
      case 'メモ表示':
        settings.showMemo = Boolean(value);
        break;
      case '秒表示':
        settings.showSecond = Boolean(value);
        break;
      case '点数記録':
        settings.showScore = Boolean(value);
        break;
      case '学習時間を記録':
        settings.showStudyTime = Boolean(value);
        break;
      case '取り組み表示':
        settings.showActivity = Boolean(value);
        break;
      default:
        assertNever(label);
        break;
    }

    return settings;
  }, {} as AppSettings);
}

/**
 * Initialize the settings sheet with default values
 * @returns Initialized settings sheet
 */
export function initSettingsSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  try {
    const sheet = createSheet(SETTINGS_SHEET_NAME);

    // Set headers
    const headerRange = sheet.getRange(1, 1, 1, SETTINGS_SHEET_HEADERS.length);
    headerRange.setValues([[...SETTINGS_SHEET_HEADERS]]);
    headerRange.setFontWeight('bold');

    // Set column widths
    sheet.setColumnWidths(1, SETTINGS_SHEET_HEADERS.length, 100);

    // Freeze the header row
    sheet.setFrozenRows(1);

    // Set default values
    sheet
      .getRange(2, 1, DefaultSettingsItemValue.length, 3)
      .setValues(DefaultSettingsItemValue.map((item) => [item.name, item.value, item.desc]));

    // Set validation rules for each setting type
    for (const label of SETTINGS_SHEET_LABEL) {
      const targetRange = sheet.getRange(label.rowAt, 2);

      switch (label.type) {
        case 'boolean':
          targetRange.setDataValidation(
            SpreadsheetApp.newDataValidation().requireValueInList(['FALSE', 'TRUE'], true).build(),
          );
          break;
        case 'number':
          targetRange.setDataValidation(
            SpreadsheetApp.newDataValidation().requireNumberBetween(0, 1000).build(),
          );
          break;
        case 'date':
          targetRange.setDataValidation(SpreadsheetApp.newDataValidation().requireDate().build());
          break;
        default:
          assertNever(label.type);
          break;
      }
    }

    return sheet;
  } catch (error) {
    throw new DataAccessError('Failed to initialize settings sheet', error);
  }
}

/**
 * Validate if settings sheet exists with correct headers
 * @returns Validation result
 */
export function validateSettingsSheet(): boolean {
  const { isExist, sheet } = validateSheetExists(SETTINGS_SHEET_NAME);

  if (!isExist) {
    return false;
  }

  try {
    const headers = sheet.getRange(1, 1, 1, SETTINGS_SHEET_HEADERS.length).getValues()[0];
    return headers.every(
      (header: string, index: number) => header === SETTINGS_SHEET_HEADERS[index],
    );
  } catch (error) {
    throw new DataAccessError('Failed to validate settings sheet', error);
  }
}
