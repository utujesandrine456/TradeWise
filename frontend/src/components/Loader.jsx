import React from 'react';

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center py-40 font-Urbanist w-full h-full min-h-[400px]">
            <div className="relative group flex items-center justify-center">
                <div className="absolute inset-0 bg-[#0d1826]/20 blur-2xl rounded-full scale-150" />
                <div className="w-24 h-24 border-4 border-transparent border-t-white border-l-blue-200 rounded-full animate-spin shadow-[0_0_30px_rgba(255,255,255,0.2)]"></div>
                <div className="absolute flex items-center justify-center inset-0">
                    <div className="w-12 h-12 bg-white/20 rounded-full animate-pulse backdrop-blur-md border border-white/40 shadow-inner"></div>
                </div>
            </div>

            <h2 className="mt-12 text-3xl md:text-5xl font-nosifer font-black text-white tracking-[0.3em] uppercase animate-pulse drop-shadow-xl select-none">
                <span className="font-nosifer">Stocka</span>
            </h2>
        </div>
    );
};

export default Loader;
