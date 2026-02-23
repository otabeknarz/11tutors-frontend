"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";
import {
	HomeIcon,
	BookOpenIcon,
	UserIcon,
	LogOutIcon,
	MenuIcon,
	XIcon,
	PencilRuler,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	Sheet,
	SheetContent,
	SheetTrigger,
	SheetClose,
} from "@/components/ui/sheet";

export default function AppNav() {
	const pathname = usePathname();
	const { t } = useLanguage();
	const { user, logout } = useAuth();
	const router = useRouter();
	const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	const isCreator = user?.role === 1 || user?.role === 2;

	const navItems = [
		{
			href: "/dashboard/home",
			icon: <HomeIcon className="h-[18px] w-[18px]" />,
			label: "nav.home",
		},
		{
			href: "/dashboard/courses",
			icon: <BookOpenIcon className="h-[18px] w-[18px]" />,
			label: "nav.courses",
		},
		...(isCreator
			? [
					{
						href: "/dashboard/creator/home",
						icon: <PencilRuler className="h-[18px] w-[18px]" />,
						label: "nav.creator",
					},
				]
			: []),
		{
			href: "/dashboard/profile",
			icon: <UserIcon className="h-[18px] w-[18px]" />,
			label: "nav.profile",
		},
	];

	const isItemActive = (href: string) => {
		if (href === "/dashboard/home") return pathname === href;
		return pathname.startsWith(href);
	};

	return (
		<>
			{/* Desktop Sidebar */}
			<div className="hidden md:flex md:w-[260px] md:flex-col md:fixed md:inset-y-0 z-40">
				<div className="flex flex-col h-full border-r border-border/50 bg-sidebar">
					{/* Logo */}
					<div className="flex items-center gap-2.5 px-6 h-16 shrink-0">
						<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
							<span className="text-primary-foreground font-bold text-sm">
								11
							</span>
						</div>
						<span className="font-heading text-lg font-bold tracking-tight">
							Tutors
						</span>
					</div>

					{/* Navigation */}
					<nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
						{navItems.map((item) => {
							const active = isItemActive(item.href);
							return (
								<Link
									key={item.href}
									href={item.href}
									className={cn(
										"group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ease-out",
										active
											? "bg-accent text-accent-foreground"
											: "text-muted-foreground hover:text-foreground hover:bg-muted/60 hover:translate-x-0.5",
									)}
								>
									{active && (
										<div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary shadow-[0_0_8px_rgba(217,119,6,0.4)]" />
									)}
									<span
										className={cn(
											"transition-colors duration-200",
											active ? "text-primary" : "group-hover:text-foreground",
										)}
									>
										{item.icon}
									</span>
									<span>{t(item.label) || item.label}</span>
								</Link>
							);
						})}
					</nav>

					{/* Bottom section */}
					<div className="mt-auto border-t border-border/50">
						{/* Logout */}
						<div className="px-3 py-2">
							<button
								onClick={handleLogout}
								className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200 w-full cursor-pointer"
							>
								<LogOutIcon className="h-[18px] w-[18px]" />
								<span>{t("nav.logout") || "Logout"}</span>
							</button>
						</div>

						{/* User profile */}
						{user && (
							<div className="px-4 py-3 border-t border-border/50">
								<div className="flex items-center gap-3">
									<Avatar className="h-9 w-9 ring-2 ring-border/50">
										<AvatarImage src={user.avatar} alt={user.first_name} />
										<AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
											{user.first_name?.[0]}
											{user.last_name?.[0]}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col min-w-0">
										<span className="text-sm font-semibold truncate">
											{user.first_name} {user.last_name}
										</span>
										<span className="text-xs text-muted-foreground truncate">
											{user.email}
										</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Mobile Bottom Navigation */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50">
				<div className="flex justify-around items-center h-16 px-2">
					{navItems.map((item) => {
						const active = isItemActive(item.href);
						return (
							<Link
								key={item.href}
								href={item.href}
								className={cn(
									"flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-lg transition-all duration-200 min-w-[56px]",
									active ? "text-primary" : "text-muted-foreground",
								)}
							>
								<div className="relative">
									{item.icon}
									{active && (
										<div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
									)}
								</div>
								<span className="text-[10px] font-medium leading-none mt-1">
									{t(item.label) || item.label}
								</span>
							</Link>
						);
					})}
				</div>
			</div>

			{/* Mobile menu button */}
			<div className="md:hidden fixed top-4 right-4 z-50">
				<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
					<SheetTrigger asChild>
						<Button
							variant="outline"
							size="icon"
							className="bg-background/80 backdrop-blur-xl shadow-lg"
						>
							<MenuIcon className="h-5 w-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right" className="w-[280px]">
						<div className="flex flex-col h-full">
							<div className="flex items-center justify-between mb-8">
								<div className="flex items-center gap-2.5">
									<div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
										<span className="text-primary-foreground font-bold text-sm">
											11
										</span>
									</div>
									<span className="font-heading text-lg font-bold">Tutors</span>
								</div>
								<SheetClose asChild>
									<Button variant="ghost" size="icon">
										<XIcon className="h-5 w-5" />
									</Button>
								</SheetClose>
							</div>

							{user && (
								<div className="flex items-center gap-3 pb-6 mb-6 border-b border-border/50">
									<Avatar className="h-11 w-11 ring-2 ring-border/50">
										<AvatarImage src={user.avatar} alt={user.first_name} />
										<AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
											{user.first_name?.[0]}
											{user.last_name?.[0]}
										</AvatarFallback>
									</Avatar>
									<div className="min-w-0">
										<p className="font-semibold truncate">
											{user.first_name} {user.last_name}
										</p>
										<p className="text-sm text-muted-foreground truncate">
											{user.email}
										</p>
									</div>
								</div>
							)}

							<nav className="flex-1 space-y-1">
								{navItems.map((item) => {
									const active = isItemActive(item.href);
									return (
										<SheetClose asChild key={item.href}>
											<Link
												href={item.href}
												className={cn(
													"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
													active
														? "bg-accent text-accent-foreground"
														: "text-muted-foreground hover:text-foreground hover:bg-muted/60",
												)}
											>
												{item.icon}
												<span>{t(item.label) || item.label}</span>
											</Link>
										</SheetClose>
									);
								})}

								<div className="pt-4 mt-4 border-t border-border/50">
									<SheetClose asChild>
										<button
											onClick={handleLogout}
											className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all duration-200 w-full cursor-pointer"
										>
											<LogOutIcon className="h-[18px] w-[18px]" />
											<span>{t("nav.logout") || "Logout"}</span>
										</button>
									</SheetClose>
								</div>
							</nav>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
}
