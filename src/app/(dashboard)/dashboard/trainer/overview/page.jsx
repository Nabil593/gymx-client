"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { Dumbbell, Users, Mail, UserCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';

const TrainerOverviewPage = () => {
    const { data: sessionData, isPending: isAuthPending } = useSession();
    const user = sessionData?.user;

    const [stats, setStats] = useState({ totalClasses: 0, totalStudents: 0 });
    const [isStatsLoading, setIsStatsLoading] = useState(true);

    useEffect(() => {
        const fetchTrainerStats = async () => {
            if (!user?.email) return;

            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

                const response = await fetch(`${baseUrl}/api/trainer-stats/${user.email}`);
                const data = await response.json();
                if (data.success) {
                    setStats(data.stats);
                }
            } catch (error) {
                console.error("Error fetching trainer stats:", error);
            } finally {
                setIsStatsLoading(false);
            }
        };

        if (user) {
            fetchTrainerStats();
        }
    }, [user]);

    // loading spinner
    if (isAuthPending || isStatsLoading) {
        return (
            <div className="h-[60vh] w-full flex items-center justify-center bg-black">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6 text-zinc-300 font-sans select-none">

            {/* Header section */}
            <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Trainer Dashboard Overview</h2>
                <p className="text-xs text-zinc-500">Monitor your classes, track active students, and review your statistics.</p>
            </div>

            {/* 👤 Profile Details Section */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left w-full">

                    {/* Profile Image with Fallback */}
                    <div className="relative h-16 w-16 shrink-0">
                        <Image
                            className="rounded-full object-cover border border-zinc-800"
                            src={user?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=60"}
                            alt={user?.name || "Trainer Name"}
                            fill
                            sizes="64px"
                            priority
                        />
                    </div>

                    {/* Profile Meta */}
                    <div className="space-y-1 min-w-0">
                        <h3 className="text-base font-bold text-zinc-100 truncate">{user?.name}</h3>
                        <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-zinc-400">
                            <Mail className="h-3.5 w-3.5 text-zinc-500" />
                            <span className="truncate">{user?.email}</span>
                        </div>
                    </div>
                </div>

                {/* 🛡️ Trainer Badge */}
                <div className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg shrink-0">
                    <UserCheck className="h-3.5 w-3.5 text-zinc-400" />
                    <span className="text-[10px] font-black tracking-widest uppercase text-zinc-200">
                        Trainer
                    </span>
                </div>
            </div>

            {/* 📊 Visual Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Visual Card 1: Total Classes Created */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 flex items-center justify-between group hover:border-zinc-800 transition-colors duration-200">
                    <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Classes Created</p>
                        <p className="text-3xl font-extrabold text-zinc-100 tracking-tight">{stats.totalClasses}</p>
                    </div>
                    <div className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-zinc-100 transition-colors">
                        <Dumbbell className="h-5 w-5" />
                    </div>
                </div>

                {/* Visual Card 2: Total Students Enrolled */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 flex items-center justify-between group hover:border-zinc-800 transition-colors duration-200">
                    <div className="space-y-2">
                        <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Total Students Enrolled</p>
                        <p className="text-3xl font-extrabold text-zinc-100 tracking-tight">{stats.totalStudents}</p>
                    </div>
                    <div className="h-10 w-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center text-zinc-400 group-hover:text-zinc-100 transition-colors">
                        <Users className="h-5 w-5" />
                    </div>
                </div>

            </div>

        </div>
    );
};

export default TrainerOverviewPage;