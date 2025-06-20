import { initApp } from '../main';

const initAppMenu = (): void => {
  const ui = SpreadsheetApp.getUi();

  const btn = ui.alert(
    '⚠️ 初期化 ⚠️',
    'シートを初期化しますか？この操作はもとに戻せません',
    ui.ButtonSet.YES_NO,
  );

  if (btn === ui.Button.YES) {
    const result = initApp();
    if (result.success) {
      ui.alert('初期化に成功しました');
    } else {
      ui.alert('初期中にエラーが発生しました。');
    }
  } else {
    ui.alert('キャンセルされました');
  }
};

export { initAppMenu };
