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
			<div className="md:pl-64 flex flex-col flex-1">
				<main className="flex-1 pb-16 md:pb-0">
					{/* Content area */}
					<div className="py-6">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
							{children}
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
