"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import {
	BookOpenIcon,
	UsersIcon,
	ClockIcon,
	BanknoteIcon,
	ArrowRightIcon,
	CheckCircleIcon,
	LaptopIcon,
	CalendarIcon,
	MessageSquareIcon,
	StarIcon,
	PlayCircleIcon,
	ShieldCheckIcon,
	TrendingUpIcon,
	HeadphonesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function HowItWorksPage() {
	const { t } = useLanguage();

	const steps = [
		{
			icon: BookOpenIcon,
			title: t("landing.howItWorks.step1.title"),
			description: t("landing.howItWorks.step1.description"),
			color: "from-blue-500 to-indigo-500",
		},
		{
			icon: UsersIcon,
			title: t("landing.howItWorks.step2.title"),
			description: t("landing.howItWorks.step2.description"),
			color: "from-indigo-500 to-purple-500",
		},
		{
			icon: ClockIcon,
			title: t("landing.howItWorks.step3.title"),
			description: t("landing.howItWorks.step3.description"),
			color: "from-purple-500 to-pink-500",
		},
		{
			icon: BanknoteIcon,
			title: t("landing.howItWorks.step4.title"),
			description: t("landing.howItWorks.step4.description"),
			color: "from-pink-500 to-rose-500",
		},
	];

	const benefits = [
		{
			icon: ClockIcon,
			title: t("howItWorks.benefits.flexibility.title"),
			description: t("howItWorks.benefits.flexibility.description"),
			gradient: "from-blue-500 to-cyan-500",
		},
		{
			icon: ShieldCheckIcon,
			title: t("howItWorks.benefits.quality.title"),
			description: t("howItWorks.benefits.quality.description"),
			gradient: "from-emerald-500 to-teal-500",
		},
		{
			icon: TrendingUpIcon,
			title: t("howItWorks.benefits.technology.title"),
			description: t("howItWorks.benefits.technology.description"),
			gradient: "from-purple-500 to-pink-500",
		},
		{
			icon: HeadphonesIcon,
			title: t("howItWorks.benefits.support.title"),
			description: t("howItWorks.benefits.support.description"),
			gradient: "from-orange-500 to-red-500",
		},
	];

	const faqs = [
		{
			question: t("howItWorks.faqs.question1"),
			answer: t("howItWorks.faqs.answer1"),
		},
		{
			question: t("howItWorks.faqs.question2"),
			answer: t("howItWorks.faqs.answer2"),
		},
		{
			question: t("howItWorks.faqs.question3"),
			answer: t("howItWorks.faqs.answer3"),
		},
		{
			question: t("howItWorks.faqs.question4"),
			answer: t("howItWorks.faqs.answer4"),
		},
		{
			question: t("howItWorks.faqs.question5"),
			answer: t("howItWorks.faqs.answer5"),
		},
	];

	// Animation variants
	const container = {
		hidden: { opacity: 0 },
		show: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2,
			},
		},
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 },
	};

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			{/* Hero Section */}
			<section className="relative py-24 md:py-32 overflow-hidden">
				{/* Background gradient */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
				<div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
				
				{/* Animated background elements */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden">
					<motion.div 
						animate={{ 
							rotate: 360,
							scale: [1, 1.1, 1]
						}}
						transition={{ 
							duration: 20, 
							repeat: Infinity, 
							ease: "linear" 
						}}
						className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full blur-3xl"
					/>
					<motion.div 
						animate={{ 
							rotate: -360,
							scale: [1, 1.2, 1]
						}}
						transition={{ 
							duration: 25, 
							repeat: Infinity, 
							ease: "linear" 
						}}
						className="absolute -bottom-24 -left-24 w-80 h-80 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-full blur-3xl"
					/>
				</div>
				
				<div className="container mx-auto px-4 relative">
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						className="text-center max-w-4xl mx-auto"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.2 }}
						>
							<Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
								✨ Discover Our Platform
							</Badge>
						</motion.div>
						
						<motion.h1 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.3 }}
							className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent leading-tight"
						>
							{t('howItWorks.title')}
						</motion.h1>
						
						<motion.p 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.4 }}
							className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-3xl mx-auto"
						>
							{t('howItWorks.description')}
						</motion.p>
						
						<motion.div 
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.5 }}
							className="flex flex-col sm:flex-row gap-4 justify-center"
						>
							<Button 
								size="lg" 
								asChild
								className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-6 text-lg"
							>
								<Link href="/courses">
									<BookOpenIcon className="mr-2 h-5 w-5" />
									{t('howItWorks.exploreCourses')}
								</Link>
							</Button>
							<Button 
								variant="outline" 
								size="lg" 
								asChild
								className="border-2 hover:bg-primary/5 px-8 py-6 text-lg backdrop-blur-sm"
							>
								<Link href="/tutors">
									<UsersIcon className="mr-2 h-5 w-5" />
									{t('howItWorks.findTutor')}
								</Link>
							</Button>
						</motion.div>
					</motion.div>
				</div>
			</section>

			{/* How It Works Steps */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							{t("howItWorks.stepsTitle")}
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							{t("howItWorks.stepsDescription")}
						</p>
					</motion.div>

					<motion.div
						variants={container}
						initial="hidden"
						whileInView="show"
						viewport={{ once: true }}
						className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
					>
						{steps.map((step, index) => {
							const Icon = step.icon;
							return (
								<motion.div key={index} variants={item}>
									<Card className="relative overflow-hidden border-none shadow-md h-full">
										<div
											className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${step.color}`}
										/>
										<div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-background flex items-center justify-center shadow-md z-10">
											<span className="text-sm font-bold">{index + 1}</span>
										</div>
										<CardHeader>
											<div className="mb-4 relative">
												<div
													className={`absolute inset-0 bg-gradient-to-r ${step.color} rounded-full opacity-10 blur-xl`}
												/>
												<div
													className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white`}
												>
													<Icon className="h-8 w-8" />
												</div>
											</div>
											<CardTitle>{step.title}</CardTitle>
										</CardHeader>
										<CardContent>
											<CardDescription className="text-base">
												{step.description}
											</CardDescription>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</motion.div>
				</div>
			</section>

			{/* Video Section */}
			<section className="py-20 bg-muted/30">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							<h2 className="text-3xl md:text-4xl font-bold mb-6">
								{t("howItWorks.videoTitle")}
							</h2>
							<p className="text-lg text-muted-foreground mb-8">
								{t("howItWorks.videoDescription")}
							</p>

							<ul className="space-y-4 mb-8">
								<li className="flex items-start gap-3">
									<CheckCircleIcon className="h-6 w-6 text-primary mt-0.5" />
									<div>
										<h3 className="font-medium">
											{t("howItWorks.videoPoints.point1.title")}
										</h3>
										<p className="text-muted-foreground">
											{t("howItWorks.videoPoints.point1.description")}
										</p>
									</div>
								</li>
								<li className="flex items-start gap-3">
									<CheckCircleIcon className="h-6 w-6 text-primary mt-0.5" />
									<div>
										<h3 className="font-medium">
											{t("howItWorks.videoPoints.point2.title")}
										</h3>
										<p className="text-muted-foreground">
											{t("howItWorks.videoPoints.point2.description")}
										</p>
									</div>
								</li>
								<li className="flex items-start gap-3">
									<CheckCircleIcon className="h-6 w-6 text-primary mt-0.5" />
									<div>
										<h3 className="font-medium">
											{t("howItWorks.videoPoints.point3.title")}
										</h3>
										<p className="text-muted-foreground">
											{t("howItWorks.videoPoints.point3.description")}
										</p>
									</div>
								</li>
							</ul>

							<Button>{t("howItWorks.getStarted")}</Button>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
							className="relative aspect-video bg-black/5 rounded-lg overflow-hidden shadow-xl"
						>
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="w-20 h-20 rounded-full bg-primary/90 flex items-center justify-center cursor-pointer hover:bg-primary transition-colors">
									<div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1"></div>
								</div>
							</div>
							<div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent opacity-50"></div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* Benefits */}
			<section className="py-20">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							{t("howItWorks.benefitsTitle")}
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							{t("howItWorks.benefitsDescription")}
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{benefits.map((benefit, index) => {
							const Icon = benefit.icon;
							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									whileHover={{ y: -5 }}
									className="group"
								>
									<Card className="h-full border-0 bg-gradient-to-br from-background/50 to-background/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
										<CardContent className="p-6">
											<div className="flex items-start gap-4">
												<div
													className={`p-3 rounded-xl bg-gradient-to-r ${benefit.gradient} shadow-lg`}
												>
													<Icon className="h-6 w-6 text-white" />
												</div>
												<div className="flex-1">
													<h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
														{benefit.title}
													</h3>
													<p className="text-muted-foreground leading-relaxed">
														{benefit.description}
													</p>
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>

			{/* FAQs */}
			<section className="py-20 bg-muted/30">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-center mb-16"
					>
						<h2 className="text-3xl md:text-4xl font-bold mb-4">
							{t("howItWorks.faqsTitle")}
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							{t("howItWorks.faqsDescription")}
						</p>
					</motion.div>

					<motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="border border-border/50 rounded-lg bg-card/50 backdrop-blur-sm px-6 data-[state=open]:bg-card/80 transition-all duration-200"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="text-lg font-semibold pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-2">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: 0.6 }}
						className="text-center mt-12"
					>
						<p className="text-lg mb-6">{t("howItWorks.moreQuestions")}</p>
						<Button size="lg">{t("howItWorks.contactSupport")}</Button>
					</motion.div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-center max-w-2xl mx-auto"
					>
						<h2 className="text-3xl font-bold mb-4">
							{t("howItWorks.ctaTitle")}
						</h2>
						<p className="text-lg text-muted-foreground mb-8">
							{t("howItWorks.ctaDescription")}
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg" asChild>
								<Link href="/courses">
									{t("howItWorks.startLearning")}
									<ArrowRightIcon className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button variant="outline" size="lg" asChild>
								<Link href="/for-tutors">{t("howItWorks.becomeTutor")}</Link>
							</Button>
						</div>
					</motion.div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
