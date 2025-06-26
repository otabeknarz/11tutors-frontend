"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
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
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { COURSES_URL } from "@/lib/constants";

// Define types for the API response
interface Category {
	id: number;
	name: string;
	slug: string;
}

interface CoursePart {
	id: string;
	title: string;
	order: number;
}

interface Tutor {
	id: string;
	first_name: string;
	last_name: string;
	email: string;
}

interface Course {
	id: string;
	title: string;
	slug: string;
	description: string;
	thumbnail: string;
	tutors: Tutor[];
	category: Category;
	parts: CoursePart[];
	created_at: string;
	updated_at: string;
	// These fields aren't in the API response but are used in the UI
	// We'll calculate or provide default values for them
	level?: string;
	rating?: number;
	students?: number;
	duration?: string;
	price?: string | number;
}

interface CoursesResponse {
	count: number;
	next: string | null;
	previous: string | null;
	results: Course[];
}

export default function CoursesPage() {
	const { t } = useLanguage();
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
				} else {
					params.append("price_type", price);
				}
			});
		}

		if (sortOption) {
			params.append("ordering", sortOption);
		}

		return params.toString();
	};

	// Fetch courses from the API
	const fetchCourses = async (url?: string) => {
		try {
			setLoading(true);
			setError(null);

			const fetchUrl = url || `${COURSES_URL}?${buildQueryParams()}`;
			const response = await axios.get<CoursesResponse>(fetchUrl);
			const data = response.data;

			setCourses(data.results);
			setTotalCount(data.count);
			setNextPageUrl(data.next);
			setPrevPageUrl(data.previous);
			setTotalPages(Math.ceil(data.count / pageSize));
		} catch (err) {
			console.error("Error fetching courses:", err);
			setError(t("courses.errorFetching") || "Error fetching courses");
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
			setCurrentPage((prev) => prev + 1);
		}
	};

	const goToPrevPage = () => {
		if (prevPageUrl) {
			fetchCourses(prevPageUrl);
			setCurrentPage((prev) => prev - 1);
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
		setActiveTab("all");
	};

	// For development/fallback when API is not available
	const [showPlaceholders, setShowPlaceholders] = useState(false);

	// Use placeholder data if no courses are available and not loading
	useEffect(() => {
		if (!loading && courses.length === 0 && !error) {
			setShowPlaceholders(true);
		} else {
			setShowPlaceholders(false);
		}
	}, [courses, loading, error]);

	// Filter courses based on search query and category
	const filteredCourses = courses.filter((course) => {
		const matchesSearch =
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			categoryFilter === "all" ||
			course.category.name.toLowerCase() === categoryFilter;
		return matchesSearch && matchesCategory;
	});

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			{/* Hero Section */}
			<section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5 }}
						className="text-center max-w-3xl mx-auto"
					>
						<h1 className="text-4xl md:text-5xl font-bold mb-6">
							{t("courses.title")}
						</h1>
						<p className="text-xl text-muted-foreground mb-8">
							{t("courses.description")}
						</p>

						{/* Search and Filter */}
						<div className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto">
							<div className="relative flex-1">
								<SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
								<Input
									placeholder={t("courses.searchPlaceholder")}
									className="pl-10"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>
							<div className="flex gap-2">
								<Select
									value={categoryFilter}
									onValueChange={setCategoryFilter}
								>
									<SelectTrigger className="w-full md:w-[180px]">
										<SelectValue placeholder={t("courses.filterByCategory")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											{t("courses.allCategories")}
										</SelectItem>
										<SelectItem value="mathematics">
											{t("courses.categories.mathematics")}
										</SelectItem>
										<SelectItem value="science">
											{t("courses.categories.science")}
										</SelectItem>
										<SelectItem value="literature">
											{t("courses.categories.literature")}
										</SelectItem>
										<SelectItem value="technology">
											{t("courses.categories.technology")}
										</SelectItem>
										<SelectItem value="history">
											{t("courses.categories.history")}
										</SelectItem>
									</SelectContent>
								</Select>
								<Select
									value={priceFilter.length > 0 ? priceFilter[0] : "all"}
									onValueChange={(value) =>
										setPriceFilter(value === "all" ? [] : [value])
									}
								>
									<SelectTrigger className="w-full md:w-[140px]">
										<SelectValue
											placeholder={t("courses.filterByPrice") || "Price"}
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
									</SelectContent>
								</Select>
							</div>
						</div>
					</motion.div>
				</div>

				{/* Decorative elements */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
					<div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
					<div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
				</div>
			</section>

			{/* Courses Grid */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<div className="flex justify-between items-center mb-8">
						<h2 className="text-2xl font-bold">
							{filteredCourses.length}{" "}
							{filteredCourses.length === 1
								? t("courses.course")
								: t("courses.coursesPlural")}
						</h2>
						<div className="flex items-center gap-2">
							<FilterIcon className="h-4 w-4 text-muted-foreground" />
							<Select defaultValue="popular">
								<SelectTrigger className="w-[160px]">
									<SelectValue placeholder={t("courses.sortBy")} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="popular">
										{t("courses.sortOptions.popular")}
									</SelectItem>
									<SelectItem value="newest">
										{t("courses.sortOptions.newest")}
									</SelectItem>
									<SelectItem value="priceAsc">
										{t("courses.sortOptions.priceAsc")}
									</SelectItem>
									<SelectItem value="priceDesc">
										{t("courses.sortOptions.priceDesc")}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>

					{filteredCourses.length === 0 ? (
						<div className="text-center py-16">
							<BookOpenIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
							<h3 className="text-xl font-medium mb-2">
								{t("courses.noCoursesFound")}
							</h3>
							<p className="text-muted-foreground">
								{t("courses.tryDifferentSearch")}
							</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={() => {
									setSearchQuery("");
									setCategoryFilter("all");
								}}
							>
								{t("courses.clearFilters")}
							</Button>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{filteredCourses.map((course) => (
								<div key={course.id}>
									<Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
										<div className="relative h-48 bg-muted">
											<Image
												src={course.thumbnail || "/placeholder-course.jpg"}
												alt={course.title}
												width={500}
												height={300}
												className="w-full h-full object-cover"
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
											<div className="absolute bottom-3 left-3">
												<Badge className="bg-primary/90 hover:bg-primary text-white">
													{course.level || "All Levels"}
												</Badge>
											</div>
											<div className="absolute top-3 right-3 flex items-center bg-black/50 text-white text-sm px-2 py-1 rounded-full">
												<StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
												{course.rating || 5}
											</div>
										</div>

										<CardHeader>
											<div className="flex justify-between items-start">
												<CardTitle className="text-xl">
													{course.title}
												</CardTitle>
											</div>
											<CardDescription className="text-sm text-muted-foreground">
												{course.tutors && course.tutors.length > 0
													? `${course.tutors[0].first_name} ${course.tutors[0].last_name}`.trim()
													: "Unknown Instructor"}
											</CardDescription>
										</CardHeader>

										<CardContent className="flex-grow">
											<p className="text-sm text-muted-foreground line-clamp-2">
												{course.description}
											</p>

											<div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
												<div className="flex items-center">
													<UsersIcon className="h-4 w-4 mr-1" />
													{course.students || 0}
												</div>
												<div className="flex items-center">
													<ClockIcon className="h-4 w-4 mr-1" />
													{course.duration ||
														`${course.parts?.length || 0} parts`}
												</div>
											</div>
										</CardContent>

										<CardFooter className="flex justify-between items-center border-t pt-4">
											<div className="flex items-center gap-2">
												{course.price ? (
													<span className="font-bold">
														{new Intl.NumberFormat("en-US", {
															style: "currency",
															currency: "USD",
														}).format(Number(course.price))}
													</span>
												) : (
													<Badge
														variant="outline"
														className="bg-green-50 text-green-700 border-green-200"
													>
														{t("courses.free") || "Free"}
													</Badge>
												)}
											</div>
											<Button
												size="sm"
												onClick={() =>
													(window.location.href = `/courses/${course.slug}`)
												}
											>
												{t("courses.viewCourse")}
											</Button>
										</CardFooter>
									</Card>
								</div>
							))}
						</div>
					)}

					{/* Pagination */}
					{filteredCourses.length > 0 && (
						<div className="flex justify-center mt-12">
							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm" disabled>
									{t("courses.previous")}
								</Button>
								<Button
									variant="outline"
									size="sm"
									className="bg-primary text-white hover:bg-primary/90"
								>
									1
								</Button>
								<Button variant="outline" size="sm">
									2
								</Button>
								<Button variant="outline" size="sm">
									3
								</Button>
								<Button variant="outline" size="sm">
									{t("courses.next")}
								</Button>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="text-center max-w-2xl mx-auto">
						<h2 className="text-3xl font-bold mb-4">{t("courses.ctaTitle")}</h2>
						<p className="text-lg text-muted-foreground mb-8">
							{t("courses.ctaDescription")}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg">{t("courses.startLearning")}</Button>
							<Button variant="outline" size="lg">
								{t("courses.becomeTutor")}
							</Button>
						</div>
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
