import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { IoCall, IoLocationSharp } from "react-icons/io5";
import { MdEmail } from 'react-icons/md';

export default function Footer() {
    return (
        <footer className="bg-white text-chocolate-900 py-16 font-afacad shadow-[0_-10px_40px_rgba(93,64,55,0.05)] w-full border-t border-chocolate-100 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* About Us */}
                    <div className="flex flex-col">
                        <h3 className="text-chocolate-900 font-#FC9E4F text-3xl mb-8">About Us</h3>
                        <p className="text-chocolate-500 text-lg leading-relaxed mb-8 font-medium">
                            TradeWise delivers the finest trading experience right to your screen. We pride ourselves on accuracy, privacy, and exceptional service.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="p-3 bg-chocolate-50 rounded-full text-chocolate-600 hover:bg-chocolate-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"><FaFacebook size={22} /></a>
                            <a href="#" className="p-3 bg-chocolate-50 rounded-full text-chocolate-600 hover:bg-chocolate-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"><FaInstagram size={22} /></a>
                            <a href="#" className="p-3 bg-chocolate-50 rounded-full text-chocolate-600 hover:bg-chocolate-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"><FaTwitter size={22} /></a>
                            <a href="#" className="p-3 bg-chocolate-50 rounded-full text-chocolate-600 hover:bg-chocolate-600 hover:text-white transition-all transform hover:-translate-y-1 shadow-sm"><FaLinkedin size={22} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col">
                        <h3 className="text-chocolate-900 font-#FC9E4F text-3xl mb-8">Quick Links</h3>
                        <ul className="flex flex-col gap-4 text-chocolate-600 text-lg font-bold">
                            <li><a href="#" className="hover:text-chocolate-900 hover:translate-x-2 transition-all flex items-center gap-3"><span className="w-2 h-2 bg-chocolate-600 rounded-full shadow-sm"></span>Home</a></li>
                            <li><a href="#about" className="hover:text-chocolate-900 hover:translate-x-2 transition-all flex items-center gap-3"><span className="w-2 h-2 bg-chocolate-600 rounded-full shadow-sm"></span>About</a></li>
                            <li><a href="#services" className="hover:text-chocolate-900 hover:translate-x-2 transition-all flex items-center gap-3"><span className="w-2 h-2 bg-chocolate-600 rounded-full shadow-sm"></span>Services</a></li>
                            <li><a href="#contact" className="hover:text-chocolate-900 hover:translate-x-2 transition-all flex items-center gap-3"><span className="w-2 h-2 bg-chocolate-600 rounded-full shadow-sm"></span>Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-col">
                        <h3 className="text-chocolate-900 font-#FC9E4F text-3xl mb-8">Contact Info</h3>
                        <div className="flex flex-col gap-6 text-chocolate-600 text-xl font-bold">
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-chocolate-50 rounded-lg group-hover:bg-chocolate-100 transition-colors shadow-sm">
                                    <IoCall className="text-chocolate-600" size={24} />
                                </div>
                                <span className="group-hover:text-chocolate-900 transition-colors tracking-wide">+250 785 805 869</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-chocolate-50 rounded-lg group-hover:bg-chocolate-100 transition-colors shadow-sm">
                                    <MdEmail className="text-chocolate-600" size={24} />
                                </div>
                                <span className="group-hover:text-chocolate-900 transition-colors">tradewise.app456@gmail.com</span>
                            </div>
                            <div className="flex items-center gap-4 group">
                                <div className="p-3 bg-chocolate-50 rounded-lg group-hover:bg-chocolate-100 transition-colors shadow-sm">
                                    <IoLocationSharp className="text-chocolate-600" size={24} />
                                </div>
                                <span className="group-hover:text-chocolate-900 transition-colors">Kigali, Rwanda</span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div className="flex flex-col">
                        <h3 className="text-chocolate-900 font-#FC9E4F text-3xl mb-8">Newsletter</h3>
                        <p className="text-chocolate-500 text-lg mb-6 font-medium">
                            Subscribe to our newsletter for updates, special offers, and exclusive deals.
                        </p>
                        <form className="flex flex-col gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="bg-[#fdfcfb] border-2 border-chocolate-100 rounded-lg px-6 py-4 text-chocolate-900 text-lg focus:border-chocolate-400 focus:ring-4 focus:ring-chocolate-50 outline-none transition-all placeholder-chocolate-300 font-bold shadow-sm"
                            />
                            <button className="bg-chocolate-600 text-white rounded-lg px-6 py-5 font-#FC9E4F text-xl cursor-pointer hover:bg-chocolate-700 transition-all transform hover:-translate-y-1 shadow-xl shadow-chocolate-600/30 active:scale-95">
                                Subscribe Now
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-chocolate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-chocolate-400 text-base font-bold tracking-wide uppercase">
                        &copy; {new Date().getFullYear()} <span className="text-chocolate-600 font-#FC9E4F">TradeWise</span>. All rights reserved.
                    </div>
                    <div className="flex gap-8 text-base font-bold text-chocolate-400 uppercase tracking-wide">
                        <a href="#" className="hover:text-chocolate-600 transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-chocolate-600 transition-colors">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
