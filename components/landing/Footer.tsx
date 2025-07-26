"use client";

import { useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { motion, useInView } from "framer-motion";
import {
	GlobeIcon,
	HeartIcon,
	BookIcon,
	GraduationCapIcon,
	CodeIcon,
	CalculatorIcon,
	BriefcaseIcon,
	FlaskConicalIcon,
	LanguagesIcon,
	PaletteIcon,
	InstagramIcon,
	TwitterIcon,
	YoutubeIcon,
	LinkedinIcon,
	FacebookIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
	const { t } = useLanguage();
	const footerRef = useRef(null);
	const isInView = useInView(footerRef, { once: true, amount: 0.1 });

	const currentYear = new Date().getFullYear();

	// Animation variants
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.1,
				delayChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 10 },
		visible: { opacity: 1, y: 0 },
	};

	// Social links with icons
	const socialLinks = [
		{
			name: t("landing.footer.social.instagram"),
			icon: InstagramIcon,
			href: "https://instagram.com/11tutors",
			color: "bg-gradient-to-br from-pink-500 to-purple-500",
		},
		{
			name: t("landing.footer.social.twitter"),
			icon: TwitterIcon,
			href: "https://twitter.com/11tutors",
			color: "bg-blue-500",
		},
		{
			name: t("landing.footer.social.youtube"),
			icon: YoutubeIcon,
			href: "https://youtube.com/11tutors",
			color: "bg-red-600",
		},
		{
			name: t("landing.footer.social.linkedin"),
			icon: LinkedinIcon,
			href: "https://linkedin.com/company/11tutors",
			color: "bg-blue-700",
		},
		{
			name: t("landing.footer.social.facebook"),
			icon: FacebookIcon,
			href: "https://facebook.com/11tutors",
			color: "bg-blue-600",
		},
	];

	// Footer links organized by category with icons
	const footerLinks = {
		company: [
			{ name: t("landing.footer.links.aboutUs"), href: "/about" },
			{ name: t("landing.footer.links.careers"), href: "/careers" },
			{ name: t("landing.footer.links.blog"), href: "/blog" },
			{ name: t("landing.footer.links.press"), href: "/press" },
		],
		resources: [
			{ name: t("landing.footer.links.helpCenter"), href: "/help" },
			{ name: t("landing.footer.links.contactUs"), href: "/contact" },
			{ name: t("landing.footer.links.tutors"), href: "/tutors" },
			{
				name: t("landing.footer.legal"),
				href: "/legal",
			},
		],
		categories: [
			{
				name: t("landing.footer.links.computerScience"),
				href: "/courses/computer-science",
			},
			{
				name: t("landing.footer.links.mathematics"),
				href: "/courses/mathematics",
			},
			{ name: t("landing.footer.links.business"), href: "/courses/business" },
			{ name: t("landing.footer.links.science"), href: "/courses/science" },
			{ name: t("landing.footer.links.languages"), href: "/courses/languages" },
			{
				name: t("landing.footer.links.artsHumanities"),
				href: "/courses/arts-humanities",
			},
		],
	};

	return (
		<footer className="pt-16 pb-8 relative overflow-hidden" ref={footerRef}>
			{/* Background decorative elements */}
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />
			<div className="absolute -z-10 top-12 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
			<div className="absolute -z-10 bottom-0 left-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

			<div className="container mx-auto px-4">
				<motion.div
					initial="hidden"
					animate={isInView ? "visible" : "hidden"}
					variants={containerVariants}
					className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12"
				>
					{/* Logo and description */}
					<motion.div
						variants={itemVariants}
						className="col-span-2 md:col-span-4 lg:col-span-1"
					>
						<Link href="/" className="inline-block mb-4">
							<span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
								{t("app.name")}
							</span>
						</Link>
						<p className="text-muted-foreground text-sm mb-6 max-w-xs">
							{t("landing.footer.description")}
						</p>

						{/* Social links */}
						<div className="flex flex-wrap gap-2">
							{socialLinks.map((social, index) => {
								const SocialIcon = social.icon;
								return (
									<motion.a
										key={index}
										href={social.href}
										target="_blank"
										rel="noopener noreferrer"
										className={`${social.color} p-2 rounded-full text-white hover:scale-110 transition-transform`}
										whileHover={{ y: -3 }}
										aria-label={social.name}
									>
										<SocialIcon className="h-4 w-4" />
									</motion.a>
								);
							})}
						</div>
					</motion.div>

					{/* Company links */}
					<motion.div variants={itemVariants}>
						<h3 className="font-semibold mb-4 flex items-center gap-2">
							<Badge variant="outline" className="bg-primary/5 text-primary">
								{t("landing.footer.company")}
							</Badge>
						</h3>
						<ul className="space-y-3">
							{footerLinks.company.map((link, index) => {
								return (
									<motion.li
										key={index}
										whileHover={{ x: 3 }}
										transition={{ type: "spring", stiffness: 400 }}
									>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
										>
											{link.name}
										</Link>
									</motion.li>
								);
							})}
						</ul>
					</motion.div>

					{/* Resources links */}
					<motion.div variants={itemVariants}>
						<h3 className="font-semibold mb-4 flex items-center gap-2">
							<Badge
								variant="outline"
								className="bg-secondary/5 text-secondary"
							>
								{t("landing.footer.resources")}
							</Badge>
						</h3>
						<ul className="space-y-3">
							{footerLinks.resources.map((link, index) => {
								return (
									<motion.li
										key={index}
										whileHover={{ x: 3 }}
										transition={{ type: "spring", stiffness: 400 }}
									>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
										>
											{link.name}
										</Link>
									</motion.li>
								);
							})}
						</ul>
					</motion.div>

					{/* Categories links */}
					<motion.div
						variants={itemVariants}
						className="col-span-2 md:col-span-4 lg:col-span-1"
					>
						<h3 className="font-semibold mb-4 flex items-center gap-2">
							<Badge variant="outline" className="bg-primary/10 text-primary">
								{t("landing.footer.categories")}
							</Badge>
						</h3>
						<ul className="grid grid-cols-2 gap-x-4 gap-y-3">
							{footerLinks.categories.map((link, index) => {
								return (
									<motion.li
										key={index}
										whileHover={{ x: 3 }}
										transition={{ type: "spring", stiffness: 400 }}
									>
										<Link
											href={link.href}
											className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
										>
											{link.name}
										</Link>
									</motion.li>
								);
							})}
						</ul>
					</motion.div>
				</motion.div>

				<Separator className="my-8" />

				{/* Bottom footer */}
				<motion.div
					variants={containerVariants}
					className="flex flex-col md:flex-row justify-between items-center gap-4"
				>
					<motion.p
						variants={itemVariants}
						className="text-sm text-muted-foreground"
					>
						&copy; {currentYear} 11Tutors.{" "}
						{t("landing.footer.allRightsReserved")}
					</motion.p>
					<motion.p
						variants={itemVariants}
						className="text-sm text-muted-foreground flex items-center gap-1"
					>
						{t("landing.footer.madeWithStudents")}
					</motion.p>
				</motion.div>
			</div>
		</footer>
	);
}
