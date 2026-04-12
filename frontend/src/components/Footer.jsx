import React from 'react';
import { Mail, Globe, Linkedin, Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="relative bg-brand-900 pt-32 pb-16 overflow-hidden mt-auto">
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20">
                    <div className="space-y-10">
                        <div className="flex items-center gap-4 group cursor-pointer">
                            <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110">
                                <span className="text-brand-900 font-black text-2xl tracking-tighter">S</span>
                            </div>
                            <h3 className="text-white font-black text-4xl tracking-tight group-hover:text-brand-500 transition-colors">Stocka</h3>
                        </div>
                        <p className="text-white/50 text-base font-semibold leading-relaxed max-w-sm">
                            Pioneering enterprise-grade trading environments with surgical precision. Strategic asset management and elite-tier user experience synthesized into a singular access point.
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
                        <h4 className="text-white font-black text-xl mb-12 tracking-tight">Core Modules</h4>
                        <ul className="space-y-6">
                            {['Inventory', 'Analytics', 'Financials', 'Trading'].map((item) => (
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

                    <div className="relative group">
                        <div className="p-10 bg-white/5 rounded-3xl border border-white/10 overflow-hidden relative">
                            <div className="absolute inset-0 bg-brand-500 opacity-0 group-hover:opacity-5 transition-opacity" />
                            <h4 className="text-white font-black text-xl mb-8 tracking-tight">Enterprise Access</h4>
                            <p className="text-white/40 text-[13px] font-bold leading-relaxed mb-10">
                                Deploy Stocka within your organization for enterprise-grade management.
                            </p>
                            <button className="w-full py-4 bg-brand-500 text-white rounded-xl font-black text-sm tracking-widest hover:bg-brand-600 transition-all shadow-glow active:scale-95">
                                GET STARTED
                            </button>
                        </div>
                    </div>
                </div>

                <div className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="text-white/30 text-[11px] tracking-[0.2em] font-black uppercase">
                        &copy; {new Date().getFullYear()} <span className="text-white/60">Stocka Systems</span>. All Rights Reserved.
                    </div>
                    <div className="flex gap-10 text-[11px] font-black text-white/30 tracking-[0.2em] uppercase">
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
