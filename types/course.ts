// Course type definitions

export interface Tutor {
	id: string;
	name: string;
	avatar?: string;
	university?: string;
	universityColor?: string;
	universityInitial?: string;
	bio?: string;
	rating?: number;
}

export interface CourseLesson {
	id: string;
	title: string;
	duration: string;
	videoUrl?: string;
	isPreview: boolean;
	order: number;
}

export interface CoursePart {
	id: string;
	title: string;
	lessons: CourseLesson[];
	order: number;
}

export interface CourseReview {
	id: string;
	user: {
		name: string;
		avatar?: string;
	};
	rating: number;
	comment: string;
	date: string;
}

export interface Course {
	id: string;
	slug: string;
	title: string;
	description: string;
	thumbnail?: string;
	price?: string | number;
	rating?: number;
	reviewCount?: number;
	tutor?: Tutor;
	level?: string;
	duration?: string;
	category?: string;
	language?: string;
	parts?: CoursePart[];
	reviews?: CourseReview[];
	enrolledStudents?: number;
	lastUpdated?: string;
	tags?: string[];
	isFeatured?: boolean;
	isEnrolled?: boolean;
	progress?: number;
}

export interface CourseDetail extends Course {
	description_long?: string;
	objectives?: string[];
	requirements?: string[];
	parts: CoursePart[];
}

export interface CourseFilters {
	search?: string;
	category?: string;
	level?: string[];
	price?: string[];
	rating?: number;
	sort?: string;
	page?: number;
	limit?: number;
}

// Course creation/editing types (creator dashboard)
export interface LessonData {
	id?: string;
	slug?: string;
	title: string;
	description: string;
	videoFile: File | null;
	videoServiceId: string | null;
	videoUrl?: string;
	duration: number;
	order: number;
	isFreePreview: boolean;
	uploadProgress: number;
	uploadStatus: "idle" | "uploading" | "completed" | "error";
}

export interface CoursePartData {
	id?: string;
	slug?: string;
	title: string;
	description: string;
	order: number;
	lessons: LessonData[];
}

export interface CourseFormData {
	id?: string;
	slug: string;
	title: string;
	description: string;
	category: string;
	price: number;
	thumbnail: File | null;
	thumbnailUrl?: string;
	parts: CoursePartData[];
	isPublished: boolean;
	createdAt?: string;
	updatedAt?: string;
}
