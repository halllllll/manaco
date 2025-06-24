/**
 * Main API entry point that exports functions to be used by the frontend
 */
import { saveActivityHandler } from './handlers/activityHandler';
import { getDashboardHandler } from './handlers/dashboardHandler';
import { getSettingsHandler } from './handlers/settingsHandler';
import { getSpreadsheetNameHandler, getSpreadsheetUrlHandler } from './handlers/spreadsheetHandler';
import { getUserHandler } from './handlers/userHandler';
import { initAppHandler, validateAllHandler } from './handlers/validationHandler';

// Export all handler functions to be made available to the global scope
export {
  getDashboardHandler,
  getSettingsHandler,
  getSpreadsheetNameHandler,
  getSpreadsheetUrlHandler,
  getUserHandler,
  initAppHandler,
  saveActivityHandler,
  validateAllHandler,
};
