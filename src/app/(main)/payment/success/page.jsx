"use client";

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const SuccessContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState('processing');
    const effectRan = useRef(false);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        if (effectRan.current) return;

        const transactionId = searchParams.get('session_id');
        const classId = searchParams.get('classId');

        // Decoding to safely handle special characters (such as <?> or spaces)
        const className = searchParams.get('className') ? decodeURIComponent(searchParams.get('className')) : '';
        const trainerName = searchParams.get('trainerName') ? decodeURIComponent(searchParams.get('trainerName')) : '';
        const trainerEmail = searchParams.get('trainerEmail') ? decodeURIComponent(searchParams.get('trainerEmail')) : '';

        const price = searchParams.get('price');
        const userEmail = searchParams.get('userEmail');

        if (transactionId && classId) {
            effectRan.current = true;

            const bookingInfo = {
                classId,
                className,
                trainerName,
                trainerEmail: trainerEmail || "",
                price: parseFloat(price) || 0,
                userEmail: userEmail || "anonymous@gymx.com",
                transactionId,
                bookingDate: new Date().toISOString(),
                classSchedule: {
                    day: searchParams.get('day') || "Flexible Day",
                    time: searchParams.get('time') || "Standard Time"
                }
            };

            axios.post(`${baseUrl}/api/bookings/confirm`, bookingInfo)
                .then(res => {
                    if (res.data.success) {
                        setStatus('success');
                        setTimeout(() => {
                            router.push('/dashboard/user/booked-classes');
                        }, 3000);
                    } else {
                        console.error("Backend validation failed:", res.data);
                        setStatus('error');
                        effectRan.current = false;
                    }
                })
                .catch(err => {
                    console.error("Booking verification API error:", err.response?.data || err.message);
                    setStatus('error');
                    effectRan.current = false;
                });
        }
    }, [searchParams, baseUrl, router]);

    if (status === 'processing') {
        return (
            <div className="text-center space-y-3">
                <Loader2 className="h-10 w-10 animate-spin text-zinc-500 mx-auto" />
                <h2 className="text-lg font-medium text-zinc-200">Verifying Payment...</h2>
                <p className="text-xs text-zinc-500">Please do not close or refresh this page.</p>
            </div>
        );
    }

    if (status === 'error') {
        return (
            <div className="text-center space-y-3 max-w-sm">
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
                <h2 className="text-lg font-semibold text-zinc-200">Verification Failed</h2>
                <p className="text-xs text-zinc-500">Payment was secured by Stripe, but database updates failed. Please check backend logs.</p>
                <button onClick={() => router.push('/classes')} className="mt-4 px-4 py-2 bg-zinc-900 border border-zinc-800 text-xs rounded-lg text-zinc-300">
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 mx-auto animate-bounce" />
            <h2 className="text-2xl font-bold text-zinc-100">Payment Successful!</h2>
            <p className="text-xs text-zinc-400">Your seat has been reserved. Redirecting to your dashboard...</p>
        </div>
    );
};

const PaymentSuccessPage = () => {
    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex items-center justify-center px-4">
            <Suspense fallback={<Loader2 className="h-6 w-6 animate-spin" />}>
                <SuccessContent />
            </Suspense>
        </div>
    );
};

export default PaymentSuccessPage;