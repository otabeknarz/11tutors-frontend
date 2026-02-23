"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { motion } from "framer-motion";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Card,
	CardContent,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Icons
import {
	Mail,
	Lock,
	User,
	AlertCircle,
	ArrowRight,
	KeyRound,
	MoonIcon,
	SunIcon,
} from "lucide-react";
import { useTheme } from "next-themes";

export default function RegisterPage() {
	const { register, error, clearError } = useAuth();
	const { t } = useLanguage();
	const router = useRouter();

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState("");
	const { theme, setTheme } = useTheme();

	const validateForm = () => {
		if (!firstName) {
			setFormError(t("errors.firstNameRequired"));
			return false;
		}
		if (!lastName) {
			setFormError(t("errors.lastNameRequired"));
			return false;
		}
		if (!email) {
			setFormError(t("errors.emailRequired"));
			return false;
		}
		if (!password) {
			setFormError(t("errors.passwordRequired"));
			return false;
		}
		if (password !== confirmPassword) {
			setFormError(t("errors.passwordsDoNotMatch"));
			return false;
		}
		if (password.length < 8) {
			setFormError(t("errors.passwordTooShort"));
			return false;
		}
		return true;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		clearError();
		setFormError("");

		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			const success = await register(firstName, lastName, email, password);
			if (success) {
				// Redirect to dashboard after successful registration
				router.push("/dashboard");
			}
		} catch (err) {
			setFormError(t("errors.registrationFailed"));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex">
			{/* Left decorative panel */}
			<div className="hidden lg:flex lg:w-1/2 relative bg-[#1C1917] items-center justify-center overflow-hidden">
				<div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
				<div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px]" />

				<div className="relative z-10 max-w-md px-12 text-white">
					<div className="flex items-center gap-3 mb-10">
						<div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
							<span className="text-primary-foreground font-bold">11</span>
						</div>
						<span className="font-heading text-2xl font-bold tracking-tight">
							Tutors
						</span>
					</div>
					<h2 className="font-heading text-4xl font-bold tracking-tight leading-[1.15] mb-4">
						Start your journey
						<br />
						<span className="text-primary">today.</span>
					</h2>
					<p className="text-white/60 text-base leading-relaxed">
						Create your account and get access to personalized courses from top
						university tutors.
					</p>
				</div>
			</div>

			{/* Right form panel */}
			<div className="flex-1 flex flex-col">
				{/* Top bar */}
				<div className="flex items-center justify-between px-6 py-4">
					<div className="flex items-center gap-2 lg:hidden">
						<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
							<span className="text-primary-foreground font-bold text-sm">
								11
							</span>
						</div>
						<span className="font-heading text-lg font-bold">Tutors</span>
					</div>
					<div className="flex items-center gap-2 ml-auto">
						<LanguageSwitcher />
						<Button
							variant="ghost"
							size="icon"
							onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
							className="rounded-full"
							aria-label="Toggle theme"
						>
							{theme === "dark" ? (
								<SunIcon className="h-4 w-4" />
							) : (
								<MoonIcon className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				{/* Form */}
				<div className="flex-1 flex items-center justify-center px-6 py-8">
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="w-full max-w-sm"
					>
						<div className="mb-8">
							<h1 className="text-2xl font-bold tracking-tight">
								{t("auth.createAccount")}
							</h1>
							<p className="text-muted-foreground text-sm mt-1.5">
								{t("auth.alreadyHaveAccount")}{" "}
								<Link
									href="/login"
									className="font-semibold text-primary hover:text-primary/80 transition-colors"
								>
									{t("auth.signIn")}
								</Link>
							</p>
						</div>

						<form className="space-y-4" onSubmit={handleSubmit}>
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<Label htmlFor="first-name" className="text-sm font-medium">
										{t("auth.firstName")}
									</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											type="text"
											name="first-name"
											id="first-name"
											autoComplete="given-name"
											value={firstName}
											onChange={(e) => setFirstName(e.target.value)}
											className="pl-10 h-11"
											placeholder={t("auth.firstNamePlaceholder")}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="last-name" className="text-sm font-medium">
										{t("auth.lastName")}
									</Label>
									<div className="relative">
										<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
										<Input
											type="text"
											name="last-name"
											id="last-name"
											autoComplete="family-name"
											value={lastName}
											onChange={(e) => setLastName(e.target.value)}
											className="pl-10 h-11"
											placeholder={t("auth.lastNamePlaceholder")}
										/>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email" className="text-sm font-medium">
									{t("auth.email")}
								</Label>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										id="email"
										name="email"
										type="email"
										autoComplete="email"
										required
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										className="pl-10 h-11"
										placeholder={t("auth.emailPlaceholder")}
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="password" className="text-sm font-medium">
									{t("auth.password")}
								</Label>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										name="password"
										type="password"
										autoComplete="new-password"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="pl-10 h-11"
										placeholder={t("auth.passwordPlaceholder")}
									/>
								</div>
								<p className="text-[11px] text-muted-foreground">
									{t("auth.passwordRequirements")}
								</p>
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="confirm-password"
									className="text-sm font-medium"
								>
									{t("auth.confirmPassword")}
								</Label>
								<div className="relative">
									<KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										id="confirm-password"
										name="confirm-password"
										type="password"
										autoComplete="new-password"
										required
										value={confirmPassword}
										onChange={(e) => setConfirmPassword(e.target.value)}
										className="pl-10 h-11"
										placeholder={t("auth.confirmPasswordPlaceholder")}
									/>
								</div>
							</div>

							{(error || formError) && (
								<Alert variant="destructive" className="text-sm">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>{error || formError}</AlertDescription>
								</Alert>
							)}

							<Button
								type="submit"
								disabled={isSubmitting}
								className="w-full h-11 btn-glow"
							>
								{isSubmitting ? (
									<span className="flex items-center gap-2">
										<span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
										{t("auth.registering")}
									</span>
								) : (
									<span className="flex items-center">
										{t("auth.register")} <ArrowRight className="ml-2 h-4 w-4" />
									</span>
								)}
							</Button>
						</form>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
