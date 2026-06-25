"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ShieldCheck, Dumbbell, User, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { authClient } from "@/lib/auth-client";

const PaymentContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const classId = searchParams.get('classId');

    const [selectedClass, setSelectedClass] = useState(null);
    const [loading, setLoading] = useState(true);
    const [redirecting, setRedirecting] = useState(false);
    const [error, setError] = useState('');

    const { data: session, isPending } = authClient.useSession();
    const currentUserEmail = session?.user?.email;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    useEffect(() => {
        if (!classId) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setError('No class selected for booking.');
            setLoading(false);
            return;
        }

        axios.get(`${baseUrl}/api/classes/${classId}`)
            .then(res => {
                const rawData = res.data;
                if (rawData && rawData._id) {
                    setSelectedClass(rawData.classData || rawData);
                } else {
                    setError('Class data not found.');
                }
                setLoading(false);
            })
            .catch(err => {
                setError('Failed to load class details.');
                setLoading(false);
            });
    }, [classId, baseUrl]);

    // Function to redirect to Stripe Hosted Pages
    const handleStripeRedirect = async () => {
        setRedirecting(true);
        setError('');
        try {
            const emailToSend = currentUserEmail || "trainee@gymx.com";

            if (!selectedClass?.price) {
                setError("Class price is missing.");
                setRedirecting(false);
                return;
            }

            const response = await axios.post(`${baseUrl}/api/payments/create-checkout-session`, {
                classData: {
                    ...selectedClass,
                    classSchedule: selectedClass.classSchedule || { day: "Flexible Day", time: "Standard Time" }
                },
                userEmail: emailToSend
            });

            if (response.data?.id) {
                window.location.href = response.data.id;
            }
        } catch (err) {
            setError(`Stripe Error: ${err.response?.data?.error || err.message}`);
            setRedirecting(false);
        }
    };

    if (loading || isPending) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] gap-2">
                <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                <p className="text-xs text-zinc-500">Preparing secure checkout...</p>
            </div>
        );
    }

    if (error || !selectedClass) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-4">
                <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
                <p className="text-xs text-zinc-500 mt-1">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-md w-full border border-zinc-900 bg-zinc-950/40 p-6 rounded-2xl backdrop-blur-md text-center">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
                <ShieldCheck className="h-3 w-3" /> Official Stripe Gateway
            </span>
            <h2 className="text-xl font-bold tracking-tight text-zinc-100">Order Summary</h2>
            <p className="text-xs text-zinc-500 mt-1">You will be redirected to Stripe to complete the transaction safely.</p>

            <div className="mt-6 p-4 bg-zinc-900/30 border border-zinc-900 rounded-xl text-left space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Class:</span>
                    <span className="text-zinc-200 font-medium">{selectedClass.className}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-zinc-500">Trainer:</span>
                    <span className="text-zinc-200 font-medium">{selectedClass.trainerName}</span>
                </div>
                <div className="border-t border-zinc-900 pt-3 flex justify-between items-baseline">
                    <span className="text-sm text-zinc-400">Total</span>
                    <span className="text-xl font-extrabold text-white">${parseFloat(selectedClass.price).toFixed(2)}</span>
                </div>
            </div>

            <button
                onClick={handleStripeRedirect}
                disabled={redirecting}
                className="w-full mt-6 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-black font-semibold text-sm rounded-lg transition-all disabled:opacity-50"
            >
                {redirecting ? (
                    <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Redirecting to Stripe...
                    </>
                ) : (
                    <>
                        Proceed to Payment <ArrowRight className="h-4 w-4" />
                    </>
                )}
            </button>
        </div>
    );
};

const PaymentPage = () => {
    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex items-center justify-center py-20 px-4">
            <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin" />}>
                <PaymentContent />
            </Suspense>
        </div>
    );
};

export default PaymentPage;