/**
 * API URL constants for authentication and user management
 * These constants are used for making API requests to the backend
 */

// Base URL for the backend API
export const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Authentication endpoints
export const AUTH_ENDPOINTS = {
	// JWT token authentication
	LOGIN: `${API_BASE_URL}/api/auth/token/`,

	// Token refresh endpoint
	REFRESH: `${API_BASE_URL}/api/auth/token/refresh/`,

	// User registration endpoint
	REGISTER: `${API_BASE_URL}/api/auth/users/`,

	// Get current user information
	USER_INFO: `${API_BASE_URL}/api/auth/users/me/`,
};

// Course endpoints (detailed, used by creator API services)
export const API_ENDPOINTS = {
	// Categories
	CATEGORIES: `${API_BASE_URL}/api/courses/categories/`,
	CATEGORY_DETAIL: (slug: string) =>
		`${API_BASE_URL}/api/courses/categories/${slug}/`,

	// Courses (use slug for detail endpoints)
	COURSES: `${API_BASE_URL}/api/courses/courses/`,
	COURSE_DETAIL: (slug: string) =>
		`${API_BASE_URL}/api/courses/courses/${slug}/`,

	// Course Parts (use slug for detail endpoints)
	COURSE_PARTS: `${API_BASE_URL}/api/courses/course-parts/`,
	COURSE_PART_DETAIL: (slug: string) =>
		`${API_BASE_URL}/api/courses/course-parts/${slug}/`,

	// Lessons (use slug for detail endpoints)
	LESSONS: `${API_BASE_URL}/api/courses/lessons/`,
	LESSON_DETAIL: (slug: string) =>
		`${API_BASE_URL}/api/courses/lessons/${slug}/`,

	// Comments
	COMMENTS: `${API_BASE_URL}/api/courses/comments/`,
	COMMENT_DETAIL: (id: string) => `${API_BASE_URL}/api/courses/comments/${id}/`,

	// Enrollments
	ENROLLMENTS: `${API_BASE_URL}/api/courses/enrollments/`,
	ENROLLMENT_DETAIL: (id: string) =>
		`${API_BASE_URL}/api/courses/enrollments/${id}/`,
};

// Legacy course endpoints (for backward compatibility)
export const COURSE_ENDPOINTS = {
	// Get all courses with pagination
	COURSES: API_ENDPOINTS.COURSES,
	CATEGORIES: API_ENDPOINTS.CATEGORIES,
	LESSONS: API_ENDPOINTS.LESSONS,
	// Get a specific course by ID
	COURSE_DETAIL: API_ENDPOINTS.COURSE_DETAIL,
};

// Payment endpoints
export const PAYMENT_ENDPOINTS = {
	// Create Stripe checkout session
	CREATE_CHECKOUT: `${API_BASE_URL}/api/payments/payments/`,
};

// Export individual endpoints for direct imports
export const LOGIN_URL = AUTH_ENDPOINTS.LOGIN;
export const REFRESH_URL = AUTH_ENDPOINTS.REFRESH;
export const REGISTER_URL = AUTH_ENDPOINTS.REGISTER;
export const USER_INFO_URL = AUTH_ENDPOINTS.USER_INFO;
export const COURSES_URL = COURSE_ENDPOINTS.COURSES;
