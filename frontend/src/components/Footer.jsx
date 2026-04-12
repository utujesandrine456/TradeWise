import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { IoCall, IoLocationSharp } from "react-icons/io5";
import { MdEmail } from 'react-icons/md';

export default function Footer() {
    return (
        <footer className="bg-brand-900 text-white py-32 font-Urbanist relative overflow-hidden border-t border-white/5">
            <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-[120px]" />

                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-500/10 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="footer-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#footer-grid)" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
                        {/* Brand Identity */}
                        <div className="flex flex-col space-y-10">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shadow-2xl">
                                    <span className="text-brand-900 font-bold text-2xl">W</span>
                                </div>
                                <h3 className="text-white font-bold text-3xl tracking-tight">Stocka</h3>
                            </div>
                            <p className="text-white/60 text-sm font-semibold leading-relaxed">
                                Pioneering enterprise-grade trading environments with surgical precision. Strategic asset management, cryptographic privacy, and elite-tier user experience synthesized into a singular access point.
                            </p>
                            <div className="flex gap-6">
                                {[FaFacebook, FaInstagram, FaTwitter, FaLinkedin].map((Icon, i) => (
                                    <a key={i} href="#" className="w-12 h-12 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:bg-white hover:text-brand-900 hover:border-white transition-all duration-500 group shadow-xl">
                                        <Icon size={20} className="group-hover:scale-110 transition-transform" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex flex-col space-y-10">
                            <h4 className="text-white/40 font-bold tracking-wider text-xs">Operations</h4>
                            <ul className="flex flex-col gap-6 text-white font-semibold text-sm">
                                {['Home', 'About', 'Services', 'Contact', 'FAQ'].map(link => (
                                    <li key={link}>
                                        <a href={`#${link}`} className="hover:text-brand-400 hover:translate-x-2 transition-all inline-block opacity-60 hover:opacity-100">
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Direct Contact */}
                        <div className="flex flex-col space-y-10">
                            <h4 className="text-white/40 font-bold tracking-wider text-xs">System Support</h4>
                            <div className="flex flex-col gap-8 text-white font-semibold text-sm">
                                <div className="flex items-center gap-5 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-md bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white transition-all duration-500 group-hover:bg-white group-hover:text-brand-900">
                                        <IoCall size={20} />
                                    </div>
                                    <span className="opacity-60 group-hover:opacity-100 transition-opacity">+250 788 123 456</span>
                                </div>
                                <div className="flex items-center gap-5 group cursor-pointer">
                                    <div className="w-12 h-12 rounded-md bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-white transition-all duration-500 group-hover:bg-white group-hover:text-brand-900">
                                        <MdEmail size={20} />
                                    </div>
                                    <span className="opacity-60 group-hover:opacity-100 transition-opacity">support@tradewise.com</span>
                                </div>
                            </div>
                        </div>

                        {/* Subscription */}
                        <div className="flex flex-col space-y-10">
                            <h4 className="text-white/40 font-bold tracking-wider text-xs">Intelligence Feed</h4>
                            <p className="text-white/60 text-sm font-semibold leading-relaxed">
                                Subscribe to receive strategic market analysis and real-time system performance diagnostic reports.
                            </p>
                            <form className="flex flex-col gap-4">
                                <input
                                    type="email"
                                    placeholder="Email address"
                                    className="bg-white/5 border border-white/10 rounded-md px-6 py-5 text-white font-semibold text-sm outline-none transition-all placeholder:text-white/20 focus:border-white/40 focus:bg-white/10"
                                />
                                <button className="bg-white text-brand-900 rounded-md px-10 py-5 font-bold text-sm tracking-wide hover:bg-brand-50 transition-all shadow-xl active:scale-95 relative overflow-hidden group/sub">
                                    <div className="absolute inset-0 bg-brand-900/5 translate-x-full group-hover/sub:translate-x-0 transition-transform duration-500" />
                                    <span className="relative z-10">Establish Feed Link</span>
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-12">
                        <div className="text-white/40 text-[11px] tracking-wide font-semibold">
                            &copy; {new Date().getFullYear()} <span className="text-white/80">Stocka Systems</span>. All Rights Reserved.
                        </div>
                        <div className="flex gap-12 text-[11px] font-semibold text-white/40 tracking-wide">
                            <a href="#" className="hover:text-white transition-colors">Privacy Protocol</a>
                            <a href="#" className="hover:text-white transition-colors">Access Licensing</a>
                        </div>
                    </div>
                </div>
        </footer>
    );
}
