"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

const ClassDetailsPage = () => {
    const { id } = useParams();
    const router = useRouter();

    const { data: sessionData, isPending } = useSession();
    const user = sessionData?.user;

    const userEmail = user?.email;
    const userRole = user?.role || 'user';

    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isBooked, setIsBooked] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchAllData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5000/api/classes/${id}`);
                const data = await res.json();
                if (data) setClassData(data.classData || data);

                if (userEmail) {
                    const bookingRes = await fetch(`http://localhost:5000/api/check-booked?email=${encodeURIComponent(userEmail)}&classId=${id}`);
                    const bookingData = await bookingRes.json();
                    setIsBooked(!!(bookingData.isBooked || bookingData.hasBooked));

                    const favRes = await fetch(`http://localhost:5000/api/check-favorite?email=${encodeURIComponent(userEmail)}&classId=${id}`);
                    const favData = await favRes.json();
                    setIsFavorite(!!favData.isFav);
                }
            } catch (error) {
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!isPending) fetchAllData();
    }, [id, userEmail, isPending]);

    const handleBooking = () => {
        if (isBooked) {
            alert("You have already booked this class");
            return;
        }
        router.push(`/payment?classId=${id}&price=${classData?.price}`);
    };

    const handleFavorite = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/favorites`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: userEmail,
                    role: userRole,
                    classId: id,
                    className: classData?.className,
                    image: classData?.image,
                    price: classData?.price
                })
            });
            const data = await res.json();
            if (data.success) {
                setIsFavorite(true);
                alert("Successfully added to your favorites!");
            } else {
                alert(data.message || "Failed to add to favorites");
            }
        } catch (error) {
            alert("Something went wrong. Please check your backend API.");
        }
    };

    if (isPending || loading) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!classData) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-[#a1a1aa]">
                <p>Class details not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-[#fafafa] py-12 px-4 font-sans antialiased">
            <div className="max-w-4xl mx-auto">
                <div className="mb-6">
                    <button
                        onClick={() => router.push('/classes')}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#18181b] hover:bg-[#27272a] text-[#a1a1aa] hover:text-[#f4f4f5] text-xs font-medium rounded-lg border border-[#27272a] transition-all duration-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        Back to Classes
                    </button>
                </div>

                <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-2xl">
                    <div className="h-64 md:h-96 w-full relative">
                        <img src={classData.image} alt={classData.className} className="w-full h-full object-cover opacity-90" />
                        <span className="absolute top-4 right-4 bg-[#09090b]/80 border border-[#27272a] text-xs font-medium px-3 py-1 rounded-md backdrop-blur-md">
                            {classData.category}
                        </span>
                    </div>

                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-1">{classData.className}</h1>
                                <p className="text-sm text-emerald-500">
                                    Guided by <span className="font-semibold text-emerald-400">{classData.trainerName}</span>
                                </p>
                            </div>
                            <div className="text-right bg-[#27272a] px-4 py-2 rounded-lg border border-[#3f3f46]">
                                <p className="text-[10px] text-[#52525b] uppercase font-bold">Price</p>
                                <p className="text-xl font-bold text-white">${classData.price}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#09090b] p-4 rounded-lg border border-[#27272a] mb-6 text-sm text-[#a1a1aa]">
                            <div><span className="text-white font-medium">Duration:</span> {classData.duration}</div>
                            <div><span className="text-white font-medium">Level:</span> {classData.difficultyLevel || "All Levels"}</div>
                            <div className="md:col-span-2">
                                <span className="text-white font-medium">Schedule:</span>{" "}
                                {classData.classSchedule && typeof classData.classSchedule === 'object' ?
                                    `${classData.classSchedule.days || ''} (${classData.classSchedule.time || ''})`
                                    : classData.classSchedule || "Flexible"}
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-white mb-2">Program Overview</h3>
                        <p className="text-[#a1a1aa] text-sm leading-relaxed mb-8">{classData.description}</p>

                        {userRole === 'user' ? (
                            <div className="flex flex-col sm:flex-row gap-4 border-t border-[#27272a] pt-6">
                                <button
                                    onClick={handleBooking}
                                    disabled={isBooked}
                                    className={`flex-1 text-center py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${isBooked ? 'bg-[#27272a] border border-[#3f3f46] text-[#71717a] cursor-not-allowed' : 'bg-[#fafafa] hover:bg-[#e4e4e7] text-[#09090b]'}`}
                                >
                                    {isBooked ? 'Already Booked' : 'Book Now'}
                                </button>
                                <button
                                    onClick={handleFavorite}
                                    disabled={isFavorite}
                                    className={`px-6 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${isFavorite ? 'bg-[#09090b] border-[#27272a] text-emerald-500 cursor-not-allowed' : 'bg-[#27272a] border border-[#3f3f46] hover:border-[#52525b] text-[#e4e4e7]'}`}
                                >
                                    {isFavorite ? '✓ Saved to Favorites' : 'Add to Favorites'}
                                </button>
                            </div>
                        ) : (
                            <div className="mt-6 p-4 bg-[#27272a]/40 border border-[#3f3f46] text-[#a1a1aa] text-xs rounded-lg text-center backdrop-blur-sm">
                                Booking and Favorite features are exclusively available for trainees. You are logged in as an <span className="text-emerald-400 font-semibold capitalize">{userRole}</span>.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClassDetailsPage;