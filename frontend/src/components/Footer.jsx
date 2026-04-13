import React from 'react';
import { Mail, Phone, Linkedin, Instagram, Facebook, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="relative py-12 overflow-hidden mt-auto">
            {/* Diamond Lattice Background — matches reference */}
            <div className="absolute inset-0 bg-[#09111E] overflow-hidden pointer-events-none">
                <svg className="absolute inset-0 w-full h-full">
                    <defs>
                        <pattern id="diamondFooter" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
                            <path d="M36 2 L70 36 L36 70 L2 36 Z" fill="none" stroke="rgba(102,124,155,0.25)" strokeWidth="1.2" />
                            <path d="M36 14 L58 36 L36 58 L14 36 Z" fill="none" stroke="rgba(102,124,155,0.1)" strokeWidth="0.8" />
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width="100%" height="100%" fill="url(#diamondFooter)" />
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                    <div className="space-y-10">
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <h3 className="text-white font-black text-4xl tracking-tight group-hover:text-brand-500 transition-colors">Stocka</h3>
                        </div>
                        <p className="text-white/50 text-base font-semibold leading-relaxed max-w-sm">
                            Empowering traders with high-fidelity performance tracking. Master your expenses, debits, and credits with absolute precision in one unified dashboard.
                        </p>
                        <div className="flex gap-6">
                            {[Instagram, Linkedin, Facebook].map((Icon, i) => (
                                <a key={i} href="#" className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/40 hover:text-white hover:bg-brand-500 hover:border-brand-500 transition-all duration-500">
                                    <Icon size={20} />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-xl mb-12 tracking-tight">Core modules</h4>
                        <ul className="space-y-6">
                            {['Expenses', 'Cash flow', 'Profit/Loss', 'Performance'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-white/40 hover:text-brand-400 font-bold transition-all flex items-center gap-3 group">
                                        <div className="w-1.5 h-1.5 bg-brand-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-xl mb-12 tracking-tight">Global Support</h4>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">Email</div>
                                    <span className="text-white/40 font-semibold group-hover:text-white transition-colors">tradewise.app456@gmail.com</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">Phone Number</div>
                                    <span className="text-white/40 font-semibold group-hover:text-white transition-colors">+250 785 805 869</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-xl mb-12 tracking-tight">Newsletter</h4>
                        <p className="text-white/40 text-sm font-semibold mb-8 leading-relaxed">
                            Subscribe for the latest enterprise-grade updates and product releases.
                        </p>
                        <form className="space-y-4">
                            <input
                                type="email"
                                placeholder="name@company.com"
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-md focus:outline-none focus:border-brand-500 text-white font-bold text-sm"
                            />
                            <button className="flex gap-2 justify-center items-center w-full py-4 bg-white text-[#09111E] rounded-md font-bold text-md hover:bg-white/90 transition-all">
                                Subscribe <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-white/30 text-[14px]  font-semibold">
                        &copy; {new Date().getFullYear()} <span className="text-white/60">Stocka</span> All Rights Reserved.
                    </div>
                    <div className="flex gap-10 text-[14px] font-semibold text-white/30">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
