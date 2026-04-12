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
        <header
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b ${scrolled || mobileOpen
                ? 'bg-white border-brand-100 py-3 shadow-sm'
                : 'bg-brand-900 border-white/5 py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 md:px-10 flex justify-between items-center">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <img src={images.logo} alt="logo" className="w-9 h-9 rounded-lg object-cover" />
                    <h1 className={`text-xl font-bold tracking-tight ${scrolled || mobileOpen ? 'text-brand-900' : 'text-white'}`}>Stocka</h1>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(item.toLowerCase());
                            }}
                            className={`text-sm font-bold tracking-wide transition-colors ${scrolled || mobileOpen ? 'text-brand-900/60 hover:text-brand-900' : 'text-white/60 hover:text-white'}`}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {!user ? (
                        <button
                            onClick={() => navigate('/login')}
                            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 ${scrolled || mobileOpen
                                ? 'bg-brand-900 text-white hover:bg-brand-800'
                                : 'bg-white text-brand-900 hover:bg-brand-50'
                                }`}
                        >
                            Log In
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className={`px-5 py-2 rounded-lg font-bold text-sm transition-all active:scale-95 flex items-center gap-2 ${scrolled || mobileOpen
                                ? 'bg-brand-900 text-white hover:bg-brand-800'
                                : 'bg-brand-500 text-white hover:bg-brand-600'
                                }`}
                        >
                            <MdDashboard size={16} /> Dashboard
                        </button>
                    )}
                </div>

                <div className="md:hidden">
                    <button
                        className={`p-2 rounded-lg transition-colors ${scrolled || mobileOpen ? 'bg-brand-50 text-brand-900' : 'bg-white/5 text-white'}`}
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-brand-900 overflow-hidden"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {navLinks.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="text-white font-bold text-lg text-left"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Header;
