/**
 * フォームフィールドの値とエラーを取得するカスタムフック
 * 入れ子構造を解消して可読性と保守性を向上
 */
// biome-ignore lint/suspicious/noExplicitAny: TanStack FormのForm型は複雑すぎるためanyを使用（Claude Sonnet 4 (preview)）
export const useFormFields = (form: any) => {
  return {
    DateField: form.Field,
    MinutesField: form.Field,
    SecondsField: form.Field,
    ScoreField: form.Field,
    MoodField: form.Field,
    MemoField: form.Field,
    ActivityTypeField: form.Field,
  };
};
