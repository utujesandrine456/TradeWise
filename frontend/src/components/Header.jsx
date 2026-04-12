import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronRight, ChevronLeft, Menu, X } from 'lucide-react';
import { MdDashboard } from 'react-icons/md';
import images from '../utils/images';

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const navigate = useNavigate();
    const { user, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setMobileOpen(false);
        }
    };

    const navLinks = ['Home', 'About', 'Services', 'Contact', 'FAQ'];

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || mobileOpen ? 'bg-white/90 backdrop-blur-xl py-4 shadow-sm border-b border-brand-50' : 'bg-transparent py-6'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <img
                        src={images.logo}
                        alt="Stocka Logo"
                        className="w-14 h-11 rounded-md transition-transform group-hover:scale-105 shadow-xl brightness-0 invert"
                    />
                    <h1 className={`text-2xl md:text-3xl font-bold tracking-tight ${scrolled || mobileOpen ? 'text-brand-900' : 'text-white'}`}>
                        Stocka
                    </h1>
                </div>

                <div className="hidden md:flex items-center gap-10">
                    {navLinks.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(item.toLowerCase());
                            }}
                            className={`font-semibold transition-all relative group text-sm tracking-wide ${scrolled || mobileOpen ? 'text-brand-500 hover:text-brand-900' : 'text-white/60 hover:text-white'}`}
                        >
                            {item}
                            <span className={`absolute -bottom-2 left-0 right-0 mx-auto h-0.5 w-1 rounded-full origin-center scale-0 transition-transform duration-300 group-hover:scale-100 ${scrolled || mobileOpen ? 'bg-brand-900' : 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]'}`}></span>
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-6">
                    {loading ? (
                        <div className="animate-pulse w-24 h-10 bg-brand-100 rounded-md"></div>
                    ) : !user ? (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className={`px-4 py-2 font-semibold transition-all text-sm ${scrolled || mobileOpen ? 'text-brand-900 hover:opacity-70' : 'text-white hover:text-white/70'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="bg-brand-900 text-white px-8 py-3 text-sm font-semibold rounded-md transition-all hover:bg-brand-800 active:scale-95 shadow-lg relative overflow-hidden group/join"
                            >
                                <div className="absolute inset-0 bg-white/10 translate-x-full group-hover/join:translate-x-0 transition-transform duration-500" />
                                <span className="relative z-10">Get Started</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-brand-900 hover:bg-brand-800 text-white px-8 py-3 rounded-md font-semibold text-sm flex items-center gap-4 transition-all shadow-lg active:scale-95 relative overflow-hidden group/dash"
                        >
                            <div className="absolute inset-0 bg-white/10 translate-x-full group-hover/dash:translate-x-0 transition-transform duration-500" />
                            <MdDashboard size={18} className="relative z-10" /> <span className="relative z-10">Dashboard</span>
                        </button>
                    )}
                </div>

                <button
                    className={`md:hidden p-2 focus:outline-none ${scrolled || mobileOpen ? 'text-brand-900' : 'text-white'}`}
                    onClick={() => setMobileOpen(!mobileOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-brand-50 overflow-hidden shadow-xl"
                    >
                        <div className="px-6 py-8 flex flex-col gap-6">
                            {navLinks.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="text-brand-600 text-xl font-bold text-left hover:text-brand-900 transition-all flex items-center justify-between group capitalize"
                                >
                                    {item}
                                    <ChevronRight size={24} className="opacity-0 group-hover:opacity-100 transition-all text-brand-600 translate-x-4 group-hover:translate-x-0" />
                                </button>
                            ))}

                            <div className="h-px bg-brand-100 my-4"></div>

                            {!user ? (
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => {
                                            navigate('/login');
                                            setMobileOpen(false);
                                        }}
                                        className="w-full bg-brand-50 text-brand-600 py-4 rounded-lg font-bold hover:bg-brand-100 transition-all capitalize"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/signup');
                                            setMobileOpen(false);
                                        }}
                                        className="w-full bg-brand-600 text-white py-4 rounded-lg font-bold shadow-lg hover:-translate-y-1 active:scale-95 transition-all capitalize"
                                    >
                                        Get Started
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        navigate('/dashboard');
                                        setMobileOpen(false);
                                    }}
                                    className="w-full bg-brand-600 text-white py-4 rounded-lg font-bold shadow-lg flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95 transition-all capitalize"
                                >
                                    <MdDashboard size={24} /> Open Dashboard
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}

export default Header;
