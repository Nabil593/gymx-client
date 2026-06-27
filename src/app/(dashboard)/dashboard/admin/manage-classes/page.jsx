"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, CheckCircle2, XCircle, Trash2, Inbox, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

const ManageClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // Fetch All Classes submitted by trainers
    const fetchClasses = useCallback(async () => {
        const sessionToken = await authClient.token();
        const token = sessionToken?.data?.token;
        try {
            const response = await fetch(`${baseUrl}/api/admin/classes`, {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (data.success) {
                setClasses(data.classes);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setIsLoading(false);
        }
    }, [baseUrl]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchClasses();
    }, [fetchClasses]);

    // Handle Approve Class
    const handleApproveClass = async (id) => {
        const sessionToken = await authClient.token();
        const token = sessionToken?.data?.token;
        setActionLoadingId(id);
        try {
            const response = await fetch(`${baseUrl}/api/admin/classes/approve/${id}`, {
                method: 'PATCH',
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (data.success) {
                setClasses(prev => prev.map(cls => cls._id === id ? { ...cls, status: 'Approved' } : cls));
                toast.success("Class approved successfully!"); // এখানে টোস্ট
            }
        } catch (error) {
            toast.error("Failed to approve class.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Handle Reject Class
    const handleRejectClass = async (id) => {
        const sessionToken = await authClient.token();
        const token = sessionToken?.data?.token;
        setActionLoadingId(id);
        try {
            const response = await fetch(`${baseUrl}/api/admin/classes/reject/${id}`, {
                method: 'PATCH',
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (data.success) {
                setClasses(prev => prev.map(cls => cls._id === id ? { ...cls, status: 'Rejected' } : cls));
                toast.info("Class has been rejected.");
            }
        } catch (error) {
            toast.error("Error rejecting the class.");
        } finally {
            setActionLoadingId(null);
        }
    };

    // Handle Delete Class
    const handleDeleteClass = async (id) => {
        const sessionToken = await authClient.token();
        const token = sessionToken?.data?.token;
        setActionLoadingId(id);
        try {
            const response = await fetch(`${baseUrl}/api/admin/classes/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (data.success) {
                setClasses(prev => prev.filter(cls => cls._id !== id));
                toast.success("Class deleted permanently!"); // সাকসেস মেসেজ
            }
        } catch (error) {
            toast.error("Failed to delete the class.");
        } finally {
            setActionLoadingId(null);
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
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Manage Classes</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Review fitness classes submitted by trainers, authorize bookings, or remove schedules.</p>
            </div>

            {/* 📊 Classes Table Grid */}
            {classes.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500">
                        <Inbox className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-400">No classes submitted yet</p>
                        <p className="text-xs text-zinc-600 max-w-xs mt-0.5">When trainers create new schedule requests, they will show up here for moderation.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-900 bg-zinc-900/20 text-xs font-semibold text-zinc-400 tracking-wider">
                                    <th className="p-4">Class Details</th>
                                    <th className="p-4">Trainer</th>
                                    <th className="p-4">Schedule</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Moderation Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-zinc-900">
                                {classes.map((cls) => {
                                    const currentStatus = cls.status || 'Pending';

                                    return (
                                        <tr key={cls._id} className="hover:bg-zinc-900/10 transition-colors">

                                            {/* Class Info */}
                                            <td className="p-4 max-w-[220px]">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-zinc-100 truncate">{cls.className || cls.title}</span>
                                                    <span className="text-[11px] text-zinc-500 mt-0.5 truncate">{cls.duration || "N/A"} • ${cls.price || 0}</span>
                                                </div>
                                            </td>

                                            {/* Trainer Email / Name */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 text-zinc-400">
                                                    <User className="h-3 w-3 text-zinc-600" />
                                                    <span className="truncate max-w-[150px]">{cls.trainerEmail || cls.email}</span>
                                                </div>
                                            </td>

                                            {/* Day & Time slot */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-1 text-zinc-400">
                                                    <Calendar className="h-3 w-3 text-zinc-600" />
                                                    <span>{cls.day || cls.slot || "Weekday"}</span>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td className="p-4">
                                                {currentStatus === 'Approved' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-wide">
                                                        Approved
                                                    </span>
                                                ) : currentStatus === 'Rejected' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[10px] font-bold uppercase tracking-wide">
                                                        Rejected
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] font-bold uppercase tracking-wide">
                                                        Pending
                                                    </span>
                                                )}
                                            </td>

                                            {/* Admin Actions */}
                                            <td className="p-4 text-right space-x-2 whitespace-nowrap">

                                                {/* Approve (Only show if not already Approved) */}
                                                {currentStatus !== 'Approved' && (
                                                    <button
                                                        disabled={actionLoadingId === cls._id}
                                                        onClick={() => handleApproveClass(cls._id)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <CheckCircle2 className="h-3 w-3" /> Approve
                                                    </button>
                                                )}

                                                {/* Reject (Only show if Pending) */}
                                                {currentStatus === 'Pending' && (
                                                    <button
                                                        disabled={actionLoadingId === cls._id}
                                                        onClick={() => handleRejectClass(cls._id)}
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold rounded-lg transition-colors disabled:opacity-50"
                                                    >
                                                        <XCircle className="h-3 w-3" /> Reject
                                                    </button>
                                                )}

                                                {/* Delete Button (Always Available) */}
                                                <button
                                                    disabled={actionLoadingId === cls._id}
                                                    onClick={() => handleDeleteClass(cls._id)}
                                                    className="inline-flex items-center justify-center p-1.5 bg-zinc-900 hover:bg-rose-950/20 border border-zinc-800 hover:border-rose-900/50 text-zinc-500 hover:text-rose-400 rounded-lg transition-colors disabled:opacity-50"
                                                    title="Delete Class Permanently"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageClassesPage;