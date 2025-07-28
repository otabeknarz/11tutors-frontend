import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { AuthProvider } from "../lib/AuthContext";
import { LanguageProvider } from "../lib/LanguageContext";
import { OnboardingProvider } from "../lib/OnboardingContext";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const robotoSans = Roboto({
	variable: "--font-roboto-sans",
	subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
	variable: "--font-roboto-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "11tutors",
	description: "Learn university courses from the best tutors",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}
			>
				<LanguageProvider>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<AuthProvider>
							<OnboardingProvider>{children}</OnboardingProvider>
						</AuthProvider>
					</ThemeProvider>
				</LanguageProvider>
			</body>
		</html>
	);
}
