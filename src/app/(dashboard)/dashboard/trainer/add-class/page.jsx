"use client";

import React, { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { Loader2, PlusCircle, AlignLeft, DollarSign, Clock, Layers, Award, Upload, Type, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const AddClassPage = () => {
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
                toast.error("Image upload failed. Try again.");
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
            toast.warning("Please upload a class image first!");
            return;
        }

        setIsLoading(true);

        const form = e.target;
        const className = form.className.value;
        const category = form.category.value;
        const difficulty = form.difficulty.value;
        const duration = form.duration.value;
        const days = form.days.value;
        const time = form.time.value;
        const price = parseFloat(form.price.value);
        const description = form.description.value;

        const classInfo = {
            className,
            image: imageUrl,
            category,
            difficultyLevel: difficulty,
            duration,
            classSchedule: {
                days: days.split(',').map(day => day.trim()),
                time
            },
            price,
            description,
            trainerName: user?.name || "Anonymous Trainer",
            trainerEmail: user?.email,
            trainerImage: user?.image
        };

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
            const response = await fetch(`${baseUrl}/api/classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(classInfo)
            });

            const data = await response.json();
            if (data.success) {
                toast.success("✨ Class submitted successfully! Waiting for Admin approval.");
                form.reset();
                setImageUrl("");
            }
        } catch (error) {
            console.error("Error adding class:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 text-zinc-300 font-sans select-none space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
                    <PlusCircle className="h-5 w-5 text-zinc-400" /> Add New Class
                </h2>
                <p className="text-xs text-zinc-500">Design a new fitness program. Newly created classes will remain pending until admin review.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 sm:p-6 space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Class Name */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5"><Type className="h-3.5 w-3.5" /> Class Name</label>
                        <input type="text" name="className" required placeholder="e.g., Elite Yoga & Mindfulness"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600" />
                    </div>

                    {/* Local File Image Upload (Imgbb) */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5">
                            <Upload className="h-3.5 w-3.5" /> Upload Class Image
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

                    {/* Category */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5"><Layers className="h-3.5 w-3.5" /> Category</label>
                        <select name="category" required className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700">
                            <option value="Yoga">Yoga</option>
                            <option value="Cardio">Cardio</option>
                            <option value="Weights">Weights & Strength</option>
                            <option value="Zumba">Zumba & Dance</option>
                            <option value="CrossFit">CrossFit</option>
                        </select>
                    </div>

                    {/* Difficulty Level */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5"><Award className="h-3.5 w-3.5" /> Difficulty Level</label>
                        <select name="difficulty" required className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700">
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    {/* Duration */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Duration</label>
                        <input type="text" name="duration" required placeholder="e.g., 60 Mins or 4 Weeks"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600" />
                    </div>

                    {/* Price */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /> Price ($)</label>
                        <input type="number" name="price" step="0.01" required placeholder="e.g., 49.99"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600" />
                    </div>

                    {/* Schedule: Days */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Class Days</label>
                        <input type="text" name="days" required placeholder="e.g., Sat, Mon, Wed"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600" />
                    </div>

                    {/* Schedule: Time */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Class Time</label>
                        <input type="text" name="time" required placeholder="e.g., 08:00 AM - 09:30 AM"
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600" />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-400 flex items-center gap-1.5"><AlignLeft className="h-3.5 w-3.5" /> Description</label>
                    <textarea name="description" rows="4" required placeholder="Write a detailed overview of the training session objectives, requirements..."
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-zinc-700 placeholder:text-zinc-600 resize-none"></textarea>
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={isLoading || uploadingImage}
                    className="w-full bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-600 font-bold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2">
                    {isLoading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" /> Submitting Class...
                        </>
                    ) : (
                        "Create Class"
                    )}
                </button>

            </form>
        </div>
    );
};

export default AddClassPage;