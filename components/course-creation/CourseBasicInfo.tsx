"use client";

import React, { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import {
	Image as ImageIcon,
	Upload,
	X,
	DollarSign,
	BookOpen,
	FileText,
	Tag,
} from "lucide-react";

interface Category {
	id: string;
	name: string;
	slug: string;
}

interface CourseBasicInfoProps {
	title: string;
	description: string;
	category: string;
	price: number;
	thumbnail: File | null;
	thumbnailUrl?: string;
	categories: Category[];
	onUpdate: (field: string, value: any) => void;
}

export default function CourseBasicInfo({
	title,
	description,
	category,
	price,
	thumbnail,
	thumbnailUrl,
	categories,
	onUpdate,
}: CourseBasicInfoProps) {
	const { t } = useLanguage();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
		thumbnailUrl || null
	);

	// Update preview when thumbnailUrl changes (e.g., when editing existing course)
	useEffect(() => {
		if (thumbnailUrl && !thumbnail) {
			setThumbnailPreview(thumbnailUrl);
		}
	}, [thumbnailUrl, thumbnail]);

	const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				return;
			}

			// Validate file size (max 5MB)
			if (file.size > 5 * 1024 * 1024) {
				return;
			}

			const previewUrl = URL.createObjectURL(file);
			setThumbnailPreview(previewUrl);
			onUpdate("thumbnail", file);
		}
	};

	const removeThumbnail = () => {
		if (thumbnailPreview && thumbnail) {
			URL.revokeObjectURL(thumbnailPreview);
		}
		setThumbnailPreview(null);
		onUpdate("thumbnail", null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<div className="space-y-6">
			{/* Course Title */}
			<div className="space-y-2">
				<Label htmlFor="title" className="flex items-center gap-2">
					<BookOpen className="h-4 w-4" />
					Course Title *
				</Label>
				<Input
					id="title"
					placeholder="Enter course title..."
					value={title}
					onChange={(e) => onUpdate("title", e.target.value)}
					className="text-lg"
				/>
			</div>

			{/* Course Description */}
			<div className="space-y-2">
				<Label htmlFor="description" className="flex items-center gap-2">
					<FileText className="h-4 w-4" />
					Course Description *
				</Label>
				<Textarea
					id="description"
					placeholder="Describe your course..."
					value={description}
					onChange={(e) => onUpdate("description", e.target.value)}
					rows={6}
				/>
			</div>

			{/* Category and Price */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{/* Category */}
				<div className="space-y-2">
					<Label className="flex items-center gap-2">
						<Tag className="h-4 w-4" />
						Category *
					</Label>
					<Select
						value={category}
						onValueChange={(value) => onUpdate("category", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="Select a category" />
						</SelectTrigger>
						<SelectContent>
							{categories.map((cat) => (
								<SelectItem key={cat.id} value={cat.id}>
									{cat.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Price */}
				<div className="space-y-2">
					<Label htmlFor="price" className="flex items-center gap-2">
						<DollarSign className="h-4 w-4" />
						Price (USD) *
					</Label>
					<Input
						id="price"
						type="number"
						min="0"
						step="0.01"
						placeholder="0.00"
						value={price || ""}
						onChange={(e) =>
							onUpdate("price", parseFloat(e.target.value) || 0)
						}
					/>
					<p className="text-xs text-muted-foreground">
						Set to 0 for a free course
					</p>
				</div>
			</div>

			{/* Thumbnail Upload */}
			<div className="space-y-2">
				<Label className="flex items-center gap-2">
					<ImageIcon className="h-4 w-4" />
					Course Thumbnail *
				</Label>

				{thumbnailPreview ? (
					<Card>
						<CardContent className="p-4">
							<div className="relative">
								<img
									src={thumbnailPreview}
									alt="Course thumbnail"
									className="w-full h-48 object-cover rounded-lg"
								/>
								<Button
									variant="destructive"
									size="sm"
									className="absolute top-2 right-2"
									onClick={removeThumbnail}
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardContent className="p-6">
							<div
								className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
								onClick={() => fileInputRef.current?.click()}
							>
								<ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
								<div className="space-y-2">
									<p className="text-sm font-medium">
										Upload course thumbnail
									</p>
									<p className="text-xs text-muted-foreground">
										Recommended: 1280x720px, JPG or PNG (Max 5MB)
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
									Choose Image
								</Button>
							</div>
						</CardContent>
					</Card>
				)}

				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					className="hidden"
					onChange={handleThumbnailChange}
				/>
			</div>
		</div>
	);
}
