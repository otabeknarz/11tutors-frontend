"use client";

import React from "react";
import { useLanguage, type Language } from "@/lib/LanguageContext";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { localeNames, localeFlags, locales } from "@/i18n/config";

export const LanguageSwitcher: React.FC = () => {
	const { language, setLanguage, isLoading } = useLanguage();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="gap-2"
					disabled={isLoading}
				>
					<span className="text-base">{localeFlags[language]}</span>
					<span className="hidden sm:inline">{localeNames[language]}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{locales.map((locale) => (
					<DropdownMenuItem
						key={locale}
						onClick={() => setLanguage(locale as Language)}
						className={language === locale ? "bg-accent" : ""}
					>
						<span className="mr-2 text-base">{localeFlags[locale]}</span>
						{localeNames[locale]}
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default LanguageSwitcher;
