"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, Inbox, CreditCard, Calendar, Mail, Hash, Copy, Check } from 'lucide-react';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Fetch Transactions from Backend
    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${baseUrl}/api/admin/transactions`);
            const data = await response.json();
            if (data.success) {
                setTransactions(data.transactions);
            }
        } catch (error) {
            console.error("Error fetching transactions:", error);
        } finally {
            setIsLoading(false);
        }
    }, [baseUrl]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchTransactions();
    }, [fetchTransactions]);

    // 📋 Handle Copy Transaction ID to Clipboard
    const handleCopy = (id) => {
        navigator.clipboard.writeText(id);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
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
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Payment Transactions</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Read-only ledger of all Stripe payment histories and successful premium bookings.</p>
            </div>

            {/* Transactions Table Grid */}
            {transactions.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500">
                        <CreditCard className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-400">No transactions recorded</p>
                        <p className="text-xs text-zinc-600 max-w-xs mt-0.5">When users complete booking checkout processes via Stripe, ledger details will appear here.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-900 bg-zinc-900/20 text-xs font-semibold text-zinc-400 tracking-wider">
                                    <th className="p-4"><span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-zinc-500" /> User Email</span></th>
                                    <th className="p-4"><span className="flex items-center gap-1.5"><CreditCard className="h-3.5 w-3.5 text-zinc-500" /> Amount</span></th>
                                    <th className="p-4"><span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-zinc-500" /> Date</span></th>
                                    <th className="p-4"><span className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5 text-zinc-500" /> Transaction ID</span></th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-zinc-900">
                                {transactions.map((tx) => {
                                    const txId = tx.transactionId || tx.txId || "N/A";
                                    const rawDate = tx.date || tx.createdAt;
                                    const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    }) : "N/A";

                                    return (
                                        <tr key={tx._id} className="hover:bg-zinc-900/10 transition-colors">

                                            {/* User Email */}
                                            <td className="p-4 font-medium text-zinc-200">
                                                {tx.userEmail || tx.email || "anonymous@user.com"}
                                            </td>

                                            {/* Amount */}
                                            <td className="p-4 font-semibold text-emerald-400">
                                                ${tx.price || tx.amount || 0}
                                            </td>

                                            {/* Date */}
                                            <td className="p-4 text-zinc-400">
                                                {formattedDate}
                                            </td>

                                            {/* Transaction ID with Copy Action */}
                                            <td className="p-4 font-mono text-[11px] text-zinc-500">
                                                <div className="flex items-center gap-2">
                                                    <span className="tracking-wide text-zinc-400 bg-zinc-900/50 border border-zinc-900 px-2 py-1 rounded">
                                                        {txId}
                                                    </span>
                                                    <button
                                                        onClick={() => handleCopy(txId)}
                                                        className="p-1 hover:bg-zinc-900 rounded text-zinc-500 hover:text-zinc-300 transition-colors"
                                                        title="Copy Transaction ID"
                                                    >
                                                        {copiedId === txId ? (
                                                            <Check className="h-3 w-3 text-emerald-400" />
                                                        ) : (
                                                            <Copy className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                </div>
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

export default TransactionsPage;