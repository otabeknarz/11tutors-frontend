"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import {
	GraduationCap,
	BookOpen,
	Users,
	ArrowRight,
	Brain,
} from "lucide-react";

const HeroIllustration = () => (
	<div className="hidden lg:block relative w-full aspect-square max-w-md mx-auto">
		<motion.div
			initial={{ scale: 0.8, opacity: 0 }}
			animate={{ scale: 1, opacity: 1 }}
			transition={{ duration: 0.5 }}
			className="absolute inset-0"
		>
			<div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-3xl" />
			<div className="relative z-10 w-full h-full flex items-center justify-center">
				<div className="grid grid-cols-2 gap-4 transform rotate-12">
					{[GraduationCap, BookOpen, Users, Brain].map((Icon, index) => (
						<motion.div
							key={index}
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: index * 0.1 }}
							className="bg-white/10 backdrop-blur p-4 rounded-lg border border-white/20"
						>
							<Icon className="w-8 h-8 text-primary" />
						</motion.div>
					))}
				</div>
			</div>
		</motion.div>
	</div>
);

const HeroSection = () => {
	const { t } = useLanguage();
	return (
		<section className="relative min-h-screen pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden">
			{/* Background elements */}
			<div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background/50" />
			<div className="absolute inset-0 overflow-hidden">
				<motion.div
					animate={{
						backgroundPosition: ["0% 0%", "100% 100%"],
						opacity: [0.3, 0.5],
					}}
					transition={{
						duration: 20,
						repeat: Infinity,
						repeatType: "reverse",
					}}
					className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(79,70,229,0.1)_0%,_transparent_50%)] opacity-30"
				/>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				<div className="flex items-center gap-12">
					{/* Hero content */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5 }}
						className="flex-1 text-center lg:text-left"
					>
						<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
							<motion.span
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
								className="block"
							>
								{t("landing.heroSection.title")
									.split(" ")
									.slice(0, -1)
									.join(" ")}
							</motion.span>
							<motion.span
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.4 }}
								className="bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text inline-block"
							>
								{t("landing.heroSection.title").split(" ").slice(-1)[0]}
							</motion.span>
						</h1>
						<motion.p
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
						>
							{t("landing.heroSection.subtitle")}
						</motion.p>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.8 }}
							className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
						>
							<Button size="lg" asChild>
								<Link href="/courses">
									{t("landing.heroSection.browseCourses")}
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button size="lg" variant="outline" asChild>
								<Link href="/become-tutor">
									{t("landing.heroSection.becomeTutor")}
								</Link>
							</Button>
						</motion.div>
					</motion.div>

					{/* Hero illustration */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="hidden lg:flex flex-1"
					>
						<HeroIllustration />
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;
