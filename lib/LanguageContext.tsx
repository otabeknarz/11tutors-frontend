"use client";

import { useTranslations, useLocale } from "next-intl";
import { useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export type Language = "en" | "ru" | "es";

// Hook for using translations (backward compatible with old useLanguage)
export const useLanguage = () => {
	const t = useTranslations();
	const locale = useLocale() as Language;
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const setLanguage = useCallback(
		(newLocale: Language) => {
			// Set cookie for the locale
			Cookies.set("locale", newLocale, { expires: 365 });
			// Refresh the page to apply the new locale
			startTransition(() => {
				router.refresh();
			});
		},
		[router],
	);

	// Wrapper function to match old t() signature
	const translate = useCallback(
		(key: string, params?: Record<string, string | number>): string => {
			try {
				// next-intl will use the fallback from request.ts if key is missing
				return t(key, params as any);
			} catch {
				// Return the key itself if translation fails
				return key;
			}
		},
		[t],
	);

	return {
		language: locale,
		setLanguage,
		t: translate,
		isLoading: isPending,
	};
};
