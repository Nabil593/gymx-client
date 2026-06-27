"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, UserMinus, ShieldAlert, Inbox, Mail, Star } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

const ManageTrainersPage = () => {
    const [trainers, setTrainers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoadingEmail, setActionLoadingEmail] = useState(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // Fetch All Active Trainers
    const fetchTrainers = useCallback(async () => {
        const sessionToken = await authClient.token();
        const token = sessionToken?.data?.token;
        try {
            const response = await fetch(`${baseUrl}/api/admin/trainers`, {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (data.success) {
                setTrainers(data.trainers);
            }
        } catch (error) {
            console.error("Error fetching trainers:", error);
        } finally {
            setIsLoading(false);
        }
    }, [baseUrl]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTrainers();
    }, [fetchTrainers]);

    // Handle Demote Trainer
    const handleDemote = async (email, name) => {
        const sessionToken = await authClient.token();
        const token = sessionToken?.data?.token;
        const confirmDemote = toast.success(`Demote from ${name || 'this trainer'}?`);
        if (!confirmDemote) return;

        setActionLoadingEmail(email);
        try {
            const response = await fetch(`${baseUrl}/api/admin/trainers/demote/${email}`, {
                method: 'PATCH',
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();

            if (data.success) {
                setTrainers(prev => prev.filter(trainer => trainer.email !== email));
            } else {
                toast.error(data.message || "Failed to demote trainer.");
            }
        } catch (error) {
            toast.error("Something went wrong. Try again.");
        } finally {
            setActionLoadingEmail(null);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[50vh] w-full flex items-center justify-center bg-black">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 text-zinc-300 font-sans select-none space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Active Trainers</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Monitor and manage certified trainers who currently hold active coaching privileges.</p>
            </div>

            {/* 📊 Active Trainers Table */}
            {trainers.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500">
                        <Inbox className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-400">No active trainers</p>
                        <p className="text-xs text-zinc-600 max-w-xs mt-0.5">There are no coaches registered on the platform yet. Approved applicant profiles will appear here.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-900 bg-zinc-900/20 text-xs font-semibold text-zinc-400 tracking-wider">
                                    <th className="p-4">Trainer Info</th>
                                    <th className="p-4">Secure Contact</th>
                                    <th className="p-4">Role Designation</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-zinc-900">
                                {trainers.map((trainer) => (
                                    <tr key={trainer._id} className="hover:bg-zinc-900/10 transition-colors">

                                        {/* Name & Identity */}
                                        <td className="p-4 font-semibold text-zinc-100">
                                            {trainer.name || "Active Coach"}
                                        </td>

                                        {/* Email */}
                                        <td className="p-4 text-zinc-400">
                                            <div className="flex items-center gap-1.5 text-zinc-400">
                                                <Mail className="h-3.5 w-3.5 text-zinc-600" />
                                                <span>{trainer.email}</span>
                                            </div>
                                        </td>

                                        {/* Status / Badge */}
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                                                <Star className="h-2.5 w-2.5 fill-emerald-400/20" /> Certified Trainer
                                            </span>
                                        </td>

                                        {/* Action Button */}
                                        <td className="p-4 text-right">
                                            <button
                                                disabled={actionLoadingEmail === trainer.email}
                                                onClick={() => handleDemote(trainer.email, trainer.name)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-rose-950/20 border border-zinc-800 hover:border-rose-900/50 text-zinc-400 hover:text-rose-400 font-semibold rounded-lg transition-colors disabled:opacity-50"
                                            >
                                                <UserMinus className="h-3.5 w-3.5" />
                                                {actionLoadingEmail === trainer.email ? "Demoting..." : "Demote to User"}
                                            </button>
                                        </td>

                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ManageTrainersPage;