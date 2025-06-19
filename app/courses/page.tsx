"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import {
	BookOpenIcon,
	StarIcon,
	UsersIcon,
	ClockIcon,
	FilterIcon,
	SearchIcon,
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
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function CoursesPage() {
	const { t } = useLanguage();
	const [searchQuery, setSearchQuery] = React.useState("");
	const [categoryFilter, setCategoryFilter] = React.useState("all");

	// Mock course data - in a real app, this would come from an API
	const courses = [
		{
			id: 1,
			title: t("courses.mockData.math.title"),
			description: t("courses.mockData.math.description"),
			category: "mathematics",
			level: t("courses.level.beginner"),
			rating: 4.8,
			students: 1245,
			duration: t("courses.duration.weeks", { count: 8 }),
			image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
			price: "$49.99",
			instructor: t("courses.mockData.math.instructor"),
		},
		{
			id: 2,
			title: t("courses.mockData.physics.title"),
			description: t("courses.mockData.physics.description"),
			category: "science",
			level: t("courses.level.advanced"),
			rating: 4.9,
			students: 876,
			duration: t("courses.duration.weeks", { count: 12 }),
			image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa",
			price: "$69.99",
			instructor: t("courses.mockData.physics.instructor"),
		},
		{
			id: 3,
			title: t("courses.mockData.literature.title"),
			description: t("courses.mockData.literature.description"),
			category: "literature",
			level: t("courses.level.intermediate"),
			rating: 4.7,
			students: 932,
			duration: t("courses.duration.weeks", { count: 10 }),
			image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0",
			price: "$39.99",
			instructor: t("courses.mockData.literature.instructor"),
		},
		{
			id: 4,
			title: t("courses.mockData.cs.title"),
			description: t("courses.mockData.cs.description"),
			category: "technology",
			level: t("courses.level.beginner"),
			rating: 4.9,
			students: 2134,
			duration: t("courses.duration.weeks", { count: 8 }),
			image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
			price: "$59.99",
			instructor: t("courses.mockData.cs.instructor"),
		},
		{
			id: 5,
			title: t("courses.mockData.history.title"),
			description: t("courses.mockData.history.description"),
			category: "history",
			level: t("courses.level.intermediate"),
			rating: 4.6,
			students: 745,
			duration: t("courses.duration.weeks", { count: 6 }),
			image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1",
			price: "$44.99",
			instructor: t("courses.mockData.history.instructor"),
		},
		{
			id: 6,
			title: t("courses.mockData.chemistry.title"),
			description: t("courses.mockData.chemistry.description"),
			category: "science",
			level: t("courses.level.advanced"),
			rating: 4.8,
			students: 623,
			duration: t("courses.duration.weeks", { count: 14 }),
			image: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6",
			price: "$79.99",
			instructor: t("courses.mockData.chemistry.instructor"),
		},
	];

	// Filter courses based on search query and category
	const filteredCourses = courses.filter((course) => {
		const matchesSearch =
			course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			course.description.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory =
			categoryFilter === "all" || course.category === categoryFilter;
		return matchesSearch && matchesCategory;
	});

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

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
							<Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
						>
							{filteredCourses.map((course) => (
								<motion.div key={course.id} variants={itemVariants}>
									<Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
										<div className="relative h-48 bg-muted">
											<div
												className="absolute inset-0 bg-cover bg-center"
												style={{ backgroundImage: `url(${course.image})` }}
											/>
											<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
											<div className="absolute bottom-3 left-3">
												<Badge className="bg-primary/90 hover:bg-primary text-white">
													{course.level}
												</Badge>
											</div>
											<div className="absolute top-3 right-3 flex items-center bg-black/50 text-white text-sm px-2 py-1 rounded-full">
												<StarIcon className="h-3 w-3 text-yellow-400 mr-1" />
												{course.rating}
											</div>
										</div>

										<CardHeader>
											<div className="flex justify-between items-start">
												<CardTitle className="text-xl">
													{course.title}
												</CardTitle>
											</div>
											<CardDescription className="text-sm text-muted-foreground">
												{course.instructor}
											</CardDescription>
										</CardHeader>

										<CardContent className="flex-grow">
											<p className="text-sm text-muted-foreground line-clamp-2">
												{course.description}
											</p>

											<div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
												<div className="flex items-center">
													<UsersIcon className="h-4 w-4 mr-1" />
													{course.students}
												</div>
												<div className="flex items-center">
													<ClockIcon className="h-4 w-4 mr-1" />
													{course.duration}
												</div>
											</div>
										</CardContent>

										<CardFooter className="flex justify-between items-center border-t pt-4">
											<span className="font-bold">{course.price}</span>
											<Button size="sm">{t("courses.viewCourse")}</Button>
										</CardFooter>
									</Card>
								</motion.div>
							))}
						</motion.div>
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
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-center max-w-2xl mx-auto"
					>
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
					</motion.div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
