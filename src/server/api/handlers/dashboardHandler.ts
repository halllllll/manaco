/**
 * API handler for dashboard-related endpoints
 */
import { getDashboardService } from '@/server/services/dashboardService';
import type { DashboardDTO } from '@/shared/types/dto';

/**
 * Handler for getting dashboard data
 * @returns Dashboard data
 */
export function getDashboardHandler(): DashboardDTO {
  return getDashboardService();
}
