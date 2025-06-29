import {
  getTeacherDashboardService,
  getTeacherStudentDetailService,
  getTeacherStudentsService,
} from '@/server/services/teacherService';
import type {
  TeacherDashboardDTO,
  TeacherStudentDetailDTO,
  TeacherStudentsDTO,
} from '@/shared/types/teacher';

/**
 * Handler for getting teacher dashboard data
 */
export function getTeacherDashboardHandler(): TeacherDashboardDTO {
  try {
    const data = getTeacherDashboardService();
    return {
      success: true,
      data,
    };
  } catch (error) {
    const err = error as Error;
    console.error(err);
    return {
      success: false,
      message: `Error: ${err.name}: ${err.message}`,
    };
  }
}

/**
 * Handler for getting teacher students data
 */
export function getTeacherStudentsHandler(): TeacherStudentsDTO {
  console.info('うお〜　getting students data~~~~');
  try {
    const data = getTeacherStudentsService();
    return {
      success: true,
      data,
    };
  } catch (error) {
    const err = error as Error;
    console.error(err);
    return {
      success: false,
      message: `Error: ${err.name}: ${err.message}`,
    };
  }
}

/**
 * Handler for getting teacher student detail data
 * @param studentId 生徒ID
 */
export function getTeacherStudentDetailHandler(studentId: string): TeacherStudentDetailDTO {
  try {
    const data = getTeacherStudentDetailService(studentId);
    return {
      success: true,
      data: data || null,
    };
  } catch (error) {
    const err = error as Error;
    console.error(err);
    return {
      success: false,
      message: `Error: ${err.name}: ${err.message}`,
    };
  }
}
