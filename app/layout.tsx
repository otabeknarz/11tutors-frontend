import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../lib/AuthContext";
import { LanguageProvider } from "../lib/LanguageContext";
import { OnboardingProvider } from "../lib/OnboardingContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <LanguageProvider>
            <OnboardingProvider>
              {children}
            </OnboardingProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
