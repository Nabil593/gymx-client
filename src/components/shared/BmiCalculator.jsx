"use client";
import React, { useState } from 'react';

export default function BmiCalculator() {
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bmi, setBmi] = useState(null);

    const calculateBMI = () => {
        if (weight && height) {
            const heightInMeters = height / 100;
            const result = (weight / (heightInMeters * heightInMeters)).toFixed(1);
            setBmi(result);
        }
    };

    // Reset ফাংশন
    const resetFields = () => {
        setWeight('');
        setHeight('');
        setBmi(null);
    };

    return (
        <section className="py-16 bg-black border-y border-zinc-900">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center">
                    <div className="flex-1 space-y-2">
                        <h2 className="text-2xl font-extrabold uppercase text-zinc-100">BMI Calculator</h2>
                        <p className="text-sm text-zinc-400">Calculate your Body Mass Index and stay healthy.</p>
                    </div>

                    <div className="flex-1 w-full space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="number" placeholder="Weight (kg)" value={weight}
                                className="h-10 bg-black border border-zinc-800 rounded px-3 text-zinc-200 text-sm focus:border-zinc-700 outline-none"
                                onChange={(e) => setWeight(e.target.value)}
                            />
                            <input
                                type="number" placeholder="Height (cm)" value={height}
                                className="h-10 bg-black border border-zinc-800 rounded px-3 text-zinc-200 text-sm focus:border-zinc-700 outline-none"
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={calculateBMI}
                                className="flex-1 bg-zinc-50 hover:bg-zinc-200 text-black h-10 rounded font-bold text-sm transition-colors"
                            >
                                Calculate
                            </button>
                            {/* Reset বাটন */}
                            <button
                                onClick={resetFields}
                                className="bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 px-4 h-10 rounded font-bold text-sm transition-colors"
                            >
                                Reset
                            </button>
                        </div>

                        {bmi && (
                            <div className="mt-4 p-4 bg-black rounded border border-zinc-800 text-center space-y-1">
                                <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Your BMI</span>
                                <div className="text-3xl font-black text-white">{bmi}</div>
                                <div className={`text-xs font-bold uppercase ${bmi < 18.5 ? 'text-blue-400' : bmi < 25 ? 'text-green-500' : bmi < 30 ? 'text-yellow-500' : 'text-red-500'
                                    }`}>
                                    {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : bmi < 30 ? 'Overweight' : 'Obese'}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}