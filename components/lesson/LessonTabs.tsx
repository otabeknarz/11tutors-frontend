"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, FileText } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export const LessonTabs = () => {
	const { t } = useLanguage();

	return (
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
	);
};
