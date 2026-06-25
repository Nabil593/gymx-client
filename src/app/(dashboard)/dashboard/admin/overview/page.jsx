"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from '@/lib/auth-client';
import { Loader2, Users, Dumbbell, Calendar, User, Mail, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

const AdminOverviewPage = () => {
    const { data: sessionData } = useSession();
    const adminUser = sessionData?.user;

    const [adminData, setAdminData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // 🔄 Fetch Admin Stats
    const fetchAdminStats = useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}/api/admin-overview`);
            const data = await response.json();
            if (data.success) {
                setAdminData(data.stats);
            }
        } catch (error) {
            console.error("Error fetching admin stats:", error);
        } finally {
            setIsLoading(false);
        }
    }, [baseUrl]);

    useEffect(() => {
        if (adminUser?.email) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchAdminStats();
        }
    }, [adminUser?.email, fetchAdminStats]);

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
                <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Admin Control Center</h1>
                <p className="text-xs text-zinc-500 mt-0.5">High-level platform monitoring and data management dashboard.</p>
            </div>

            {/* Visual Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Users */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex items-center justify-between hover:border-zinc-800 transition-colors">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Users</p>
                        <p className="text-2xl font-bold text-zinc-100 tracking-tight">
                            {adminData?.totalUsers || 0}
                        </p>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                        <Users className="h-5 w-5" />
                    </div>
                </div>

                {/* Total Classes */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex items-center justify-between hover:border-zinc-800 transition-colors">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Total Classes</p>
                        <p className="text-2xl font-bold text-zinc-100 tracking-tight">
                            {adminData?.totalClasses || 0}
                        </p>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                        <Dumbbell className="h-5 w-5" />
                    </div>
                </div>

                {/* Total Booked Classes */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex items-center justify-between hover:border-zinc-800 transition-colors">
                    <div className="space-y-1">
                        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Booked Sessions</p>
                        <p className="text-2xl font-bold text-zinc-100 tracking-tight">
                            {adminData?.totalBookedClasses || 0}
                        </p>
                    </div>
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400">
                        <Calendar className="h-5 w-5" />
                    </div>
                </div>
            </div>

            {/* Admin Profile Details */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                <div className="p-5 border-b border-zinc-900">
                    <h3 className="text-sm font-bold text-zinc-100 tracking-tight">Admin Credentials</h3>
                </div>

                <div className="p-5 flex flex-col md:flex-row items-center md:items-start gap-6">
                    {/* Profile Picture */}
                    <div className="h-24 w-24 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 relative shrink-0">
                        <Image
                            src={adminUser?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200"}
                            alt="Admin Profile"
                            fill
                            className="object-cover"
                            unoptimized
                        />
                    </div>

                    {/* Metadata Grid */}
                    <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-3.5 flex items-center gap-3">
                            <User className="h-4 w-4 text-zinc-500" />
                            <div>
                                <p className="text-zinc-500 font-medium">Administrator Name</p>
                                <p className="text-zinc-200 font-semibold mt-0.5">{adminUser?.name || "Nabil"}</p>
                            </div>
                        </div>

                        <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-3.5 flex items-center gap-3">
                            <Mail className="h-4 w-4 text-zinc-500" />
                            <div>
                                <p className="text-zinc-500 font-medium">Secure Email</p>
                                <p className="text-zinc-200 font-semibold mt-0.5">{adminUser?.email || "admin@gymx.com"}</p>
                            </div>
                        </div>

                        <div className="bg-zinc-900/40 border border-zinc-900 rounded-lg p-3.5 flex items-center gap-3">
                            <ShieldAlert className="h-4 w-4 text-rose-500" />
                            <div>
                                <p className="text-zinc-500 font-medium">Security Badge</p>
                                <div className="mt-1">
                                    <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-bold uppercase tracking-wider text-[10px]">
                                        {adminUser?.role || "Admin"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default AdminOverviewPage;