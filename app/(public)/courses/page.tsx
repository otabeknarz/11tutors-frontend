"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { useAuth } from "@/lib/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
	StarIcon,
	UsersIcon,
	ClockIcon,
	FilterIcon,
	SearchIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	XIcon,
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
			const response = await api.get<CoursesResponse>(
				url || "/api/courses/courses/",
			);
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
			router,
		);
	};

	return (
		<div className="min-h-screen bg-background">
			<Navbar />
			<main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
				{/* Hero Section */}
				<section className="mb-10">
					<div className="text-center">
						<h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-3">
							{t("courses.title") || "Explore Our Courses"}
						</h1>
						<p className="text-muted-foreground max-w-xl mx-auto text-base">
							{t("courses.subtitle") ||
								"Discover a wide range of courses taught by expert tutors to help you achieve your learning goals."}
						</p>
					</div>
				</section>

				{/* Search and Filter Bar */}
				<section className="mb-8">
					<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
						<div className="relative w-full md:w-1/2">
							<SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								type="text"
								placeholder={
									t("courses.searchPlaceholder") || "Search courses..."
								}
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="pl-10 h-11"
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
																			levelFilter.filter((l) => l !== level),
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
													),
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

				{/* Results count */}
				{!loading && !error && filteredCourses.length > 0 && (
					<div className="mb-6 text-sm text-muted-foreground">
						{t("courses.showing") || "Showing"} {filteredCourses.length}{" "}
						{t("courses.of") || "of"} {totalCount}{" "}
						{totalCount === 1
							? t("courses.course") || "course"
							: t("courses.coursesPlural") || "courses"}
					</div>
				)}

				{/* Course Grid */}
				<section className="mb-12">
					{loading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{Array.from({ length: 8 }).map((_, index) => (
								<Card key={index} className="overflow-hidden">
									<Skeleton className="aspect-video rounded-none" />
									<CardHeader className="pb-2">
										<Skeleton className="h-5 w-4/5" />
										<Skeleton className="h-4 w-3/5 mt-2" />
									</CardHeader>
									<CardContent>
										<Skeleton className="h-4 w-full" />
										<Skeleton className="h-4 w-2/3 mt-2" />
									</CardContent>
									<CardFooter>
										<Skeleton className="h-9 w-full" />
									</CardFooter>
								</Card>
							))}
						</div>
					) : error ? (
						<Card className="card-premium">
							<CardContent className="py-16 text-center">
								<div className="mx-auto w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
									<XIcon className="h-7 w-7 text-destructive" />
								</div>
								<h3 className="text-lg font-semibold mb-2">
									{t("courses.errorTitle") || "Oops! Something went wrong"}
								</h3>
								<p className="text-muted-foreground text-sm mb-6">{error}</p>
								<Button onClick={() => fetchCourses()}>
									{t("courses.tryAgain") || "Try Again"}
								</Button>
							</CardContent>
						</Card>
					) : filteredCourses.length === 0 ? (
						<Card className="card-premium">
							<CardContent className="py-16 text-center">
								<div className="mx-auto w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
									<SearchIcon className="h-7 w-7 text-muted-foreground" />
								</div>
								<h3 className="text-lg font-semibold mb-2">
									{t("courses.noResults") || "No courses found"}
								</h3>
								<p className="text-muted-foreground text-sm mb-6">
									{t("courses.noResultsDescription") ||
										"Try adjusting your search or filter criteria"}
								</p>
								<Button variant="outline" onClick={resetFilters}>
									{t("courses.resetFilters") || "Reset Filters"}
								</Button>
							</CardContent>
						</Card>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{filteredCourses.map((course) => (
								<Card
									key={course.id}
									className="overflow-hidden flex flex-col h-full group card-highlight"
								>
									<div className="relative aspect-video overflow-hidden">
										{course.thumbnail ? (
											<Image
												src={course.thumbnail}
												alt={course.title}
												fill
												className="object-cover transition-transform duration-500 group-hover:scale-105"
											/>
										) : (
											<div className="absolute inset-0 bg-linear-to-br from-amber-600/20 to-orange-700/20 flex items-center justify-center">
												<SearchIcon className="h-10 w-10 text-primary/30" />
											</div>
										)}
										{typeof course.price === "number" && course.price === 0 && (
											<Badge className="absolute top-3 left-3 bg-green-600 text-white border-0">
												{t("courses.free") || "Free"}
											</Badge>
										)}
										<div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
									</div>
									<CardHeader className="pb-2">
										<CardTitle className="text-base font-semibold line-clamp-2 leading-snug group-hover:text-primary transition-colors duration-200">
											{course.title}
										</CardTitle>
										<CardDescription className="line-clamp-2 text-sm leading-relaxed">
											{course.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="flex-1">
										{course.tutor && (
											<div className="flex items-center gap-2 mb-3">
												<Avatar className="h-5 w-5">
													<AvatarImage
														src={course.tutor.avatar}
														alt={course.tutor.name}
													/>
													<AvatarFallback className="text-[10px] bg-primary/10 text-primary">
														{course.tutor.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<span className="text-xs text-muted-foreground">
													{course.tutor.name}
												</span>
											</div>
										)}
										<div className="flex items-center gap-3 text-xs text-muted-foreground">
											{course.rating && (
												<div className="flex items-center gap-1">
													<StarIcon className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
													<span className="font-medium">
														{course.rating.toFixed(1)}
													</span>
												</div>
											)}
											{course.enrolledStudents && (
												<div className="flex items-center gap-1">
													<UsersIcon className="h-3.5 w-3.5" />
													<span>
														{course.enrolledStudents.toLocaleString()}
													</span>
												</div>
											)}
											{course.duration && (
												<div className="flex items-center gap-1">
													<ClockIcon className="h-3.5 w-3.5" />
													<span>{course.duration}</span>
												</div>
											)}
										</div>
									</CardContent>
									<CardFooter className="flex gap-2 pt-0">
										<Button
											variant="outline"
											size="sm"
											asChild
											className="flex-1"
										>
											<Link href={`/courses/${course.slug}`}>
												{t("courses.details") || "Details"}
											</Link>
										</Button>
										<Button
											size="sm"
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

					{/* Pagination */}
					{!loading && !error && totalPages > 1 && (
						<div className="flex justify-center items-center gap-3 mt-10">
							<Button
								variant="outline"
								size="sm"
								onClick={goToPrevPage}
								disabled={!prevPageUrl}
								className="flex items-center gap-1.5"
							>
								<ChevronLeftIcon className="h-4 w-4" />
								{t("courses.previous") || "Previous"}
							</Button>
							<span className="text-sm text-muted-foreground px-3">
								{currentPage} / {totalPages}
							</span>
							<Button
								variant="outline"
								size="sm"
								onClick={goToNextPage}
								disabled={!nextPageUrl}
								className="flex items-center gap-1.5"
							>
								{t("courses.next") || "Next"}
								<ChevronRightIcon className="h-4 w-4" />
							</Button>
						</div>
					)}
				</section>
			</main>
			<Footer />
		</div>
	);
}
