/**
 * API handler for spreadsheet information
 */
// import { ss } from '../../utils/constants';
import { ss } from '@/server/utils/constants';

/**
 * Handler for getting the spreadsheet name
 * @returns Spreadsheet name
 */
export function getSpreadsheetNameHandler(): string {
  return ss.getName();
}

/**
 * Handler for getting the spreadsheet URL
 * @returns Spreadsheet URL
 */
export function getSpreadsheetUrlHandler(): string {
  return ss.getUrl();
}
