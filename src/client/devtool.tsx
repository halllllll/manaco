import { useEffect, useState } from 'react';

// 開発環境でユーザーを切り替えるためのコンポーネント
export const DevTools = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('dev-user-id') || 'dev-user-1';
  });

  // ユーザープロファイルのサンプル
  const userProfiles = [
    { id: 'dev-user-1', name: '開発太郎', role: 'student' },
    { id: 'dev-user-2', name: '初心者花子', role: 'student' },
    { id: 'dev-user-3', name: '管理者次郎', role: 'admin' },
    { id: 'new-user', name: '未登録ユーザー', role: 'guest' },
  ];

  useEffect(() => {
    // 選択されたユーザーを保存
    localStorage.setItem('dev-user-id', currentUser);
    // MSWにユーザー変更を通知
    window.postMessage({ type: 'MSW_SET_USER', userId: currentUser }, '*');
  }, [currentUser]);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="flex justify-end top-4 right-4 z-50 gap-2 bg-pink-400">
      <h3 className="flex items-center">{'here is dev tool'}</h3>
      <details className="dropdown dropdown-end">
        <summary className="btn m-1">
          DEV: {userProfiles.find((u) => u.id === currentUser)?.name}
        </summary>

        <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          {userProfiles.map((user) => (
            <li key={user.id}>
              <button
                type={'button'}
                role={'tab'}
                onClick={() => setCurrentUser(user.id)}
                className={`${currentUser === user.id ? 'tab-active' : ''}`}
              >
                {user.name} <span className="badge badge-sm">{user.role}</span>
              </button>
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
};
