"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { COURSE_ENDPOINTS } from "@/lib/constants";
import axios from "axios";
import { initiatePayment } from "@/lib/payment";
import { motion } from "framer-motion";
import { useMediaQuery } from "../../../../hooks/use-media-query";

// UI Components
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from "@/components/ui/drawer";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	ArrowLeft,
	Clock as ClockIcon,
	Play,
	Pause,
	Heart as HeartIcon,
	MessageCircle,
	Share2 as Share2Icon,
	ChevronRight,
	ChevronLeft,
	ChevronDown,
	BookOpen,
	Book,
	Lock,
	Check,
	Facebook,
	Instagram,
	Send,
	FileText,
} from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { cn } from "@/lib/utils";

// Define types based on the API response
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

interface Part {
	id: string;
	title: string;
	order: number;
	lessons: Lesson[];
}

interface Course {
	id: string;
	title: string;
	description: string;
	thumbnail: string;
	slug: string;
	parts: Part[];
	tutors: {
		first_name: string;
		last_name: string;
		avatar: string | null;
	}[];
}

// Comment interface for the comments section
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

// Comments section component
const CommentsSection = ({ lesson }: { lesson: Lesson }) => {
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
								<AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
							</Avatar>
							<div className="flex-1">
								<div className="flex items-center justify-between">
									<h4 className="font-medium">{comment.user.name}</h4>
									<span className="text-xs text-muted-foreground">
										{formatCommentDate(comment.createdAt)}
									</span>
								</div>
								<p className="mt-1 text-sm">{comment.content}</p>
								<div className="mt-2 flex items-center gap-4">
									<button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
										<HeartIcon className="h-3.5 w-3.5" />
										<span>{comment.likes}</span>
									</button>
									<button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
										<MessageCircle className="h-3.5 w-3.5" />
										<span>{t("lessonDetail.reply") || "Reply"}</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				))
			)}
		</div>
	);
};

