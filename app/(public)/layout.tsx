"use client";

import { usePathname } from "next/navigation";

export default function PublicLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const pathname = usePathname();
	return (
		<section className={pathname === "/onboarding" ? "mt-24 sm:mt-28" : ""}>
			{children}
		</section>
	);
}
