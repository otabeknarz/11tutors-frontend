"use client";

import { useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
	ArrowRightIcon,
	BookOpenIcon,
	UsersIcon,
	GraduationCapIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CtaBanner() {
	const { t } = useLanguage();
	const containerRef = useRef(null);
	const isInView = useInView(containerRef, { once: true, amount: 0.2 });

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 },
	};

	// Stats to display
	const stats = [
		{
			icon: BookOpenIcon,
			value: "500+",
			label: t("landing.ctaBanner.stats.courses"),
		},
		{
			icon: UsersIcon,
			value: "50,000+",
			label: t("landing.ctaBanner.stats.students"),
		},
		{
			icon: GraduationCapIcon,
			value: "2,000+",
			label: t("landing.ctaBanner.stats.tutors"),
		},
	];

	return (
		<section className="py-16 relative overflow-hidden" ref={containerRef}>
			{/* Background with gradient and blur */}
			<div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-700 -z-10" />

			{/* Decorative elements */}
			<div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
			<div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl" />

			<div className="container mx-auto px-4">
				<motion.div
					initial="hidden"
					animate={isInView ? "visible" : "hidden"}
					variants={containerVariants}
					className="max-w-4xl mx-auto"
				>
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 mb-12">
						<div className="md:max-w-lg">
							<motion.div variants={itemVariants} className="mb-2">
								<Badge className="bg-white/20 hover:bg-white/30 text-white mb-4">
									{t("landing.ctaBanner.limitedOffer")}
								</Badge>
							</motion.div>

							<motion.h2
								variants={itemVariants}
								className="text-3xl md:text-4xl font-bold mb-4 text-white"
							>
								{t("landing.ctaBanner.title")}
							</motion.h2>

							<motion.p
								variants={itemVariants}
								className="text-xl mb-6 text-white/80"
							>
								{t("landing.ctaBanner.subtitle")}.
								{t("landing.ctaBanner.discount")}{" "}
								<span className="font-bold text-white">
									{t("landing.ctaBanner.discountCode")}
								</span>
							</motion.p>

							<motion.div
								variants={itemVariants}
								className="flex flex-wrap gap-4"
							>
								<Button
									size="lg"
									variant="default"
									asChild
									className="rounded-full shadow-lg"
								>
									<Link href="/courses" className="flex items-center gap-2">
										{t("landing.ctaBanner.browseCourses")}
										<ArrowRightIcon className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
									</Link>
								</Button>

								<Button
									size="lg"
									variant="outline"
									asChild
									className="rounded-full shadow-lg"
								>
									<Link href="/become-tutor">
										{t("landing.ctaBanner.becomeTutor")}
									</Link>
								</Button>
							</motion.div>
						</div>

						<motion.div
							variants={itemVariants}
							className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl"
						>
							<div className="text-center mb-4">
								<h3 className="font-bold text-white text-xl">
									{t("landing.ctaBanner.stats.title")}
								</h3>
							</div>
							<div className="flex flex-col gap-4">
								{stats.map((stat, index) => {
									const StatIcon = stat.icon;
									return (
										<motion.div
											key={index}
											className="flex items-center gap-3"
											initial={{ opacity: 0, x: -10 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.4 + index * 0.1 }}
										>
											<div className="bg-white/20 p-2 rounded-full">
												<StatIcon className="h-5 w-5 text-white" />
											</div>
											<div>
												<div className="font-bold text-white">{stat.value}</div>
												<div className="text-sm text-white/70">
													{stat.label}
												</div>
											</div>
										</motion.div>
									);
								})}
							</div>
						</motion.div>
					</div>

					{/* Animated dots */}
					<motion.div
						className="flex justify-center gap-2 mt-8"
						variants={itemVariants}
					>
						{[...Array(3)].map((_, i) => (
							<motion.div
								key={i}
								className="h-2 w-2 bg-white/50 rounded-full"
								animate={{
									opacity: [0.3, 1, 0.3],
									scale: [0.8, 1.2, 0.8],
								}}
								transition={{
									duration: 1.5,
									repeat: Infinity,
									delay: i * 0.2,
								}}
							/>
						))}
					</motion.div>
				</motion.div>
			</div>
		</section>
	);
}
