"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart as HeartIcon, MessageCircle } from "lucide-react";
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

interface Comment {
	id: string;
	user: {
		name: string;
		avatar: string | null;
	};
	content: string;
	createdAt: string;
	likes: number;
	replies: number;
}

interface CommentsSectionProps {
	lesson: Lesson;
}

export const CommentsSection = ({ lesson }: CommentsSectionProps) => {
	const { t, language } = useLanguage();

	// Sample comments data (would be fetched from API in production)
	const sampleComments: Comment[] = [
		{
			id: "1",
			user: {
				name: "Alex Johnson",
				avatar: null,
			},
			content:
				"This lesson was incredibly helpful! I finally understand how to implement authentication properly.",
			createdAt: "2023-11-15T14:23:00Z",
			likes: 8,
			replies: 2,
		},
		{
			id: "2",
			user: {
				name: "Maria Garcia",
				avatar: null,
			},
			content:
				"Could you explain more about the JWT token expiration best practices? I'm still a bit confused about that part.",
			createdAt: "2023-11-14T09:45:00Z",
			likes: 3,
			replies: 1,
		},
		{
			id: "3",
			user: {
				name: "David Kim",
				avatar: null,
			},
			content:
				"The code examples were very clear. I appreciate how you broke down each step!",
			createdAt: "2023-11-13T16:30:00Z",
			likes: 5,
			replies: 0,
		},
	];

	// Format date based on current language
	const formatCommentDate = (dateString: string) => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat(language, {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(date);
	};

	return (
		<div className="space-y-6">
			{/* Comment Form */}
			<div className="space-y-3">
				<h3 className="font-medium">
					{t("lessonDetail.addComment") || "Add a comment"}
				</h3>
				<Textarea
					placeholder={t("lessonDetail.commentPlaceholder") || "Share your thoughts about this lesson..."}
					className="min-h-[100px]"
				/>
				<div className="flex justify-end">
					<Button size="sm">
						{t("lessonDetail.postComment") || "Post Comment"}
					</Button>
				</div>
			</div>

			{/* Comments List */}
			{sampleComments.length === 0 ? (
				<div className="text-center py-6">
					<p className="text-muted-foreground">
						{t("lessonDetail.noCommentsYet") ||
							"No comments yet. Be the first to comment!"}
					</p>
				</div>
			) : (
				sampleComments.map((comment) => (
					<div
						key={comment.id}
						className="border-b border-border pb-4 last:border-0"
					>
						<div className="flex items-start gap-3">
							<Avatar className="h-8 w-8">
								<AvatarImage
									src={comment.user.avatar || undefined}
									alt={comment.user.name}
								/>
								<AvatarFallback>
									{comment.user.name
										.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 space-y-2">
								<div className="flex items-center gap-2">
									<span className="font-medium text-sm">
										{comment.user.name}
									</span>
									<span className="text-xs text-muted-foreground">
										{formatCommentDate(comment.createdAt)}
									</span>
								</div>
								<p className="text-sm text-muted-foreground">
									{comment.content}
								</p>
								<div className="flex items-center gap-4">
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
									>
										<HeartIcon className="h-3 w-3 mr-1" />
										{comment.likes}
									</Button>
									<Button
										variant="ghost"
										size="sm"
										className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
									>
										<MessageCircle className="h-3 w-3 mr-1" />
										{t("lessonDetail.reply") || "Reply"}
									</Button>
								</div>
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
};
