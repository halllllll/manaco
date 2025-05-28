import type { ValidationResult } from '@/server/validate';
import type { UserWithActivities } from '@/shared/types/user';
import type { LearningActivity } from './activity';
import type { AppSettings } from './settings';
import type { User } from './user';

type BaseDTO<T> =
  | {
      success: false;
      message: string;
      details?: string;
    }
  | {
      success: true;
      data: T;
    };

export type DashboardDTO = BaseDTO<UserWithActivities | null>;

export type SettingsDTO = BaseDTO<AppSettings>;

// export type SpreadsheetValidateDTO = BaseDTO<Omit<ValidationResult, keyof ValidationResult> | null>;
export type SpreadsheetValidateDTO = BaseDTO<ValidationResult | null>;

export type InitAppDTO = BaseDTO<null>;
