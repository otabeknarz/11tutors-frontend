import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";

export const locales = ["en", "ru", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export default getRequestConfig(async () => {
	const cookieStore = await cookies();
	const locale = (cookieStore.get("locale")?.value as Locale) || defaultLocale;

	return {
		locale,
		messages: (await import(`../messages/${locale}.json`)).default,
		// Handle missing translations gracefully
		onError(error) {
			// Silently ignore missing translations in production
			if (process.env.NODE_ENV === "development") {
				console.warn(`[i18n] ${error.message}`);
			}
		},
		getMessageFallback({ namespace, key }) {
			// Return the key itself as fallback
			return namespace ? `${namespace}.${key}` : key;
		},
	};
});
