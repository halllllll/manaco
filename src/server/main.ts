import { initAppMenu } from './Menu/Menu';
/**
 * Main entry point for the Google Apps Script web app
 * This file exposes all the necessary functions to the global scope
 * to be called from the frontend
 */
import {
  getDashboardHandler,
  getSettingsHandler,
  getSpreadsheetNameHandler,
  getSpreadsheetUrlHandler,
  getUserHandler,
  initAppHandler,
  saveActivityHandler,
  validateAllHandler,
} from './api';
import {
  getTeacherDashboardHandler,
  getTeacherStudentsHandler,
} from './api/handlers/teacherHandler';
import { getCurrentUser } from './services/userService';
import { validateAllService } from './services/validationService';
import {
  AppSettingSheetValidationTest,
  LearningLogSheetValidationTest,
  StudentSheetValidationTest,
} from './test/test';

/**
 * Handle GET requests to the web app
 * @returns HTML output
 */
export const doGet = (): GoogleAppsScript.HTML.HtmlOutput => {
  console.info('validation check');
  const validateResult = validateAllService();
  console.info('get user');
  const user = getCurrentUser();

  if (!validateResult.success) {
    return HtmlService.createHtmlOutputFromFile('panic.html');
  }

  if (user?.role !== 'teacher') {
    return HtmlService.createHtmlOutputFromFile('index.html')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1')
      .setTitle(getSpreadsheetNameHandler() ?? 'manaco');
  }

  return HtmlService.createHtmlOutputFromFile('teacher.html')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setTitle(getSpreadsheetNameHandler() ?? 'manaco');
};

/**
 * Handle spreadsheet open event
 * @param e Open event
 */
const onOpen = (e: GoogleAppsScript.Events.SheetsOnOpen): void => {
  console.log(e.user);
  const menu = SpreadsheetApp.getUi().createMenu('Custom menu');
  menu.addItem('初期化', 'initAppMenu_');
  menu.addToUi();
};

// Expose global functions to be called from the frontend
// This is required for Google Apps Script to work

// Expose doGet and onOpen
global.doGet = doGet;
global.onOpen = onOpen;

// Menu functions
global.initAppMenu_ = initAppMenu;

// Activity functions
global.setActivity = saveActivityHandler;

// Spreadsheet functions
global.getSpreadSheetName = getSpreadsheetNameHandler;
global.getSpreadSheetUrl = getSpreadsheetUrlHandler;

// Dashboard functions
global.getDashboard = getDashboardHandler;

// Test functions
global._test_student_sheet = StudentSheetValidationTest;
global._test_learning_log_sheet = LearningLogSheetValidationTest;
global._test_app_setting_sheet = AppSettingSheetValidationTest;

// User functions
global.getUser = getUserHandler;

// Validation functions
global.validateAll = validateAllHandler;
global.initApp = initAppHandler;

// Settings functions
global.getSettingsData = getSettingsHandler;

global.getTeacherDashboard = getTeacherDashboardHandler;
global.getTeacherStudents = getTeacherStudentsHandler;

// Export functions for the frontend API
export {
  getDashboardHandler as getDashboard,
  getSettingsHandler as getSettingsData,
  getSpreadsheetNameHandler as getSpreadSheetName,
  getSpreadsheetUrlHandler as getSpreadSheetUrl,
  getTeacherDashboardHandler as getTeacherDashboard,
  getTeacherStudentsHandler as getTeacherStudents,
  getUserHandler as getUser,
  initAppHandler as initApp,
  saveActivityHandler as setActivity,
  validateAllHandler as validateAll,
};
