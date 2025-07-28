"use client";

import React from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { motion } from "framer-motion";
import {
	CheckCircleIcon,
	ArrowRightIcon,
	UsersIcon,
	DollarSignIcon,
	ClockIcon,
	LaptopIcon,
	GraduationCapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function ForTutorsPage() {
	const { t } = useLanguage();

	const benefits = [
		{
			icon: UsersIcon,
			title: t("forTutors.benefits.students.title"),
			description: t("forTutors.benefits.students.description"),
		},
		{
			icon: DollarSignIcon,
			title: t("forTutors.benefits.earnings.title"),
			description: t("forTutors.benefits.earnings.description"),
		},
		{
			icon: ClockIcon,
			title: t("forTutors.benefits.flexibility.title"),
			description: t("forTutors.benefits.flexibility.description"),
		},
		{
			icon: LaptopIcon,
			title: t("forTutors.benefits.tools.title"),
			description: t("forTutors.benefits.tools.description"),
		},
	];

	const steps = [
		{
			title: t("forTutors.steps.apply.title"),
			description: t("forTutors.steps.apply.description"),
		},
		{
			title: t("forTutors.steps.interview.title"),
			description: t("forTutors.steps.interview.description"),
		},
		{
			title: t("forTutors.steps.onboarding.title"),
			description: t("forTutors.steps.onboarding.description"),
		},
		{
			title: t("forTutors.steps.teaching.title"),
			description: t("forTutors.steps.teaching.description"),
		},
	];

	return (
		<div className="min-h-screen bg-background">
			<Navbar />

			{/* Hero Section */}
			<section className="relative py-20 bg-gradient-to-b from-primary/10 to-background">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.5 }}
						>
							<h1 className="text-4xl md:text-5xl font-bold mb-6">
								{t("forTutors.title")}
							</h1>
							<p className="text-xl text-muted-foreground mb-8">
								{t("forTutors.description")}
							</p>
							<div className="space-y-4 mb-8">
								<div className="flex items-start gap-3">
									<CheckCircleIcon className="h-6 w-6 text-primary mt-1" />
									<p>{t("forTutors.points.point1")}</p>
								</div>
								<div className="flex items-start gap-3">
									<CheckCircleIcon className="h-6 w-6 text-primary mt-1" />
									<p>{t("forTutors.points.point2")}</p>
								</div>
								<div className="flex items-start gap-3">
									<CheckCircleIcon className="h-6 w-6 text-primary mt-1" />
									<p>{t("forTutors.points.point3")}</p>
								</div>
							</div>
							<Button size="lg">
								{t("forTutors.applyNow")}
								<ArrowRightIcon className="ml-2 h-4 w-4" />
							</Button>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.5, delay: 0.2 }}
							className="relative"
						>
							<div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg blur-3xl -z-10" />
							<div className="bg-card p-8 rounded-lg border shadow-lg">
								<h3 className="text-2xl font-bold mb-6 text-center">
									{t("forTutors.earningsTitle")}
								</h3>
								<div className="space-y-6">
									<div className="text-center">
										<div className="text-4xl font-bold text-primary mb-2">
											{t("forTutors.averageRate")}
										</div>
										<p className="text-muted-foreground">
											{t("forTutors.perHour")}
										</p>
									</div>
									<div className="grid grid-cols-2 gap-4 text-center">
										<div>
											<div className="text-2xl font-bold mb-1">
												{t("forTutors.potentialEarnings.weekly")}
											</div>
											<p className="text-muted-foreground text-sm">
												{t("forTutors.weeklyHours")}
											</p>
										</div>
										<div>
											<div className="text-2xl font-bold mb-1">
												{t("forTutors.potentialEarnings.monthly")}
											</div>
											<p className="text-muted-foreground text-sm">
												{t("forTutors.monthlyHours")}
											</p>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</div>

				{/* Decorative elements */}
				<div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
					<div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
					<div className="absolute -bottom-16 -left-16 w-48 h-48 bg-secondary/5 rounded-full blur-3xl" />
				</div>
			</section>

			{/* Benefits Section */}
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
							{t("forTutors.benefitsTitle")}
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							{t("forTutors.benefitsDescription")}
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						{benefits.map((benefit, index) => {
							const Icon = benefit.icon;
							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
								>
									<div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
										<Icon className="h-6 w-6 text-primary" />
									</div>
									<h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
									<p className="text-muted-foreground">{benefit.description}</p>
								</motion.div>
							);
						})}
					</div>
				</div>
			</section>

			{/* How to Become a Tutor */}
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
							{t("forTutors.stepsTitle")}
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							{t("forTutors.stepsDescription")}
						</p>
					</motion.div>

					<div className="max-w-4xl mx-auto">
						{steps.map((step, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="relative pl-12 pb-12 last:pb-0"
							>
								{index < steps.length - 1 && (
									<div className="absolute left-5 top-10 bottom-0 w-0.5 bg-primary/30" />
								)}
								<div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
									{index + 1}
								</div>
								<div>
									<h3 className="text-xl font-bold mb-2">{step.title}</h3>
									<p className="text-muted-foreground">{step.description}</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials */}
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
							{t("forTutors.testimonialsTitle")}
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							{t("forTutors.testimonialsDescription")}
						</p>
					</motion.div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[1, 2, 3].map((index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="bg-card p-6 rounded-lg border shadow-sm"
							>
								<div className="flex items-center gap-4 mb-4">
									<div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
										<GraduationCapIcon className="h-6 w-6 text-primary" />
									</div>
									<div>
										<h4 className="font-bold">
											{t(`forTutors.testimonials.testimonial${index}.name`)}
										</h4>
										<p className="text-sm text-muted-foreground">
											{t(`forTutors.testimonials.testimonial${index}.subject`)}
										</p>
									</div>
								</div>
								<p className="italic text-muted-foreground mb-4">
									"{t(`forTutors.testimonials.testimonial${index}.quote`)}"
								</p>
								<div className="flex items-center">
									{[1, 2, 3, 4, 5].map((star) => (
										<svg
											key={star}
											className="w-4 h-4 text-yellow-400"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
										</svg>
									))}
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* Application Form */}
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
								{t("forTutors.applyTitle")}
							</h2>
							<p className="text-lg text-muted-foreground mb-8">
								{t("forTutors.applyDescription")}
							</p>

							<ul className="space-y-4 mb-8">
								<li className="flex items-start gap-3">
									<CheckCircleIcon className="h-6 w-6 text-primary mt-0.5" />
									<div>
										<h3 className="font-medium">
											{t("forTutors.requirements.requirement1.title")}
										</h3>
										<p className="text-muted-foreground">
											{t("forTutors.requirements.requirement1.description")}
										</p>
									</div>
								</li>
								<li className="flex items-start gap-3">
									<CheckCircleIcon className="h-6 w-6 text-primary mt-0.5" />
									<div>
										<h3 className="font-medium">
											{t("forTutors.requirements.requirement2.title")}
										</h3>
										<p className="text-muted-foreground">
											{t("forTutors.requirements.requirement2.description")}
										</p>
									</div>
								</li>
								<li className="flex items-start gap-3">
									<CheckCircleIcon className="h-6 w-6 text-primary mt-0.5" />
									<div>
										<h3 className="font-medium">
											{t("forTutors.requirements.requirement3.title")}
										</h3>
										<p className="text-muted-foreground">
											{t("forTutors.requirements.requirement3.description")}
										</p>
									</div>
								</li>
							</ul>
						</motion.div>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5 }}
						>
							<div className="bg-card p-8 rounded-lg border shadow-lg">
								<h3 className="text-2xl font-bold mb-6">
									{t("forTutors.applicationFormTitle")}
								</h3>
								<form className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div className="space-y-2">
											<label
												htmlFor="firstName"
												className="text-sm font-medium"
											>
												{t("forTutors.form.firstName")}
											</label>
											<Input
												id="firstName"
												placeholder={t("forTutors.form.firstNamePlaceholder")}
											/>
										</div>
										<div className="space-y-2">
											<label htmlFor="lastName" className="text-sm font-medium">
												{t("forTutors.form.lastName")}
											</label>
											<Input
												id="lastName"
												placeholder={t("forTutors.form.lastNamePlaceholder")}
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label htmlFor="email" className="text-sm font-medium">
											{t("forTutors.form.email")}
										</label>
										<Input
											id="email"
											type="email"
											placeholder={t("forTutors.form.emailPlaceholder")}
										/>
									</div>

									<div className="space-y-2">
										<label htmlFor="subjects" className="text-sm font-medium">
											{t("forTutors.form.subjects")}
										</label>
										<Input
											id="subjects"
											placeholder={t("forTutors.form.subjectsPlaceholder")}
										/>
									</div>

									<div className="space-y-2">
										<label htmlFor="experience" className="text-sm font-medium">
											{t("forTutors.form.experience")}
										</label>
										<Textarea
											id="experience"
											placeholder={t("forTutors.form.experiencePlaceholder")}
										/>
									</div>

									<Button type="submit" className="w-full">
										{t("forTutors.form.submit")}
									</Button>
								</form>
							</div>
						</motion.div>
					</div>
				</div>
			</section>

			{/* FAQ Section */}
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
							{t("forTutors.faqTitle")}
						</h2>
						<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
							{t("forTutors.faqDescription")}
						</p>
					</motion.div>

					<div className="max-w-3xl mx-auto space-y-6">
						{[1, 2, 3, 4].map((index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.5, delay: index * 0.1 }}
								className="bg-card p-6 rounded-lg border shadow-sm"
							>
								<h3 className="text-xl font-bold mb-3">
									{t(`forTutors.faqs.faq${index}.question`)}
								</h3>
								<p className="text-muted-foreground">
									{t(`forTutors.faqs.faq${index}.answer`)}
								</p>
							</motion.div>
						))}
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className="py-16 bg-primary/10">
				<div className="container mx-auto px-4">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5 }}
						className="text-center max-w-2xl mx-auto"
					>
						<h2 className="text-3xl font-bold mb-4">
							{t("forTutors.ctaTitle")}
						</h2>
						<p className="text-lg text-muted-foreground mb-8">
							{t("forTutors.ctaDescription")}
						</p>
						<Button size="lg">
							{t("forTutors.ctaButton")}
							<ArrowRightIcon className="ml-2 h-4 w-4" />
						</Button>
					</motion.div>
				</div>
			</section>

			<Footer />
		</div>
	);
}
