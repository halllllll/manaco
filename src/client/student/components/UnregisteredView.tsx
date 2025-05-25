import { QRCodeSVG } from 'qrcode.react';
import type { FC } from 'react';
import type { UnregisteredViewProps } from '../types/props';

/**
 * 未登録ユーザー向けコンポーネント
 */
export const UnregisteredView: FC<UnregisteredViewProps> = ({ sheetName, sheetUrl }) => {
  return (
    <div className="card bg-base-100 shadow-xl border border-base-200 w-full max-w-full mx-auto p-6">
      <div className="card-body items-center text-center">
        <h2 className="card-title text-3xl font-bold text-primary mt-2">
          先生に登録してもらおう！
        </h2>

        <RegistrationGuide />
        <TeacherInstructions sheetName={sheetName} sheetUrl={sheetUrl} />
      </div>
    </div>
  );
};

/**
 * 登録ガイドセクション
 */
const RegistrationGuide: FC = () => {
  return (
    <div className="bg-info/10 rounded-lg p-4 my-4 w-full">
      <h3 className="text-lg font-bold flex items-center gap-2 mb-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-info"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>{'guide'}</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        どうすればいいの？
      </h3>
      <ol className="steps steps-vertical">
        <li className="step step-primary">この画面を先生に見せよう</li>
        <li className="step step-primary">先生があなたのお名前とクラスを登録してくれるよ</li>
        <li className="step step-primary">登録が終わったら、このページをもういちど開いてみよう</li>
        <li className="step step-primary">これで学習記録が使えるようになるよ！</li>
      </ol>
    </div>
  );
};

/**
 * 先生向けの指示セクション
 */
const TeacherInstructions: FC<{ sheetName: string; sheetUrl: string }> = ({
  sheetName,
  sheetUrl,
}) => {
  return (
    <div className="bg-warning/10 rounded-lg p-4 mb-4 w-full">
      <div className="flex gap-3 items-start">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-warning mt-1 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <title>warning</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="flex-1">
          <h3 className="font-bold text-lg">先生へのおねがい</h3>
          <div className="text-sm mt-2 space-y-2">
            <p>このアプリの設定管理画面（Spreadsheet）で、生徒の基本情報の登録をお願いします。</p>

            <TeacherDetailsSection sheetName={sheetName} sheetUrl={sheetUrl} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 先生向けの詳細情報セクション
 */
const TeacherDetailsSection: FC<{ sheetName: string; sheetUrl: string }> = ({
  sheetName,
  sheetUrl,
}) => {
  return (
    <div className="flex justify-center">
      <details className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box max-w-xl">
        <summary className="collapse-title py-2 text-lg font-medium bg-base-100">
          先生はここをクリック
        </summary>
        <div className="collapse-content">
          <div className="divider divider-warning text-lg font-bold text-red-500">⚠️ 注意 ⚠️</div>
          <div className="flex flex-col items-center gap-2">
            <DataProtectionNotice />
            <div className="text-center">
              <p className="mb-2">
                アプリのSpreadsheet名: <span className="font-bold">【{sheetName}】</span>
              </p>
              <QRCodeSVG value={sheetUrl} className="w-80 h-100" />
            </div>
          </div>
        </div>
      </details>
    </div>
  );
};

/**
 * データ保護に関する注意事項
 */
const DataProtectionNotice: FC = () => {
  return (
    <div className="text-sm font-extrabold bg-warning/25 p-4 rounded-lg text-left flex flex-col gap-2">
      <p>SpreadSheetは適切なアクセス管理・共有権限管理をお願いします。</p>
      <p>
        <span
          className="tooltip cursor-help border-b border-dashed border-primary inline-flex items-center gap-1"
          data-tip="ワークシートや学習ドリル、アンケートなどの学習に関する、教職員や児童生徒自身が日々の学校における教育活動において活用する情報"
        >
          学習系データ
        </span>
        と、
        <span
          className="tooltip cursor-help border-b border-dashed border-primary inline-flex items-center gap-1"
          data-tip="指導要録に記載のある成績情報・学習指導、生徒指導、生活指導等に活用する情報"
        >
          校務系データ
        </span>
        を認識し、適切に管理してください。
      </p>
      <p>
        参考:{' '}
        <a
          href="https://www.mext.go.jp/content/20250328-mxt_syoto01-000028144_01.pdf"
          className="text-blue-500 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          教育データの利活用に係る留意事項 第３版（文部科学省：R7.3）
        </a>
      </p>
    </div>
  );
};
