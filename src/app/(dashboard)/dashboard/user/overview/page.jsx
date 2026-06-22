"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from '@/lib/auth-client';
import { Loader2, Calendar, Heart, User, Mail, Shield, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react';
import Image from 'next/image';

const UserOverviewPage = () => {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    const [overviewData, setOverviewData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const userEmail = user?.email;

    // Fetch Overview Stats & Application Status
    const fetchOverviewData = useCallback(async () => {
        if (!userEmail) return;
        try {
            const response = await fetch(`${baseUrl}/api/user-overview/${userEmail}`);
            const data = await response.json();
            if (data.success) {
                setOverviewData(data);
            }
        } catch (error) {
            console.error("Error fetching user overview data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userEmail, baseUrl]);

    useEffect(() => {
        if (userEmail) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchOverviewData();
        }
    }, [userEmail, fetchOverviewData]);

    // 🛡️ Helper function to render Status Badges
    const renderStatusBadge = (status) => {
        switch (status) {
            case 'Pending':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Clock className="h-3 w-3" /> Pending
                    </span>
                );
            case 'Approved':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="h-3 w-3" /> Approved
                    </span>
                );
            case 'Rejected':
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle className="h-3 w-3" /> Rejected
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                        Not Applied
                    </span>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] w-full flex items-center justify-center bg-black">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 text-zinc-300 font-sans select-none space-y-8">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Welcome Back, {user?.name || 'User'}!</h1>
                <p className="text-xs text-zinc-500 mt-0.5">Here is an overview of your account activity and profile status.</p>
            </div>

            {/* 📊 Visual Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Total Booked Classes Card */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex items-center justify-between hover:border-zinc-800 transition-colors">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Booked Classes</p>
                        <p className="text-2xl font-bold text-zinc-100 tracking-tight">
                            {overviewData?.stats?.totalBookedClasses || 0}
                        </p>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                        <Calendar className="h-5 w-5" />
                    </div>
                </div>

                {/* Total Favorites Card */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex items-center justify-between hover:border-zinc-800 transition-colors">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Favorites</p>
                        <p className="text-2xl font-bold text-zinc-100 tracking-tight">
                            {overviewData?.stats?.totalFavorites || 0}
                        </p>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                        <Heart className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Admin Feedback Notification (If Rejected) */}
            {overviewData?.application?.status === 'Rejected' && overviewData?.application?.feedback && (
                <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-rose-400">Trainer Application Feedback</h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">{overviewData.application.feedback}</p>
                    </div>
                </div>
            )}

            {/* Profile Details & Application Status Section */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-900">
                    <h3 className="text-sm font-bold text-zinc-100 tracking-tight">Profile Details</h3>
                </div>

                <div className="p-5 flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Profile Picture */}
                    <div className="h-24 w-24 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 relative shrink-0">
                        <Image
                            src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"}
                            alt="Profile"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Metadata Grid */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                        <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-3.5 flex items-center gap-3">
                            <User className="h-4 w-4 text-zinc-500" />
                            <div>
                                <p className="text-zinc-500 font-medium">Full Name</p>
                                <p className="text-zinc-200 font-semibold mt-0.5">{user?.name || "N/A"}</p>
                            </div>
                        </div>

                        <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-3.5 flex items-center gap-3">
                            <Mail className="h-4 w-4 text-zinc-500" />
                            <div>
                                <p className="text-zinc-500 font-medium">Email Address</p>
                                <p className="text-zinc-200 font-semibold mt-0.5">{user?.email || "N/A"}</p>
                            </div>
                        </div>

                        <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-3.5 flex items-center gap-3">
                            <Shield className="h-4 w-4 text-zinc-500" />
                            <div>
                                <p className="text-zinc-500 font-medium">Account Role</p>
                                <div className="mt-1">
                                    <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-bold uppercase tracking-wider text-[10px]">
                                        {user?.role || "User"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-3.5 flex items-center gap-3">
                            <AlertCircle className="h-4 w-4 text-zinc-500" />
                            <div>
                                <p className="text-zinc-500 font-medium">Trainer Application</p>
                                <div className="mt-1">
                                    {renderStatusBadge(overviewData?.application?.status)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default UserOverviewPage;