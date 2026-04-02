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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || mobileOpen ? 'bg-white/90 backdrop-blur-xl py-4 shadow-sm border-b border-chocolate-50' : 'bg-transparent py-6'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <img
                        src={images.logo}
                        alt="TradeWise Logo"
                        className="w-14 h-11 rounded-lg transition-transform group-hover:scale-110 shadow-sm"
                    />
                    <h1 className={`text-2xl md:text-3xl font-bold capitalize tracking-tight ${scrolled || mobileOpen ? 'text-chocolate-900' : 'text-white drop-shadow-sm'}`}>
                        TradeWise
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
                            className={`font-bold capitalize transition-all relative group text-sm tracking-wide ${scrolled || mobileOpen ? 'text-chocolate-500 hover:text-chocolate-900' : 'text-white/80 hover:text-white drop-shadow-sm'}`}
                        >
                            {item}
                            <span className={`absolute -bottom-2 left-0 right-0 mx-auto h-1 w-1 rounded-full origin-center scale-0 transition-transform duration-300 group-hover:scale-100 ${scrolled || mobileOpen ? 'bg-chocolate-600' : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]'}`}></span>
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-6">
                    {loading ? (
                        <div className="animate-pulse w-20 h-6 bg-chocolate-100 rounded-lg"></div>
                    ) : !user ? (
                        <>
                            <button
                                onClick={() => navigate('/login')}
                                className={`px-4 py-2 font-bold capitalize transition-all text-sm ${scrolled || mobileOpen ? 'text-chocolate-600 hover:text-chocolate-900' : 'text-white hover:text-white/80 drop-shadow-sm'}`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="bg-chocolate-600 text-white px-8 py-3 text-sm font-bold rounded-lg transition-all hover:bg-chocolate-700 active:scale-95 shadow-lg capitalize active:shadow-sm hover:-translate-y-1"
                            >
                                Join Now
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="bg-chocolate-600 hover:bg-chocolate-700 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-3 transition-all hover:-translate-y-1 active:scale-95 capitalize shadow-lg"
                        >
                            <MdDashboard size={20} /> Dashboard
                        </button>
                    )}
                </div>

                <button
                    className={`md:hidden p-2 focus:outline-none ${scrolled || mobileOpen ? 'text-chocolate-900' : 'text-white'}`}
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
                        className="md:hidden bg-white border-t border-chocolate-50 overflow-hidden shadow-xl"
                    >
                        <div className="px-6 py-8 flex flex-col gap-6">
                            {navLinks.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="text-chocolate-600 text-xl font-bold text-left hover:text-chocolate-900 transition-all flex items-center justify-between group capitalize"
                                >
                                    {item}
                                    <ChevronRight size={24} className="opacity-0 group-hover:opacity-100 transition-all text-chocolate-600 translate-x-4 group-hover:translate-x-0" />
                                </button>
                            ))}

                            <div className="h-px bg-chocolate-100 my-4"></div>

                            {!user ? (
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => {
                                            navigate('/login');
                                            setMobileOpen(false);
                                        }}
                                        className="w-full bg-chocolate-50 text-chocolate-600 py-4 rounded-lg font-bold hover:bg-chocolate-100 transition-all capitalize"
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={() => {
                                            navigate('/signup');
                                            setMobileOpen(false);
                                        }}
                                        className="w-full bg-chocolate-600 text-white py-4 rounded-lg font-bold shadow-lg hover:-translate-y-1 active:scale-95 transition-all capitalize"
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
                                    className="w-full bg-chocolate-600 text-white py-4 rounded-lg font-bold shadow-lg flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95 transition-all capitalize"
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
