import type { ValidationResult } from '@/server/utils/validation';
import type { UserWithActivities } from '@/shared/types/user';
import type { AppSettings } from './settings';
import type { User } from './user';

type BaseResponse<T> =
  | {
      success: false;
      message: string;
      details?: string;
    }
  | {
      success: true;
      data: T;
    };

export type DashboardDTO = BaseResponse<UserWithActivities | null>;

export type SettingsDTO = BaseResponse<AppSettings>;

// export type SpreadsheetValidateDTO = BaseResponse<Omit<ValidationResult, keyof ValidationResult> | null>;
export type SpreadsheetValidateDTO = BaseResponse<ValidationResult | null>;

export type UserDTO = BaseResponse<User | null>;

export type InitAppDTO = BaseResponse<null>;

// 成功可否だけわかればいいのでデータを含まない
export type UserActivityDTO = BaseResponse<null>;
