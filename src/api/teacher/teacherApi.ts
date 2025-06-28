import type {
  TeacherDashboardDTO,
  TeacherStudentDetailDTO,
  TeacherStudentsDTO,
} from '@/shared/types/teacher';
import { getApiPath } from '../endpoint';
import { isGASEnvironment, serverFunctions } from '../serverFunctions';

/**
 * Teacher API functions for data fetching
 */
export const TeacherAPI = {
  /**
   * Get teacher dashboard data
   */
  getDashboard: async (): Promise<TeacherDashboardDTO> => {
    console.log('[TeacherAPI] Fetching dashboard data');
    if (isGASEnvironment()) {
      const ret = await serverFunctions.getTeacherDashboard();
      return ret;
    }

    /**
     * in dev, intercepted by MSW
     * @see src/client/mock/teacherHandlers.ts
     */
    const response = await fetch(getApiPath('TEACHER_DASHBOARD'));
    return await response.json();
  },

  /**
   * Get students with activities
   */
  getStudents: async (): Promise<TeacherStudentsDTO> => {
    console.log('[TeacherAPI] Fetching students data');
    if (isGASEnvironment()) {
      const ret = await serverFunctions.getTeacherStudents();
      console.info('students data ok???');
      return ret;
    }

    /**
     * in dev, intercepted by MSW
     * @see src/client/mock/teacherHandlers.ts
     */
    const response = await fetch(getApiPath('TEACHER_STUDENTS'));
    return await response.json();
  },

  /**
   * Get student details by ID
   */
  getStudentDetail: async (studentId: string): Promise<TeacherStudentDetailDTO> => {
    console.log('[TeacherAPI] Fetching student detail for ID:', studentId);
    if (isGASEnvironment()) {
      const ret = await serverFunctions.getTeacherStudentDetail(studentId);
      return ret;
    }

    /**
     * in dev, intercepted by MSW
     * @see src/client/mock/teacherHandlers.ts
     */
    const response = await fetch(getApiPath('TEACHER_STUDENTS', { studentId }));
    return await response.json();
  },
};
