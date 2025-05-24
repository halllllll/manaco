import { type SettingsResult, type SettingsSheetItem, ss } from './Const';

export interface SheetInfo {
  name: string;
  headers: string[];
}

export interface ValidationResult<T = any[][]> {
  isValid: boolean;
  messages: string[];
  data?: T;
  details?: Record<string, any>;
}

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class SheetValidator {
  static validateSheetExists(sheetName: string):
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

  static getAndValidateHeaders<T>(
    sheetName: string,
    expectedHeaders: string[],
  ): ValidationResult<T[]> {
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
    const { isExist, sheet } = this.validateSheetExists(sheetName);
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
      data: headers,
    };
  }

  // 設定シート用
  static validateSettingSheetItems(
    sheetName: string,
    items: SettingsSheetItem[],
  ): ValidationResult {
    // biome-ignore lint/complexity/noThisInStatic: <explanation>
    const { isExist, sheet } = this.validateSheetExists(sheetName);
    if (!isExist) {
      return {
        isValid: false,
        messages: [`Sheet "${sheetName}" does not exist.`],
      };
    }

    const settingValues = sheet.getDataRange().getValues().slice(1);

    const itemNames = settingValues.map((row) => row[0]);

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
    let result: SettingsResult[] = [];
    let isValid = true;
    const itemValuesAndType = settingValues.map((row, idx) => {
      return {
        type: items[idx].type,
        key: row[0],
        value: row[1],
      };
    });
    for (const item of itemValuesAndType) {
      switch (item.type) {
        case 'number':
          isValid = !Number.isNaN(item.value);
          break;
        case 'boolean':
          isValid =
            typeof item.value === 'boolean' ||
            item.value === 'TRUE' ||
            item.value === 'FALSE' ||
            item.value === 'true' ||
            item.value === 'false';
          break;
        case 'date':
          isValid = !Number.isNaN(new Date(item.value).getTime());
          break;
        default:
          isValid = false;
      }
      result = [...result, { item: item.key as SettingsSheetItem['name'], value: item.value }];
    }

    if (!isValid) {
      return {
        isValid: false,
        messages: [
          `${sheetName}シートの値が不正です : ${items.map((item) => item.name).join(', ')}`,
        ],
        details: {
          itemValuesAndType,
        },
      };
    }

    return {
      isValid: true,
      messages: [],
    };
  }

  // static getSettingItems(sheetName: string, items: SettingsSheetItem[]): SettingsResult[] {
  //   // biome-ignore lint/complexity/noThisInStatic: <explanation>
  //   const { isExist, sheet } = this.validateSheetExists(sheetName);
  //   if (!isExist) {
  //     throw new Error(`Sheet "${sheetName}" does not exist.`);
  //   }
  //   const settingValues = sheet.getDataRange().getValues().slice(1);

  //   let result: SettingsResult[] = [];
  //   const itemValuesAndType = settingValues.map((row, idx) => {
  //     return {
  //       type: items[idx].type,
  //       key: row[0],
  //       value: row[1],
  //     };
  //   });

  //   for (const item of itemValuesAndType) {
  //     result = [...result, { item: item.key as SettingsSheetItem['name'], value: item.value }];
  //   }
  //   return result;
  // }
}
