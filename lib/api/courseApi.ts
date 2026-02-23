import { API_ENDPOINTS } from '@/lib/constants';
import api from '../api';

// Types based on Django models
export interface Category {
	id: string;
	name: string;
	slug: string;
	description?: string;
}

export interface Course {
	id: string;
	title: string;
	slug: string;
	thumbnail?: string;
	description?: string;
	tutors: string[];
	category?: string;
	price: number;
	is_published: boolean;
	created_at: string;
	updated_at: string;
}

export interface CoursePart {
	id: string;
	course: string;
	title: string;
	slug: string;
	description?: string;
	order: number;
	created_at: string;
	updated_at: string;
}

export interface Lesson {
	id: string;
	part: string;
	title: string;
	slug: string;
	description?: string;
	video_service_id?: string;
	order: number;
	duration?: string; // Django DurationField
	is_free_preview: boolean;
	created_at: string;
	updated_at: string;
}

export interface CreateCourseData {
	title: string;
	description?: string;
	category?: string;
	price: number;
	is_published?: boolean;
}

export interface CreateCoursePartData {
	course: string;
	title: string;
	description?: string;
	order: number;
}

export interface CreateLessonData {
	part: string;
	title: string;
	description?: string;
	video_service_id?: string;
	order: number;
	duration?: string;
	is_free_preview: boolean;
}

class CourseApiService {
	// Categories
	async getCategories(): Promise<Category[]> {
		const response = await api.get(API_ENDPOINTS.CATEGORIES);
		return response.data;
	}

	// Courses
	async getCourses(): Promise<Course[]> {
		const response = await api.get(API_ENDPOINTS.COURSES);
		return response.data;
	}

	async getCourse(slug: string): Promise<Course> {
		const response = await api.get(`${API_ENDPOINTS.COURSES}${slug}/`);
		return response.data;
	}

	async createCourse(data: CreateCourseData): Promise<Course> {
		const response = await api.post(API_ENDPOINTS.COURSES, data);
		return response.data;
	}

	async updateCourse(slug: string, data: Partial<CreateCourseData>): Promise<Course> {
		const response = await api.patch(`${API_ENDPOINTS.COURSES}${slug}/`, data);
		return response.data;
	}

	async deleteCourse(slug: string): Promise<void> {
		await api.delete(`${API_ENDPOINTS.COURSES}${slug}/`);
	}

	// Course Parts
	async getCourseParts(courseId?: string): Promise<CoursePart[]> {
		const url = courseId 
			? `${API_ENDPOINTS.COURSE_PARTS}?course=${courseId}`
			: API_ENDPOINTS.COURSE_PARTS;
		const response = await api.get(url);
		return response.data;
	}

	async createCoursePart(data: CreateCoursePartData): Promise<CoursePart> {
		const response = await api.post(API_ENDPOINTS.COURSE_PARTS, data);
		return response.data;
	}

	async updateCoursePart(slug: string, data: Partial<CreateCoursePartData>): Promise<CoursePart> {
		const response = await api.patch(`${API_ENDPOINTS.COURSE_PARTS}${slug}/`, data);
		return response.data;
	}

	async deleteCoursePart(slug: string): Promise<void> {
		await api.delete(`${API_ENDPOINTS.COURSE_PARTS}${slug}/`);
	}

	// Lessons
	async getLessons(partId?: string): Promise<Lesson[]> {
		const url = partId 
			? `${API_ENDPOINTS.LESSONS}?part=${partId}`
			: API_ENDPOINTS.LESSONS;
		const response = await api.get(url);
		return response.data;
	}

	async createLesson(data: CreateLessonData): Promise<Lesson> {
		const response = await api.post(API_ENDPOINTS.LESSONS, data);
		return response.data;
	}

	async updateLesson(slug: string, data: Partial<CreateLessonData>): Promise<Lesson> {
		const response = await api.patch(`${API_ENDPOINTS.LESSONS}${slug}/`, data);
		return response.data;
	}

	async deleteLesson(slug: string): Promise<void> {
		await api.delete(`${API_ENDPOINTS.LESSONS}${slug}/`);
	}

	// Upload course thumbnail
	async uploadCourseThumbnail(courseSlug: string, file: File): Promise<Course> {
		const formData = new FormData();
		formData.append('thumbnail', file);
		const response = await api.patch(`${API_ENDPOINTS.COURSES}${courseSlug}/`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
		return response.data;
	}
}

export const courseApi = new CourseApiService();
