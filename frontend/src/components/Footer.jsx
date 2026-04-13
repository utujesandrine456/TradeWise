import React from 'react';
import { Mail, Globe, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-brand-900 pt-24 pb-12 overflow-hidden mt-auto">
            {/* Designed Background */}
            <div className="absolute inset-0 bg-grid-pattern-dark opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-brand-900 via-transparent to-brand-900/80" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-400/5 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
                    <div className="space-y-10">
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                                <span className="text-brand-900 font-black text-2xl tracking-tighter">S</span>
                            </div>
                            <h3 className="text-white font-black text-4xl tracking-tight group-hover:text-brand-500 transition-colors">Stocka</h3>
                        </div>
                        <p className="text-white/50 text-base font-semibold leading-relaxed max-w-sm">
                            Empowering traders with high-fidelity performance tracking. Master your expenses, debits, and credits with absolute precision in one unified dashboard.
                        </p>
                        <div className="flex gap-6">
                            {[Twitter, Instagram, Linkedin, Facebook].map((Icon, i) => (
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
                                    <div className="text-white font-bold text-sm">Assistance</div>
                                    <span className="text-white/40 font-semibold group-hover:text-white transition-colors">support@stocka.com</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-white/40 group-hover:bg-brand-500 group-hover:text-white transition-all duration-500">
                                    <Globe size={18} />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">Operations</div>
                                    <span className="text-white/40 font-semibold group-hover:text-white transition-colors">Silicon Valley, CA</span>
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
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-brand-500 text-white font-bold text-sm"
                            />
                            <button className="w-full py-4 bg-white text-brand-900 rounded-xl font-bold text-sm hover:bg-white/90 transition-all">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-white/30 text-[14px]  font-semibold">
                        &copy; {new Date().getFullYear()} <span className="text-white/60">Stocka Systems</span>. All Rights Reserved.
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
