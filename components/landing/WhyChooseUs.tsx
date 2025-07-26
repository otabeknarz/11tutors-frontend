"use client";

import { useRef, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import {
	BrainIcon,
	PiggyBankIcon,
	RocketIcon,
	GraduationCapIcon,
	CheckCircle2Icon,
	StarIcon,
	ClockIcon,
	HeartIcon,
	ShieldCheckIcon,
	TrendingUpIcon,
	AwardIcon,
} from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";

type BenefitType = {
	title: string;
	description: string;
	icon: any;
	emoji?: string;
	color?: string;
};

type WhyChooseUsProps = {
	title?: string;
	subtitle?: string;
	benefits?: BenefitType[];
	trustedByText?: string;
};

export default function WhyChooseUs(props: WhyChooseUsProps) {
	const { t } = useLanguage();

	// Use translation keys
	const title = t("landing.whyChooseUs.title");
	const subtitle = t("landing.whyChooseUs.subtitle");
	const trustedByText = t("landing.whyChooseUs.trustedBy");
	const benefits =
		props.benefits && props.benefits.length > 0 ? props.benefits : [];
	const containerRef = useRef(null);
	const isInView = useInView(containerRef, { once: true, amount: 0.2 });
	const controls = useAnimation();

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

	// Use provided benefits or fallback to default ones if not provided
	const displayBenefits =
		benefits.length > 0
			? benefits
			: [
					{
						icon: BrainIcon,
						title: t("landing.whyChooseUs.benefit1.title"),
						description: t("landing.whyChooseUs.benefit1.description"),
						emoji: "🧠",
						color: "from-blue-500 to-indigo-500",
					},
					{
						icon: PiggyBankIcon,
						title: t("landing.whyChooseUs.benefit2.title"),
						description: t("landing.whyChooseUs.benefit2.description"),
						emoji: "💰",
						color: "from-green-500 to-emerald-500",
					},
					{
						icon: ClockIcon,
						title: t("landing.whyChooseUs.benefit5.title"),
						description: t("landing.whyChooseUs.benefit5.description"),
						emoji: "⏰",
						color: "from-amber-500 to-orange-500",
					},
					{
						icon: RocketIcon,
						title: t("landing.whyChooseUs.benefit3.title"),
						description: t("landing.whyChooseUs.benefit3.description"),
						emoji: "🚀",
						color: "from-purple-500 to-pink-500",
					},
					{
						icon: GraduationCapIcon,
						title: t("landing.whyChooseUs.benefit4.title"),
						description: t("landing.whyChooseUs.benefit4.description"),
						emoji: "👩‍🎓",
						color: "from-blue-600 to-sky-500",
					},
					{
						icon: TrendingUpIcon,
						title: t("landing.whyChooseUs.benefit6.title"),
						description: t("landing.whyChooseUs.benefit6.description"),
						emoji: "📈",
						color: "from-red-500 to-rose-500",
					},
			  ];

	// University data with colors and initials
	const universities = [
		{ name: "Harvard Universitys", initial: "H", color: "bg-crimson-700" },
		{ name: "Stanford University", initial: "S", color: "bg-red-600" },
		{ name: "MIT", initial: "M", color: "bg-gray-800" },
		{ name: "Oxford University", initial: "O", color: "bg-blue-800" },
		{ name: "Cambridge University", initial: "C", color: "bg-red-700" },
		{ name: "UC Berkeley", initial: "B", color: "bg-blue-700" },
		{ name: "Yale University", initial: "Y", color: "bg-blue-900" },
		{ name: "Princeton", initial: "P", color: "bg-orange-600" },
	];

	// Stats
	const stats = [
		{
			value: t("landing.whyChooseUs.stat1.value"),
			label: t("landing.whyChooseUs.stat1.label"),
			icon: StarIcon,
			color: "bg-amber-100 text-amber-700",
		},
		{
			value: t("landing.whyChooseUs.stat2.value"),
			label: t("landing.whyChooseUs.stat2.label"),
			icon: AwardIcon,
			color: "bg-blue-100 text-blue-700",
		},
	];

	useEffect(() => {
		if (isInView) {
			controls.start("visible");
		}
	}, [controls, isInView]);

	return (
		<section id="why-choose-us" className="py-20 relative overflow-hidden">
			{/* Background gradient elements */}
			<div className="absolute -z-10 top-0 right-0 w-1/3 h-1/3 bg-gradient-to-br from-primary/5 to-primary/0 rounded-full blur-3xl" />
			<div className="absolute -z-10 bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-secondary/5 to-secondary/0 rounded-full blur-3xl" />

			<div className="container mx-auto px-4" ref={containerRef}>
				<motion.div
					initial="hidden"
					animate={controls}
					variants={containerVariants}
					className="text-center mb-16"
				>
					<motion.h2
						className="text-3xl md:text-4xl font-bold mb-4"
						variants={itemVariants}
					>
						<span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
							{title}
						</span>
					</motion.h2>
					<motion.p
						className="text-xl text-muted-foreground max-w-2xl mx-auto"
						variants={itemVariants}
					>
						{subtitle}
					</motion.p>
				</motion.div>

				{/* Stats section */}
				<motion.div
					variants={containerVariants}
					className="grid sm:grid-cols-2 gap-4 mb-16"
				>
					{stats.map((stat, index) => {
						const StatIcon = stat.icon;
						return (
							<motion.div
								key={index}
								variants={itemVariants}
								whileHover={{ y: -5 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								<Card className="border-none shadow-md overflow-hidden h-full">
									<CardContent className="p-6 text-center">
										<div
											className={`mx-auto w-12 h-12 rounded-full ${stat.color} flex items-center justify-center mb-4`}
										>
											<StatIcon className="h-6 w-6" />
										</div>
										<h3 className="text-2xl font-bold">{stat.value}</h3>
										<p className="text-sm text-muted-foreground">
											{stat.label}
										</p>
									</CardContent>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>

				{/* Benefits grid */}
				<motion.div
					variants={containerVariants}
					className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
				>
					{displayBenefits.map((benefit, index) => {
						const Icon = benefit.icon;
						return (
							<motion.div
								key={index}
								variants={itemVariants}
								whileHover={{ y: -5 }}
								transition={{ type: "spring", stiffness: 300 }}
							>
								<Card className="overflow-hidden h-full border-none shadow-md">
									<div
										className={`h-2 w-full bg-gradient-to-r ${benefit.color}`}
									/>
									<CardContent className="p-6">
										<div
											className={`mb-4 w-14 h-14 rounded-full bg-gradient-to-br ${benefit.color} flex items-center justify-center text-white shadow-md`}
										>
											<Icon className="h-7 w-7" />
										</div>
										<h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
											{benefit.emoji && (
												<span className="text-xl">{benefit.emoji}</span>
											)}
											<span>{benefit.title}</span>
										</h3>
										<p className="text-muted-foreground">
											{benefit.description}
										</p>
									</CardContent>
									<CardFooter className="px-6 pb-4 pt-0">
										<div className="flex items-center text-sm text-primary">
											<CheckCircle2Icon className="h-4 w-4 mr-1" />
											<span>{t("landing.whyChooseUs.verifiedByStudents")}</span>
										</div>
									</CardFooter>
								</Card>
							</motion.div>
						);
					})}
				</motion.div>

				{/* University badges */}
				<motion.div variants={containerVariants} className="mt-16 text-center">
					<motion.h3
						className="text-xl font-semibold mb-8"
						variants={itemVariants}
					>
						{trustedByText}
					</motion.h3>
					<motion.div
						className="flex flex-wrap justify-center items-center gap-4"
						variants={containerVariants}
					>
						{universities.map((university, index) => (
							<motion.div
								key={index}
								className="flex flex-col items-center"
								variants={itemVariants}
								whileHover={{ scale: 1.05 }}
							>
								<div
									className={`w-12 h-12 ${university.color} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md`}
								>
									{university.initial}
								</div>
								<span className="text-xs mt-2 text-muted-foreground">
									{university.name}
								</span>
							</motion.div>
						))}
					</motion.div>

					<motion.div className="mt-12" variants={itemVariants}>
						<Button variant="outline" className="gap-2 group">
							{t("landing.whyChooseUs.viewAllUniversities")}
							<svg
								className="h-4 w-4 group-hover:translate-x-1 transition-transform"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M14 5l7 7m0 0l-7 7m7-7H3"
								/>
							</svg>
						</Button>
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
