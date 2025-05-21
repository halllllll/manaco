import type { ValidationResult } from '@/server/validate';
import type { LearningActivity } from './activity';
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

export type DashboardDTO = BaseDTO<User & { activities: LearningActivity[] }>;

export type SpreadsheetValidateDTO = BaseDTO<Omit<ValidationResult, keyof ValidationResult> | null>;

export type InitAppDTO = BaseDTO<null>;
