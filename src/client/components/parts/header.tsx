import { useDashboard } from '@/client/api/dashboard/hooks';
import { useSheetName } from '@/client/api/sheet/hooks';
import type { FC, ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
}

export const Header: FC<HeaderProps> = ({ children }) => {
  const { data: title, isLoading: isSheetLoading } = useSheetName();
  const { data: user, isLoading: isDashboardLoading } = useDashboard();
  const isLoading = isSheetLoading || isDashboardLoading;
  return (
    <header className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg rounded-b-lg max-h-24">
      <div className="container mx-auto flex justify-between items-center gap-2">
        <h1 className="text-3xl font-bold min-h-[2.25rem] flex items-center">
          {children ? (
            children
          ) : isLoading ? (
            <div className="flex items-center">
              <span className="m-2">よみこみちゅう</span>
              <span className="loading loading-spinner loading-md" />
            </div>
          ) : (
            title
          )}
        </h1>

        {/* ユーザー情報セクション - 読み込み状態にスケルトンを使用 */}
        <div className="flex flex-col items-end justify-center min-h-[3.5rem]">
          {/* コンテナの基本高さを維持 */}
          {isLoading ? (
            <div className="animate-pulse flex flex-col items-end gap-1 w-44">
              {/* スケルトン全体の幅の目安 */}
              <div className="flex flex-row items-center gap-2 w-full">
                <div className="skeleton h-6 w-16 rounded" /> {/* 所属バッジのスケルトン */}
                <div className="skeleton h-7 flex-1 rounded" />{' '}
                {/* 名前のスケルトン (text-lg相当) */}
              </div>
              <div className="skeleton h-6 w-3/4 rounded mt-1" /> {/* IDのスケルトン */}
            </div>
          ) : user?.name ? (
            <div className="flex flex-col items-end gap-1">
              <div className="flex flex-row items-center gap-2">
                {user.belonging && (
                  <div className="badge badge-outline badge-lg">{user.belonging}</div>
                )}
                <div className="text-lg font-semibold">{`${user.name} さん`}</div>
              </div>
              <div>{user.id}</div>
            </div>
          ) : (
            /* 読み込み完了後でユーザー名がない場合、コンテナのmin-hを維持するためのプレースホルダー
               （幅を指定した空のdivなど） */
            <div className="w-44" />
          )}
        </div>
      </div>
    </header>
  );
};
