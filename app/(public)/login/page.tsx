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
import { Mail, Lock, AlertCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
	const { login, error, clearError } = useAuth();
	const { t } = useLanguage();
	const router = useRouter();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [formError, setFormError] = useState("");

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
								{t("auth.signIn")}
							</CardTitle>
							<CardDescription>
								{t("auth.orRegister")}{" "}
								<Link
									href="/register"
									className="font-medium text-primary hover:underline"
								>
									{t("auth.register")}
								</Link>
							</CardDescription>
						</CardHeader>

						<CardContent>
							<form className="space-y-4" onSubmit={handleSubmit}>
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
									<div className="flex items-center justify-between">
										<Label htmlFor="password" className="text-sm font-medium">
											{t("auth.password")}
										</Label>
										<Link
											href="/forgot-password"
											className="text-xs text-primary hover:underline"
										>
											{t("auth.forgotPassword")}
										</Link>
									</div>
									<div className="relative">
										<Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
										<Input
											id="password"
											name="password"
											type="password"
											autoComplete="current-password"
											required
											value={password}
											onChange={(e) => setPassword(e.target.value)}
											className="pl-10"
											placeholder={t("auth.passwordPlaceholder")}
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
										t("auth.signingIn")
									) : (
										<span className="flex items-center">
											{t("auth.signIn")} <ArrowRight className="ml-2 h-4 w-4" />
										</span>
									)}
								</Button>
							</form>
						</CardContent>

						<CardFooter className="flex justify-center border-t pt-4">
							<LanguageSwitcher />
						</CardFooter>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
