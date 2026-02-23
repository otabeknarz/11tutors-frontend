"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

// UI Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
	Settings,
	Users,
	Eye,
	Bell,
	Shield,
	Trash2,
	Copy,
	Share,
	Download,
	AlertTriangle,
} from "lucide-react";

interface CourseFormData {
	id?: string;
	title: string;
	description: string;
	category: string;
	price: number;
	slug: string;
	thumbnail: File | null;
	thumbnailUrl?: string;
	parts: any[];
	isPublished: boolean;
	createdAt?: string;
	updatedAt?: string;
}

interface CourseSettingsProps {
	courseData: CourseFormData;
	setCourseData: (data: CourseFormData) => void;
}

export default function CourseSettings({
	courseData,
	setCourseData,
}: CourseSettingsProps) {
	const { t } = useLanguage();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [settings, setSettings] = useState({
		isPublic: courseData.isPublished,
		allowPreview: true,
		showInSearch: true,
		maxStudents: 0,
		requireApproval: false,
		allowRefunds: true,
		refundPeriod: 30,
		allowComments: true,
		allowQA: true,
		emailNotifications: true,
		studentNotifications: true,
		enableCoupons: true,
		allowBulkPurchase: false,
		allowDownloads: false,
		watermarkVideos: true,
		preventScreenshots: false,
		enableCertificates: true,
		certificateTemplate: "default",
		enableAnalytics: true,
		allowDataExport: true,
		seoOptimized: true,
	});

	const handleSettingChange = (key: string, value: any) => {
		setSettings((prev) => ({ ...prev, [key]: value }));
	};

	const handleSaveSettings = async () => {
		console.log("Saving settings:", settings);
	};

	const handleDuplicateCourse = () => {
		console.log("Duplicating course:", courseData.id);
	};

	const handleExportCourse = () => {
		console.log("Exporting course:", courseData.id);
	};

	const handleDeleteCourse = () => {
		console.log("Deleting course:", courseData.id);
		setShowDeleteDialog(false);
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-6"
		>
			{/* Header */}
			<div>
				<h2 className="text-2xl font-bold">Course Settings</h2>
				<p className="text-muted-foreground">
					Configure your course visibility, enrollment, and advanced options
				</p>
			</div>

			{/* Visibility Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<Eye className="h-5 w-5 mr-2" />
						Visibility & Access
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Public Course</Label>
							<p className="text-sm text-muted-foreground">
								Make this course visible to all users
							</p>
						</div>
						<Switch
							checked={settings.isPublic}
							onCheckedChange={(checked) =>
								handleSettingChange("isPublic", checked)
							}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Allow Preview</Label>
							<p className="text-sm text-muted-foreground">
								Let users preview some lessons before enrolling
							</p>
						</div>
						<Switch
							checked={settings.allowPreview}
							onCheckedChange={(checked) =>
								handleSettingChange("allowPreview", checked)
							}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Show in Search</Label>
							<p className="text-sm text-muted-foreground">
								Include this course in search results
							</p>
						</div>
						<Switch
							checked={settings.showInSearch}
							onCheckedChange={(checked) =>
								handleSettingChange("showInSearch", checked)
							}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Enrollment Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<Users className="h-5 w-5 mr-2" />
						Enrollment Settings
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="maxStudents">Maximum Students</Label>
							<Input
								id="maxStudents"
								type="number"
								placeholder="0 for unlimited"
								value={settings.maxStudents}
								onChange={(e) =>
									handleSettingChange(
										"maxStudents",
										parseInt(e.target.value) || 0,
									)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="refundPeriod">Refund Period (days)</Label>
							<Input
								id="refundPeriod"
								type="number"
								value={settings.refundPeriod}
								onChange={(e) =>
									handleSettingChange(
										"refundPeriod",
										parseInt(e.target.value) || 30,
									)
								}
							/>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Require Approval</Label>
							<p className="text-sm text-muted-foreground">
								Manually approve each enrollment request
							</p>
						</div>
						<Switch
							checked={settings.requireApproval}
							onCheckedChange={(checked) =>
								handleSettingChange("requireApproval", checked)
							}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Allow Refunds</Label>
							<p className="text-sm text-muted-foreground">
								Enable refund requests from students
							</p>
						</div>
						<Switch
							checked={settings.allowRefunds}
							onCheckedChange={(checked) =>
								handleSettingChange("allowRefunds", checked)
							}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Communication Settings */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<Bell className="h-5 w-5 mr-2" />
						Communication & Notifications
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Allow Comments</Label>
							<p className="text-sm text-muted-foreground">
								Let students comment on lessons
							</p>
						</div>
						<Switch
							checked={settings.allowComments}
							onCheckedChange={(checked) =>
								handleSettingChange("allowComments", checked)
							}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Email Notifications</Label>
							<p className="text-sm text-muted-foreground">
								Send you notifications about course activity
							</p>
						</div>
						<Switch
							checked={settings.emailNotifications}
							onCheckedChange={(checked) =>
								handleSettingChange("emailNotifications", checked)
							}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Student Notifications</Label>
							<p className="text-sm text-muted-foreground">
								Send students notifications about updates
							</p>
						</div>
						<Switch
							checked={settings.studentNotifications}
							onCheckedChange={(checked) =>
								handleSettingChange("studentNotifications", checked)
							}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Content Protection */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<Shield className="h-5 w-5 mr-2" />
						Content Protection
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Allow Downloads</Label>
							<p className="text-sm text-muted-foreground">
								Let students download course materials
							</p>
						</div>
						<Switch
							checked={settings.allowDownloads}
							onCheckedChange={(checked) =>
								handleSettingChange("allowDownloads", checked)
							}
						/>
					</div>
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Watermark Videos</Label>
							<p className="text-sm text-muted-foreground">
								Add watermarks to protect video content
							</p>
						</div>
						<Switch
							checked={settings.watermarkVideos}
							onCheckedChange={(checked) =>
								handleSettingChange("watermarkVideos", checked)
							}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Certificates */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<Badge className="h-5 w-5 mr-2" />
						Certificates
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-6">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Enable Certificates</Label>
							<p className="text-sm text-muted-foreground">
								Award certificates upon course completion
							</p>
						</div>
						<Switch
							checked={settings.enableCertificates}
							onCheckedChange={(checked) =>
								handleSettingChange("enableCertificates", checked)
							}
						/>
					</div>
					{settings.enableCertificates && (
						<div className="space-y-2">
							<Label htmlFor="certificateTemplate">Certificate Template</Label>
							<Select
								value={settings.certificateTemplate}
								onValueChange={(value) =>
									handleSettingChange("certificateTemplate", value)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="default">Default Template</SelectItem>
									<SelectItem value="modern">Modern Template</SelectItem>
									<SelectItem value="classic">Classic Template</SelectItem>
									<SelectItem value="custom">Custom Template</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Course Actions */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center">
						<Settings className="h-5 w-5 mr-2" />
						Course Actions
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Button
							variant="outline"
							onClick={handleDuplicateCourse}
							className="flex items-center justify-center"
						>
							<Copy className="h-4 w-4 mr-2" />
							Duplicate Course
						</Button>
						<Button
							variant="outline"
							onClick={handleExportCourse}
							className="flex items-center justify-center"
						>
							<Download className="h-4 w-4 mr-2" />
							Export Course
						</Button>
						<Button
							variant="outline"
							className="flex items-center justify-center"
						>
							<Share className="h-4 w-4 mr-2" />
							Share Course
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Danger Zone */}
			<Card className="border-destructive">
				<CardHeader>
					<CardTitle className="flex items-center text-destructive">
						<AlertTriangle className="h-5 w-5 mr-2" />
						Danger Zone
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<h4 className="font-medium mb-2">Delete Course</h4>
							<p className="text-sm text-muted-foreground mb-4">
								Permanently delete this course and all its content. This action
								cannot be undone.
							</p>
							<AlertDialog
								open={showDeleteDialog}
								onOpenChange={setShowDeleteDialog}
							>
								<AlertDialogTrigger asChild>
									<Button variant="destructive" size="sm">
										<Trash2 className="h-4 w-4 mr-2" />
										Delete Course
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>
											Are you absolutely sure?
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete
											the course &quot;{courseData.title}&quot; and remove all
											associated data including student progress, comments, and
											analytics.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											onClick={handleDeleteCourse}
											className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
										>
											Delete Course
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Save Settings */}
			<div className="flex justify-end">
				<Button onClick={handleSaveSettings} size="lg">
					Save Settings
				</Button>
			</div>
		</motion.div>
	);
}
