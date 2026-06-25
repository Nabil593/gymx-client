"use client";

import React, { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import { Loader2, Edit3, Trash2, Users, X, Layers, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

const MyClassesPage = () => {
    const { data: sessionData } = useSession();
    const user = sessionData?.user;

    const [classes, setClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modals State
    const [activeStudents, setActiveStudents] = useState(null); // stores array of students for modal
    const [editingClass, setEditingClass] = useState(null); // stores class object for edit modal
    const [isUpdating, setIsUpdating] = useState(false);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    // Class load function
    const fetchMyClasses = async () => {
        if (!user?.email) return;
        try {
            const response = await fetch(`${baseUrl}/api/my-classes/${user.email}`);
            const data = await response.json();
            if (data.success) setClasses(data.classes);
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchMyClasses = async () => {

            if (!user?.email) return;

            try {
                const response = await fetch(`${baseUrl}/api/my-classes/${user.email}`);
                const data = await response.json();
                if (data.success) setClasses(data.classes);
            } catch (error) {
                console.error("Error fetching classes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMyClasses();
    }, [user?.email, baseUrl]);

    // Class Delete handler
    const handleDelete = async (id) => {
        const confirmDelete = toast.success("Deleted this class");
        if (!confirmDelete) return;

        try {
            const response = await fetch(`${baseUrl}/api/classes/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (data.success) {
                toast.success("Class deleted successfully.");
                setClasses(classes.filter(c => c._id !== id));
            }
        } catch (error) {
            console.error("Error deleting class:", error);
        }
    };

    // Student viewing handler
    const handleViewStudents = async (className) => {
        try {
            const response = await fetch(`${baseUrl}/api/class-students/${encodeURIComponent(className)}`);
            const data = await response.json();
            if (data.success) {
                setActiveStudents(data.students);
            }
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    // Class Update Submit Handler
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        const form = e.target;
        const updatedInfo = {
            className: form.className.value,
            category: form.category.value,
            difficultyLevel: form.difficulty.value,
            duration: form.duration.value,
            classSchedule: {
                days: form.days.value.split(',').map(d => d.trim()),
                time: form.time.value
            },
            price: parseFloat(form.price.value),
            description: form.description.value
        };

        try {
            const response = await fetch(`${baseUrl}/api/classes/${editingClass._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedInfo)
            });
            const data = await response.json();
            if (data.success) {
                toast.success("Class updated successfully!");
                setEditingClass(null);
                fetchMyClasses();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsUpdating(false);
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
        <div className="max-w-6xl mx-auto p-4 sm:p-6 text-zinc-300 font-sans select-none space-y-6">

            {/* Header */}
            <div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-100">My Classes</h2>
                <p className="text-xs text-zinc-500">Manage your created programs, update details, or track your enrolled students.</p>
            </div>

            {/* 📊 Classes Table */}
            <div className="bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                        <thead>
                            <tr className="border-b border-zinc-900 bg-zinc-900/40 text-zinc-400 font-semibold">
                                <th className="p-4">Class Name</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                            {classes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-zinc-600 font-medium">No classes created yet.</td>
                                </tr>
                            ) : (
                                classes.map((item) => (
                                    <tr key={item._id} className="hover:bg-zinc-900/20 transition-colors">
                                        <td className="p-4 font-bold text-zinc-200">{item.className}</td>
                                        <td className="p-4 text-zinc-400">{item.category}</td>
                                        <td className="p-4 font-semibold text-zinc-300">${item.price}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${item.status === 'Approved' ? 'bg-emerald-950 border border-emerald-800 text-emerald-400' : 'bg-amber-950 border border-amber-800 text-amber-400'
                                                }`}>
                                                {item.status || "Pending"}
                                            </span>
                                        </td>
                                        <td className="p-4 flex items-center justify-center gap-2">
                                            <button onClick={() => setEditingClass(item)} className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded text-zinc-400 hover:text-zinc-100 transition-colors" title="Update">
                                                <Edit3 className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="p-1.5 bg-zinc-900 border border-zinc-800 hover:border-red-900 rounded text-zinc-400 hover:text-red-400 transition-colors" title="Delete">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => handleViewStudents(item.className)} className="flex items-center gap-1 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 rounded text-zinc-300 font-medium transition-colors">
                                                <Users className="h-3 w-3" /> View Students
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* MODAL: View Students */}
            {activeStudents && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl max-w-md w-full p-5 space-y-4 relative">
                        <button onClick={() => setActiveStudents(null)} className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-200">
                            <X className="h-4 w-4" />
                        </button>
                        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                            <Users className="h-4 w-4 text-zinc-400" /> Enrolled Students
                        </h3>
                        <div className="divide-y divide-zinc-900 max-h-[40vh] overflow-y-auto pr-1">
                            {activeStudents.length === 0 ? (
                                <p className="text-xs text-zinc-600 py-4 text-center">No students have booked this class yet.</p>
                            ) : (
                                activeStudents.map((student, idx) => (
                                    <div key={idx} className="py-2.5 text-xs">
                                        <p className="font-semibold text-zinc-200">{student.userName || "Student Name"}</p>
                                        <p className="text-zinc-500 text-[11px]">{student.userEmail || "student@example.com"}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Update Class */}
            {editingClass && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-zinc-950 border border-zinc-900 rounded-xl max-w-lg w-full p-5 sm:p-6 space-y-4 relative my-8">
                        <button onClick={() => setEditingClass(null)} className="absolute right-4 top-4 text-zinc-500 hover:text-zinc-200">
                            <X className="h-4 w-4" />
                        </button>
                        <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
                            <Edit3 className="h-4 w-4 text-zinc-400" /> Update Class Settings
                        </h3>

                        <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-zinc-400 font-semibold">Class Name</label>
                                    <input type="text" name="className" defaultValue={editingClass.className} required className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-zinc-400 font-semibold">Category</label>
                                    <select name="category" defaultValue={editingClass.category} required className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700">
                                        <option value="Yoga">Yoga</option>
                                        <option value="Cardio">Cardio</option>
                                        <option value="Weights">Weights & Strength</option>
                                        <option value="Zumba">Zumba & Dance</option>
                                        <option value="CrossFit">CrossFit</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-zinc-400 font-semibold">Difficulty Level</label>
                                    <select name="difficulty" defaultValue={editingClass.difficultyLevel} required className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700">
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-zinc-400 font-semibold">Duration</label>
                                    <input type="text" name="duration" defaultValue={editingClass.duration} required className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-zinc-400 font-semibold">Class Days</label>
                                    <input type="text" name="days" defaultValue={editingClass.classSchedule?.days?.join(', ')} required className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-zinc-400 font-semibold">Class Time</label>
                                    <input type="text" name="time" defaultValue={editingClass.classSchedule?.time} required className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700" />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-zinc-400 font-semibold">Price ($)</label>
                                    <input type="number" step="0.01" name="price" defaultValue={editingClass.price} required className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700" />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-zinc-400 font-semibold">Description</label>
                                <textarea name="description" rows="3" defaultValue={editingClass.description} required className="w-full bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-100 focus:outline-none focus:border-zinc-700 resize-none"></textarea>
                            </div>
                            <button type="submit" disabled={isUpdating} className="w-full bg-zinc-100 hover:bg-zinc-200 disabled:bg-zinc-800 text-zinc-950 disabled:text-zinc-600 font-bold py-2 rounded transition-colors flex items-center justify-center gap-1">
                                {isUpdating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save Changes"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default MyClassesPage;