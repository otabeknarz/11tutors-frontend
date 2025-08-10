"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import axios from "axios";
import { format } from "date-fns";
import {
	BookOpenIcon,
	StarIcon,
	UsersIcon,
	ClockIcon,
	FilterIcon,
	SearchIcon,
	CalendarIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	Loader2Icon,
	XIcon,
	SlidersHorizontalIcon,
	TagIcon,
	BarChartIcon,
	CheckIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	SheetFooter,
	SheetClose,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { API_BASE_URL, COURSES_URL } from "@/lib/constants";
import { Course } from "@/types/course";
import api from "@/lib/api";
import { EnrollmentManager } from "@/lib/enrollmentManager";

interface CoursesResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Course[];
}

export default function CoursesPage() {
	const { t } = useLanguage();
	const { user } = useAuth();
	const router = useRouter();

	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [levelFilter, setLevelFilter] = useState<string[]>([]);
	const [priceFilter, setPriceFilter] = useState<string[]>([]);
	const [sortOption, setSortOption] = useState("popular");
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [activeTab, setActiveTab] = useState("all");

	// State for API data and pagination
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
	const [prevPageUrl, setPrevPageUrl] = useState<string | null>(null);
	const pageSize = 12; // Maximum number of courses per page

	// Debounce search query
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearchQuery(searchQuery);
		}, 500);
		return () => clearTimeout(timer);
	}, [searchQuery]);

	// Build query parameters based on filters
	const buildQueryParams = () => {
		const params = new URLSearchParams();
		params.append("limit", pageSize.toString());

		if (debouncedSearchQuery) {
			params.append("search", debouncedSearchQuery);
		}

		if (categoryFilter !== "all") {
			params.append("category", categoryFilter);
		}

		if (levelFilter.length > 0) {
			levelFilter.forEach((level) => {
				params.append("level", level);
			});
		}

		if (priceFilter.length > 0) {
			priceFilter.forEach((price) => {
				if (price === "free") {
					params.append("is_free", "true");
				} else if (price === "paid") {
					params.append("is_free", "false");
				} else if (price === "low-to-high") {
					params.append("ordering", "price");
				} else if (price === "high-to-low") {
					params.append("ordering", "-price");
				} else {
					params.append("price_type", price);
				}
			});
		}

		return params;
	};

	// Fetch courses from the API
	const fetchCourses = async (url?: string) => {
		setLoading(true);
		setError(null);

		try {
			const apiUrl = url || `${COURSES_URL}?${buildQueryParams().toString()}`;
			const response = await axios.get<CoursesResponse>(apiUrl);
			const data = response.data;

			setCourses(data.results);
			setTotalCount(data.count);
			setNextPageUrl(data.next);
			setPrevPageUrl(data.previous);
			setTotalPages(Math.ceil(data.count / pageSize));
		} catch (err) {
			console.error("Error fetching courses:", err);
			setError("Failed to load courses. Please try again later.");
			// Use placeholder data if API fails
			setShowPlaceholders(true);
		} finally {
			setLoading(false);
		}
	};

	// Apply filters and fetch courses
	useEffect(() => {
		fetchCourses();
		setCurrentPage(1);
	}, [
		debouncedSearchQuery,
		categoryFilter,
		levelFilter,
		priceFilter,
		sortOption,
	]);

	// Load courses on initial render
	useEffect(() => {
		fetchCourses();
	}, []);

	// Handle page navigation
	const goToNextPage = () => {
		if (nextPageUrl) {
			fetchCourses(nextPageUrl);
			setCurrentPage(currentPage + 1);
		}
	};

	const goToPrevPage = () => {
		if (prevPageUrl) {
			fetchCourses(prevPageUrl);
			setCurrentPage(currentPage - 1);
		}
	};

	// Reset filters
	const resetFilters = () => {
		setSearchQuery("");
		setDebouncedSearchQuery("");
		setCategoryFilter("all");
		setLevelFilter([]);
		setPriceFilter([]);
		setSortOption("popular");
		setCurrentPage(1);
	};

	// For development/fallback when API is not available
	const [showPlaceholders, setShowPlaceholders] = useState(false);

	// Filter courses client-side (for development/fallback)
	const filteredCourses = showPlaceholders
		? courses.filter((course) => {
				const matchesSearch =
					searchQuery === "" ||
					course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
					course.description.toLowerCase().includes(searchQuery.toLowerCase());
				const matchesCategory =
					categoryFilter === "all" ||
					course.category?.toLowerCase() === categoryFilter.toLowerCase();
				return matchesSearch && matchesCategory;
		  })
		: courses;

	// Handle course enrollment
	const handleEnrollCourse = async (courseId: string, courseSlug: string) => {
		// Use the centralized enrollment manager for simple enrollment
		await EnrollmentManager.handleSimpleEnrollment(
			courseId,
			courseSlug,
			user,
			router
		);
	};

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<main className="container mx-auto px-4 py-8">
				{/* Hero Section */}
				<section className="mb-12">
					<div className="text-center">
						<h1 className="text-4xl font-bold mb-4">
							{t("courses.title") || "Explore Our Courses"}
						</h1>
						<p className="text-muted-foreground max-w-2xl mx-auto">
							{t("courses.subtitle") ||
								"Discover a wide range of courses taught by expert tutors to help you achieve your learning goals."}
						</p>
					</div>
				</section>

				{/* Search and Filter Bar */}
				<section className="mb-8">
					<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
						<div className="relative w-full md:w-1/2">
							<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								type="text"
								placeholder={
									t("courses.searchPlaceholder") || "Search courses..."
								}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10"
							/>
						</div>

						<div className="flex items-center gap-2 w-full md:w-auto">
							<Select
								value={priceFilter.length > 0 ? priceFilter[0] : "all"}
								onValueChange={(value) => {
									if (value === "all") {
										setPriceFilter([]);
									} else {
										setPriceFilter([value]);
									}
								}}
							>
								<SelectTrigger className="w-[180px]">
									<SelectValue
										placeholder={t("courses.priceFilter") || "Price"}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										{t("courses.allPrices") || "All Prices"}
									</SelectItem>
									<SelectItem value="free">
										{t("courses.free") || "Free"}
									</SelectItem>
									<SelectItem value="paid">
										{t("courses.paid") || "Paid"}
									</SelectItem>
									<SelectItem value="low-to-high">
										{t("courses.priceLowToHigh") || "Price: Low to High"}
									</SelectItem>
									<SelectItem value="high-to-low">
										{t("courses.priceHighToLow") || "Price: High to Low"}
									</SelectItem>
								</SelectContent>
							</Select>

							<Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
								<SheetTrigger asChild>
									<Button variant="outline" size="icon">
										<FilterIcon className="h-4 w-4" />
									</Button>
								</SheetTrigger>
								<SheetContent>
									<SheetHeader>
										<SheetTitle>{t("courses.filters") || "Filters"}</SheetTitle>
										<SheetDescription>
											{t("courses.filtersDescription") ||
												"Refine your course search"}
										</SheetDescription>
									</SheetHeader>
									<div className="py-6">
										<div className="mb-6">
											<h3 className="text-sm font-medium mb-4">
												{t("courses.categories") || "Categories"}
											</h3>
											<div className="space-y-2">
												<div className="flex items-center">
													<Checkbox
														id="category-all"
														checked={categoryFilter === "all"}
														onCheckedChange={() => setCategoryFilter("all")}
													/>
													<Label htmlFor="category-all" className="ml-2">
														{t("courses.allCategories") || "All Categories"}
													</Label>
												</div>
												{[
													"mathematics",
													"science",
													"technology",
													"language",
													"arts",
													"business",
												].map((category) => (
													<div key={category} className="flex items-center">
														<Checkbox
															id={`category-${category}`}
															checked={categoryFilter === category}
															onCheckedChange={() =>
																setCategoryFilter(category)
															}
														/>
														<Label
															htmlFor={`category-${category}`}
															className="ml-2 capitalize"
														>
															{t(`courses.category.${category}`) || category}
														</Label>
													</div>
												))}
											</div>
										</div>

										<Separator className="my-4" />

										<div className="mb-6">
											<h3 className="text-sm font-medium mb-4">
												{t("courses.level") || "Level"}
											</h3>
											<div className="space-y-2">
												{["beginner", "intermediate", "advanced"].map(
													(level) => (
														<div key={level} className="flex items-center">
															<Checkbox
																id={`level-${level}`}
																checked={levelFilter.includes(level)}
																onCheckedChange={(checked) => {
																	if (checked) {
																		setLevelFilter([...levelFilter, level]);
																	} else {
																		setLevelFilter(
																			levelFilter.filter((l) => l !== level)
																		);
																	}
																}}
															/>
															<Label
																htmlFor={`level-${level}`}
																className="ml-2 capitalize"
															>
																{t(`courses.level.${level}`) || level}
															</Label>
														</div>
													)
												)}
											</div>
										</div>
									</div>
									<SheetFooter>
										<Button variant="outline" onClick={resetFilters}>
											{t("courses.resetFilters") || "Reset Filters"}
										</Button>
										<SheetClose asChild>
											<Button>{t("courses.applyFilters") || "Apply"}</Button>
										</SheetClose>
									</SheetFooter>
								</SheetContent>
							</Sheet>
						</div>
					</div>
				</section>

				{/* Course Grid */}
				<section className="mb-12">
					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{Array.from({ length: 8 }).map((_, index) => (
								<Card key={index} className="overflow-hidden">
									<div className="aspect-video bg-muted animate-pulse" />
									<CardHeader>
										<div className="h-6 bg-muted animate-pulse rounded mb-2" />
										<div className="h-4 bg-muted animate-pulse rounded w-3/4" />
									</CardHeader>
									<CardContent>
										<div className="h-4 bg-muted animate-pulse rounded mb-2" />
										<div className="h-4 bg-muted animate-pulse rounded w-2/3" />
									</CardContent>
									<CardFooter>
										<div className="h-10 bg-muted animate-pulse rounded w-full" />
									</CardFooter>
								</Card>
							))}
						</div>
					) : error ? (
						<div className="text-center py-12">
							<XIcon className="h-12 w-12 mx-auto text-destructive mb-4" />
							<h3 className="text-xl font-medium mb-2">
								{t("courses.errorTitle") || "Oops! Something went wrong"}
							</h3>
							<p className="text-muted-foreground mb-6">{error}</p>
							<Button onClick={() => fetchCourses()}>
								{t("courses.tryAgain") || "Try Again"}
							</Button>
						</div>
					) : filteredCourses.length === 0 ? (
						<div className="text-center py-12">
							<SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
							<h3 className="text-xl font-medium mb-2">
								{t("courses.noResults") || "No courses found"}
							</h3>
							<p className="text-muted-foreground mb-6">
								{t("courses.noResultsDescription") ||
									"Try adjusting your search or filter criteria"}
							</p>
							<Button onClick={resetFilters}>
								{t("courses.resetFilters") || "Reset Filters"}
							</Button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredCourses.map((course) => (
								<Card
									key={course.id}
									className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg"
								>
									<div className="relative aspect-video">
										<Image
											src={course.thumbnail || ""}
											alt={course.title}
											fill
											className="object-cover"
										/>
										{typeof course.price === "number" && course.price === 0 && (
											<Badge className="absolute top-2 right-2 bg-green-500">
												{t("courses.free") || "Free"}
											</Badge>
										)}
									</div>
									<CardHeader>
										<CardTitle className="line-clamp-2">
											{course.title}
										</CardTitle>
										<CardDescription className="line-clamp-2">
											{course.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="flex-grow">
										<div className="flex items-center gap-2 mb-2">
											{course.tutor && (
												<div className="flex items-center gap-2">
													<Avatar className="h-6 w-6">
														<AvatarImage
															src={course.tutor.avatar}
															alt={course.tutor.name}
														/>
														<AvatarFallback>
															{course.tutor.name.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<span className="text-sm text-muted-foreground">
														{course.tutor.name}
													</span>
												</div>
											)}
										</div>
										<div className="flex items-center gap-4 text-sm text-muted-foreground">
											{course.rating && (
												<div className="flex items-center gap-1">
													<StarIcon className="h-4 w-4 text-yellow-500" />
													<span>{course.rating.toFixed(1)}</span>
												</div>
											)}
											{course.enrolledStudents && (
												<div className="flex items-center gap-1">
													<UsersIcon className="h-4 w-4" />
													<span>
														{course.enrolledStudents.toLocaleString()}
													</span>
												</div>
											)}
											{course.duration && (
												<div className="flex items-center gap-1">
													<ClockIcon className="h-4 w-4" />
													<span>{course.duration}</span>
												</div>
											)}
										</div>
									</CardContent>
									<CardFooter className="flex gap-2">
										<Button variant="outline" asChild className="flex-1">
											<Link href={`/courses/${course.slug}`}>
												{t("courses.details") || "Details"}
											</Link>
										</Button>
										<Button
											className="flex-1"
											onClick={() => handleEnrollCourse(course.id, course.slug)}
										>
											{course.isEnrolled
												? t("courses.continue") || "Continue"
												: t("courses.enroll") || "Enroll"}
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
					)}
				</section>
			</main>
			<Footer />
		</div>
	);
}
