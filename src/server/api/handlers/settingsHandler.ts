/**
 * API handler for settings-related endpoints
 */
import { getActivityListService } from '@/server/services/activityListService';
import { getSettingsService } from '@/server/services/settingsService';
import type { AppSettingResponse } from '@/shared/types/dto';

/**
 * Handler for getting application settings
 * showActivity is true, it will also include activity items
 * @returns Settings data
 */
export function getSettingsHandler(): AppSettingResponse {
  const settings = getSettingsService();
  if (!settings.success) {
    return {
      success: false,
      message: settings.message || 'Failed to retrieve settings',
    };
  }

  if (settings.success && settings.data.showActivity) {
    const activityItems = getActivityListService();
    if (activityItems.success) {
      return {
        success: true,
        data: {
          ...settings.data,
          activityItems: activityItems.data,
        },
      };
    }
    // エラー
    return {
      success: false,
      message: activityItems.message || 'Failed to retrieve activity items',
    };
  }
  return {
    success: true,
    data: {
      ...settings.data,
      showActivity: false,
    },
  };
}
