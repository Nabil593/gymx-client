"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, ShieldCheck, UserCheck, UserX, ShieldAlert, Inbox, Dumbbell } from 'lucide-react';

const ManageUsersPage = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Fetch All Users
    const fetchUsers = useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}/api/admin/users`);
            const data = await response.json();
            if (data.success) {
                setUsers(data.users);
            }
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setIsLoading(false);
        }
    }, [baseUrl]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchUsers();
    }, [fetchUsers]);

    // Handle Block / Unblock Toggle
    const handleToggleBlock = async (id, currentStatus) => {
        setActionLoadingId(id);
        try {
            const response = await fetch(`${baseUrl}/api/admin/users/toggle-block/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentStatus })
            });
            const data = await response.json();
            if (data.success) {
                setUsers(prev => prev.map(user =>
                    user._id === id ? { ...user, status: currentStatus === 'Blocked' ? 'Active' : 'Blocked' } : user
                ));
            }
        } catch (error) {
            console.error("Error toggling block status:", error);
        } finally {
            setActionLoadingId(null);
        }
    };

    // Handle Make Admin
    const handleMakeAdmin = async (id) => {
        setActionLoadingId(id);
        try {
            const response = await fetch(`${baseUrl}/api/admin/users/make-admin/${id}`, {
                method: 'PATCH'
            });
            const data = await response.json();
            if (data.success) {
                setUsers(prev => prev.map(user =>
                    user._id === id ? { ...user, role: 'admin' } : user
                ));
            }
        } catch (error) {
            console.error("Error making admin:", error);
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
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Manage Users</h2>
                <p className="text-xs text-zinc-500 mt-0.5">View registered members, customize security access, or assign administrator roles.</p>
            </div>

            {/* Users Data Table */}
            {users.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500">
                        <Inbox className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-400">No users found</p>
                        <p className="text-xs text-zinc-600 max-w-xs mt-0.5">As soon as members interact with dashboard actions, they will appear here.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-900 bg-zinc-900/20 text-xs font-semibold text-zinc-400 tracking-wider">
                                    <th className="p-4">User Details</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-right">Management Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-zinc-900">
                                {users.map((item) => {
                                    const userRole = item.role?.toLowerCase() || 'user';

                                    return (
                                        <tr key={item._id} className="hover:bg-zinc-900/10 transition-colors">

                                            {/* Name & Email */}
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-zinc-100">{item.name || "Anonymous"}</span>
                                                    <span className="text-[11px] text-zinc-500 mt-0.5">{item.email}</span>
                                                </div>
                                            </td>

                                            {/* Role Badge */}
                                            <td className="p-4">
                                                {userRole === 'admin' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[10px] font-bold uppercase tracking-wide">
                                                        <ShieldCheck className="h-3 w-3" /> Admin
                                                    </span>
                                                ) : userRole === 'trainer' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-wide">
                                                        <Dumbbell className="h-3 w-3" /> Trainer
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-[10px] font-bold uppercase tracking-wide">
                                                        <UserCheck className="h-3 w-3" /> User
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="p-4">
                                                {item.status === 'Blocked' ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] font-medium">
                                                        Blocked
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-medium">
                                                        Active
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="p-4 text-right space-x-2 whitespace-nowrap min-h-[40px]">
                                                {/* অ্যাকশন লোডিং স্টেট হ্যান্ডেল করার জন্য লজিক */}
                                                {actionLoadingId === item._id ? (
                                                    <span className="inline-flex items-center text-zinc-500 text-[11px] pr-4">
                                                        <Loader2 className="h-3 w-3 animate-spin mr-1" /> Updating...
                                                    </span>
                                                ) : (
                                                    <>
                                                        {/* 🚫 BLOCK BUTTON CONDITIONAL RENDERING */}
                                                        {userRole !== 'admin' && (
                                                            <button
                                                                onClick={() => handleToggleBlock(item._id, item.status)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 rounded-lg transition-colors"
                                                            >
                                                                {item.status === 'Blocked' ? 'Unblock' : 'Block'}
                                                            </button>
                                                        )}

                                                        {/* 🛡️ MAKE ADMIN BUTTON CONDITIONAL RENDERING */}
                                                        {userRole !== 'admin' && (
                                                            <button
                                                                onClick={() => handleMakeAdmin(item._id)}
                                                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-black font-semibold rounded-lg transition-colors"
                                                            >
                                                                Make Admin
                                                            </button>
                                                        )}
                                                    </>
                                                )}
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

export default ManageUsersPage;