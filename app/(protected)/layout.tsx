"use client";

import React from "react";
import AppNav from "@/components/navigation/AppNav";
import { useAuth } from "@/lib/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export default function ProtectedLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const { user, loading } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	// Show loading state while checking authentication
	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-background">
				<div className="flex flex-col items-center gap-4">
					<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center animate-pulse">
						<span className="text-primary font-bold text-sm">11</span>
					</div>
					<div className="h-1 w-24 rounded-full bg-muted overflow-hidden">
						<div className="h-full w-1/2 rounded-full bg-primary animate-[shimmer_1.5s_ease-in-out_infinite]" />
					</div>
				</div>
			</div>
		);
	}

	// Redirect if no user (this is a fallback, should be handled by middleware)
	if (!user && typeof window !== "undefined") {
		router.replace("/login");
		return null;
	}

	const paymentPaths = [
		"/dashboard/payment-success",
		"/dashboard/payment-failed",
	];

	if (paymentPaths.includes(pathname)) {
		return <>{children}</>;
	}

	return (
		<div className="min-h-screen bg-background">
			<AppNav />
			<div className="md:pl-[260px] flex flex-col flex-1">
				<main className="flex-1 pb-24 md:pb-0">
					<div className="py-8 px-4 sm:px-6 lg:px-8">
						<div className="max-w-7xl mx-auto">{children}</div>
					</div>
				</main>
			</div>
		</div>
	);
}
