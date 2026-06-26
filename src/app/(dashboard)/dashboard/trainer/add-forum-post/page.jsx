"use client";

import React, { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { Loader2, FilePlus, AlignLeft, Upload, Type, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

const AddForumPostPage = () => {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    const [isLoading, setIsLoading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const IMGBB_API_KEY = "d3e4bc27d418ba7d094aa1df32884888";

    // Local file upload handler in Imgbb
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                setImageUrl(data.data.display_url); // Save Imgbb live link
            } else {
                toast.error("Image upload failed. Please try again.");
            }
        } catch (error) {
            console.error("Imgbb Upload Error:", error);
            toast.error("Error uploading image.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!imageUrl) {
            toast.warning("Please upload a cover image for the post!");
            return;
        }

        setIsLoading(true);

        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;

        const forumPostInfo = {
            title,
            image: imageUrl,
            description,
            authorName: user?.name || "Anonymous Trainer",
            authorEmail: user?.email,
            authorImage: user?.image,
            authorRole: user?.role,
        };

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL;
            const response = await fetch(`${baseUrl}/api/forums`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(forumPostInfo)
            });

            const data = await response.json();
            if (data.success) {
                toast.success("✨ Forum post published successfully!");
                form.reset();
                setImageUrl("");
            }
        } catch (error) {
            console.error("Error adding forum post:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 text-zinc-300 font-sans select-none space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
                    <FilePlus className="h-5 w-5 text-zinc-400" /> Create Forum Post
                </h2>
                <p className="text-xs text-zinc-500">Share your knowledge, fitness tips, or community updates with the GymX members.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 sm:p-6 space-y-5">

                {/* Title */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                        <Type className="h-3.5 w-3.5" /> Post Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        required
                        placeholder="e.g., 5 Essential Diet Tips for Faster Muscle Recovery"
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600"
                    />
                </div>

                {/* Local File Image Upload (Imgbb) */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                        <Upload className="h-3.5 w-3.5" /> Upload Cover Image
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-zinc-400 file:mr-4 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-zinc-800 file:text-zinc-200 hover:file:bg-zinc-700 cursor-pointer focus:outline-none"
                        />
                        {uploadingImage && (
                            <div className="absolute right-3 top-2.5">
                                <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                            </div>
                        )}
                    </div>
                    {imageUrl && <p className="text-[10px] text-emerald-500 font-medium truncate">✔ Image uploaded successfully!</p>}
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                        <AlignLeft className="h-3.5 w-3.5" /> Post Content
                    </label>
                    <textarea
                        name="description"
                        rows="6"
                        required
                        placeholder="Deep dive into your topic. Share actionable insights, formatting with proper paragraphs..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600 resize-none"
                    ></textarea>
                </div>

                {/* Author Preview Badge (Optional - adds a beautiful premium look) */}
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-3 flex items-center justify-between text-[11px] text-zinc-500">
                    <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-zinc-400" /> Publishing as:
                    </span>
                    <span className="font-medium text-zinc-400">{user?.name || "Verified Trainer"} ({user?.email || "trainer@gymx.com"})</span>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isLoading || uploadingImage}
                    className="w-full bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-600 font-bold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Publishing Post...
                        </>
                    ) : (
                        "Publish Post"
                    )}
                </button>

            </form>
        </div>
    );
};

export default AddForumPostPage;