import { initActivityListSheet } from '@/server/repositories/activityListRepository';
import { initActivitySheet } from '@/server/repositories/activityRepository';
import { initSettingsSheet } from '@/server/repositories/settingsRepository';
import { initUserSheet } from '@/server/repositories/userRepository';
import {
  ACTIVITY_LIST_SHEET_HEADERS,
  ACTIVITY_LIST_SHEET_NAME,
  LEARNING_ACTIVITY_SHEET_HEADERS,
  LEARNING_ACTIVITY_SHEET_NAME,
  SETTINGS_SHEET_HEADERS,
  SETTINGS_SHEET_LABEL,
  SETTINGS_SHEET_NAME,
  type SettingsResult,
  type SettingsSheetItem,
  USER_SHEET_HEADERS,
  USER_SHEET_NAME,
  ss,
} from '@/server/utils/constants';
import { getAndValidateHeaders, validateSheetExists } from '@/server/utils/validation';

import type { InitAppDTO, SpreadsheetValidateDTO } from '@/shared/types/dto';

/**
 * バリデーション結果を表す型
 */
export interface ValidationResult<T = unknown> {
  isValid: boolean;
  messages: string[];
  data?: T;
  details?: Record<string, unknown>;
}

/**
 * シートバリデータ関数の型
 */
export type SheetValidatorFn = (sheetName: string) => ValidationResult;

/**
 * シートバリデータの構造
 */
export type SheetValidatorEntry = {
  /** バリデータ名 */
  name: string;
  /** バリデータが対象とするシート名 */
  targetSheetName: string;
  /** バリデーション実行関数 */
  validate: SheetValidatorFn;
};

/**
 * 基本的なシートヘッダーバリデーション関数を生成
 * @param targetSheetName 対象シート名
 * @param expectedHeaders 期待されるヘッダー配列
 * @returns ヘッダーバリデータのエントリ
 */
export function createHeaderValidator(
  targetSheetName: string,
  expectedHeaders: readonly string[],
): SheetValidatorEntry {
  return {
    name: `HeaderValidator-${targetSheetName}`,
    targetSheetName,
    validate: () => getAndValidateHeaders(targetSheetName, [...expectedHeaders]),
  };
}

/**
 * バリデータレジストリ初期化関数
 * 全てのバリデータを登録
 */
function createValidatorRegistry(): SheetValidatorEntry[] {
  return [
    // 基本的なヘッダーバリデーション
    createHeaderValidator(USER_SHEET_NAME, USER_SHEET_HEADERS),
    createHeaderValidator(LEARNING_ACTIVITY_SHEET_NAME, LEARNING_ACTIVITY_SHEET_HEADERS),
    createHeaderValidator(SETTINGS_SHEET_NAME, SETTINGS_SHEET_HEADERS),
    createHeaderValidator(ACTIVITY_LIST_SHEET_NAME, ACTIVITY_LIST_SHEET_HEADERS),

    // 設定シート特有のバリデーション
    createSettingsValidator(SETTINGS_SHEET_NAME, SETTINGS_SHEET_LABEL),

    // 将来的に追加するバリデータをここに登録する
    // 例:
    // {
    //   name: 'UserRoleValidator',
    //   targetSheetName: USER_SHEET_NAME,
    //   validate: validateUserRoles
    // }
  ];
}

/**
 * バリデーション結果とメタデータを保持する型
 */
type ValidationResultWithMeta = {
  validatorName: string;
  targetSheet: string;
  result: ValidationResult;
};

/**
 * Service function to validate all sheets
 * @returns Validation result
 */
