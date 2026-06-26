"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Loader2, Upload } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const router = useRouter();

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl");

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            role: "user" // Default role
        }
    });

    const selectedImage = watch("imageFile");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setApiError("");

        try {
            let imageUrl = "";
            const imageFile = data.imageFile[0];

            if (!imageFile) {
                throw new Error("Please select a profile image.");
            }

            const formData = new FormData();
            formData.append("image", imageFile);

            // Imgbb API Key
            const IMGBB_API_KEY = "d3e4bc27d418ba7d094aa1df32884888";

            const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: "POST",
                body: formData,
            });

            const imgbbData = await imgbbResponse.json();

            if (imgbbData.success) {
                imageUrl = imgbbData.data.display_url; // Imgbb main link
            } else {
                throw new Error("Image upload failed. Please try again.");
            }

            // Better Auth signup 
            const { error } = await authClient.signUp.email({
                email: data.email,
                password: data.password,
                name: data.name,
                image: imageUrl,
                role: data.role
            });

            if (error) throw new Error(error.message);

            router.push(`/login`);
        } catch (err) {
            setApiError(err.message || "Registration failed. Try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Google Sign-In
    const handleGoogleSignIn = async () => {
        try {
            setIsLoading(true);
            await authClient.signIn.social({
                provider: "google",
                callbackURL: callbackUrl || '/',
                additionalParameters: {
                    role: "user"
                }
            });
        } catch (err) {
            setApiError("Google Authentication failed.");
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full min-h-[85vh] flex items-center justify-center bg-black text-zinc-50 px-4 py-12">
            <div className="w-full max-w-[420px] bg-zinc-950 border border-zinc-800 rounded-xl p-6 sm:p-8 shadow-2xl">

                <div className="flex flex-col space-y-1.5 text-center mb-6">
                    <h1 className="text-xl font-extrabold tracking-tight uppercase text-zinc-100">Join GymX Ecosystem</h1>
                    <p className="text-xs text-zinc-400">Create your account with proper role allocation</p>
                </div>

                {apiError && (
                    <div className="mb-4 p-2.5 bg-red-950/40 border border-red-900 rounded text-xs text-red-400 font-medium">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Full Name</label>
                        <input
                            type="text"
                            placeholder="Shariea Reza"
                            className="w-full h-9 bg-black text-xs px-3 rounded border border-zinc-800 focus:border-zinc-700 text-zinc-200 focus:outline-none transition-colors"
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <p className="text-[10px] text-red-400 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Email Address</label>
                        <input
                            type="email"
                            placeholder="shariea@example.com"
                            className="w-full h-9 bg-black text-xs px-3 rounded border border-zinc-800 focus:border-zinc-700 text-zinc-200 focus:outline-none transition-colors"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <p className="text-[10px] text-red-400 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Local Image File Upload Field */}
                    <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Profile Picture</label>
                        <div className="relative w-full h-9 bg-black rounded border border-zinc-800 focus-within:border-zinc-700 flex items-center transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                {...register("imageFile", { required: "Profile image is required" })}
                            />
                            <div className="w-full flex items-center justify-between px-3 text-zinc-400 text-xs pointer-events-none">
                                <span className={`truncate ${selectedImage?.[0] ? 'text-zinc-200 font-medium' : 'text-zinc-500'}`}>
                                    {selectedImage?.[0] ? selectedImage[0].name : "Choose image from device..."}
                                </span>
                                <Upload className="h-3.5 w-3.5 text-zinc-500" />
                            </div>
                        </div>
                        {errors.imageFile && <p className="text-[10px] text-red-400 mt-1">{errors.imageFile.message}</p>}
                    </div>

                    {/* ROLE SELECTOR DROPDOWN */}
                    <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Select Account Role</label>
                        <select
                            className="w-full h-9 bg-black text-xs px-2 rounded border border-zinc-800 focus:border-zinc-700 text-zinc-200 focus:outline-none transition-colors appearance-none cursor-pointer"
                            {...register("role")}
                        >
                            <option value="user">Standard User / Member</option>
                            <option value="trainer">Gym Trainer</option>
                            <option value="admin">System Administrator</option>
                        </select>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1.5 text-left">
                        <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className="w-full h-9 bg-black text-xs pl-3 pr-10 rounded border border-zinc-800 focus:border-zinc-700 text-zinc-200 focus:outline-none transition-colors"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 6, message: "Minimum 6 characters required" },
                                    validate: {
                                        hasUpper: (v) => /[A-Z]/.test(v) || "Requires at least one uppercase letter (A-Z)",
                                        hasLower: (v) => /[a-z]/.test(v) || "Requires at least one lowercase letter (a-z)"
                                    }
                                })}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                            >
                                {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-[10px] text-red-400 leading-tight mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-zinc-50 hover:bg-zinc-200 text-black h-9 rounded text-xs font-bold flex items-center justify-center transition-colors mt-2 cursor-pointer"
                    >
                        {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Complete Account Registration"}
                    </button>
                </form>

                <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-900" /></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-zinc-950 text-zinc-500 px-2">Or</span></div>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    type="button"
                    className="w-full bg-black hover:bg-zinc-900 border border-zinc-800 text-zinc-200 h-9 rounded text-xs font-semibold flex items-center justify-center transition-colors gap-2 cursor-pointer"
                >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google Authentication
                </button>

                <p className="mt-6 text-center text-xs text-zinc-500">
                    Already verified an account?{" "}
                    <Link href="/login" className="text-zinc-300 hover:text-zinc-50 underline font-medium">
                        Log in here
                    </Link>
                </p>
            </div>
        </div>
    );
}