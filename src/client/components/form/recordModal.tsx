import { format } from 'date-fns';
import { ja } from 'date-fns/locale';
import { type FC, type KeyboardEvent, useState } from 'react';

// Mock imports for icons (replace with your actual icon library)
const CalendarIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>{''}</title>
    <path
      d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Clock = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>{''}</title>
    <path
      d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const PencilLine = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>{''}</title>
    <path
      d="M15 3L21 9M15 3L12 6M21 9L12 18M12 18L6 12M12 18L18 12M12 6L3 15L9 21"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Sparkles = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <title>{''}</title>
    <path
      d="M5 3V7M3 5H7M6 17V21M4 19H8M13 3L15.2857 9.85714L21 12L15.2857 14.1429L13 21L10.7143 14.1429L5 12L10.7143 9.85714L13 3Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Mock confetti function
const confetti = (options: any) => console.log('Confetti!', options);

type Mood = 'たのしかった！' | 'ふつう' | 'つかれた' | 'むずかしかった';

export const StudyRecordModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [minutes, setMinutes] = useState(30);
  const [seconds, setSeconds] = useState(0);
  const [score, setScore] = useState(60);
  const [mood, setMood] = useState<Mood | null>(null);
  const [memo, setMemo] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Determine if mood and memo sections should be shown based on user type
  const showMood = true;
  const showMemo = true;

  const handleSave = () => {
    // Trigger confetti animation on save
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#8b5cf6', '#ec4899', '#f59e0b'],
    });

    // In a real app, we would save the data to a database
    onSave();
  };

  const handleMinutesChange = (value: number) => {
    if (value >= 0 && value <= 180) {
      setMinutes(value);
    }
  };

  const handleSecondsChange = (value: number) => {
    if (value >= 0 && value < 60) {
      setSeconds(value);
    }
  };

  const handleScoreChange = (value: number) => {
    if (value >= 0 && value <= 100) {
      setScore(value);
    }
  };

  const handleKeyUp = (e: KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      callback();
    }
  };

  const moodOptions: { value: Mood; emoji: string; color: string }[] = [
    { value: 'たのしかった！', emoji: '😊', color: 'bg-green-100 border-green-300' },
    { value: 'ふつう', emoji: '😐', color: 'bg-blue-100 border-blue-300' },
    { value: 'つかれた', emoji: '😵', color: 'bg-yellow-100 border-yellow-300' },
    { value: 'むずかしかった', emoji: '😖', color: 'bg-red-100 border-red-300' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal modal-open">
        <div className="modal-box max-w-md bg-white p-6 rounded-lg shadow-xl">
          {/* Header */}
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-800">今日のべんきょうを記録しよう！</h3>
          </div>

          <div className="space-y-6">
            {/* Date Picker */}
            <div className="space-y-2">
              <label htmlFor="study-date" className="flex items-center text-gray-700 font-medium">
                <CalendarIcon />
                <span className="ml-2">どの日にべんきょうした？</span>
              </label>
              <div className="dropdown w-full">
                <button
                  id="study-date"
                  type="button"
                  className="btn btn-outline w-full justify-start text-left font-normal"
                  onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  onKeyUp={(e) => handleKeyUp(e, () => setIsCalendarOpen(!isCalendarOpen))}
                >
                  {date ? (
                    format(date, 'yyyy年MM月dd日 (EEE)', { locale: ja })
                  ) : (
                    <span>日付を選んでね</span>
                  )}
                </button>
                {isCalendarOpen && (
                  <div className="dropdown-content bg-base-100 p-2 shadow rounded-box w-full mt-1">
                    {/* Simplified calendar */}
                    <div className="grid grid-cols-7 gap-1 p-2">
                      {Array.from({ length: 31 }, (_, i) => {
                        const day = new Date();
                        day.setDate(i + 1);
                        return (
                          <button
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            key={i}
                            type="button"
                            className={`btn btn-sm ${
                              date.getDate() === i + 1 ? 'btn-primary' : 'btn-ghost'
                            }`}
                            onClick={() => {
                              const newDate = new Date();
                              newDate.setDate(i + 1);
                              setDate(newDate);
                              setIsCalendarOpen(false);
                            }}
                            onKeyUp={(e) =>
                              handleKeyUp(e, () => {
                                const newDate = new Date();
                                newDate.setDate(i + 1);
                                setDate(newDate);
                                setIsCalendarOpen(false);
                              })
                            }
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label htmlFor="duration" className="flex items-center text-gray-700 font-medium">
                <Clock />
                <span className="ml-2">どれくらいべんきょうした？</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="minutes" className="text-sm text-gray-500">
                    分
                  </label>
                  <div className="join">
                    <button
                      type="button"
                      className="join-item btn btn-outline"
                      onClick={() => handleMinutesChange(minutes - 5)}
                      onKeyUp={(e) => handleKeyUp(e, () => handleMinutesChange(minutes - 5))}
                    >
                      -
                    </button>
                    <input
                      id="minutes"
                      type="number"
                      value={minutes}
                      onChange={(e) => handleMinutesChange(Number.parseInt(e.target.value) || 0)}
                      className="join-item input input-bordered w-20 text-center"
                      min={0}
                      max={180}
                    />
                    <button
                      type="button"
                      className="join-item btn btn-outline"
                      onClick={() => handleMinutesChange(minutes + 5)}
                      onKeyUp={(e) => handleKeyUp(e, () => handleMinutesChange(minutes + 5))}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="seconds" className="text-sm text-gray-500">
                    秒
                  </label>
                  <div className="join">
                    <button
                      type="button"
                      className="join-item btn btn-outline"
                      onClick={() => handleSecondsChange(seconds - 5)}
                      onKeyUp={(e) => handleKeyUp(e, () => handleSecondsChange(seconds - 5))}
                    >
                      -
                    </button>
                    <input
                      id="seconds"
                      type="number"
                      value={seconds}
                      onChange={(e) => handleSecondsChange(Number.parseInt(e.target.value) || 0)}
                      className="join-item input input-bordered w-20 text-center"
                      min={0}
                      max={59}
                    />
                    <button
                      type="button"
                      className="join-item btn btn-outline"
                      onClick={() => handleSecondsChange(seconds + 5)}
                      onKeyUp={(e) => handleKeyUp(e, () => handleSecondsChange(seconds + 5))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Score */}
            <div className="space-y-2">
              <label htmlFor="score" className="text-gray-700 font-medium">
                今日の点数は？
              </label>
              <div className="join">
                <button
                  type="button"
                  className="join-item btn btn-outline"
                  onClick={() => handleScoreChange(score - 5)}
                  onKeyUp={(e) => handleKeyUp(e, () => handleScoreChange(score - 5))}
                >
                  -
                </button>
                <input
                  id="score"
                  type="number"
                  value={score}
                  onChange={(e) => handleScoreChange(Number.parseInt(e.target.value) || 0)}
                  className="join-item input input-bordered w-24 text-center text-2xl font-bold"
                  min={0}
                  max={100}
                />
                <button
                  type="button"
                  className="join-item btn btn-outline"
                  onClick={() => handleScoreChange(score + 5)}
                  onKeyUp={(e) => handleKeyUp(e, () => handleScoreChange(score + 5))}
                >
                  +
                </button>
              </div>
              <div className="text-center text-sm text-gray-500 mt-1">0〜100点で入力してね</div>
            </div>

            {/* Mood */}
            {showMood && (
              <div className="space-y-2">
                <label className="text-gray-700 font-medium" htmlFor="">
                  べんきょうしてどうだった？
                </label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {moodOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                        mood === option.value
                          ? `${option.color} ring-2 ring-offset-2 ring-primary`
                          : 'border-gray-200 bg-white hover:bg-gray-50'
                      }`}
                      onClick={() => setMood(option.value)}
                      onKeyUp={(e) => handleKeyUp(e, () => setMood(option.value))}
                    >
                      <span className="text-3xl mb-1">{option.emoji}</span>
                      <span className="text-sm font-medium text-gray-700">{option.value}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Memo */}
            {showMemo && (
              <div className="space-y-2">
                <label htmlFor="memo" className="flex items-center text-gray-700 font-medium">
                  <PencilLine />
                  <span className="ml-2">がんばったこと</span>
                </label>
                <textarea
                  id="memo"
                  placeholder="今日がんばったことを書いてみよう！"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  className="textarea textarea-bordered w-full min-h-[100px] text-base"
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="modal-action flex flex-col sm:flex-row gap-2 mt-6">
            <button
              type="button"
              className="btn btn-outline flex-1"
              onClick={onClose}
              onKeyUp={(e) => handleKeyUp(e, onClose)}
            >
              キャンセル
            </button>
            <button
              type="button"
              className="btn btn-primary flex-1"
              disabled={!showMood ? false : !mood}
              onClick={handleSave}
              onKeyUp={(e) => handleKeyUp(e, handleSave)}
            >
              <Sparkles />
              <span className="ml-2">記録する</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
