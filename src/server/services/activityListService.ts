import type { ActivityItemDTO } from '@/shared/types/dto';
import { getActivityItems } from '../repositories/activityListRepository';

export function getActivityListService(): ActivityItemDTO {
  try {
    const activityItems = getActivityItems();
    return {
      success: true,
      data: activityItems,
    };
  } catch (e) {
    console.error(e);
    const err = e as Error;
    return {
      success: false,
      message: `Error: ${err.name}: ${err.message}`,
    };
  }
}