export function validateAllService(): SpreadsheetValidateDTO {
  try {
    // バリデータを初期化
    const validators = createValidatorRegistry();

    // 登録されたすべてのバリデータを実行
    const allResults: ValidationResultWithMeta[] = validators.map((validator) => {
      const result = validator.validate(validator.targetSheetName);
      return {
        validatorName: validator.name,
        targetSheet: validator.targetSheetName,
        result,
      };
    });

    // いずれかのバリデーションが失敗していた場合はエラーを返す
    const failedResults = allResults.filter((item) => !item.result.isValid);
    const hasInvalidResult = failedResults.length > 0;

    if (hasInvalidResult) {
      console.error(
        `Validation failed:\n${failedResults
          .map(
            (item) =>
              `${item.validatorName} for ${item.targetSheet}: ${JSON.stringify(item.result)}`,
          )
          .join('\n')}`,
      );

      // 全てのエラーメッセージを集約
      const allMessages = failedResults.flatMap((item) => item.result.messages);

      return {
        success: false,
        message: 'Validation failed',
        details: allMessages.join('\n'),
      };
    }

    return {
      success: true,
      data: null,
    };
  } catch (error) {
    console.error('Error during validation:', error);
    const err = error as Error;
    return {
      success: false,
      message: `Validation error: ${err.message}`,
    };
  }
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

/**
 * 設定シートの内容を検証する関数
 * @param sheetName シート名
 * @param items 検証する設定項目の配列
 * @returns 検証結果
 */
export function validateSettingsSheetItems(
  sheetName: string,
  items: readonly SettingsSheetItem[],
): ValidationResult<SettingsResult[]> {
  const { isExist, sheet } = validateSheetExists(sheetName);

  if (!isExist) {
    return {
      isValid: false,
      messages: [`Sheet "${sheetName}" does not exist.`],
    };
  }

  // シートから値を取得
  const settingValues = sheet.getDataRange().getValues().slice(1);
  const itemNames = settingValues.map((row) => row[0]);

  // 設定項目の数と名前を検証
  if (
    itemNames.length !== items.length ||
    itemNames.some((name, index) => name !== items[index].name)
  ) {
    return {
      isValid: false,
      messages: [
        `${sheetName}シートの項目が不正です: ${items.map((item) => item.name).join(', ')}`,
      ],
    };
  }

  // 各設定値の型を検証
  const result: SettingsResult[] = [];
  let isValid = true;
  const invalidItems: string[] = [];

  const itemValuesAndType = settingValues.map((row, idx) => ({
    type: items[idx].type,
    key: row[0],
    value: row[1],
  }));

  for (const item of itemValuesAndType) {
    let itemIsValid = true;

    switch (item.type) {
      case 'number':
        itemIsValid = !Number.isNaN(Number(item.value));
        break;
      case 'boolean':
        itemIsValid =
          typeof item.value === 'boolean' ||
          item.value === 'TRUE' ||
          item.value === 'FALSE' ||
          item.value === 'true' ||
          item.value === 'false';
        break;
      case 'date':
        itemIsValid = !Number.isNaN(new Date(item.value).getTime());
        break;
      default:
        itemIsValid = false;
    }

    if (!itemIsValid) {
      isValid = false;
      invalidItems.push(`${item.key}(${item.type})`);
    }

    result.push({
      item: item.key as SettingsSheetItem['name'],
      value: item.value,
    });
  }

  if (!isValid) {
    return {
      isValid: false,
      messages: [`${sheetName}シートの値が不正です : ${invalidItems.join(', ')}`],
      details: {
        itemValuesAndType,
      },
    };
  }

  return {
    isValid: true,
    messages: [],
    data: result,
  };
}

/**
 * 設定シート検証バリデータを作成する関数
 * @param targetSheetName 対象シート名
 * @param items 検証する設定項目
 * @returns 設定シートバリデータ
 */
export function createSettingsValidator(
  targetSheetName: string = SETTINGS_SHEET_NAME,
  items: readonly SettingsSheetItem[] = SETTINGS_SHEET_LABEL,
): SheetValidatorEntry {
  return {
    name: 'SettingsContentValidator',
    targetSheetName,
    validate: (sheetName) => validateSettingsSheetItems(sheetName, items),
  };
}
