"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";
import { API_BASE_URL } from "@/lib/constants";

// UI Components
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
	Upload,
	Video,
	X,
	Play,
	CheckCircle,
	AlertCircle,
	Clock,
	FileVideo,
	Loader2,
} from "lucide-react";

interface LessonData {
	id?: string;
	title: string;
	description: string;
	videoFile: File | null;
	videoServiceId: string | null;
	duration: number;
	order: number;
	isFreePreview: boolean;
	uploadProgress: number;
	uploadStatus: "idle" | "uploading" | "completed" | "error";
}

interface VideoUploaderProps {
	lesson: LessonData;
	onVideoUpload: (videoData: Partial<LessonData>) => void;
}

export default function VideoUploader({
	lesson,
	onVideoUpload,
}: VideoUploaderProps) {
	const { t } = useLanguage();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const videoPreviewRef = useRef<HTMLVideoElement>(null);

	const [dragActive, setDragActive] = useState(false);
	const [videoPreview, setVideoPreview] = useState<string | null>(null);
	const [videoDuration, setVideoDuration] = useState<number>(0);
	const [uploadError, setUploadError] = useState<string | null>(null);
	const [selectedFile, setSelectedFile] = useState<File | null>(
		lesson.videoFile
	);

	// Sync selectedFile with lesson.videoFile prop
	useEffect(() => {
		if (lesson.videoFile && !selectedFile) {
			setSelectedFile(lesson.videoFile);
		}
	}, [lesson.videoFile, selectedFile]);

	// Handle file selection
	const handleVideoSelect = useCallback(
		(file: File) => {
			if (!file.type.startsWith("video/")) {
				setUploadError("Please select a valid video file");
				return;
			}

			// Check file size (max 1GB for VdoCipher)
			const maxSize = 1024 * 1024 * 1024; // 1GB
			if (file.size > maxSize) {
				setUploadError("Video file size must be less than 1GB");
				return;
			}

			setUploadError(null);

			// Set local state immediately
			setSelectedFile(file);

			// Create video preview
			const videoUrl = URL.createObjectURL(file);
			setVideoPreview(videoUrl);

			// Update lesson with video file
			onVideoUpload({
				videoFile: file,
				uploadStatus: "idle",
			});

			// Get video duration
			const video = document.createElement("video");
			video.preload = "metadata";
			video.onloadedmetadata = () => {
				const duration = Math.round(video.duration);
				setVideoDuration(duration);
				onVideoUpload({ duration });
				URL.revokeObjectURL(video.src);
			};
			video.src = videoUrl;
		},
		[onVideoUpload]
	);

	// Handle drag and drop
	const handleDrag = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") {
			setDragActive(true);
		} else if (e.type === "dragleave") {
			setDragActive(false);
		}
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			e.stopPropagation();
			setDragActive(false);

			if (e.dataTransfer.files && e.dataTransfer.files[0]) {
				handleVideoSelect(e.dataTransfer.files[0]);
			}
		},
		[handleVideoSelect]
	);

	// Upload to VdoCipher via Django backend
	const uploadToVdoCipher = async () => {
		const videoFile = selectedFile || lesson.videoFile;
		
		if (!videoFile) {
			console.error("No video file selected", { selectedFile, lessonVideoFile: lesson.videoFile });
			return;
		}

		console.log("Starting VdoCipher upload for:", lesson.title, "File:", videoFile.name);
		onVideoUpload({ uploadStatus: "uploading", uploadProgress: 0 });
		setUploadError(null);

		try {
			// Step 1: Get upload credentials from Django backend
			const token =
				typeof window !== "undefined"
					? localStorage.getItem("accessToken")
					: null;
			
			console.log("Requesting upload credentials from backend...");
			const credentialsResponse = await fetch(
				`${API_BASE_URL}/api/courses/vdocipher/upload-credentials/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({
						title: lesson.title || "Untitled Lesson",
						folderId: "root",
					}),
				}
			);

			if (!credentialsResponse.ok) {
				const errorData = await credentialsResponse.text();
				console.error("Failed to get credentials:", errorData);
				throw new Error(`Failed to get upload credentials: ${errorData}`);
			}

			const credentials = await credentialsResponse.json();
			console.log("Received upload credentials:", credentials);

			// Step 2: Upload video directly to VdoCipher using the credentials
			const payload = credentials.clientPayload || credentials;
			const uploadUrl = payload.uploadLink || credentials.uploadLink || credentials.uploadUrl;
			
			console.log("Upload URL:", uploadUrl);
			
			if (!uploadUrl) {
				throw new Error("Upload URL not found in credentials");
			}
			
			const formData = new FormData();
			formData.append("policy", payload.policy);
			formData.append("key", payload.key);
			formData.append("x-amz-signature", payload["x-amz-signature"]);
			formData.append("x-amz-algorithm", payload["x-amz-algorithm"]);
			formData.append("x-amz-date", payload["x-amz-date"]);
			formData.append("x-amz-credential", payload["x-amz-credential"]);
			formData.append("success_action_status", "201");
			formData.append("success_action_redirect", "");
			formData.append("file", videoFile);

			// Upload with progress tracking
			const xhr = new XMLHttpRequest();

			xhr.upload.addEventListener("progress", (event) => {
				if (event.lengthComputable) {
					const progress = Math.round((event.loaded / event.total) * 100);
					onVideoUpload({ uploadProgress: progress });
				}
			});

			xhr.addEventListener("load", () => {
				console.log("Upload response status:", xhr.status);
				
				if (xhr.status === 201 || xhr.status === 200) {
					try {
						const parser = new DOMParser();
						const xmlDoc = parser.parseFromString(xhr.responseText, "text/xml");
						const videoId = xmlDoc.getElementsByTagName("Key")[0]?.textContent;

						const finalVideoId = credentials.videoId || videoId;

						if (finalVideoId) {
							console.log("Video upload successful! Video ID:", finalVideoId);
							onVideoUpload({
								uploadStatus: "completed",
								uploadProgress: 100,
								videoServiceId: finalVideoId,
							});
						} else {
							throw new Error("Failed to get video ID from response");
						}
					} catch (parseError) {
						console.error("Parse error:", parseError);
						if (credentials.videoId) {
							onVideoUpload({
								uploadStatus: "completed",
								uploadProgress: 100,
								videoServiceId: credentials.videoId,
							});
						} else {
							throw new Error("No video ID available");
						}
					}
				} else {
					console.error("Upload failed. Status:", xhr.status);
					throw new Error(`Upload failed with status: ${xhr.status}. ${xhr.responseText}`);
				}
			});

			xhr.addEventListener("error", () => {
				throw new Error("Upload failed due to network error");
			});

			console.log("Starting upload to VdoCipher...");
			xhr.open("POST", uploadUrl);
			xhr.send(formData);
		} catch (error) {
			console.error("Upload error:", error);
			setUploadError(error instanceof Error ? error.message : "Upload failed");
			onVideoUpload({ uploadStatus: "error", uploadProgress: 0 });
		}
	};

	// Remove video
	const removeVideo = () => {
		if (videoPreview) {
			URL.revokeObjectURL(videoPreview);
			setVideoPreview(null);
		}
		setVideoDuration(0);
		setUploadError(null);
		setSelectedFile(null);
		onVideoUpload({
			videoFile: null,
			videoServiceId: null,
			duration: 0,
			uploadStatus: "idle",
			uploadProgress: 0,
		});

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const formatDuration = (seconds: number) => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const secs = seconds % 60;

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, "0")}:${secs
				.toString()
				.padStart(2, "0")}`;
		}
		return `${minutes}:${secs.toString().padStart(2, "0")}`;
	};

	const formatFileSize = (bytes: number) => {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
	};

	const getStatusIcon = () => {
		switch (lesson.uploadStatus) {
			case "uploading":
				return <Loader2 className="h-4 w-4 animate-spin" />;
			case "completed":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "error":
				return <AlertCircle className="h-4 w-4 text-red-500" />;
			default:
				return <Video className="h-4 w-4" />;
		}
	};

	const getStatusText = () => {
		switch (lesson.uploadStatus) {
			case "uploading":
				return `Uploading... ${lesson.uploadProgress}%`;
			case "completed":
				return "Upload Complete";
			case "error":
				return "Upload Failed";
			default:
				return "Ready to Upload";
		}
	};

	return (
		<div className="space-y-4">
			<Label className="text-sm font-medium">Video Content *</Label>

			{/* Video Upload Area */}
			{!selectedFile && !lesson.videoFile ? (
				<Card>
					<CardContent className="p-6">
						<div
							className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
								dragActive
									? "border-primary bg-primary/5"
									: "border-muted-foreground/25 hover:border-muted-foreground/50"
							}`}
							onDragEnter={handleDrag}
							onDragLeave={handleDrag}
							onDragOver={handleDrag}
							onDrop={handleDrop}
							onClick={() => fileInputRef.current?.click()}
						>
							<FileVideo className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
							<div className="space-y-2">
								<p className="text-sm font-medium">Upload lesson video</p>
								<p className="text-xs text-muted-foreground">
									Drag and drop a video file, or click to browse
								</p>
								<p className="text-xs text-muted-foreground">
									Supported formats: MP4, MOV, AVI, WebM (Max 1GB)
								</p>
							</div>
							<Button
								variant="outline"
								className="mt-4"
								onClick={(e) => {
									e.stopPropagation();
									fileInputRef.current?.click();
								}}
							>
								<Upload className="h-4 w-4 mr-2" />
								Choose Video File
							</Button>
						</div>

						<input
							ref={fileInputRef}
							type="file"
							accept="video/*"
							className="hidden"
							onChange={(e) => {
								if (e.target.files && e.target.files[0]) {
									handleVideoSelect(e.target.files[0]);
								}
							}}
						/>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardContent className="p-6">
						<div className="space-y-4">
							{/* Video Preview */}
							{videoPreview && (
								<div className="relative">
									<video
										ref={videoPreviewRef}
										src={videoPreview}
										className="w-full h-48 object-cover rounded-lg bg-black"
										controls
									/>
								</div>
							)}

							{/* Video Info */}
							<div className="flex items-center justify-between">
								<div className="flex items-center space-x-3">
									{getStatusIcon()}
									<div>
										<p className="font-medium">
											{(selectedFile || lesson.videoFile)?.name}
										</p>
										<div className="flex items-center space-x-3 text-sm text-muted-foreground">
											<span>
												{formatFileSize(
													(selectedFile || lesson.videoFile)?.size || 0
												)}
											</span>
											{videoDuration > 0 && (
												<span>
													<Clock className="h-3 w-3 inline mr-1" />
													{formatDuration(videoDuration)}
												</span>
											)}
											<Badge variant="outline" className="text-xs">
												{getStatusText()}
											</Badge>
										</div>
									</div>
								</div>

								<Button
									variant="ghost"
									size="sm"
									onClick={removeVideo}
									disabled={lesson.uploadStatus === "uploading"}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>

							{/* Upload Progress */}
							{lesson.uploadStatus === "uploading" && (
								<div className="space-y-2">
									<Progress value={lesson.uploadProgress} className="w-full" />
									<p className="text-sm text-muted-foreground text-center">
										Uploading to VdoCipher... {lesson.uploadProgress}%
									</p>
								</div>
							)}

							{/* Error Message */}
							{uploadError && (
								<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
									<div className="flex items-center space-x-2">
										<AlertCircle className="h-4 w-4 text-red-500" />
										<p className="text-sm text-red-700">{uploadError}</p>
									</div>
								</div>
							)}

							{/* Upload Button */}
							{(lesson.uploadStatus === "idle" || !lesson.uploadStatus) && (selectedFile || lesson.videoFile) && !lesson.videoServiceId && (
								<div className="space-y-2">
									<Button
										onClick={uploadToVdoCipher}
										className="w-full"
										disabled={!lesson.title}
										variant={lesson.title ? "default" : "outline"}
									>
										<Upload className="h-4 w-4 mr-2" />
										{lesson.title ? "Upload to VdoCipher" : "Add Title to Upload"}
									</Button>
									{!lesson.title && (
										<p className="text-xs text-center text-muted-foreground">
											Lesson title is required before uploading
										</p>
									)}
								</div>
							)}

							{/* Re-upload Button */}
							{lesson.uploadStatus === "error" && (
								<Button
									onClick={uploadToVdoCipher}
									variant="outline"
									className="w-full"
								>
									<Upload className="h-4 w-4 mr-2" />
									Retry Upload
								</Button>
							)}

							{/* Success State */}
							{lesson.uploadStatus === "completed" && (
								<div className="p-3 bg-green-50 border border-green-200 rounded-lg">
									<div className="flex items-center space-x-2">
										<CheckCircle className="h-4 w-4 text-green-500" />
										<div>
											<p className="text-sm text-green-700 font-medium">
												Video uploaded successfully!
											</p>
											{lesson.videoServiceId && (
												<p className="text-xs text-green-600">
													Video ID: {lesson.videoServiceId}
												</p>
											)}
										</div>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
