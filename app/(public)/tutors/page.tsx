"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import {
	SearchIcon,
	FilterIcon,
	StarIcon,
	MapPinIcon,
	GraduationCapIcon,
	BookOpenIcon,
	CheckCircleIcon,
	ClockIcon,
	DollarSignIcon,
	UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function TutorsPage() {
	const { t } = useLanguage();
	const [searchQuery, setSearchQuery] = useState("");
	const [subjectFilter, setSubjectFilter] = useState("all");
	const [sortBy, setSortBy] = useState("rating");

	// Mock tutor data - in a real app, this would come from an API
	const tutors = [
		{
			id: 1,
			name: "Dr. Sarah Johnson",
			avatar: "https://i.pravatar.cc/150?img=1",
			subjects: ["Mathematics", "Physics"],
			rating: 4.9,
			reviews: 124,
			location: "New York, USA",
			hourlyRate: "$45",
			education: "Ph.D. in Mathematics, MIT",
			experience: "10+ years",
			bio: "Experienced mathematics and physics tutor with a passion for making complex concepts easy to understand.",
			verified: true,
			availability: "Weekdays, Evenings",
		},
		{
			id: 2,
			name: "Prof. Michael Chen",
			avatar: "https://i.pravatar.cc/150?img=11",
			subjects: ["Computer Science", "Data Science"],
			rating: 4.8,
			reviews: 98,
			location: "San Francisco, USA",
			hourlyRate: "$60",
			education: "Ph.D. in Computer Science, Stanford",
			experience: "8+ years",
			bio: "Specialized in programming, algorithms, and machine learning. I help students build practical skills for the tech industry.",
			verified: true,
			availability: "Flexible",
		},
		{
			id: 3,
			name: "Emily Williams",
			avatar: "https://i.pravatar.cc/150?img=5",
			subjects: ["English Literature", "Creative Writing"],
			rating: 4.7,
			reviews: 87,
			location: "London, UK",
			hourlyRate: "$40",
			education: "M.A. in English Literature, Oxford",
			experience: "6+ years",
			bio: "Passionate about literature and helping students develop their writing skills and critical thinking.",
			verified: true,
			availability: "Weekends, Evenings",
		},
		{
			id: 4,
			name: "Dr. Robert Thompson",
			avatar: "https://i.pravatar.cc/150?img=12",
			subjects: ["History", "Political Science"],
			rating: 4.9,
			reviews: 76,
			location: "Chicago, USA",
			hourlyRate: "$50",
			education: "Ph.D. in History, University of Chicago",
			experience: "12+ years",
			bio: "Specialized in modern history and political systems. I make history come alive for my students.",
			verified: true,
			availability: "Weekdays",
		},
		{
			id: 5,
			name: "Lisa Anderson",
			avatar: "https://i.pravatar.cc/150?img=9",
			subjects: ["Chemistry", "Biology"],
			rating: 4.8,
			reviews: 92,
			location: "Boston, USA",
			hourlyRate: "$55",
			education: "Ph.D. in Chemistry, Harvard",
			experience: "7+ years",
			bio: "Helping students master the sciences with clear explanations and practical examples.",
			verified: true,
			availability: "Flexible",
		},
		{
			id: 6,
			name: "David Miller",
			avatar: "https://i.pravatar.cc/150?img=15",
			subjects: ["Economics", "Business"],
			rating: 4.6,
			reviews: 68,
			location: "Toronto, Canada",
			hourlyRate: "$48",
			education: "MBA, University of Toronto",
			experience: "9+ years",
			bio: "Specialized in economics and business strategy. I help students understand real-world applications.",
			verified: true,
			availability: "Weekdays, Evenings",
		},
	];

	// Filter and sort tutors based on search query, subject, and sort criteria
	const filteredAndSortedTutors = useMemo(() => {
		let filtered = tutors.filter((tutor) => {
			const matchesSearch =
				searchQuery === "" ||
				tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tutor.bio.toLowerCase().includes(searchQuery.toLowerCase()) ||
				tutor.subjects.some((subject) =>
					subject.toLowerCase().includes(searchQuery.toLowerCase())
				);

			const matchesSubject =
				subjectFilter === "all" ||
				tutor.subjects.some((subject) =>
					subject
						.toLowerCase()
						.replace(" ", "")
						.includes(subjectFilter.toLowerCase())
				);

			return matchesSearch && matchesSubject;
		});

		// Sort tutors based on selected criteria
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "rating":
					return b.rating - a.rating;
				case "priceAsc":
					return (
						parseInt(a.hourlyRate.replace("$", "")) -
						parseInt(b.hourlyRate.replace("$", ""))
					);
				case "priceDesc":
					return (
						parseInt(b.hourlyRate.replace("$", "")) -
						parseInt(a.hourlyRate.replace("$", ""))
					);
				case "experience":
					return (
						parseInt(b.experience.replace("+", "")) -
						parseInt(a.experience.replace("+", ""))
					);
				default:
					return 0;
			}
		});

		return filtered;
	}, [tutors, searchQuery, subjectFilter, sortBy]);

	const clearFilters = () => {
		setSearchQuery("");
		setSubjectFilter("all");
		setSortBy("rating");
	};

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
			<section className="relative py-16 lg:py-20">
				{/* Background gradient */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

				<div className="container mx-auto px-4 relative">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center max-w-4xl mx-auto"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.1 }}
							className="mb-6"
						>
							<Badge
								variant="secondary"
								className="mb-4 px-4 py-2 text-sm font-medium"
							>
								<UsersIcon className="h-4 w-4 mr-2" />
								{tutors.length}+ Expert Tutors Available
							</Badge>
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
								{t("tutors.title")}
							</h1>
						</motion.div>

						<motion.p
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed"
						>
							{t("tutors.description")}
						</motion.p>

						{/* Enhanced Search and Filter */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="bg-card/50 backdrop-blur-sm border rounded-2xl p-6 shadow-lg max-w-4xl mx-auto"
						>
							<div className="flex flex-col lg:flex-row gap-4">
								<div className="relative flex-1">
									<SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
									<Input
										placeholder={t("tutors.searchPlaceholder")}
										className="pl-12 h-12 text-base border-0 bg-background/50 focus:bg-background transition-colors"
										value={searchQuery}
										onChange={(e) => setSearchQuery(e.target.value)}
									/>
								</div>
								<Select value={subjectFilter} onValueChange={setSubjectFilter}>
									<SelectTrigger className="w-full lg:w-[200px] h-12 border-0 bg-background/50 focus:bg-background transition-colors">
										<SelectValue placeholder={t("tutors.filterBySubject")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">
											{t("tutors.allSubjects")}
										</SelectItem>
										<SelectItem value="mathematics">
											{t("tutors.subjects.mathematics")}
										</SelectItem>
										<SelectItem value="physics">
											{t("tutors.subjects.physics")}
										</SelectItem>
										<SelectItem value="computerscience">
											{t("tutors.subjects.computerScience")}
										</SelectItem>
										<SelectItem value="englishliterature">
											{t("tutors.subjects.englishLiterature")}
										</SelectItem>
										<SelectItem value="history">
											{t("tutors.subjects.history")}
										</SelectItem>
										<SelectItem value="chemistry">
											{t("tutors.subjects.chemistry")}
										</SelectItem>
										<SelectItem value="economics">
											{t("tutors.subjects.economics")}
										</SelectItem>
										<SelectItem value="biology">
											{t("tutors.subjects.biology")}
										</SelectItem>
										<SelectItem value="business">
											{t("tutors.subjects.business")}
										</SelectItem>
									</SelectContent>
								</Select>

								{/* Clear filters button */}
								{(searchQuery || subjectFilter !== "all") && (
									<Button
										variant="outline"
										onClick={clearFilters}
										className="h-12 px-6 border-0 bg-background/50 hover:bg-background transition-colors"
									>
										{t("tutors.clearFilters")}
									</Button>
								)}
							</div>
						</motion.div>
					</motion.div>
				</div>

				{/* Decorative elements */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
					<div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
					<div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
				</div>
			</section>

			{/* Tutors Grid */}
			<section className="py-16 bg-muted/20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
					>
						<div>
							<h2 className="text-2xl lg:text-3xl font-bold mb-2">
								{filteredAndSortedTutors.length}{" "}
								{filteredAndSortedTutors.length === 1
									? t("tutors.tutor")
									: t("tutors.tutorsPlural")}
							</h2>
							<p className="text-muted-foreground">
								Find the perfect tutor for your learning journey
							</p>
						</div>

						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2 text-sm text-muted-foreground">
								<FilterIcon className="h-4 w-4" />
								Sort by:
							</div>
							<Select value={sortBy} onValueChange={setSortBy}>
								<SelectTrigger className="w-[180px] bg-background border-border/50">
									<SelectValue placeholder={t("tutors.sortBy")} />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="rating">
										{t("tutors.sortOptions.rating")}
									</SelectItem>
									<SelectItem value="priceAsc">
										{t("tutors.sortOptions.priceAsc")}
									</SelectItem>
									<SelectItem value="priceDesc">
										{t("tutors.sortOptions.priceDesc")}
									</SelectItem>
									<SelectItem value="experience">
										{t("tutors.sortOptions.experience")}
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</motion.div>

					{filteredAndSortedTutors.length === 0 ? (
						<div className="text-center py-16">
							<GraduationCapIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
							<h3 className="text-xl font-medium mb-2">
								{t("tutors.noTutorsFound")}
							</h3>
							<p className="text-muted-foreground">
								{t("tutors.tryDifferentSearch")}
							</p>
							<Button
								variant="outline"
								className="mt-4"
								onClick={() => {
									setSearchQuery("");
									setSubjectFilter("all");
								}}
							>
								{t("tutors.clearFilters")}
							</Button>
						</div>
					) : (
						<motion.div
							variants={containerVariants}
							initial="hidden"
							animate="visible"
							className="grid grid-cols-1 lg:grid-cols-2 gap-6"
						>
							{filteredAndSortedTutors.map((tutor) => (
								<motion.div key={tutor.id} variants={itemVariants}>
									<Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
										<CardHeader className="pb-2">
											<div className="flex items-start gap-4">
												<Avatar className="h-16 w-16 border-2 border-primary/20">
													<AvatarImage src={tutor.avatar} alt={tutor.name} />
													<AvatarFallback>
														{tutor.name.charAt(0)}
													</AvatarFallback>
												</Avatar>
												<div className="flex-1">
													<div className="flex items-center gap-2">
														<h3 className="text-xl font-bold">{tutor.name}</h3>
														{tutor.verified && (
															<Badge
																variant="outline"
																className="bg-green-50 text-green-700 border-green-200"
															>
																<CheckCircleIcon className="h-3 w-3 mr-1" />
																{t("tutors.verified")}
															</Badge>
														)}
													</div>
													<div className="flex items-center gap-1 text-sm text-muted-foreground">
														<GraduationCapIcon className="h-3 w-3" />
														<span>{tutor.education}</span>
													</div>
													<div className="flex items-center gap-2 mt-1">
														<div className="flex items-center">
															<StarIcon className="h-4 w-4 text-yellow-400" />
															<span className="ml-1 font-medium">
																{tutor.rating}
															</span>
															<span className="text-muted-foreground text-sm ml-1">
																({tutor.reviews})
															</span>
														</div>
														<div className="flex items-center text-sm text-muted-foreground">
															<MapPinIcon className="h-3 w-3 mr-1" />
															{tutor.location}
														</div>
													</div>
												</div>
												<div className="text-right">
													<div className="font-bold text-lg">
														{tutor.hourlyRate}
													</div>
													<div className="text-xs text-muted-foreground">
														{t("tutors.perHour")}
													</div>
												</div>
											</div>
										</CardHeader>

										<CardContent>
											<p className="text-sm text-muted-foreground mb-4">
												{tutor.bio}
											</p>

											<div className="flex flex-wrap gap-2 mb-4">
												{tutor.subjects.map((subject, index) => (
													<Badge
														key={index}
														variant="secondary"
														className="bg-primary/10"
													>
														{subject}
													</Badge>
												))}
											</div>

											<div className="grid grid-cols-2 gap-4 text-sm">
												<div>
													<span className="text-muted-foreground">
														{t("tutors.experience")}:
													</span>
													<span className="ml-1 font-medium">
														{tutor.experience}
													</span>
												</div>
												<div>
													<span className="text-muted-foreground">
														{t("tutors.availability")}:
													</span>
													<span className="ml-1 font-medium">
														{tutor.availability}
													</span>
												</div>
											</div>
										</CardContent>

										<CardFooter className="flex justify-between border-t pt-4">
											<Button variant="outline">
												{t("tutors.viewProfile")}
											</Button>
											<Button>{t("tutors.bookSession")}</Button>
										</CardFooter>
									</Card>
								</motion.div>
							))}
						</motion.div>
					)}

					{/* Pagination */}
					{filteredAndSortedTutors.length > 0 && (
						<div className="flex justify-center mt-12">
							<div className="flex items-center gap-2">
								<Button variant="outline" size="sm" disabled>
									{t("tutors.previous")}
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
									{t("tutors.next")}
								</Button>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* Become a Tutor CTA */}
			<section className="py-16 bg-muted/30">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8"
					>
						<div className="flex-1">
							<h2 className="text-3xl font-bold mb-4">
								{t("tutors.becomeTitle")}
							</h2>
							<p className="text-lg text-muted-foreground mb-6">
								{t("tutors.becomeDescription")}
							</p>
							<ul className="space-y-2 mb-6">
								<li className="flex items-center gap-2">
									<CheckCircleIcon className="h-5 w-5 text-primary" />
									<span>{t("tutors.benefits.flexible")}</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircleIcon className="h-5 w-5 text-primary" />
									<span>{t("tutors.benefits.earnings")}</span>
								</li>
								<li className="flex items-center gap-2">
									<CheckCircleIcon className="h-5 w-5 text-primary" />
									<span>{t("tutors.benefits.impact")}</span>
								</li>
							</ul>
							<Button size="lg">{t("tutors.applyNow")}</Button>
						</div>
						<div className="flex-1 relative">
							<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-xl -z-10" />
							<div className="bg-card p-6 rounded-lg border shadow-lg">
								<div className="flex items-center gap-4 mb-4">
									<BookOpenIcon className="h-10 w-10 text-primary" />
									<div>
										<h3 className="font-bold text-xl">
											{t("tutors.joinTitle")}
										</h3>
										<p className="text-muted-foreground">
											{t("tutors.joinSubtitle")}
										</p>
									</div>
								</div>
								<ul className="space-y-3 mb-6">
									<li className="flex items-start gap-2">
										<CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
										<span>{t("tutors.joinBenefits.students")}</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
										<span>{t("tutors.joinBenefits.tools")}</span>
									</li>
									<li className="flex items-start gap-2">
										<CheckCircleIcon className="h-5 w-5 text-primary mt-0.5" />
										<span>{t("tutors.joinBenefits.community")}</span>
									</li>
								</ul>
							</div>
						</div>
					</motion.div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
