"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useSession } from '@/lib/auth-client';
import { Loader2, Calendar, User, Eye, Inbox, Clock } from 'lucide-react';
import { toast } from 'sonner';

const BookedClassesPage = () => {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const userEmail = user?.email;

    // Fetch Booked Classes
    const fetchBookedClasses = useCallback(async () => {
        if (!userEmail) return;
        try {
            const response = await fetch(`${baseUrl}/api/my-bookings/${userEmail}`);
            const data = await response.json();
            if (data.success) {
                setBookings(data.bookings);
            }
        } catch (error) {
            console.error("Error fetching booked classes:", error);
        } finally {
            setIsLoading(false);
        }
    }, [userEmail, baseUrl]);

    useEffect(() => {
        if (userEmail) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            fetchBookedClasses();
        }
    }, [userEmail, fetchBookedClasses]);

    // View Details Click Handler
    const handleViewDetails = (booking) => {

        const className = booking.bookedClassName || booking.className || "Unnamed Class";
        const trainer = booking.trainerName || 'N/A';

        toast.success(`Class: ${className}\nTrainer: ${trainer}\nStatus: Paid & Confirmed`);
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
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">Booked Classes</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Review all gym sessions and schedules you have successfully registered for.</p>
            </div>

            {/* Bookings Table / Grid */}
            {bookings.length === 0 ? (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-12 flex flex-col items-center justify-center text-center space-y-3">
                    <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-500">
                        <Inbox className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-zinc-400">No classes booked yet</p>
                        <p className="text-xs text-zinc-600 max-w-xs mt-0.5">Explore our available fitness classes and book your first slot to get started.</p>
                    </div>
                </div>
            ) : (
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-zinc-900 bg-zinc-900/20 text-xs font-semibold text-zinc-400 tracking-wider">
                                    <th className="p-4">Class Name</th>
                                    <th className="p-4">Trainer</th>
                                    <th className="p-4">Schedule / Day</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-xs divide-y divide-zinc-900">
                                {bookings.map((booking) => (
                                    <tr key={booking._id} className="hover:bg-zinc-900/10 transition-colors">
                                        {/* Class Name */}
                                        <td className="p-4 font-semibold text-zinc-100">
                                            {booking.className || "Unnamed Class"}
                                        </td>

                                        {/* Trainer Name */}
                                        <td className="p-4 text-zinc-400">
                                            <div className="flex items-center gap-1.5">
                                                <User className="h-3.5 w-3.5 text-zinc-600" />
                                                <span>{booking.trainerName || "Assigned Trainer"}</span>
                                            </div>
                                        </td>

                                        {/* Schedule */}
                                        <td className="p-4 text-zinc-400">
                                            <div className="flex flex-col gap-0.5">
                                                <span className="flex items-center gap-1 text-zinc-300 font-medium">
                                                    <Calendar className="h-3 w-3 text-zinc-500" />
                                                    {/* চেক করা হচ্ছে ডাটা আছে কিনা */}
                                                    {booking.classSchedule?.days ? booking.classSchedule.days[0] :
                                                        booking.classSchedule?.day ? booking.classSchedule.day : "Flexible Day"}
                                                </span>
                                                <span className="flex items-center gap-1 text-zinc-500 text-[10px]">
                                                    <Clock className="h-2.5 w-2.5" />
                                                    {booking.classSchedule?.time || "Standard Time"}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Actions Button */}
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => handleViewDetails(booking)}
                                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-zinc-300 font-medium rounded-lg transition-colors"
                                            >
                                                <Eye className="h-3 w-3" /> View Details
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

export default BookedClassesPage;