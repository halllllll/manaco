import {
  initActivityListSheet,
  initActivitySheet,
} from '@/server/repositories/activityListRepository';
import { initSettingsSheet } from '@/server/repositories/settingsRepository';
import { initUserSheet } from '@/server/repositories/userRepository';
import {
  LEARNING_ACTIVITY_SHEET_HEADERS,
  LEARNING_ACTIVITY_SHEET_NAME,
  SETTINGS_SHEET_HEADERS,
  SETTINGS_SHEET_NAME,
  USER_SHEET_HEADERS,
  USER_SHEET_NAME,
  ss,
} from '@/server/utils/constants';
import { getAndValidateHeaders } from '@/server/utils/validation';

import type { InitAppDTO, SpreadsheetValidateDTO } from '@/shared/types/dto';

/**
 * Service function to validate all sheets
 * @returns Validation result
 */
export function validateAllService(): SpreadsheetValidateDTO {
  const resultValidateUserSheet = getAndValidateHeaders(USER_SHEET_NAME, [...USER_SHEET_HEADERS]);

  const resultValidateActivitySheet = getAndValidateHeaders(LEARNING_ACTIVITY_SHEET_NAME, [
    ...LEARNING_ACTIVITY_SHEET_HEADERS,
  ]);

  const resultValidateSettingsSheet = getAndValidateHeaders(SETTINGS_SHEET_NAME, [
    ...SETTINGS_SHEET_HEADERS,
  ]);

  if (
    !resultValidateUserSheet.isValid ||
    !resultValidateActivitySheet.isValid ||
    !resultValidateSettingsSheet.isValid
  ) {
    console.error(
      `Validation failed:\nuser sheet: ${resultValidateUserSheet}:\nactivity sheet: ${resultValidateActivitySheet}\nsetting sheet: ${resultValidateSettingsSheet}`,
    );

    return {
      success: false,
      message: 'Validation failed',
      details: [
        ...resultValidateUserSheet.messages,
        ...resultValidateActivitySheet.messages,
        ...resultValidateSettingsSheet.messages,
      ].join('\n'),
    };
  }

  return {
    success: true,
    data: null,
  };
}

/**
 * Service function to initialize the application
 * Creates all necessary sheets with headers, validation rules, and default values
 * @returns Result of the operation
 */
export function initAppService(): InitAppDTO {
  try {
    // Create a temporary sheet as a safety measure
    // to ensure spreadsheet doesn't become empty during initialization
    const uuid = Utilities.getUuid();
    const tempSheet = ss.insertSheet(uuid);

    try {
      // Initialize all sheets - each function takes care of setting up headers,
      // column widths, validation rules, default values, and styling
      const userSheet = initUserSheet();
      const activitySheet = initActivitySheet();
      const settingsSheet = initSettingsSheet();
      const activityListSheet = initActivityListSheet();

      // Set the first row as frozen for all sheets (doing it here again to ensure consistency)
      userSheet.setFrozenRows(1);
      activitySheet.setFrozenRows(1);
      settingsSheet.setFrozenRows(1);
      activityListSheet.setFrozenRows(1);

      // Log successful initialization
      console.info('All sheets initialized successfully');
    } finally {
      // Always delete the temporary sheet when done
      ss.deleteSheet(tempSheet);
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    const err = error as Error;
    console.error('Failed to initialize application:', err);
    return {
      success: false,
      message: `Error: ${err.name}: ${err.message}`,
    };
  }
}
