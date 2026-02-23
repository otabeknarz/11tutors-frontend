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
import { useTheme } from "next-themes";

// Icons
import {
	Mail,
	Lock,
	AlertCircle,
	ArrowRight,
	MoonIcon,
	SunIcon,
	EyeIcon,
	EyeOffIcon,
} from "lucide-react";

export default function LoginPage() {
	const { login, error, clearError } = useAuth();
	const { t } = useLanguage();
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState("");
	const { theme, setTheme } = useTheme();
	const [passwordVisible, setPasswordVisible] = useState(false);

	const validateForm = () => {
		if (!email) {
			setFormError(t("errors.emailRequired"));
			return false;
		}
		if (!password) {
			setFormError(t("errors.passwordRequired"));
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
			const success = await login(email, password);
			if (success) {
				router.push("/dashboard");
			}
		} catch (err) {
			setFormError(t("errors.loginFailed"));
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen flex">
			{/* Left decorative panel — hidden on mobile */}
			<div className="hidden lg:flex lg:w-1/2 relative bg-[#1C1917] items-center justify-center overflow-hidden">
				{/* Gradient orb */}
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
						Learn from the best,
						<br />
						<span className="text-primary">become the best.</span>
					</h2>
					<p className="text-white/60 text-base leading-relaxed">
						Join thousands of students learning from top university tutors.
						Personalized courses, real progress.
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
				<div className="flex-1 flex items-center justify-center px-6 py-12">
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4 }}
						className="w-full max-w-sm"
					>
						<div className="mb-8">
							<h1 className="text-2xl font-bold tracking-tight">
								{t("auth.signIn")}
							</h1>
							<p className="text-muted-foreground text-sm mt-1.5">
								{t("auth.orRegister")}{" "}
								<Link
									href="/register"
									className="font-semibold text-primary hover:text-primary/80 transition-colors"
								>
									{t("auth.register")}
								</Link>
							</p>
						</div>

						<form className="space-y-5" onSubmit={handleSubmit}>
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
								<div className="flex items-center justify-between">
									<Label htmlFor="password" className="text-sm font-medium">
										{t("auth.password")}
									</Label>
									<Link
										href="/forgot-password"
										className="text-xs text-muted-foreground hover:text-primary transition-colors"
									>
										{t("auth.forgotPassword")}
									</Link>
								</div>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										id="password"
										name="password"
										type={passwordVisible ? "text" : "password"}
										autoComplete="current-password"
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										className="pl-10 h-11 pr-10"
										placeholder={t("auth.passwordPlaceholder")}
									/>
									<Button
										variant="ghost"
										size="icon"
										type="button"
										className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
										aria-label="Toggle password visibility"
										onClick={() => setPasswordVisible(!passwordVisible)}
									>
										{passwordVisible ? (
											<EyeOffIcon className="h-4 w-4 text-muted-foreground" />
										) : (
											<EyeIcon className="h-4 w-4 text-muted-foreground" />
										)}
									</Button>
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
										{t("auth.signingIn")}
									</span>
								) : (
									<span className="flex items-center">
										{t("auth.signIn")} <ArrowRight className="ml-2 h-4 w-4" />
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
