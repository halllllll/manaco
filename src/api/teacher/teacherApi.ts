import type {
  TeacherClassesDTO,
  TeacherCurrentDTO,
  TeacherDashboardDTO,
  TeacherStudentDetailDTO,
  TeacherStudentsDTO,
} from '@/shared/types/teacher';

/**
 * Teacher API functions for data fetching
 */
export const TeacherAPI = {
  /**
   * Get teacher dashboard data
   */
  getDashboard: async (url: string): Promise<TeacherDashboardDTO> => {
    console.log('[TeacherAPI] Fetching dashboard data from', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('[TeacherAPI] Dashboard data response:', {
      success: data.success,
      students: data.data?.totalStudents,
    });
    return data;
  },

  /**
   * Get students with activities
   */
  getStudents: async (url: string): Promise<TeacherStudentsDTO> => {
    console.log('[TeacherAPI] Fetching students data from', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('[TeacherAPI] Students data response:', {
      success: data.success,
      count: data.data?.length,
    });
    return data;
  },

  /**
   * Get available classes/groups
   */
  getClasses: async (url: string): Promise<TeacherClassesDTO> => {
    console.log('[TeacherAPI] Fetching classes data from', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('[TeacherAPI] Classes data response:', {
      success: data.success,
      count: data.data?.length,
    });
    return data;
  },

  /**
   * Get current teacher information
   */
  getCurrentTeacher: async (url: string): Promise<TeacherCurrentDTO> => {
    console.log('[TeacherAPI] Fetching current teacher data from', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('[TeacherAPI] Current teacher response:', {
      success: data.success,
    });
    return data;
  },

  /**
   * Get student details by ID
   */
  getStudentDetail: async (url: string): Promise<TeacherStudentDetailDTO> => {
    console.log('[TeacherAPI] Fetching student detail from', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('[TeacherAPI] Student detail response:', {
      success: data.success,
    });
    return data;
  },
};
