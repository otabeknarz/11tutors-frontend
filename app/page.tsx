"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../lib/LanguageContext";
import Link from "next/link";
import Image from "next/image";
import api from "@/lib/api";
import { ArrowRight, BookOpen, Users, GraduationCap, Play } from "lucide-react";

import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Course {
	id: number;
	title: string;
	slug: string;
	description: string;
	thumbnail: string;
	price: string;
	is_free: boolean;
	category: { id: number; name: string } | null;
	instructor: { id: number; first_name: string; last_name: string } | null;
}

export default function Home() {
	const { t } = useLanguage();
	const [courses, setCourses] = useState<Course[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchCourses = async () => {
			try {
				const response = await api.get("/api/courses/courses/");
				setCourses(
					response.data.results?.slice(0, 6) || response.data.slice(0, 6) || []
				);
			} catch (error) {
				console.error("Failed to fetch courses:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchCourses();
	}, []);

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			<main>
				{/* Hero Section */}
				<section className="relative pt-32 pb-20 md:pt-44 md:pb-28">
					<div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
					<div className="container mx-auto px-4 relative">
						<div className="max-w-3xl mx-auto text-center">
							<h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
								{t("landing.heroSection.title")}
							</h1>
							<p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
								{t("landing.heroSection.subtitle")}
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" asChild>
									<Link href="/courses">
										{t("landing.heroSection.browseCourses")}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Link>
								</Button>
								<Button size="lg" variant="outline" asChild>
									<Link href="/for-tutors">
										{t("landing.heroSection.becomeTutor")}
									</Link>
								</Button>
							</div>
						</div>
					</div>
				</section>

				{/* How It Works */}
				<section className="py-16 md:py-24 bg-muted/30">
					<div className="container mx-auto px-4">
						<div className="text-center mb-12">
							<h2 className="text-3xl md:text-4xl font-bold mb-4">
								{t("landing.howItWorks.title")}
							</h2>
							<p className="text-muted-foreground max-w-2xl mx-auto">
								{t("landing.howItWorks.description")}
							</p>
						</div>
						<div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
							{[
								{ icon: BookOpen, step: "step1" },
								{ icon: Users, step: "step2" },
								{ icon: GraduationCap, step: "step3" },
							].map((item, index) => (
								<div key={index} className="text-center">
									<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
										<item.icon className="h-8 w-8 text-primary" />
									</div>
									<h3 className="text-lg font-semibold mb-2">
										{t(`landing.howItWorks.${item.step}.title`)}
									</h3>
									<p className="text-sm text-muted-foreground">
										{t(`landing.howItWorks.${item.step}.description`)}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Featured Courses */}
				<section className="py-16 md:py-24">
					<div className="container mx-auto px-4">
						<div className="flex items-center justify-between mb-12">
							<div>
								<h2 className="text-3xl md:text-4xl font-bold mb-2">
									{t("landing.featuredCourses.title")}
								</h2>
								<p className="text-muted-foreground">
									{t("landing.featuredCourses.subtitle")}
								</p>
							</div>
							<Button variant="outline" asChild className="hidden sm:flex">
								<Link href="/courses">
									{t("landing.featuredCourses.viewAll")}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>

						{loading ? (
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{[...Array(6)].map((_, i) => (
									<Card key={i} className="overflow-hidden">
										<Skeleton className="aspect-video" />
										<CardContent className="p-4">
											<Skeleton className="h-6 w-3/4 mb-2" />
											<Skeleton className="h-4 w-full mb-4" />
											<Skeleton className="h-4 w-1/4" />
										</CardContent>
									</Card>
								))}
							</div>
						) : courses.length > 0 ? (
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{courses.map((course) => (
									<Link key={course.id} href={`/courses/${course.slug}`}>
										<Card className="overflow-hidden h-full hover:shadow-lg transition-shadow group">
											<div className="aspect-video relative bg-muted">
												{course.thumbnail ? (
													<Image
														src={course.thumbnail}
														alt={course.title}
														fill
														className="object-cover"
													/>
												) : (
													<div className="absolute inset-0 flex items-center justify-center bg-primary/10">
														<BookOpen className="h-12 w-12 text-primary/50" />
													</div>
												)}
												<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
													<Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
												</div>
												{course.is_free && (
													<Badge className="absolute top-3 left-3 bg-green-500">
														{t("courses.free")}
													</Badge>
												)}
											</div>
											<CardContent className="p-4">
												<h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
													{course.title}
												</h3>
												<p className="text-sm text-muted-foreground line-clamp-2 mb-3">
													{course.description}
												</p>
												<div className="flex items-center justify-between">
													{course.category && (
														<Badge variant="secondary">
															{course.category.name}
														</Badge>
													)}
													<span className="font-semibold text-primary">
														{course.is_free
															? t("courses.free")
															: `$${course.price}`}
													</span>
												</div>
											</CardContent>
										</Card>
									</Link>
								))}
							</div>
						) : (
							<div className="text-center py-12">
								<BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
								<p className="text-muted-foreground">
									{t("courses.noCoursesFound")}
								</p>
							</div>
						)}

						<div className="text-center mt-8 sm:hidden">
							<Button variant="outline" asChild>
								<Link href="/courses">
									{t("landing.featuredCourses.viewAll")}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-16 md:py-24 bg-primary text-primary-foreground">
					<div className="container mx-auto px-4 text-center">
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							{t("landing.forTutors.title")}
						</h2>
						<p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
							{t("landing.forTutors.subtitle")}
						</p>
						<Button size="lg" variant="secondary" asChild>
							<Link href="/for-tutors">
								{t("landing.forTutors.joinCta")}
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
