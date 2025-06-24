/**
 * Service layer for settings operations
 */
import { getAllSettings, mapSettingsToAppSettings } from '@/server/repositories/settingsRepository';
import type { SettingsDTO } from '@/shared/types/dto';

/**
 * Service function to get application settings
 * @returns Settings data
 */
export function getSettingsService(): SettingsDTO {
  try {
    const settingsData = getAllSettings();
    const settings = mapSettingsToAppSettings(settingsData);

    return {
      data: settings,
      success: true,
    };
  } catch (error) {
    console.error(error);
    const err = error as Error;
    return {
      success: false,
      message: `Error: ${err.name}: ${err.message}`,
    };
  }
}
