"use client";

import React, { useEffect } from "react";
import { useAuth } from "../lib/AuthContext";
import { useLanguage } from "../lib/LanguageContext";
import { ArrowRightIcon } from "lucide-react";
import {
	motion,
	useAnimation,
	useInView,
	useScroll,
	useSpring,
} from "framer-motion";

// Import landing page components
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import FeaturedCourses from "@/components/landing/FeaturedCourses";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import ForTutors from "@/components/landing/ForTutors";
import Footer from "@/components/landing/Footer";

// Import UI components
import { Button } from "@/components/ui/button";

const ScrollIndicator = () => {
	const { t } = useLanguage();

	return (
		<motion.div
			className="hidden sm:flex absolute bottom-6 sm:bottom-10 left-1/2 transform -translate-x-1/2 flex-col items-center pointer-events-none"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 2, duration: 0.8 }}
		>
			<p className="text-sm text-muted-foreground mb-2">
				{t("landing.scrollIndicator.scrollToExplore")}
			</p>
			<motion.div
				className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center p-1"
				animate={{ y: [0, 10, 0] }}
				transition={{ repeat: Infinity, duration: 1.5 }}
			>
				<motion.div
					className="w-1 h-2 bg-primary rounded-full"
					animate={{ y: [0, 15, 0] }}
					transition={{ repeat: Infinity, duration: 1.5 }}
				/>
			</motion.div>
		</motion.div>
	);
};

const SectionWrapper = ({
	children,
	id,
}: {
	children: React.ReactNode;
	id: string;
}) => {
	const controls = useAnimation();
	const ref = React.useRef(null);
	const isInView = useInView(ref, { once: true, amount: 0.2 });

	useEffect(() => {
		if (isInView) {
			controls.start("visible");
		}
	}, [controls, isInView]);

	return (
		<motion.section
			id={id}
			ref={ref}
			initial="hidden"
			animate={controls}
			variants={{
				hidden: { opacity: 0, y: 50 },
				visible: { opacity: 1, y: 0 },
			}}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className="overflow-hidden py-8 md:py-12 lg:py-16 container mx-auto px-4"
		>
			{children}
		</motion.section>
	);
};

export default function Home() {
	const { user } = useAuth();
	const { t } = useLanguage();
	const { scrollYProgress } = useScroll();
	const scaleX = useSpring(scrollYProgress, {
		stiffness: 100,
		damping: 30,
		restDelta: 0.001,
	});

	return (
		<div className="min-h-screen bg-background relative overflow-x-hidden">
			{/* Scroll progress bar */}
			<motion.div
				style={{ scaleX }}
				className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/70 to-primary/30 origin-left z-50"
			/>
			{/* Navbar - fixed at the top */}
			<Navbar />

			{/* Main content */}
			<main>
				{/* Hero Section with scroll indicator */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.8 }}
					className="relative"
				>
					<HeroSection />
					<ScrollIndicator />
				</motion.div>

				{/* How It Works */}
				<SectionWrapper id={t("landing.sections.howItWorks.id")}>
					<HowItWorks />
				</SectionWrapper>

				{/* Featured Courses */}
				<SectionWrapper id={t("landing.sections.courses.id")}>
					<FeaturedCourses />
				</SectionWrapper>

				{/* Why Choose Us */}
				<SectionWrapper id={t("landing.sections.whyChooseUs.id")}>
					<WhyChooseUs />
				</SectionWrapper>

				{/* For Tutors */}
				<SectionWrapper id={t("landing.sections.forTutors.id")}>
					<ForTutors />
				</SectionWrapper>
			</main>

			{/* Footer */}
			<Footer />

			{/* Sticky CTA Button */}
			{!user && (
				<motion.div
					className="fixed bottom-6 right-6 z-50"
					initial={{ scale: 0, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 3, type: "spring" }}
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
				>
					<Button
						className="relative overflow-hidden bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300"
						size="lg"
						onClick={() => (window.location.href = "/register")}
					>
						{t("landing.ctaBanner.browseCourses")}
						<ArrowRightIcon className="h-5 w-5" />
					</Button>
				</motion.div>
			)}
		</div>
	);
}
