"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, Eye, X, Check, AlertCircle, Inbox, Clock, Award, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const AppliedTrainerPage = () => {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [feedback, setFeedback] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    // Fetch Pending Applications
    const fetchApplications = useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}/api/admin/trainer-applications/pending`);
            const data = await response.json();
            if (data.success) {
                setApplications(data.applications);
            }
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            setIsLoading(false);
        }
    }, [baseUrl]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchApplications();
    }, [fetchApplications]);

    // ⚡ Handle Approve
    const handleApprove = async () => {
        if (!selectedApp) return;
        setIsActionLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/admin/trainer-applications/approve/${selectedApp._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: selectedApp.email, feedback })
            });
            const data = await response.json();
            if (data.success) {
                setApplications(prev => prev.filter(app => app._id !== selectedApp._id));
                closeModal();
            }
        } catch (error) {
            console.error("Error approving trainer:", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    // Handle Reject
    const handleReject = async () => {
        if (!selectedApp) return;
        if (!feedback.trim()) {
            toast.warning("Please provide feedback for rejection.");
            return;
        }
        setIsActionLoading(true);
        try {
            const response = await fetch(`${baseUrl}/api/admin/trainer-applications/reject/${selectedApp._id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ feedback })
            });
            const data = await response.json();
            if (data.success) {
                setApplications(prev => prev.filter(app => app._id !== selectedApp._id));
                closeModal();
            }
        } catch (error) {
            console.error("Error rejecting trainer:", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    const closeModal = () => {
        setSelectedApp(null);
        setFeedback("");
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
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Trainer Applications</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Review and manage professional trainer onboarding applications.</p>
            </div>

            {/* 📊 Applications Table */}
            {applications.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500">
                        <Inbox className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-400">All caught up!</p>
                        <p className="text-xs text-zinc-600 max-w-xs mt-0.5">There are no pending trainer applications to review at this moment.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-900 bg-zinc-900/20 text-xs font-semibold text-zinc-400 tracking-wider">
                                    <th className="p-4">Applicant</th>
                                    <th className="p-4">Specialty</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-zinc-900">
                                {applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-zinc-900/10 transition-colors">
                                        <td className="p-4">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-zinc-100">{app.name}</span>
                                                <span className="text-[11px] text-zinc-500 mt-0.5">{app.email}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-zinc-300 font-medium">{app.specialty || "General Fitness"}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] font-medium">
                                                Pending Review
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => setSelectedApp(app)}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold rounded-lg transition-colors"
                                            >
                                                <Eye className="h-3.5 w-3.5" /> Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Beautiful Custom Review Modal */}
            {selectedApp && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in-50 zoom-in-95 duration-150">

                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-900/30">
                            <div>
                                <h3 className="text-sm font-bold text-zinc-100">Review Application</h3>
                                <p className="text-[11px] text-zinc-500 mt-0.5">Submitted by {selectedApp.name}</p>
                            </div>
                            <button onClick={closeModal} className="p-1 hover:bg-zinc-900 border border-transparent hover:border-zinc-800 rounded-lg text-zinc-500 hover:text-zinc-300 transition-all">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-5 space-y-4 overflow-y-auto max-h-[65vh]">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 gap-2.5">
                                <div className="flex items-start gap-2.5 p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg">
                                    <Award className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Experience</p>
                                        <p className="text-xs text-zinc-300 font-medium mt-0.5">{selectedApp.experience || "Not specified"} years of experience</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5 p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg">
                                    <Sparkles className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Specialty</p>
                                        <p className="text-xs text-zinc-300 font-medium mt-0.5">{selectedApp.specialty || "General Fitness"}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-2.5 p-3 bg-zinc-900/40 border border-zinc-900 rounded-lg">
                                    <Clock className="h-4 w-4 text-zinc-500 mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide">Available Time</p>
                                        <p className="text-xs text-zinc-300 font-medium mt-0.5">{selectedApp.time || "Flexible"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Feedback Input */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1">
                                    Admin Feedback <span className="text-zinc-600 font-normal">(Required for rejection)</span>
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Write constructional feedback, instructions, or rejection reasons here..."
                                    rows={3}
                                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-zinc-700 rounded-lg p-2.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none resize-none transition-colors"
                                />
                            </div>
                        </div>

                        {/* Modal Footer Actions */}
                        <div className="p-4 border-t border-zinc-900 bg-zinc-900/10 flex items-center justify-end gap-2">
                            <button
                                disabled={isActionLoading}
                                onClick={handleReject}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-rose-950/20 border border-zinc-800 hover:border-rose-900/50 text-zinc-400 hover:text-rose-400 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                            >
                                <AlertCircle className="h-3.5 w-3.5" /> Reject
                            </button>
                            <button
                                disabled={isActionLoading}
                                onClick={handleApprove}
                                className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isActionLoading ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Check className="h-3.5 w-3.5" />
                                )}
                                Approve Applicant
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default AppliedTrainerPage;