import { initApp } from '../main';

const openDialog = (): void => {
  const html = HtmlService.createHtmlOutput('<h1>HELLO!</h1>');
  SpreadsheetApp.getUi().showModalDialog(html, 'AWESOME TITLE');
};

const customMenu1 = (): void => {
  const html = HtmlService.createHtmlOutputFromFile('menu.html').setWidth(600).setHeight(600);
  SpreadsheetApp.getUi().showModalDialog(html, 'CUSTOM MENU 1');
};

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

export { customMenu1, initAppMenu, openDialog };
