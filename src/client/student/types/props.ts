import type { LearningActivity } from '@/shared/types/activity';
import type { UserWithActivities } from '@/shared/types/user';

export interface AppLayoutProps {
  setIsModalOpen: (isOpen: boolean) => void;
  isModalOpen: boolean;
}

export interface LearningRecordButtonProps {
  openModal: () => void;
  variant?: 'fixed' | 'inline';
  label?: string;
}

export interface ModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

export interface UserDashboardProps {
  userData: UserWithActivities;
}

export interface EmptyDashboardProps {
  openModal: () => void;
}

export interface UnregisteredViewProps {
  sheetName: string;
  sheetUrl: string;
}

export interface GraphProps {
  activities: Omit<LearningActivity, 'userId'>[];
}

export interface LearningLogSectionProps {
  activities: LearningActivity[];
}
