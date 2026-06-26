"use client";

import React, { useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { Loader2, Briefcase, Award, FileText, Send, CheckCircle2 } from 'lucide-react';

const ApplyTrainerPage = () => {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    const [experience, setExperience] = useState('');
    const [specialty, setSpecialty] = useState('');
    const [bio, setBio] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // Form Submit Handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user?.email) return;

        setIsSubmitting(true);
        setErrorMessage('');

        const applicationPayload = {
            name: user.name,
            email: user.email,
            image: user.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
            experience,
            specialty,
            bio
        };

        try {
            const response = await fetch(`${baseUrl}/api/trainer-applications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(applicationPayload)
            });

            const data = await response.json();

            if (data.success) {
                setIsSuccess(true);
            } else {
                setErrorMessage(data.message || "Something went wrong.");
            }
        } catch (error) {
            console.error("Submission error:", error);
            setErrorMessage("Failed to connect to the server. Try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Success State View
    if (isSuccess) {
        return (
            <div className="max-w-xl mx-auto p-6 text-center space-y-4 font-sans select-none h-[50vh] flex flex-col items-center justify-center">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full animate-bounce">
                    <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="space-y-1.5">
                    <h3 className="text-lg font-bold text-zinc-100 tracking-tight">Application Submitted!</h3>
                    <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
                        Your request to become a fitness trainer is now **Pending** review. The management will verify your profile and update your status shortly.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 text-zinc-300 font-sans select-none space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Apply as a Trainer</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Join our professional fitness network and start coaching community members.</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 sm:p-6 space-y-5">

                {/* Read-only Account Info Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2 border-b border-zinc-900 text-xs">
                    <div className="space-y-1">
                        <label className="text-zinc-500 font-medium">Applicant Name</label>
                        <input type="text" value={user?.name || ''} readOnly className="w-full bg-zinc-900/40 border border-zinc-900 text-zinc-400 rounded-lg p-2.5 font-semibold outline-none cursor-not-allowed" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-zinc-500 font-medium">Email Address</label>
                        <input type="text" value={user?.email || ''} readOnly className="w-full bg-zinc-900/40 border border-zinc-900 text-zinc-400 rounded-lg p-2.5 font-semibold outline-none cursor-not-allowed" />
                    </div>
                </div>

                {/* Dynamic Input Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    {/* Years of Experience */}
                    <div className="space-y-1.5">
                        <label className="text-zinc-400 font-medium flex items-center gap-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-zinc-500" /> Experience (Years)
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            max="50"
                            placeholder="e.g. 3"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 rounded-lg p-2.5 outline-none focus:border-zinc-600 transition-colors"
                        />
                    </div>

                    {/* Specialty Selection */}
                    <div className="space-y-1.5">
                        <label className="text-zinc-400 font-medium flex items-center gap-1.5">
                            <Award className="h-3.5 w-3.5 text-zinc-500" /> Core Specialty
                        </label>
                        <select
                            required
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 rounded-lg p-2.5 outline-none focus:border-zinc-600 transition-colors cursor-pointer appearance-none"
                        >
                            <option value="" disabled>Select your specialty</option>
                            <option value="Yoga">Yoga & Flexibility</option>
                            <option value="Weights">Weight & Strength Training</option>
                            <option value="Cardio">Cardio & HIIT</option>
                            <option value="Crossfit">Crossfit & Athletics</option>
                            <option value="Dietetics">Nutrition & Dietetics</option>
                        </select>
                    </div>
                </div>

                {/* Professional Bio */}
                <div className="space-y-1.5 text-xs">
                    <label className="text-zinc-400 font-medium flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5 text-zinc-500" /> Short Biography / Cover Note
                    </label>
                    <textarea
                        required
                        rows="4"
                        maxLength="400"
                        placeholder="Briefly state your training philosophies, certified credentials, or background..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 rounded-lg p-2.5 outline-none focus:border-zinc-600 transition-colors resize-none leading-relaxed"
                    />
                </div>

                {/* Error Banner */}
                {errorMessage && (
                    <p className="text-[11px] text-rose-400 font-medium bg-rose-950/20 border border-rose-900/30 rounded-lg p-2.5">
                        {errorMessage}
                    </p>
                )}

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isSubmitting || !user?.email}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-800 text-black disabled:text-zinc-600 font-semibold text-xs rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Submitting Application...
                            </>
                        ) : (
                            <>
                                <Send className="h-3.5 w-3.5" /> Submit Application
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ApplyTrainerPage;