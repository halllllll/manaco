import { useDashboard } from '@/client/api/dashboard/hooks';
import { useSheetName } from '@/client/api/sheet/hooks';
import type { FC, ReactNode } from 'react';

interface HeaderProps {
  children?: ReactNode;
}

export const Header: FC<HeaderProps> = ({ children }) => {
  const { data: title, isLoading: isSheetLoading } = useSheetName();
  const { data: user, isLoading: isDashboardLoading } = useDashboard();
  return (
    <header className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg rounded-b-lg max-h-24">
      <div className="container mx-auto flex justify-between items-center gap-2">
        <h1 className="text-3xl font-bold">
          {children ? (
            children
          ) : isSheetLoading || isDashboardLoading ? (
            <>
              <span className="m-2">よみこみちゅう</span>
              <span className="loading loading-spinner loading-md" />
            </>
          ) : (
            title
          )}
        </h1>
        {user?.name && (
          <div className="flex flex-col items-end">
            <div className="flex flex-row items-center gap-2">
              {user?.belonging && (
                <div className="badge badge-outline badge-lg">{user.belonging}</div>
              )}
              <div className="text-lg font-semibold">{`${user.name} さん`}</div>
            </div>
            <div>{`${user?.id}`}</div>
          </div>
        )}
      </div>
    </header>
  );
};
