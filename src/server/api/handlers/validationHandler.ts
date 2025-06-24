/**
 * API handler for validation and initialization
 */
import { initAppService, validateAllService } from '@/server/services/validationService';
import type { InitAppDTO, SpreadsheetValidateDTO } from '@/shared/types/dto';

/**
 * Handler for validating all sheets
 * @returns Validation result
 */
export function validateAllHandler(): SpreadsheetValidateDTO {
  return validateAllService();
}

/**
 * Handler for initializing the application
 * @returns Result of the operation
 */
export function initAppHandler(): InitAppDTO {
  return initAppService();
}
