/**
 * API handler for settings-related endpoints
 */
import { getSettingsService } from '@/server/services/settingsService';
import type { SettingsDTO } from '@/shared/types/dto';

/**
 * Handler for getting application settings
 * @returns Settings data
 */
export function getSettingsHandler(): SettingsDTO {
  return getSettingsService();
}
