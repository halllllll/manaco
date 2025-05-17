import { isGASEnvironment, serverFunctions } from '../serverFunctions';

// SWRで使用するカスタムフェッチャー
export const apiFetcher = async (key: string, ...args: any[]) => {
  console.log(`Fetching: ${key} with args:`, args);

  // GAS環境の場合
  if (isGASEnvironment()) {
    // keyに応じてserverFunctionsの適切なメソッドを呼び出す
    switch (key) {
      case 'sheet-name':
        return await serverFunctions.getSpreadSheetName();
      case 'sheet-url':
        return await serverFunctions.getSpreadSheetUrl();
      case 'dashboard':
        // dashboardエンドポイントが実装されたら有効化
        // return await serverFunctions.getDashboard();
        throw new Error('Not implemented in GAS yet');
      default:
        throw new Error(`Unknown API key: ${key}`);
    }
  }

  // 開発環境の場合

  // MSWでインターセプトされるエンドポイントにリクエスト
  const response = await fetch(`/mock/${key}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return await response.json();
};
