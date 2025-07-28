"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoonIcon, SunIcon, MenuIcon, XIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Navbar() {
	const { user } = useAuth();
	const { t } = useLanguage();
	const { theme, setTheme } = useTheme();
	const [scrolled, setScrolled] = useState(false);
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// Animation variants
	const navVariants = {
		hidden: { opacity: 0, y: -20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.6 },
		},
	};

	const mobileMenuVariants = {
		hidden: {
			opacity: 0,
			height: 0,
			transition: { duration: 0.3 },
		},
		visible: {
			opacity: 1,
			height: "auto",
			transition: { duration: 0.3 },
		},
	};

	useEffect(() => {
		const handleScroll = () => {
			const isScrolled = window.scrollY > 10;
			if (isScrolled !== scrolled) {
				setScrolled(isScrolled);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [scrolled]);

	// Close mobile menu when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (mobileMenuOpen && !(event.target as Element).closest("nav")) {
				setMobileMenuOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [mobileMenuOpen]);

	return (
		<motion.nav
			initial="hidden"
			animate="visible"
			variants={navVariants}
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-500",
				scrolled
					? "bg-background/95 backdrop-blur-xl border-b border-border/50 shadow-lg py-3"
					: "bg-background/80 backdrop-blur-md py-4"
			)}
		>
			<div className="container mx-auto px-4 lg:px-6">
				<div className="flex items-center justify-between h-16">
					{/* Logo */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						<Link href="/" className="flex items-center gap-3 group">
							<div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
								<span className="text-white font-bold text-lg">11</span>
							</div>
							<span className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 text-transparent bg-clip-text group-hover:from-primary/90 group-hover:to-primary transition-all duration-300">
								{t("app.name")}
							</span>
						</Link>
					</motion.div>

					{/* Desktop Navigation */}
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.2 }}
						className="hidden lg:flex items-center gap-8"
					>
						<Link
							href="/courses"
							className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 group"
						>
							{t("nav.courses")}
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
						</Link>
						<Link
							href="/tutors"
							className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 group"
						>
							{t("nav.tutors")}
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
						</Link>
						<Link
							href="/how-it-works"
							className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 group"
						>
							{t("nav.how_it_works")}
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
						</Link>
						<Link
							href="/for-tutors"
							className="relative text-sm font-medium text-muted-foreground hover:text-foreground transition-all duration-300 group"
						>
							{t("nav.for_tutors")}
							<span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
						</Link>
					</motion.div>

					{/* Auth & Theme Buttons */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, delay: 0.3 }}
						className="flex items-center gap-3"
					>
						{/* Theme Toggle */}
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							className="w-10 h-10 rounded-xl hover:bg-primary/10 hover:scale-105 transition-all duration-300"
							aria-label="Toggle theme"
						>
							{theme === "dark" ? (
								<SunIcon className="h-5 w-5 text-amber-500" />
							) : (
								<MoonIcon className="h-5 w-5 text-slate-600" />
							)}
						</Button>

						{/* Language Switcher */}
						<div className="hidden sm:block">
							<LanguageSwitcher />
						</div>

						{/* Auth Buttons */}
						{user ? (
							<div className="hidden md:flex items-center gap-2">
								<Button
									variant="ghost"
									size="sm"
									asChild
									className="hover:bg-primary/10 transition-all duration-300"
								>
									<Link href="/dashboard/home">{t("nav.dashboard")}</Link>
								</Button>
								<Button
									variant="default"
									size="sm"
									asChild
									className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
								>
									<Link href="/dashboard/courses">{t("nav.my_courses")}</Link>
								</Button>
							</div>
						) : (
							<div className="hidden md:flex items-center gap-2">
								<Button
									variant="ghost"
									size="sm"
									asChild
									className="hover:bg-primary/10 transition-all duration-300"
								>
									<Link href="/login">{t("nav.login")}</Link>
								</Button>
								<Button
									variant="default"
									size="sm"
									asChild
									className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
								>
									<Link href="/register">{t("nav.register")}</Link>
								</Button>
							</div>
						)}

						{/* Mobile Menu Button */}
						<Button
							variant="ghost"
							size="icon"
							className="lg:hidden w-10 h-10 rounded-xl hover:bg-primary/10 transition-all duration-300"
							onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						>
							{mobileMenuOpen ? (
								<XIcon className="h-5 w-5" />
							) : (
								<MenuIcon className="h-5 w-5" />
							)}
						</Button>
					</motion.div>
				</div>
			</div>

			{/* Mobile Menu */}
			<motion.div
				initial="hidden"
				animate={mobileMenuOpen ? "visible" : "hidden"}
				variants={mobileMenuVariants}
				className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-border/50"
			>
				<div className="container mx-auto px-4 py-6">
					<div className="flex flex-col gap-1">
						{/* Navigation Links */}
						{[
							{ href: "/courses", label: t("nav.courses") },
							{ href: "/tutors", label: t("nav.tutors") },
							{ href: "/how-it-works", label: t("nav.how_it_works") },
							{ href: "/for-tutors", label: t("nav.for_tutors") },
						].map((item, index) => (
							<motion.div
								key={item.href}
								initial={{ opacity: 0, x: -20 }}
								animate={
									mobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
								}
								transition={{ duration: 0.3, delay: index * 0.1 }}
							>
								<Link
									href={item.href}
									className="flex items-center px-4 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all duration-300 group"
									onClick={() => setMobileMenuOpen(false)}
								>
									<span className="w-2 h-2 bg-primary/30 rounded-full mr-3 group-hover:bg-primary transition-colors" />
									{item.label}
								</Link>
							</motion.div>
						))}

						{/* Language Switcher for Mobile */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={
								mobileMenuOpen ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }
							}
							transition={{ duration: 0.3, delay: 0.4 }}
							className="sm:hidden px-4 py-2"
						>
							<LanguageSwitcher />
						</motion.div>

						{/* Auth Buttons for Mobile */}
						{!user && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={
									mobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
								}
								transition={{ duration: 0.3, delay: 0.5 }}
								className="flex flex-col gap-3 pt-6 mt-6 border-t border-border/50"
							>
								<Button
									variant="outline"
									size="lg"
									asChild
									className="w-full h-12 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
								>
									<Link href="/login" onClick={() => setMobileMenuOpen(false)}>
										{t("nav.login")}
									</Link>
								</Button>
								<Button
									variant="default"
									size="lg"
									asChild
									className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
								>
									<Link
										href="/register"
										onClick={() => setMobileMenuOpen(false)}
									>
										<span className="flex items-center justify-center gap-2">
											{t("nav.register")}
											<Badge
												variant="secondary"
												className="text-xs px-2 py-0.5 bg-white/20 text-white border-white/30"
											>
												{t("nav.new")}
											</Badge>
										</span>
									</Link>
								</Button>
							</motion.div>
						)}

						{/* User Menu for Mobile */}
						{user && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={
									mobileMenuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
								}
								transition={{ duration: 0.3, delay: 0.5 }}
								className="flex flex-col gap-3 pt-6 mt-6 border-t border-border/50"
							>
								<Button
									variant="outline"
									size="lg"
									asChild
									className="w-full h-12 border-primary/20 hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
								>
									<Link
										href="/dashboard/home"
										onClick={() => setMobileMenuOpen(false)}
									>
										{t("nav.dashboard")}
									</Link>
								</Button>
								<Button
									variant="default"
									size="lg"
									asChild
									className="w-full h-12 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
								>
									<Link
										href="/dashboard/courses"
										onClick={() => setMobileMenuOpen(false)}
									>
										{t("nav.my_courses")}
									</Link>
								</Button>
							</motion.div>
						)}
					</div>
				</div>
			</motion.div>
		</motion.nav>
	);
}
