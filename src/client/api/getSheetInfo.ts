import { isGASEnvironment, serverFunctions } from '../serverFunctions';

export const SheetApp = {
  getSheetName: async (): Promise<string> => {
    if (isGASEnvironment()) {
      const ret = await serverFunctions.getSpreadSheetName();

      return ret;
    }
    /**
     * in dev, intercepted by MSW
     * @see src/client/mock/handlers.ts
     */
    const response = await fetch('/mock/sheet-name');
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
    const response = await fetch('/mock/spreadsheet-url');
    return await response.json();
  },
};
