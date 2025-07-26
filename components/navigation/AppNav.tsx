"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
	HomeIcon,
	BookOpenIcon,
	UserIcon,
	LogOutIcon,
	MenuIcon,
	XIcon,
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

interface NavItemProps {
	href: string;
	icon: React.ReactNode;
	label: string;
	isActive: boolean;
	onClick?: () => void;
}

const NavItem = ({ href, icon, label, isActive, onClick }: NavItemProps) => {
	const { t } = useLanguage();

	// Desktop sidebar item
	const DesktopItem = (
		<Link
			href={href}
			onClick={onClick}
			className={cn(
				"flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
				isActive
					? "bg-primary text-primary-foreground"
					: "hover:bg-muted text-muted-foreground hover:text-foreground"
			)}
		>
			{icon}
			<span>{t(label) || label}</span>
		</Link>
	);

	// Mobile bottom bar item
	const MobileItem = (
		<Link
			href={href}
			onClick={onClick}
			className={cn(
				"flex flex-col items-center justify-center gap-1 text-xs",
				isActive ? "text-primary" : "text-muted-foreground"
			)}
		>
			{icon}
			<span>{t(label) || label}</span>
		</Link>
	);

	return (
		<>
			{/* Desktop version - only shown on md and above */}
			<div className="hidden md:block">{DesktopItem}</div>

			{/* Mobile version - only shown below md */}
			<div className="md:hidden">{MobileItem}</div>
		</>
	);
};

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

	const navItems = [
		{
			href: "/dashboard/home",
			icon: <HomeIcon className="h-5 w-5" />,
			label: "nav.home",
		},
		{
			href: "/dashboard/courses",
			icon: <BookOpenIcon className="h-5 w-5" />,
			label: "nav.courses",
		},
		{
			href: "/dashboard/profile",
			icon: <UserIcon className="h-5 w-5" />,
			label: "nav.profile",
		},
	];

	return (
		<>
			{/* Desktop Sidebar - Fixed on the left side */}
			<div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
				<div className="flex flex-col flex-grow border-r bg-background pt-5 overflow-y-auto">
					<div className="flex items-center flex-shrink-0 px-4 mb-5">
						<h1 className="text-xl font-bold text-primary">11Tutors</h1>
					</div>
					<div className="mt-5 flex-grow flex flex-col">
						<nav className="flex-1 px-2 pb-4 space-y-1">
							{navItems.map((item) => (
								<NavItem
									key={item.href}
									href={item.href}
									icon={item.icon}
									label={item.label}
									isActive={pathname === item.href}
								/>
							))}

							<div className="pt-4 mt-6 border-t border-border">
								<Button
									variant="ghost"
									className="w-full justify-start text-muted-foreground hover:text-foreground"
									onClick={handleLogout}
								>
									<LogOutIcon className="h-5 w-5 mr-3" />
									<span>{t("nav.logout") || "Logout"}</span>
								</Button>
							</div>
						</nav>
					</div>

					{/* User profile at bottom of sidebar */}
					{user && (
						<div className="flex items-center gap-2 px-4 py-3 border-t border-border">
							<Avatar className="h-8 w-8">
								<AvatarImage src={user.avatar} alt={user.username} />
								<AvatarFallback>
									{user.first_name?.[0]}
									{user.last_name?.[0]}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<span className="text-sm font-medium">
									{user.first_name} {user.last_name}
								</span>
								<span className="text-xs text-muted-foreground">
									{user.email}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Mobile Bottom Navigation Bar */}
			<div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
				<div className="grid grid-cols-3 h-16">
					{navItems.map((item) => (
						<NavItem
							key={item.href}
							href={item.href}
							icon={item.icon}
							label={item.label}
							isActive={pathname === item.href}
						/>
					))}
				</div>
			</div>

			{/* Mobile menu button for additional options */}
			<div className="md:hidden fixed top-4 right-4 z-50">
				<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon">
							<MenuIcon className="h-5 w-5" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right">
						<div className="flex flex-col h-full">
							<div className="flex items-center justify-between mb-6">
								<h2 className="text-lg font-semibold">
									{t("nav.menu") || "Menu"}
								</h2>
								<SheetClose asChild>
									<Button variant="ghost" size="icon">
										<XIcon className="h-5 w-5" />
									</Button>
								</SheetClose>
							</div>

							{user && (
								<div className="flex items-center gap-3 py-4 border-b border-border mb-4">
									<Avatar className="h-10 w-10">
										<AvatarImage src={user.avatar} alt={user.username} />
										<AvatarFallback>
											{user.first_name?.[0]}
											{user.last_name?.[0]}
										</AvatarFallback>
									</Avatar>
									<div>
										<p className="font-medium">
											{user.first_name} {user.last_name}
										</p>
										<p className="text-sm text-muted-foreground">
											{user.email}
										</p>
									</div>
								</div>
							)}

							<div className="space-y-3 flex-1">
								<SheetClose asChild>
									<Button
										variant="ghost"
										className="w-full justify-start"
										onClick={handleLogout}
									>
										<LogOutIcon className="h-5 w-5 mr-3" />
										<span>{t("nav.logout") || "Logout"}</span>
									</Button>
								</SheetClose>
							</div>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
}
