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
					response.data.results?.slice(0, 6) || response.data.slice(0, 6) || [],
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
				<section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
					{/* Ambient gradient orbs */}
					<div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/8 rounded-full blur-[140px]" />
					<div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />

					<div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
						<div className="max-w-3xl mx-auto text-center">
							<Badge
								variant="secondary"
								className="mb-6 px-4 py-1.5 text-xs font-medium"
							>
								{t("landing.trustedBadge")}
							</Badge>
							<h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-[1.1]">
								{t("landing.heroSection.title")}
							</h1>
							<p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
								{t("landing.heroSection.subtitle")}
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button size="lg" className="btn-glow" asChild>
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
				<section className="py-20 md:py-28 border-t border-border/50">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-14">
							<h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 tracking-tight">
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
								<div key={index} className="text-center group">
									<div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-primary/10 flex items-center justify-center transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-105">
										<item.icon className="h-7 w-7 text-primary" />
									</div>
									<h3 className="text-base font-semibold mb-2">
										{t(`landing.howItWorks.${item.step}.title`)}
									</h3>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{t(`landing.howItWorks.${item.step}.description`)}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Featured Courses */}
				<section className="py-20 md:py-28 border-t border-border/50">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-end justify-between mb-10">
							<div>
								<h2 className="font-heading text-3xl md:text-4xl font-bold mb-2 tracking-tight">
									{t("landing.featuredCourses.title")}
								</h2>
								<p className="text-muted-foreground">
									{t("landing.featuredCourses.subtitle")}
								</p>
							</div>
							<Button
								variant="ghost"
								className="hidden sm:flex btn-underline text-muted-foreground"
								asChild
							>
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
										<CardContent className="p-5">
											<Skeleton className="h-5 w-3/4 mb-3" />
											<Skeleton className="h-4 w-full mb-2" />
											<Skeleton className="h-4 w-1/3 mt-4" />
										</CardContent>
									</Card>
								))}
							</div>
						) : courses.length > 0 ? (
							<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
								{courses.map((course) => (
									<Link key={course.id} href={`/courses/${course.slug}`}>
										<Card className="overflow-hidden h-full group card-highlight">
											<div className="aspect-video relative bg-muted">
												{course.thumbnail ? (
													<Image
														src={course.thumbnail}
														alt={course.title}
														fill
														className="object-cover transition-transform duration-500 group-hover:scale-105"
													/>
												) : (
													<div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-amber-600/20 to-orange-700/20">
														<BookOpen className="h-10 w-10 text-primary/40" />
													</div>
												)}
												<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
													<Play className="h-10 w-10 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100" />
												</div>
												{course.is_free && (
													<Badge className="absolute top-3 left-3 bg-green-600 text-white border-0">
														{t("courses.free")}
													</Badge>
												)}
											</div>
											<CardContent className="p-5">
												<h3 className="font-semibold text-base mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-200">
													{course.title}
												</h3>
												<p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
													{course.description}
												</p>
												<div className="flex items-center justify-between">
													{course.category && (
														<Badge variant="secondary" className="text-[11px]">
															{course.category.name}
														</Badge>
													)}
													<span className="font-bold text-primary">
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
							<Card className="card-premium">
								<CardContent className="py-16 text-center">
									<div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
										<BookOpen className="h-7 w-7 text-primary" />
									</div>
									<p className="text-muted-foreground">
										{t("courses.noCoursesFound")}
									</p>
								</CardContent>
							</Card>
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
				<section className="relative py-20 md:py-28 overflow-hidden">
					{/* Dark background with warm tint */}
					<div className="absolute inset-0 bg-[#1C1917]" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[160px]" />

					<div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
						<h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 tracking-tight text-white">
							{t("landing.forTutors.title")}
						</h2>
						<p className="text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
							{t("landing.forTutors.subtitle")}
						</p>
						<Button size="lg" className="btn-glow" asChild>
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
