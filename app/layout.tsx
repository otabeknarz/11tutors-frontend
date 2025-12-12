import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { AuthProvider } from "../lib/AuthContext";
import { OnboardingProvider } from "../lib/OnboardingContext";
import { ThemeProvider } from "next-themes";
import "../lib/localStorage-polyfill";
import "./globals.css";

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "11tutors",
	description: "Learn university courses from the best tutors",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body
				className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
			>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<AuthProvider>
							<OnboardingProvider>{children}</OnboardingProvider>
						</AuthProvider>
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
