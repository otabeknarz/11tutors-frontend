"use client";

import { usePathname } from "next/navigation";

export default function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();

	// Pages that handle their own spacing (like landing page with full-screen hero)
	const fullScreenPages = ["/"];
	const isFullScreenPage = fullScreenPages.includes(pathname);

	// Onboarding has extra spacing
	const isOnboarding =
		pathname === "/onboarding" || pathname.startsWith("/onboarding/");

	return (
		<section
			className={
				isOnboarding
					? "pt-24 sm:pt-28"
					: isFullScreenPage
					? ""
					: "pt-20 md:pt-24"
			}
		>
			{children}
		</section>
	);
}
