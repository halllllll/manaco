import { getApiPath } from '../endpoint';
import { isGASEnvironment, serverFunctions } from '../serverFunctions';

export const SheetApp = {
  getSpreadsheetName: async (): Promise<string> => {
    if (isGASEnvironment()) {
      const ret = await serverFunctions.getSpreadSheetName();

      return ret;
    }
    /**
     * in dev, intercepted by MSW
     * @see src/client/mock/handlers.ts
     */
    const response = await fetch(getApiPath('SHEET_NAME'));
    return await response.json();
  },
  getSheetUrl: async (): Promise<string> => {
    if (isGASEnvironment()) {
      return await serverFunctions.getSpreadSheetUrl();
    }
    /**
     * in dev, intercepted by MSW
     * @see src/client/mock/handlers.ts
     */
    const response = await fetch(getApiPath('SHEET_URL'));
    return await response.json();
  },
};
