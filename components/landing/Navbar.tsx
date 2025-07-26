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
			transition: { duration: 0.5 },
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

	return (
		<motion.nav
			initial="hidden"
			animate="visible"
			variants={navVariants}
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-md",
				scrolled ? "shadow-md py-2" : "py-4"
			)}
		>
			<div className="container mx-auto px-4 flex items-center justify-between">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2">
					<span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
						{t("app.name")}
					</span>
				</Link>

				{/* Desktop Navigation */}
				<div className="hidden md:flex items-center gap-6">
					<Link
						href="/courses"
						className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
					>
						{t("nav.courses")}
					</Link>
					<Link
						href="/tutors"
						className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
					>
						{t("nav.tutors")}
					</Link>
					<Link
						href="/how-it-works"
						className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
					>
						{t("nav.how_it_works")}
					</Link>
					<Link
						href="/for-tutors"
						className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
					>
						{t("nav.for_tutors")}
					</Link>
				</div>

				{/* Auth & Theme Buttons */}
				<div className="flex items-center gap-4">
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
						className="rounded-full"
						aria-label="Toggle theme"
					>
						{theme === "dark" ? (
							<SunIcon className="h-5 w-5" />
						) : (
							<MoonIcon className="h-5 w-5" />
						)}
					</Button>

					<LanguageSwitcher />

					{user ? (
						<div className="flex items-center gap-2">
							<Button variant="ghost" size="sm" asChild>
								<Link href="/dashboard/home">{t("nav.dashboard")}</Link>
							</Button>
							<Button variant="default" size="sm" asChild>
								<Link href="/dashboard/courses">{t("nav.my_courses")}</Link>
							</Button>
						</div>
					) : (
						<div className="hidden md:flex items-center gap-2">
							<Button variant="ghost" size="sm" asChild>
								<Link href="/login">{t("nav.login")}</Link>
							</Button>
							<Button variant="default" size="sm" asChild>
								<Link href="/register">{t("nav.register")}</Link>
							</Button>
						</div>
					)}

					{/* Mobile Menu Button */}
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					>
						{mobileMenuOpen ? (
							<XIcon className="h-5 w-5" />
						) : (
							<MenuIcon className="h-5 w-5" />
						)}
					</Button>
				</div>
			</div>

			{/* Mobile Menu */}
			{mobileMenuOpen && (
				<div className="md:hidden bg-background border-t py-4 px-4 shadow-lg">
					<div className="flex flex-col gap-4">
						<Link
							href="/courses"
							className="text-sm font-medium px-2 py-1.5 rounded-md hover:bg-accent"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.courses")}
						</Link>
						<Link
							href="/tutors"
							className="text-sm font-medium px-2 py-1.5 rounded-md hover:bg-accent"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.tutors")}
						</Link>
						<Link
							href="/how-it-works"
							className="text-sm font-medium px-2 py-1.5 rounded-md hover:bg-accent"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.how_it_works")}
						</Link>
						<Link
							href="/for-tutors"
							className="text-sm font-medium px-2 py-1.5 rounded-md hover:bg-accent"
							onClick={() => setMobileMenuOpen(false)}
						>
							{t("nav.for_tutors")}
						</Link>

						{!user && (
							<div className="flex flex-col gap-2 pt-2 border-t">
								<Button variant="outline" size="sm" asChild className="w-full">
									<Link href="/login" onClick={() => setMobileMenuOpen(false)}>
										{t("nav.login")}
									</Link>
								</Button>
								<Button variant="default" size="sm" asChild className="w-full">
									<Link
										href="/register"
										onClick={() => setMobileMenuOpen(false)}
									>
										<span className="flex items-center gap-1.5">
											{t("nav.register")}
											<Badge
												variant="outline"
												className="text-[10px] px-1.5 py-0 border border-primary/20 bg-background/50"
											>
												{t("nav.new")}
											</Badge>
										</span>
									</Link>
								</Button>
							</div>
						)}
					</div>
				</div>
			)}
		</motion.nav>
	);
}
