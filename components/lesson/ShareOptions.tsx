"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Linkedin, Send, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

interface Lesson {
	id: string;
	title: string;
	description: string;
	is_free_preview: boolean;
	order: number;
	otp: string;
	playbackInfo: string;
	duration: string;
	created_at: string;
}

interface Course {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	slug: string;
	parts: any[];
	tutors: {
		first_name: string;
		last_name: string;
		avatar: string | null;
	}[];
}

interface ShareOptionsProps {
	lesson: Lesson;
	course: Course;
}

export const ShareOptions = ({ lesson, course }: ShareOptionsProps) => {
	const { t } = useLanguage();
	const [copied, setCopied] = useState(false);

	// Copy URL to clipboard
	const copyToClipboard = () => {
		navigator.clipboard.writeText(window.location.href);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const shareText = `Check out this lesson: "${lesson.title}" from the course "${course.title}"`;
	const shareUrl = encodeURIComponent(window.location.href);
	const encodedText = encodeURIComponent(shareText);

	return (
		<div className="space-y-4">
			<h3 className="font-medium">
				{t("lessonDetail.shareLesson") || "Share this lesson"}
			</h3>
			
			{/* Copy Link */}
			<div className="flex gap-2">
				<Input
					value={window.location.href}
					readOnly
					className="flex-1"
				/>
				<Button onClick={copyToClipboard} variant="outline">
					{copied 
						? t("lessonDetail.copied") || "Copied!" 
						: t("lessonDetail.copy") || "Copy"
					}
				</Button>
			</div>

			{/* Social Media Buttons */}
			<div className="space-y-2">
				<p className="text-sm text-muted-foreground">
					{t("lessonDetail.shareOn") || "Share on social media"}
				</p>
				<div className="grid grid-cols-2 gap-2">
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={() => {
							window.open(
								`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
								"_blank",
								"width=600,height=400"
							);
						}}
					>
						<Facebook className="h-4 w-4 mr-2" />
						Facebook
					</Button>
					
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={() => {
							window.open(
								`https://twitter.com/intent/tweet?text=${encodedText}&url=${shareUrl}`,
								"_blank",
								"width=600,height=400"
							);
						}}
					>
						<Send className="h-4 w-4 mr-2" />
						Twitter
					</Button>
					
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={() => {
							window.open(
								`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
								"_blank",
								"width=600,height=400"
							);
						}}
					>
						<Linkedin className="h-4 w-4 mr-2" />
						LinkedIn
					</Button>
					
					<Button
						variant="outline"
						size="sm"
						className="flex-1"
						onClick={() => {
							window.open(
								`https://t.me/share/url?url=${shareUrl}&text=${encodedText}`,
								"_blank",
								"width=600,height=400"
							);
						}}
					>
						<MessageCircle className="h-4 w-4 mr-2" />
						Telegram
					</Button>
				</div>
			</div>
		</div>
	);
};
