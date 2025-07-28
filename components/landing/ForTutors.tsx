"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DollarSignIcon,
	AwardIcon,
	ClockIcon,
	GraduationCapIcon,
	BrainIcon,
	UsersIcon,
	StarIcon,
	TrendingUpIcon,
	ArrowRightIcon,
	CheckCircleIcon,
	CalendarIcon,
	GlobeIcon,
	Code,
	Calculator,
	Database,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type Benefit = {
	title: string;
	description: string;
	icon?: ReactNode;
};

type ForTutorsProps = {
	title?: string;
	subtitle?: string;
	benefits?: Benefit[];
	joinCtaText?: string;
	featuredTutorsTitle?: string;
};

export default function ForTutors({
	title,
	subtitle,
	benefits = [],
	joinCtaText,
	featuredTutorsTitle,
}: ForTutorsProps) {
	const { t } = useLanguage();

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	// Get translations for title, subtitle, and CTA text
	const sectionTitle = title || t("forTutors.title");
	const sectionSubtitle = subtitle || t("forTutors.subtitle");
	const sectionJoinCtaText = joinCtaText || t("forTutors.joinCta");
	const sectionFeaturedTutorsTitle =
		featuredTutorsTitle || t("forTutors.featuredTutors");

	// Use provided benefits or fallback to default ones if not provided
	const displayBenefits =
		benefits.length > 0
			? benefits
			: [
					{
						icon: <DollarSignIcon className="h-6 w-6" />,
						title: t("forTutors.benefit1.title"),
						description: t("forTutors.benefit1.description"),
					},
					{
						icon: <GraduationCapIcon className="h-6 w-6" />,
						title: t("forTutors.benefit2.title"),
						description: t("forTutors.benefit2.description"),
					},
					{
						icon: <CalendarIcon className="h-6 w-6" />,
						title: t("forTutors.benefit3.title"),
						description: t("forTutors.benefit3.description"),
					},
					{
						icon: <BrainIcon className="h-6 w-6" />,
						title: t("landing.forTutors.benefit4.title"),
						description: t("landing.forTutors.benefit4.description"),
					},
					{
						icon: <GlobeIcon className="h-6 w-6" />,
						title: t("landing.forTutors.benefit5.title"),
						description: t("landing.forTutors.benefit5.description"),
					},
					{
						icon: <TrendingUpIcon className="h-6 w-6" />,
						title: t("landing.forTutors.benefit6.title"),
						description: t("landing.forTutors.benefit6.description"),
					},
			  ];

	// Function to get icon based on benefit title if not provided
	const getIconForBenefit = (benefitTitle: string) => {
		const title = benefitTitle.toLowerCase();
		if (title.includes("money") || title.includes("earn")) {
			return <DollarSignIcon className="h-6 w-6" />;
		} else if (
			title.includes("cv") ||
			title.includes("resume") ||
			title.includes("build")
		) {
			return <GraduationCapIcon className="h-6 w-6" />;
		} else if (
			title.includes("hour") ||
			title.includes("time") ||
			title.includes("flex")
		) {
			return <CalendarIcon className="h-6 w-6" />;
		} else if (title.includes("knowledge") || title.includes("learn")) {
			return <BrainIcon className="h-6 w-6" />;
		} else if (
			title.includes("global") ||
			title.includes("reach") ||
			title.includes("world")
		) {
			return <GlobeIcon className="h-6 w-6" />;
		} else if (title.includes("career") || title.includes("growth")) {
			return <TrendingUpIcon className="h-6 w-6" />;
		}
		return <AwardIcon className="h-6 w-6" />;
	};

	// Featured tutors with success stories
	const featuredTutors = [
		{
			name: "Emma Wilson",
			avatar: "/tutors/emma.jpg",
			university: "Harvard University",
			universityColor: "bg-red-800",
			universityInitial: "H",
			subject: "Mathematics",
			subjectIcon: Calculator,
			earnings: "$2,500+",
			students: 120,
			rating: 4.9,
			testimonial:
				"Teaching on 11tutors has been an amazing experience. I've earned enough to cover my textbooks and living expenses while helping others succeed.",
		},
		{
			name: "David Kim",
			avatar: "/tutors/david.jpg",
			university: "Princeton University",
			universityColor: "bg-orange-600",
			universityInitial: "P",
			subject: "Computer Science",
			subjectIcon: Code,
			earnings: "$3,200+",
			students: 145,
			rating: 4.8,
			testimonial:
				"Creating courses has helped me master the material even better. Plus, the extra income as a student has been life-changing.",
		},
		{
			name: "Sophia Chen",
			avatar: "/tutors/sophia.jpg",
			university: "Stanford University",
			universityColor: "bg-red-600",
			universityInitial: "S",
			subject: "Data Science",
			subjectIcon: Database,
			earnings: "$4,100+",
			students: 180,
			rating: 4.9,
			testimonial:
				"The platform makes it easy to create professional courses. I've built a reputation as a tutor that's already helping my career prospects.",
		},
	];

	return (
		<section id="for-tutors" className="py-20 relative overflow-hidden">
			{/* Background gradient elements */}
			<div className="absolute -z-10 top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl" />
			<div className="absolute -z-10 bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/10 to-secondary/5 rounded-full blur-3xl" />

			<div className="container mx-auto px-4">
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, amount: 0.2 }}
					variants={containerVariants}
					className="flex flex-col lg:flex-row items-start gap-12"
				>
					{/* Content */}
					<motion.div className="flex-1" variants={itemVariants}>
						<div className="max-w-2xl mx-auto text-center mb-16">
							<h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
								{sectionTitle}
							</h2>
							<p className="text-lg text-muted-foreground">{sectionSubtitle}</p>
						</div>

						<motion.div
							className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
							variants={containerVariants}
						>
							{displayBenefits.map((benefit, index) => (
								<motion.div
									key={index}
									className="bg-card rounded-xl p-6 shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-300"
									variants={itemVariants}
									whileHover={{ y: -5 }}
								>
									<div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-primary mb-4">
										{benefit.icon || getIconForBenefit(benefit.title)}
									</div>
									<h3 className="text-lg font-semibold mb-2">
										{benefit.title}
									</h3>
									<p className="text-muted-foreground text-sm">
										{benefit.description}
									</p>
								</motion.div>
							))}
						</motion.div>

						<motion.div variants={itemVariants} className="mb-16">
							<Button size="lg" className="group">
								{sectionJoinCtaText}{" "}
								<ArrowRightIcon className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
							</Button>
						</motion.div>

						<div className="relative">
							{/* Background decorative elements */}
							<div className="absolute -z-10 top-10 right-10 h-64 w-64 rounded-full bg-primary/5 blur-3xl" />
							<div className="absolute -z-10 bottom-10 left-10 h-40 w-40 rounded-full bg-secondary/5 blur-2xl" />

							{/* Featured tutor cards */}
							<motion.div className="space-y-6" variants={containerVariants}>
								{featuredTutors.map((tutor, index) => (
									<motion.div
										key={index}
										variants={itemVariants}
										whileHover={{ scale: 1.02 }}
										transition={{ type: "spring", stiffness: 300 }}
									>
										<Card className="relative overflow-hidden border border-border/50 shadow-md hover:shadow-lg transition-all duration-300">
											{/* Success badge */}
											<Badge className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center gap-1">
												<StarIcon className="h-3 w-3 fill-white" />
												{sectionFeaturedTutorsTitle}
											</Badge>

											<CardContent className="p-6">
												<div className="flex gap-4">
													<Avatar className="h-16 w-16 ring-2 ring-primary/20">
														<AvatarImage src={tutor.avatar} alt={tutor.name} />
														<AvatarFallback>
															{tutor.name.charAt(0)}
														</AvatarFallback>
													</Avatar>

													<div>
														<h3 className="font-semibold text-lg">
															{tutor.name}
														</h3>
														<div className="flex items-center gap-1 text-sm text-muted-foreground">
															<div
																className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] text-white font-bold ${tutor.universityColor}`}
															>
																{tutor.universityInitial}
															</div>
															{tutor.university}
														</div>
														<div className="flex items-center gap-1 text-sm font-medium">
															<span className="inline-block p-1 rounded-full bg-primary/10">
																<tutor.subjectIcon className="h-3 w-3 text-primary" />
															</span>
															{tutor.subject}
														</div>

														<div className="flex flex-wrap gap-3 mt-2 text-sm">
															<div className="flex items-center gap-1 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-md">
																<DollarSignIcon className="h-3 w-3 text-green-600" />
																<span>{tutor.earnings}</span>
															</div>
															<div className="flex items-center gap-1 bg-blue-50 dark:bg-blue-950/30 px-2 py-1 rounded-md">
																<UsersIcon className="h-3 w-3 text-blue-600" />
																<span>{tutor.students} students</span>
															</div>
															<div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-md">
																<StarIcon className="h-3 w-3 fill-amber-400 text-amber-400" />
																<span>{tutor.rating}</span>
															</div>
														</div>
													</div>
												</div>

												<div className="mt-4 italic text-sm bg-muted/30 p-3 rounded-lg border-l-2 border-primary/30">
													"{tutor.testimonial}"
												</div>
											</CardContent>

											<CardFooter className="bg-muted/20 px-6 py-3 flex justify-end">
												<Button
													variant="ghost"
													size="sm"
													className="text-xs group"
												>
													View Profile{" "}
													<ArrowRightIcon className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
												</Button>
											</CardFooter>
										</Card>
									</motion.div>
								))}
							</motion.div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
