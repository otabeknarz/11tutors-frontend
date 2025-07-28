"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, FileText } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { initiatePayment } from "@/lib/payment";

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

interface VideoPlayerProps {
	lesson: Lesson;
	courseId: string;
	isEnrolled?: boolean;
}

export const VideoPlayer = ({
	lesson,
	courseId,
	isEnrolled = false,
}: VideoPlayerProps) => {
	const { t } = useLanguage();
	const [paymentLoading, setPaymentLoading] = useState(false);

	const handleEnrollment = async () => {
		try {
			setPaymentLoading(true);
			await initiatePayment(courseId);
		} catch (error) {
			console.error("Payment failed:", error);
		} finally {
			setPaymentLoading(false);
		}
	};

	return (
		<div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-6">
			{lesson.otp ? (
				lesson.is_free_preview || isEnrolled ? (
					// Free preview or enrolled user - show VdoCipher iframe
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
							title={lesson.title}
						/>
					</div>
				) : (
					// Premium content - requires enrollment
					<div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
						<div className="text-center">
							<div className="h-16 w-16 mx-auto mb-4 rounded-full bg-primary flex items-center justify-center">
								<Play className="h-8 w-8 text-primary-foreground" />
							</div>
							<h3 className="text-xl font-medium mb-2">
								{t("lessonDetail.premiumContent")}
							</h3>
							<p className="text-gray-300 mb-4">
								{t("lessonDetail.enrollToWatch")}
							</p>
							<Button
								onClick={handleEnrollment}
								disabled={paymentLoading}
								className="bg-primary text-primary-foreground hover:bg-primary/90"
							>
								{paymentLoading
									? t("lessonDetail.processing") || "Processing..."
									: t("lessonDetail.enrollNow") || "Enroll Now"}
							</Button>
						</div>
					</div>
				)
			) : (
				// No video available
				<div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white">
					<FileText className="h-12 w-12 mb-4 opacity-70" />
					<h3 className="text-xl font-medium">{t("lessonDetail.noVideo")}</h3>
				</div>
			)}
		</div>
	);
};
