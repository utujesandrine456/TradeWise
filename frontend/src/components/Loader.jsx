import React from 'react';

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center py-40 font-Urbanist w-full h-full min-h-[400px]">
            <div className="relative group flex items-center justify-center">
                {/* Outer rotating ring */}
                <div className="w-32 h-32 border-2 border-transparent border-t-[#09111E] border-r-[#09111E]/20 rounded-full animate-spin duration-1000"></div>

                {/* Middle reverse rotating ring */}
                <div className="absolute w-24 h-24 border-2 border-transparent border-b-[#09111E]/40 border-l-[#09111E]/10 rounded-full animate-spin-reverse duration-[1500ms]"></div>

                {/* Core pulsing element */}
                <div className="absolute flex items-center justify-center inset-0">
                    <div className="w-12 h-12 bg-brand-600 rounded-full animate-pulse shadow-2xl flex items-center justify-center overflow-hidden relative">
                        <div className="absolute inset-0 bg-brand-500" />
                        <div className="w-4 h-4 bg-brand-600 rounded-full blur-xl" />
                    </div>
                </div>

                {/* Distant glow */}
                <div className="absolute inset-0 bg-[#09111E]/5 blur-3xl rounded-full scale-150 animate-pulse pointer-events-none" />
            </div>

            <div className="mt-16 flex flex-col items-center">
                <h2 className="text-2xl font-nosifer font-bold text-[#09111E] leading-none mb-2">
                    Stocka
                </h2>
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#09111E]/20 animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#09111E]/40 animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#09111E]/60 animate-bounce" />
                </div>
            </div>
        </div>
    );
};

export default Loader;