// Share options component
const ShareOptions = ({
	lesson,
	course,
}: {
	lesson: Lesson;
	course: Course;
}) => {
	const { t } = useLanguage();
	const [copied, setCopied] = useState(false);
	const [shareUrl, setShareUrl] = useState("");

	// Set share URL when component mounts
	useEffect(() => {
		if (typeof window !== "undefined") {
			setShareUrl(window.location.href);
		}
	}, []);

	// Copy URL to clipboard
	const copyToClipboard = () => {
		navigator.clipboard.writeText(shareUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	// Generate share URLs for different platforms
	const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
		shareUrl
	)}`;
	const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
		`${
			t("lessonDetail.checkOutLesson") || "Check out this lesson"
		}: ${shareUrl}`
	)}`;
	const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
		shareUrl
	)}&text=${encodeURIComponent(
		`${t("lessonDetail.checkOutLesson") || "Check out this lesson"}`
	)}`;
	// Instagram doesn't support direct URL sharing via web links, so we'll just use a placeholder
	const instagramShareUrl = "https://www.instagram.com";

	return (
		<div className="space-y-6">
			<div className="flex flex-col gap-2">
				<h3 className="text-sm font-medium">
					{t("lessonDetail.shareVia") || "Share via"}
				</h3>
				<div className="flex flex-wrap gap-3">
					<a
						href={facebookShareUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors"
					>
						<Facebook className="h-5 w-5" />
					</a>
					<a
						href={instagramShareUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white hover:opacity-90 transition-opacity"
					>
						<Instagram className="h-5 w-5" />
					</a>
					<a
						href={whatsappShareUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center h-10 w-10 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
							<path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
						</svg>
					</a>
					<a
						href={telegramShareUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
					>
						<Send className="h-5 w-5" />
					</a>
				</div>
			</div>

			<div className="flex flex-col gap-2">
				<h3 className="text-sm font-medium">
					{t("lessonDetail.copyLink") || "Copy link"}
				</h3>
				<div className="flex gap-2">
					<Input value={shareUrl} readOnly className="flex-1" />
					<Button
						onClick={copyToClipboard}
						variant={copied ? "secondary" : "default"}
						className={
							copied ? "bg-green-600 text-white hover:bg-green-700" : ""
						}
					>
						{copied
							? t("lessonDetail.copied") || "Copied!"
							: t("lessonDetail.copy") || "Copy"}
					</Button>
				</div>
			</div>
		</div>
	);
};

export default function LessonPage() {
	const { slug, lessonSlug } = useParams();
	const { t, language } = useLanguage();
	const [lesson, setLesson] = useState<Lesson | null>(null);
	const [course, setCourse] = useState<Course | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isLiked, setIsLiked] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [showShare, setShowShare] = useState(false);
	const [commentText, setCommentText] = useState("");
	const [paymentLoading, setPaymentLoading] = useState(false);

	// Check if the device is mobile
	const isMobile = useMediaQuery("(max-width: 768px)");

	// Render comments UI based on device (modal for desktop, drawer for mobile)
	const renderCommentsUI = () => {
		if (!lesson || !course) return null;

		return isMobile ? (
			<Drawer open={showComments} onOpenChange={setShowComments}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>
							{t("lessonDetail.comments") || "Comments"}
						</DrawerTitle>
						<DrawerDescription>
							{t("lessonDetail.commentsDescription") ||
								"Join the discussion about this lesson."}
						</DrawerDescription>
					</DrawerHeader>
					<div className="px-4 py-2">
						<CommentsSection lesson={lesson} />
					</div>
					<DrawerFooter>
						<div className="flex gap-2">
							<Textarea
								placeholder={
									t("lessonDetail.writeComment") || "Write a comment..."
								}
								value={commentText}
								onChange={(e) => setCommentText(e.target.value)}
								className="min-h-24"
							/>
						</div>
						<Button className="w-full">
							{t("lessonDetail.postComment") || "Post Comment"}
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		) : (
			<Dialog open={showComments} onOpenChange={setShowComments}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>
							{t("lessonDetail.comments") || "Comments"}
						</DialogTitle>
						<DialogDescription>
							{t("lessonDetail.commentsDescription") ||
								"Join the discussion about this lesson."}
						</DialogDescription>
					</DialogHeader>
					<div className="max-h-[350px] overflow-y-auto py-2">
						<CommentsSection lesson={lesson} />
					</div>
					<div className="flex flex-col gap-4 mt-4">
						<Textarea
							placeholder={
								t("lessonDetail.writeComment") || "Write a comment..."
							}
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
							className="min-h-24"
						/>
						<Button className="w-full">
							{t("lessonDetail.postComment") || "Post Comment"}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		);
	};

	// Render share UI based on device (modal for desktop, drawer for mobile)
	const renderShareUI = () => {
		if (!lesson || !course) return null;

		return isMobile ? (
			<Drawer open={showShare} onOpenChange={setShowShare}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>
							{t("lessonDetail.share") || "Share Lesson"}
						</DrawerTitle>
						<DrawerDescription>
							{t("lessonDetail.shareDescription") ||
								"Share this lesson with others."}
						</DrawerDescription>
					</DrawerHeader>
					<div className="px-4 py-2">
						<ShareOptions lesson={lesson} course={course} />
					</div>
				</DrawerContent>
			</Drawer>
		) : (
			<Dialog open={showShare} onOpenChange={setShowShare}>
				<DialogContent className="sm:max-w-[500px]">
					<DialogHeader>
						<DialogTitle>
							{t("lessonDetail.share") || "Share Lesson"}
						</DialogTitle>
						<DialogDescription>
							{t("lessonDetail.shareDescription") ||
								"Share this lesson with others."}
						</DialogDescription>
					</DialogHeader>
					<div className="py-4">
						<ShareOptions lesson={lesson} course={course} />
					</div>
				</DialogContent>
			</Dialog>
		);
	};

	// Format duration (e.g., "00:15:30" to "15m 30s")
	const formatDuration = (duration: string): string => {
		const [hours, minutes, seconds] = duration.split(":").map(Number);

		if (hours > 0) {
			return `${hours}h ${minutes}m`;
		}
		if (minutes > 0) {
			return `${minutes}m ${seconds}s`;
		}
		return `${seconds}s`;
	};

	// Format date based on current language
	const formatDate = (dateString: string): string => {
		const date = new Date(dateString);

		// Map language codes to locales
		const localeMap: Record<string, string> = {
			en: "en-US",
			ru: "ru-RU",
			es: "es-ES",
		};

		const locale = localeMap[language] || "en-US";

		return new Intl.DateTimeFormat(locale, {
			year: "numeric",
			month: "short",
			day: "numeric",
		}).format(date);
	};

	// Handle enrollment/payment for premium content
	const handleEnrollment = async () => {
		if (!course) return;

		try {
			setPaymentLoading(true);
			setError(null);

			// Initiate payment process
			await initiatePayment(course.id);
		} catch (err) {
			console.error("Payment initiation failed:", err);
			setError(
				`${t("lessonDetail.paymentError") || "Payment error"}: ${
					(err as Error).message || String(err)
				}`
			);
		} finally {
			setPaymentLoading(false);
		}
	};

	// Fetch lesson and course details
	useEffect(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);

				// Fetch lesson details
				const lessonResponse = await axios.get<Lesson>(
					`${COURSE_ENDPOINTS.LESSONS}${lessonSlug}/`
				);
				setLesson(lessonResponse.data);

				// Fetch course details
				const courseResponse = await axios.get<Course>(
					`${COURSE_ENDPOINTS.COURSES}${slug}/`
				);
				setCourse(courseResponse.data);
			} catch (err) {
				console.error("Error fetching data:", err);
				setError(
					`${t("lessonDetail.errorFetching")}: ${
						(err as Error).message || String(err)
					}`
				);
			} finally {
				setLoading(false);
			}
		};

		if (lessonSlug && slug) {
			fetchData();
		}
	}, [lessonSlug, slug, t]);

	// Error state
	if (error) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
					<strong className="font-bold">{t("lessonDetail.error")}</strong>
					<span className="block sm:inline"> {error}</span>
				</div>
				<Link
					href={`/courses/${slug}`}
					className="mt-4 text-primary hover:underline"
				>
					{t("lessonDetail.goBack")}
				</Link>
			</div>
		);
	}

	// Loading state
	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
				<h2 className="text-xl font-semibold">{t("lessonDetail.loading")}</h2>
			</div>
		);
	}

	// Lesson or course not found state
	if (!lesson || !course) {
		return (
			<div className="flex flex-col items-center justify-center min-h-screen py-12 px-4">
				<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative max-w-md">
					<strong className="font-bold">{t("lessonDetail.notFound")}</strong>
					<span className="block sm:inline">
						{" "}
						{t("lessonDetail.notFoundMessage")}
					</span>
				</div>
				<Link
					href={`/courses/${slug}`}
					className="mt-4 text-primary hover:underline"
				>
					{t("lessonDetail.goBack")}
				</Link>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex flex-col">
			<Navbar />

			<main className="flex-grow">
				{/* Lesson Header */}
				<section className="bg-muted/30 py-6">
					<div className="container mx-auto px-4">
						<div className="mb-4">
							<Link
								href={`/courses/${slug}`}
								className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
							>
								<ArrowLeft className="h-4 w-4 mr-1" />
								{t("lessonDetail.backToCourse")}
							</Link>
						</div>

						<div className="flex flex-wrap items-center justify-between gap-4">
							<div className="flex items-center gap-3">
								{lesson.is_free_preview ? (
									<Badge
										variant="outline"
										className="bg-green-50 text-green-700 border-green-200"
									>
										{t("lessonDetail.freePreview")}
									</Badge>
								) : (
									<Badge
										variant="outline"
										className="bg-blue-50 text-blue-700 border-blue-200"
									>
										{t("lessonDetail.premium")}
									</Badge>
								)}

								<div className="flex items-center gap-1 text-muted-foreground">
									<ClockIcon className="h-4 w-4" />
									<span>
										{formatDuration(lesson.duration)}{" "}
										{t("lessonDetail.totalLength")}
									</span>
								</div>
							</div>
						</div>

						{/* Lesson metadata */}
						<div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
							<div className="flex items-center gap-1">
								<span>{t("lessonDetail.updated")}:</span>
								<span>{formatDate(lesson.created_at)}</span>
							</div>
						</div>
					</div>
				</section>

				<section className="py-8">
					<div className="container mx-auto px-4">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
							<div className="lg:col-span-4 order-2 lg:order-1">
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.5 }}
								>
									<Card>
										<CardContent className="p-6">
											<h3 className="text-lg font-semibold mb-4">
												{t("lessonDetail.courseNavigation")}
											</h3>
											<p className="text-sm text-muted-foreground mb-4">
												{t("lessonDetail.navigationDescription")}
											</p>
											<Button asChild className="w-full mb-4">
												<Link href={`/courses/${slug}`}>
													{t("lessonDetail.backToCourse")}
												</Link>
											</Button>

											{/* Curriculum List - This would be populated from API */}
											<div className="mt-6 space-y-3">
												<h4 className="font-medium mb-2">
													{t("lessonDetail.curriculum")}
												</h4>

												{/* Sample curriculum items - replace with actual data */}
												<div className="space-y-2">
													{[1, 2, 3, 4, 5].map((item) => (
														<div
															key={item}
															className={`p-3 rounded-md flex items-center justify-between ${
																item === 3
																	? "bg-primary/10 border border-primary/20"
																	: "hover:bg-muted/50"
															}`}
														>
															<div className="flex items-center">
																<div className="mr-3 h-8 w-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
																	{item === 3 ? (
																		<Play className="h-4 w-4 text-primary" />
																	) : item < 3 ? (
																		<div className="h-4 w-4 rounded-full bg-green-500 flex items-center justify-center">
																			<svg
																				className="h-3 w-3 text-white"
																				fill="none"
																				viewBox="0 0 24 24"
																				stroke="currentColor"
																			>
																				<path
																					strokeLinecap="round"
																					strokeLinejoin="round"
																					strokeWidth={2}
																					d="M5 13l4 4L19 7"
																				/>
																			</svg>
																		</div>
																	) : (
																		<Lock className="h-4 w-4 text-muted-foreground" />
																	)}
																</div>
																<div>
																	<p className="text-sm font-medium">
																		Lesson {item}
																	</p>
																	<p className="text-xs text-muted-foreground">
																		15:30
																	</p>
																</div>
															</div>
															{item <= 3 && (
																<Button
																	variant="ghost"
																	size="sm"
																	className="h-8 w-8 p-0"
																>
																	<Play className="h-4 w-4" />
																</Button>
															)}
														</div>
													))}
												</div>
											</div>
										</CardContent>
									</Card>
								</motion.div>
							</div>

							{/* Video Player and Description - Right Side */}
							<div className="lg:col-span-8 order-1 lg:order-2">
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5 }}
								>
									{/* Video Player */}
									<div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
										{lesson.otp ? (
											lesson.is_free_preview ? (
												// Embed video player (this is a placeholder - replace with actual video embed)
												<div className="w-full h-full flex items-center justify-center bg-gray-900">
													<iframe
														src={`https://player.vdocipher.com/v2/?otp=${lesson.otp}&playbackInfo=${lesson.playbackInfo}`}
														style={{
															border: "0",
															width: "100%",
															height: "100%",
														}}
														allow={"encrypted-media"}
														allowFullScreen
													></iframe>
												</div>
											) : (
												// Locked video preview for premium content
												<div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
													<Lock className="h-12 w-12 mb-4 opacity-70" />
													<h3 className="text-xl font-medium">
														{t("lessonDetail.premiumContent")}
													</h3>
													<p className="text-gray-400 mb-4 text-center max-w-md">
														{t("lessonDetail.enrollToUnlock")}
													</p>
													<Button 
														onClick={handleEnrollment}
														disabled={paymentLoading}
													>
														{paymentLoading 
															? t("lessonDetail.processing") || "Processing..."
															: t("lessonDetail.enrollNow") || "Enroll Now"
														}
													</Button>
												</div>
											)
										) : (
											// No video available
											<div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
												<FileText className="h-12 w-12 mb-4 opacity-70" />
												<h3 className="text-xl font-medium">
													{t("lessonDetail.noVideo")}
												</h3>
											</div>
										)}
									</div>
									<div className="flex flex-col gap-4">
										{/* Like Comments and Share buttons */}
										<div className="flex items-center gap-4 mt-6">
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
												<HeartIcon
													className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`}
												/>
												{t("lessonDetail.like") || "Like"}
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
												onClick={() => setShowComments(true)}
											>
												<MessageCircle className="h-4 w-4" />
												{t("lessonDetail.comments") || "Comments"}
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
												onClick={() => setShowShare(true)}
											>
												<Share2Icon className="h-4 w-4" />
												{t("lessonDetail.share") || "Share"}
											</Button>
										</div>

										{/* Lesson Title */}
										<h1 className="text-2xl md:text-3xl font-bold">
											{lesson.title}
										</h1>

										{/* Lesson Description */}
										<div className="prose max-w-none">
											<h2 className="text-lg font-medium mb-2">
												{t("lessonDetail.about")}
											</h2>
											<div className="text-muted-foreground">
												{lesson.description || t("lessonDetail.noDescription")}
											</div>
										</div>
									</div>

									{/* Render Comments and Share UI */}
									{renderCommentsUI()}
									{renderShareUI()}

									{/* Tabs for Discussion and Notes */}
									<div className="mt-8">
										<Tabs defaultValue="discussion">
											<TabsList>
												<TabsTrigger value="discussion">
													{t("lessonDetail.discussion")}
												</TabsTrigger>
												<TabsTrigger value="notes">
													{t("lessonDetail.notes")}
												</TabsTrigger>
											</TabsList>

											<TabsContent value="discussion" className="py-4">
												<div className="text-center py-8">
													<MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
													<h3 className="text-lg font-medium">
														{t("lessonDetail.noComments")}
													</h3>
													<p className="text-muted-foreground mb-4">
														{t("lessonDetail.beFirstComment")}
													</p>
													<Button>{t("lessonDetail.addComment")}</Button>
												</div>
											</TabsContent>

											<TabsContent value="notes" className="py-4">
												<div className="text-center py-8">
													<FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
													<h3 className="text-lg font-medium">
														{t("lessonDetail.noNotes")}
													</h3>
													<p className="text-muted-foreground mb-4">
														{t("lessonDetail.addNoteDescription")}
													</p>
													<Button>{t("lessonDetail.addNote")}</Button>
												</div>
											</TabsContent>
										</Tabs>
									</div>
								</motion.div>
							</div>
						</div>
					</div>
				</section>
			</main>

			<Footer />
		</div>
	);
}
