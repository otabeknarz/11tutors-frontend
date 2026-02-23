import api from '../api';
import { API_BASE_URL } from '../constants';

// Types for tutor statistics
export interface TutorStatistics {
  total_earnings: number;
  active_students: number;
  published_courses: number;
  draft_courses: number;
  average_rating: number;
  total_reviews: number;
  monthly_earnings: MonthlyEarning[];
  course_performance: CoursePerformance[];
  recent_enrollments: number;
}

export interface MonthlyEarning {
  month: string;
  earnings: number;
  students: number;
}

export interface CoursePerformance {
  id: string;
  title: string;
  students: number;
  rating: number;
  earnings: number;
}

export interface TutorCourse {
  id: string;
  slug: string;
  title: string;
  description: string;
  thumbnail: string | null;
  price: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  students_count?: number;
  rating?: number;
  reviews_count?: number;
  earnings?: number;
  lessons_count?: number;
}

class TutorApiService {
  /**
   * Get tutor's quick statistics
   */
  async getQuickStatistics(): Promise<TutorStatistics> {
    try {
      const response = await api.get(`${API_BASE_URL}/api/auth/tutors/me/quick_statistics/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tutor statistics:', error);
      throw error;
    }
  }

  /**
   * Get tutor's courses
   */
  async getMyCourses(): Promise<TutorCourse[]> {
    try {
      const response = await api.get(`${API_BASE_URL}/api/auth/tutors/me/courses/`);
      return response.data.results || response.data;
    } catch (error) {
      console.error('Failed to fetch tutor courses:', error);
      throw error;
    }
  }

  /**
   * Get detailed course statistics
   */
  async getCourseStatistics(courseId: string) {
    try {
      const response = await api.get(`${API_BASE_URL}/api/courses/courses/${courseId}/statistics/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch course statistics:', error);
      throw error;
    }
  }

  /**
   * Get tutor profile
   */
  async getProfile() {
    try {
      const response = await api.get(`${API_BASE_URL}/api/auth/tutors/me/`);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch tutor profile:', error);
      throw error;
    }
  }
}

export const tutorApi = new TutorApiService();
