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
		<div className="min-h-screen bg-muted/30 flex flex-col">
			<div className="flex-grow flex items-center justify-center px-4 py-12">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="w-full max-w-md"
				>
					<Card className="border-muted-foreground/20 shadow-lg">
						<CardHeader className="space-y-1 text-center">
							<CardTitle className="text-2xl font-bold tracking-tight">
								{t("auth.createAccount")}
							</CardTitle>
							<CardDescription>
								{t("auth.alreadyHaveAccount")}{" "}
								<Link
									href="/login"
									className="font-medium text-primary hover:underline"
								>
									{t("auth.signIn")}
								</Link>
							</CardDescription>
						</CardHeader>

						<CardContent>
							<form className="space-y-4" onSubmit={handleSubmit}>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div className="space-y-2">
										<Label htmlFor="first-name" className="text-sm font-medium">
											{t("auth.firstName")}
										</Label>
										<div className="relative">
											<User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input
												type="text"
												name="first-name"
												id="first-name"
												autoComplete="given-name"
												value={firstName}
												onChange={(e) => setFirstName(e.target.value)}
												className="pl-10"
												placeholder={t("auth.firstNamePlaceholder")}
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="last-name" className="text-sm font-medium">
											{t("auth.lastName")}
										</Label>
										<div className="relative">
											<User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
											<Input
												type="text"
												name="last-name"
												id="last-name"
												autoComplete="family-name"
												value={lastName}
												onChange={(e) => setLastName(e.target.value)}
												className="pl-10"
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
										<Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											id="email"
											name="email"
											type="email"
											autoComplete="email"
											required
											value={email}
											onChange={(e) => setEmail(e.target.value)}
											className="pl-10"
											placeholder={t("auth.emailPlaceholder")}
										/>
									</div>
								</div>

								<div className="space-y-2">
									<Label htmlFor="password" className="text-sm font-medium">
										{t("auth.password")}
									</Label>
									<div className="relative">
										<Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											id="password"
											name="password"
											type="password"
											autoComplete="new-password"
											required
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="pl-10"
											placeholder={t("auth.passwordPlaceholder")}
										/>
									</div>
									<p className="text-xs text-muted-foreground">
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
										<KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											id="confirm-password"
											name="confirm-password"
											type="password"
											autoComplete="new-password"
											required
											value={confirmPassword}
											onChange={(e) => setConfirmPassword(e.target.value)}
											className="pl-10"
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
									className="w-full"
								>
									{isSubmitting ? (
										t("auth.registering")
									) : (
										<span className="flex items-center">
											{t("auth.register")}{" "}
											<ArrowRight className="ml-2 h-4 w-4" />
										</span>
									)}
								</Button>
							</form>
						</CardContent>

						<CardFooter className="flex justify-between border-t pt-4">
							<LanguageSwitcher />
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
						</CardFooter>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
