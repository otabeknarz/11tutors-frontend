"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "ru" | "en" | "es";

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string, params?: Record<string, any>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
);

// Default translations to use before the dynamic imports are complete
const defaultTranslations = {
	ru: {},
	en: {},
	es: {},
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [language, setLanguage] = useState<Language>("en");
	const [translations, setTranslations] =
		useState<Record<string, Record<string, string | Record<string, string>>>>(defaultTranslations);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		// Load saved language preference from localStorage if available
		if (typeof window !== "undefined") {
			const savedLanguage = localStorage.getItem("11tutors-language");
			if (
				savedLanguage &&
				(savedLanguage === "ru" ||
					savedLanguage === "en" ||
					savedLanguage === "es")
			) {
				setLanguage(savedLanguage as Language);
			}
		}

		// Load translations
		const loadTranslations = async () => {
			try {
				setIsLoading(true);

				// Dynamic imports for translations
				const ruModule = await import("../translations/ru");
				const enModule = await import("../translations/en");
				const esModule = await import("../translations/es");

				setTranslations({
					ru: ruModule.default,
					en: enModule.default,
					es: esModule.default,
				});
			} catch (error) {
				console.error("Failed to load translations:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadTranslations();
	}, []);

	// Save language preference to localStorage when it changes
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("11tutors-language", language);
		}
	}, [language]);

	// Translation function with interpolation support
	const t = (key: string, params?: Record<string, any>): string => {
		if (isLoading || !translations[language]) {
			return key;
		}

		// Get the translation text, with fallbacks
		const translationValue = translations[language][key] || translations["ru"][key];
		let text = typeof translationValue === 'string' ? translationValue : key;

		// If params are provided, replace placeholders in the text
		if (params && typeof text === 'string') {
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
