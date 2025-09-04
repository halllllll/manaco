/**
 * API handler for settings-related endpoints
 */
import { getActivityListService } from '@/server/services/activityListService';
import { getMemoListService } from '@/server/services/memoService';
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

  // Descriminiated Unionsでの分岐が面倒なので、showXXXにかかわらず、とりあえず取得する。showXXXにかかわらず、それに付随するデータは返す。存在しない場合は空配列になる。クライアント側で表示二利用するときはよしなにやる
  // TODO: 並行で取得
  const activityItems = getActivityListService();
  const memos = getMemoListService();
  if (activityItems.success && memos.success) {
    return {
      success: true,
      data: {
        ...settings.data,
        showActivity: settings.data.showActivity,
        activityItems: activityItems.data,
        showMemo: settings.data.showMemo,
        memoFields: memos.data,
      },
    };
  }

  return {
    success: false,
    message: `${!activityItems.success && `${activityItems.message} - ${activityItems.details}`}
      ${!memos.success && `\n${memos.message} - ${memos.details}`}`,
  };
}
