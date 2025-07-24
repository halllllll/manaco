import type { CSSProperties, FC } from 'react';

interface DateInputProps {
  // biome-ignore lint/suspicious/noExplicitAny: TanStack FormのFieldApi型は複雑すぎるためanyを使用（Claude Sonnet 4 (Preview)）（Claude Sonnet 4 Preview）
  field: any;
}

export const DateInput: FC<DateInputProps> = ({ field }) => {
  return (
    <div className="form-control w-full mb-4">
      <label className="label" htmlFor={field.name}>
        <span className="label-text text-lg font-medium flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <title>{'calendar'}</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          どの日に勉強した？
        </span>
      </label>
      <div>
        <button
          type="button"
          name={field.name}
          className="btn btn-lg text-xl btn-neutral btn-dash btn-wide m-2"
          id={field.name}
          onClick={() => {
            const di = document.getElementById('date-modal') as HTMLDialogElement;
            di.showModal();
          }}
        >
          {field.state.value}
        </button>
        <dialog
          id="date-modal"
          className="modal"
          style={{ positionAnchor: '--target-date' } as CSSProperties}
        >
          <div className="modal-box">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-xl flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <title>{'calendar'}</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  カレンダー
                </h2>
                <calendar-date
                  className="cally bg-base-100 p-2 shadow-none rounded-box w-full font-bold"
                  value={field.state.value}
                  formatWeekday="short"
                  showOutsideDays={true}
                  onchange={(e) => {
                    const value = (e.target as HTMLInputElement).value;
                    field.handleChange(value);
                    const targetDateButton = document.getElementById('target-date-btn');
                    if (targetDateButton) {
                      targetDateButton.innerText = value;
                    }

                    const modal = document.getElementById('date-modal') as HTMLDialogElement;
                    modal.close();
                  }}
                >
                  <button
                    type={'button'}
                    slot={'previous'}
                    aria-label={'previous'}
                    className="btn btn-ghost btn-md btn-outline"
                  >
                    <span className="flex items-center">
                      <svg
                        className="fill-current size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <title>前の月</title>
                        <path d="M15.75 19.5 8.25 12l7.5-7.5" />
                      </svg>
                      <span className="ml-1">前の月</span>
                    </span>
                  </button>
                  <button
                    type={'button'}
                    slot={'next'}
                    aria-label={'next'}
                    className="btn btn-ghost btn-md btn-outline"
                  >
                    <span className="flex items-center">
                      <span className="mr-1">次の月</span>
                      <svg
                        className="fill-current size-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <title>次の月</title>
                        <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </span>
                  </button>
                  <calendar-month />
                </calendar-date>
              </div>
            </div>
          </div>
        </dialog>
      </div>
    </div>
  );
};
