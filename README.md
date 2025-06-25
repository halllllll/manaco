# manaco

***まなこ*** は学習活動を記録・可視化するための, [Google Apps Script](https://developers.google.com/apps-script)で作成したWebアプリです。Google Spreadsheetをバックエンドとして使用し、生徒の学習履歴を簡単に記録・管理できます。

導入は[Getting Start](#getting-start)を参照してください。


## Features
***まなこ***は小学校の先生の要望から作成しました。

- **シンプルな操作**: 直感的なUIで簡単に記録できる
- **データの可視化**: グラフで学習の傾向を把握
- **学習の振り返り**: 過去の記録を見て成長を実感
- **カスタマイズ可能**: 教師が必要に応じて設定を調整可能
- **Google Workspace-Ready**: スプレッドシートをデータベースとして活用

### 生徒向け機能
- **学習記録**: 学習した日、かかった時間、点数、気分、取り組んだこと、メモを記録。表示する項目は変更可能
- **進捗の可視化**: グラフやヒートマップで学習履歴を確認・画像としてダウンロード
- **学習データ統計**: 最高点や平均点、取り組んだ時間などの統計情報
- **学習の振り返り**: 過去の学習記録の詳細閲覧

### 教師向け機能
- **生徒管理**: スプレッドシートで生徒情報を登録・管理
- **アプリ設定**: 点数の範囲や表示項目のカスタマイズ

## 画面説明

TODO: embbed image

### 未登録時の画面
初めてアプリにアクセスした生徒には、教師に登録してもらうための案内が表示されます。教師は表示されるQRコードからスプレッドシートにアクセスし、生徒情報を登録できます。

### 初回利用時の画面
登録後、まだ学習記録がない場合は、記録方法の案内と「はじめての記録をつける」ボタンが表示されます。

### ダッシュボード
学習記録を入力すると、以下の情報が表示されるダッシュボードが利用可能になります：
- **学習履歴グラフ**: 点数と学習時間の推移
- **学習データ**: 最高点、平均点、学習時間など
- **学習記録一覧**: 日付、点数、時間、気分などの履歴

### 記録フォーム
「学習を記録する」ボタンから開くフォームで以下の情報を入力できます：
- 学習した日付
- 学習にかかった時間（設定で非表示可能）
- 獲得した点数（点数の上限・下限。設定で非表示可能）
- 取り組んだこと（複数選択。設定で非表示可能）
- メモ・感想（設定で非表示可能）



## Getting Start
Googleアカウントが必要です。[Google Workspace for Education](https://edu.google.com/intl/ALL_jp/workspace-for-education/editions/compare-editions/)のような組織Googleアカウントであればベターです。ここでは`for Education Fundamentals`を使うことを前提とします。

*note: SpreadsheetはブラウザからWeb版を使用してください。ネイティブアプリ版では導入操作ができません*

### 1. Spreadsheetをコピー


コピーしたgoogle sheetsにはGoogle Apps Scriptが付属します（[container-bound scripts](https://developers.google.com/apps-script/guides/bound)）

### 2. 初期化
コピーしたSpreadsheetの上部にカスタムメニューが追加されていることを確認してください

TODO: 続き

### 3. デプロイ
TODO: 続き


## meaning `manaco`
***まなこ***の意味をClaude 3.7に考えてもらいました

> "manaco"（まなこ）には三つの意味があります：
>
> - 日本語で「目」を意味する「まなこ」から取られており、学習の過程を「見る」「観察する」というコンセプトを表しています。
> - "Monitoring ANd Analyzing Course Outcomes" の頭文字をとった略語で、学習成果の監視と分析というアプリの主要機能を表しています。
> - 「まなぶ」（学ぶ）と「こ」（子）を組み合わせた造語で、「学ぶ子どもたち」を支援するというアプリの本来の目的を表しています。

実際にはそんなことはなく、***なまこ***（海鼠、sea cucumber）に似せた響きにしたかったからです。***なまこ***そのものだと生っぽすぎたためです。意味は後付です。

## 技術的説明
Goolge Apps Scriptを使ったWebアプリです。開発環境を含めて以下のような要素を含みます。

- [Devcontainer](https://containers.dev/)
- [clasp v3](https://github.com/google/clasp)
- [TypeScript]()
- [Bun](https://bun.sh/)
- [React](https://react.dev/)
- [vite](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [daisyUI](https://daisyui.com/)



# special thanks
7割くらいはClaude 3.7とClaude 4によるvibe codingです
