"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ruModule from "../translations/ru";
import enModule from "../translations/en";
import esModule from "../translations/es";

type Language = "ru" | "en" | "es";

interface LanguageContextType {
	language: Language;
	setLanguage: (language: Language) => void;
	t: (key: string, params?: Record<string, string>) => string;
}

interface LanguageProviderProps {
	children: React.ReactNode;
	defaultTranslations?: Record<
		string,
		Record<string, string | Record<string, string>>
	>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
);

// Default translations as a fallback
const defaultTranslations = {
	ru: {},
	en: {},
	es: {},
};

export const LanguageProvider: React.FC<LanguageProviderProps> = ({
	children,
	defaultTranslations = {},
}) => {
	// Initialize with a function to ensure localStorage is only accessed during client-side rendering
	const [language, setLanguage] = useState<Language>(() => {
		if (typeof window !== "undefined") {
			const savedLanguage = localStorage.getItem("11tutors-language");
			if (savedLanguage) {
				try {
					const parsedLanguage = JSON.parse(savedLanguage);
					if (["en", "ru", "es"].includes(parsedLanguage)) {
						return parsedLanguage as Language;
					}
				} catch (e) {
					console.error("Failed to parse saved language", e);
				}
			}
		}
		return "en";
	});

	const [translations, setTranslations] =
		useState<Record<string, Record<string, string | Record<string, string>>>>(
			defaultTranslations
		);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setIsLoading(true);

		// Set translations
		setTranslations({
			ru: ruModule,
			en: enModule,
			es: esModule,
		});

		setIsLoading(false);
	}, []);

	// Save language preference to localStorage when it changes
	useEffect(() => {
		if (typeof window !== "undefined" && !isLoading) {
			localStorage.setItem("11tutors-language", JSON.stringify(language));
			// Force the document language attribute to update
			document.documentElement.lang = language;
			console.log("Language saved to localStorage:", language);
		}
	}, [language, isLoading]);

	// Translation function with interpolation support
	const t = (key: string, params?: Record<string, any>): string => {
		if (isLoading || !translations[language]) {
			return key;
		}

		// Get the translation text, with fallbacks
		const translationValue =
			translations[language][key] || translations["en"][key];
		let text = typeof translationValue === "string" ? translationValue : key;

		if (typeof translationValue !== "string") {
			console.info("Translation not found for key:", key);
		}

		// If params are provided, replace placeholders in the text
		if (params && typeof text === "string") {
			Object.entries(params).forEach(([paramKey, paramValue]) => {
				text = text.replace(
					new RegExp(`{${paramKey}}`, "g"),
					String(paramValue)
				);
			});
		}

		return text;
	};

	return (
		<LanguageContext.Provider
			value={{
				language,
				setLanguage,
				t,
			}}
		>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
};
