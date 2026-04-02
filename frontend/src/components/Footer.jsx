import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { IoCall, IoLocationSharp } from "react-icons/io5";
import { MdEmail } from 'react-icons/md';

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-brand-500 via-[#fdab66] to-[#fc9130] text-white py-16 font-afacad shadow-[0_-10px_40px_rgba(252,158,79,0.15)] w-full border-t border-brand-400 relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <pattern id="grid-footer" width="8" height="8" patternUnits="userSpaceOnUse">
                            <path d="M 8 0 L 0 0 0 8" fill="none" stroke="white" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid-footer)" />
                </svg>
                <svg className="absolute bottom-0 left-0 w-full opacity-[0.08]" viewBox="0 0 1440 320" preserveAspectRatio="none">
                    <path fill="white" d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,149.3C672,149,768,203,864,218.7C960,235,1056,213,1152,186.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                </svg>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* About Us */}
                    <div className="flex flex-col">
                        <h3 className="text-white font-bold text-3xl mb-8 drop-shadow-sm">About Us</h3>
                        <p className="text-white/80 text-lg leading-relaxed mb-8 font-normal">
                            TradeWise delivers the finest trading experience right to your screen. We pride ourselves on accuracy, privacy, and exceptional service.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-lg border border-white/10"><FaFacebook size={22} /></a>
                            <a href="#" className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-lg border border-white/10"><FaInstagram size={22} /></a>
                            <a href="#" className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-lg border border-white/10"><FaTwitter size={22} /></a>
                            <a href="#" className="p-3 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white hover:text-black transition-all transform hover:-translate-y-1 shadow-lg border border-white/10"><FaLinkedin size={22} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col">
                        <h3 className="text-white font-bold text-3xl mb-8 drop-shadow-sm">Quick Links</h3>
                        <ul className="flex flex-col gap-4 text-white/80 text-lg font-bold">
                            <li><a href="#" className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 group"><span className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-white transition-colors"></span>Home</a></li>
                            <li><a href="#about" className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 group"><span className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-white transition-colors"></span>About</a></li>
                            <li><a href="#services" className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 group"><span className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-white transition-colors"></span>Services</a></li>
                            <li><a href="#contact" className="hover:text-white hover:translate-x-2 transition-all flex items-center gap-3 group"><span className="w-2 h-2 bg-white/40 rounded-full group-hover:bg-white transition-colors"></span>Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col">
                        <h3 className="text-white font-bold text-3xl mb-8 drop-shadow-sm">Contact Info</h3>
                        <div className="flex flex-col gap-6 text-white/80 text-xl font-bold">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg group-hover:bg-white/20 transition-colors shadow-sm border border-white/10">
                                    <IoCall className="text-white" size={24} />
                                </div>
                                <span className="group-hover:text-white transition-colors tracking-wide">+250 785 805 869</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg group-hover:bg-white/20 transition-colors shadow-sm border border-white/10">
                                    <MdEmail className="text-white" size={24} />
                                </div>
                                <span className="group-hover:text-white transition-colors">tradewise.app456@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg group-hover:bg-white/20 transition-colors shadow-sm border border-white/10">
                                    <IoLocationSharp className="text-white" size={24} />
                                </div>
                                <span className="group-hover:text-white transition-colors">Kigali, Rwanda</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col">
                        <h3 className="text-white font-bold text-3xl mb-8 drop-shadow-sm">Newsletter</h3>
                        <p className="text-white/80 text-lg mb-6 font-medium">
                            Subscribe to our newsletter for updates, special offers, and exclusive deals.
                        </p>
                        <form className="flex flex-col gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="bg-white/10 backdrop-blur-md border-2 border-white/20 rounded-lg px-6 py-4 text-white text-lg focus:border-white/50 focus:ring-4 focus:ring-white/10 outline-none transition-all placeholder-white/40 font-medium shadow-inner"
                            />
                            <button className="bg-white text-black rounded-lg px-6 py-5 font-bold text-xl cursor-pointer hover:bg-brand-50 transition-all transform hover:-translate-y-1 shadow-xl shadow-black/10 active:scale-95">
                                Subscribe Now
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-white/60 text-base font-bold tracking-wide uppercase">
                        &copy; {new Date().getFullYear()} <span className="text-white font-bold">TradeWise</span>. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-base font-bold text-white/60 uppercase tracking-wide">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
