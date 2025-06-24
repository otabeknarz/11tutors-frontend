/**
 * API URL constants for authentication and user management
 * These constants are used for making API requests to the backend
 */

// Base URL for the backend API
export const API_BASE_URL = "http://localhost:8000";

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

// Course endpoints
export const COURSE_ENDPOINTS = {
	// Get all courses with pagination
	COURSES: `${API_BASE_URL}/api/courses/courses/`,
	CATEGORIES: `${API_BASE_URL}/api/courses/categories/`,
	LESSONS: `${API_BASE_URL}/api/courses/lessons/`,
	// Get a specific course by ID
	COURSE_DETAIL: (id: string) => `${API_BASE_URL}/api/courses/courses/${id}/`,
};

// Export individual endpoints for direct imports
export const LOGIN_URL = AUTH_ENDPOINTS.LOGIN;
export const REFRESH_URL = AUTH_ENDPOINTS.REFRESH;
export const REGISTER_URL = AUTH_ENDPOINTS.REGISTER;
export const USER_INFO_URL = AUTH_ENDPOINTS.USER_INFO;
export const COURSES_URL = COURSE_ENDPOINTS.COURSES;
