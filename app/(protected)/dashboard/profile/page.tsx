"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import {
	User,
	Mail,
	Phone,
	Save,
	LogOut,
	Moon,
	Sun,
	Languages,
} from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function ProfilePage() {
	const { user, logout, updateUserProfile, loading: authLoading } = useAuth();
	const { t } = useLanguage();
	const { theme, setTheme } = useTheme();
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Form state
	const [formData, setFormData] = useState({
		first_name: user?.first_name || "",
		last_name: user?.last_name || "",
		email: user?.email || "",
		phone: user?.phone || "",
		username: user?.username || "",
	});

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError(null);
		setSuccess(false);

		try {
			const result = await updateUserProfile(formData);
			if (result) {
				setSuccess(true);
				setTimeout(() => setSuccess(false), 3000);
			} else {
				setError("Failed to update profile");
			}
		} catch (err) {
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	const toggleTheme = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	// Show loading state while checking authentication
	if (authLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
			</div>
		);
	}

	// Redirect if no user (this is a fallback, should be handled by middleware)
	if (!user && typeof window !== "undefined") {
		router.replace("/login");
		return null;
	}

	return (
		<div className="space-y-10">
			{/* Header with avatar */}
			<motion.div
				initial={{ opacity: 0, y: 16 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
					<div className="flex items-center gap-4">
						<Avatar className="h-14 w-14 border-2 border-primary/20 shadow-sm">
							<AvatarImage src={user?.avatar || ""} alt={user?.first_name} />
							<AvatarFallback className="text-lg bg-primary/10 text-primary font-semibold">
								{user?.first_name?.[0]}
								{user?.last_name?.[0]}
							</AvatarFallback>
						</Avatar>
						<div>
							<h1 className="text-2xl font-bold tracking-tight">
								{user?.first_name} {user?.last_name}
							</h1>
							<p className="text-sm text-muted-foreground">{user?.email}</p>
						</div>
					</div>
					<Button
						variant="outline"
						onClick={handleLogout}
						className="flex items-center gap-2 text-destructive hover:text-destructive hover:bg-destructive/5 hover:border-destructive/30"
					>
						<LogOut className="h-4 w-4" />
						{t("nav.logout") || "Logout"}
					</Button>
				</div>
			</motion.div>

			<Tabs defaultValue="profile" className="w-full">
				<TabsList className="mb-6">
					<TabsTrigger value="profile">
						{t("profile.tabs.profile") || "Profile"}
					</TabsTrigger>
					<TabsTrigger value="preferences">
						{t("profile.tabs.preferences") || "Preferences"}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="profile">
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="card-premium">
							<CardHeader>
								<CardTitle className="text-lg">
									{t("profile.personalInfo") || "Personal Information"}
								</CardTitle>
								<CardDescription>
									{t("profile.updateInfo") ||
										"Update your personal information"}
								</CardDescription>
							</CardHeader>
							<CardContent>
								{success && (
									<Alert className="mb-6 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
										<AlertDescription>
											{t("profile.updateSuccess") ||
												"Profile updated successfully"}
										</AlertDescription>
									</Alert>
								)}

								{error && (
									<Alert variant="destructive" className="mb-6">
										<AlertDescription>{error}</AlertDescription>
									</Alert>
								)}

								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
										<div className="space-y-2">
											<Label
												htmlFor="first_name"
												className="text-sm font-medium"
											>
												{t("profile.firstName") || "First Name"}
											</Label>
											<div className="relative">
												<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													id="first_name"
													name="first_name"
													value={formData.first_name}
													onChange={handleChange}
													className="pl-10 h-11"
													placeholder={
														t("profile.firstNamePlaceholder") ||
														"Enter your first name"
													}
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label
												htmlFor="last_name"
												className="text-sm font-medium"
											>
												{t("profile.lastName") || "Last Name"}
											</Label>
											<div className="relative">
												<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													id="last_name"
													name="last_name"
													value={formData.last_name}
													onChange={handleChange}
													className="pl-10 h-11"
													placeholder={
														t("profile.lastNamePlaceholder") ||
														"Enter your last name"
													}
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="email" className="text-sm font-medium">
												{t("profile.email") || "Email"}
											</Label>
											<div className="relative">
												<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													id="email"
													name="email"
													type="email"
													value={formData.email}
													onChange={handleChange}
													className="pl-10 h-11"
													placeholder={
														t("profile.emailPlaceholder") || "Enter your email"
													}
												/>
											</div>
										</div>

										<div className="space-y-2">
											<Label htmlFor="phone" className="text-sm font-medium">
												{t("profile.phone") || "Phone"}
											</Label>
											<div className="relative">
												<Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													id="phone"
													name="phone"
													value={formData.phone}
													onChange={handleChange}
													className="pl-10 h-11"
													placeholder={
														t("profile.phonePlaceholder") ||
														"Enter your phone number"
													}
												/>
											</div>
										</div>

										<div className="space-y-2 md:col-span-2">
											<Label htmlFor="username" className="text-sm font-medium">
												{t("profile.username") || "Username"}
											</Label>
											<div className="relative">
												<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
												<Input
													id="username"
													name="username"
													value={formData.username}
													onChange={handleChange}
													className="pl-10 h-11"
													placeholder={
														t("profile.usernamePlaceholder") ||
														"Enter your username"
													}
												/>
											</div>
										</div>
									</div>

									<div className="flex justify-end pt-2">
										<Button
											type="submit"
											disabled={loading}
											className="btn-glow flex items-center gap-2"
										>
											{loading ? (
												<span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
											) : (
												<Save className="h-4 w-4" />
											)}
											{t("profile.saveChanges") || "Save Changes"}
										</Button>
									</div>
								</form>
							</CardContent>
						</Card>
					</motion.div>
				</TabsContent>

				<TabsContent value="preferences">
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="card-premium">
							<CardHeader>
								<CardTitle className="text-lg">
									{t("profile.preferences") || "Preferences"}
								</CardTitle>
								<CardDescription>
									{t("profile.preferencesDescription") ||
										"Customize your app experience"}
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-6">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
											{theme === "dark" ? (
												<Moon className="h-4 w-4" />
											) : (
												<Sun className="h-4 w-4" />
											)}
										</div>
										<div>
											<p className="text-sm font-medium">
												{t("profile.darkMode") || "Dark Mode"}
											</p>
											<p className="text-xs text-muted-foreground">
												{t("profile.darkModeDescription") ||
													"Toggle between light and dark theme"}
											</p>
										</div>
									</div>
									<Switch
										checked={theme === "dark"}
										onCheckedChange={toggleTheme}
									/>
								</div>

								<Separator />

								<div className="flex items-center justify-between">
									<div className="flex items-center gap-3">
										<div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
											<Languages className="h-4 w-4" />
										</div>
										<div>
											<p className="text-sm font-medium">
												{t("profile.language") || "Language"}
											</p>
											<p className="text-xs text-muted-foreground">
												{t("profile.languageDescription") ||
													"Select your preferred language"}
											</p>
										</div>
									</div>
									<LanguageSwitcher />
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
