"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Heart as HeartIcon,
	MessageCircle,
	Share2 as Share2Icon,
} from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";

interface LessonActionsProps {
	onCommentsClick: () => void;
	onShareClick: () => void;
	className?: string;
}

export const LessonActions = ({
	onCommentsClick,
	onShareClick,
	className,
}: LessonActionsProps) => {
	const { t } = useLanguage();
	const [isLiked, setIsLiked] = useState(false);

	return (
		<div className={cn("flex items-center gap-4", className)}>
			<Button
				variant="outline"
				size="sm"
				className={`flex items-center gap-1.5 ${
					isLiked
						? "text-red-500 hover:text-red-600"
						: "text-muted-foreground hover:text-foreground"
				}`}
				onClick={() => setIsLiked(!isLiked)}
			>
				<HeartIcon className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`} />
				{t("lessonDetail.like") || "Like"}
			</Button>

			<Button
				variant="outline"
				size="sm"
				className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
				onClick={onCommentsClick}
			>
				<MessageCircle className="h-4 w-4" />
				{t("lessonDetail.comments") || "Comments"}
			</Button>

			<Button
				variant="outline"
				size="sm"
				className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
				onClick={onShareClick}
			>
				<Share2Icon className="h-4 w-4" />
				{t("lessonDetail.share") || "Share"}
			</Button>
		</div>
	);
};
