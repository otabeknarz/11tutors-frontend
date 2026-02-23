"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface LoadingStateProps {
	message?: string;
}

export function LoadingState({ message }: LoadingStateProps) {
	const { t } = useLanguage();

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
			<div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 animate-pulse">
				<span className="text-primary font-bold text-sm">11</span>
			</div>
			<div className="h-1 w-24 rounded-full bg-muted overflow-hidden">
				<div className="h-full w-1/2 rounded-full bg-primary animate-[shimmer_1.5s_ease-in-out_infinite]" />
			</div>
			<p className="text-sm text-muted-foreground mt-4">
				{message || t("courseDetail.loading")}
			</p>
		</div>
	);
}

interface ErrorStateProps {
	error: string;
	onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
	const { t } = useLanguage();

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
			<div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-4">
				<AlertCircle className="h-7 w-7 text-destructive" />
			</div>
			<h2 className="text-lg font-semibold text-foreground mb-1.5">
				{t("courseDetail.error")}
			</h2>
			<p className="text-sm text-muted-foreground text-center max-w-md mb-6">
				{error}
			</p>
			<div className="flex gap-3">
				{onRetry && (
					<Button onClick={onRetry} variant="outline" size="sm">
						Try Again
					</Button>
				)}
				<Button size="sm" asChild>
					<Link href="/courses">{t("courseDetail.goBack")}</Link>
				</Button>
			</div>
		</div>
	);
}

interface NotFoundStateProps {
	message?: string;
}

export function NotFoundState({ message }: NotFoundStateProps) {
	const { t } = useLanguage();

	return (
		<div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
			<div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center mb-4">
				<AlertCircle className="h-7 w-7 text-muted-foreground" />
			</div>
			<h2 className="text-lg font-semibold text-foreground mb-1.5">
				{t("courseDetail.notFound")}
			</h2>
			<p className="text-sm text-muted-foreground text-center max-w-md mb-6">
				{message || t("courseDetail.notFoundMessage")}
			</p>
			<Button size="sm" asChild>
				<Link href="/courses">{t("courseDetail.goBack")}</Link>
			</Button>
		</div>
	);
}
