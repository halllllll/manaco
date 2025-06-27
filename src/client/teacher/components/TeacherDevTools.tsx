import { useEffect, useState } from 'react';

// 開発環境で教員ユーザーを切り替えるためのコンポーネント
export const TeacherDevTools = () => {
  if (!import.meta.env.DEV) return null;

  const [currentTeacher, setCurrentTeacher] = useState(() => {
    return localStorage.getItem('dev-teacher-id') || 'teacher-1';
  });

  // 教員ユーザープロファイルのサンプル
  const teacherProfiles = [
    { id: 'teacher-1', name: '山田先生', role: 'teacher' },
    { id: 'teacher-2', name: '鈴木先生', role: 'teacher' },
    { id: 'admin-1', name: '校長先生', role: 'admin' },
  ];

  useEffect(() => {
    // 選択された教員ユーザーを保存
    localStorage.setItem('dev-teacher-id', currentTeacher);

    // MSWにユーザー変更を通知 (classFilterは'all'に固定)
    window.postMessage(
      {
        type: 'MSW_SET_TEACHER',
        teacherId: currentTeacher,
        classFilter: 'all',
      },
      '*',
    );
  }, [currentTeacher]);

  return (
    <div className="bg-blue-400 p-2 shadow-lg border-b border-blue-500">
      <div className="container mx-auto flex justify-between items-center">
        <h3 className="text-white font-bold">{'教員開発ツール'}</h3>
        <div className="flex gap-2">
          {/* 教員選択 */}
          <details className="dropdown dropdown-end">
            <summary className="btn btn-sm m-1">
              教員: {teacherProfiles.find((t) => t.id === currentTeacher)?.name}
            </summary>

            <ul className="menu dropdown-content bg-base-100 rounded-box z-10 w-52 p-2 shadow-lg">
              {teacherProfiles.map((teacher) => (
                <li key={teacher.id}>
                  <button
                    type="button"
                    role="tab"
                    onClick={() => setCurrentTeacher(teacher.id)}
                    className={`${currentTeacher === teacher.id ? 'tab-active' : ''}`}
                  >
                    {teacher.name} <span className="badge badge-sm">{teacher.role}</span>
                  </button>
                </li>
              ))}
            </ul>
          </details>
        </div>
      </div>
    </div>
  );
};
