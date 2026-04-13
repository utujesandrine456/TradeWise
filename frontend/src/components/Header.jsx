import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react';
import { MdDashboard } from 'react-icons/md';

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
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 rounded-md border ${scrolled || mobileOpen
                ? 'bg-brand-900 border-white/20 shadow-xl w-[90%] max-w-5xl'
                : 'bg-brand-900/80 backdrop-blur-md border-white/10 shadow-2xl w-[95%] max-w-6xl'
                }`}
        >
            <div className="px-6 py-4 flex justify-between items-center">
                <div
                    className="flex items-center gap-3 cursor-pointer"
                    onClick={() => navigate('/')}
                >
                    <h1 className="text-3xl font-bold tracking-tight text-white">Stocka</h1>
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
                            className={`px-4 py-2 rounded-md text-sm font-semibold transition-all hover:bg-white/5 ${scrolled || mobileOpen ? 'text-white/60 hover:text-white' : 'text-white/60 hover:text-white'}`}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2 pr-1">
                    <div className="hidden md:block">
                        {!user ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="px-6 py-2.5 bg-white text-brand-900 rounded-md font-bold text-sm transition-all active:scale-95 hover:bg-white/90"
                                >
                                    Sign Up
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-6 py-2.5 bg-brand-900 text-white border border-white rounded-md font-bold text-sm transition-all active:scale-95 hover:bg-white/90"
                                >
                                    Login
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-2.5 bg-white text-brand-900 rounded-md font-bold text-sm transition-all active:scale-95 flex items-center gap-2 hover:bg-white/90"
                            >
                                <MdDashboard size={16} /> Dashboard
                            </button>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button
                            className="p-2.5 bg-white/5 text-white rounded-md transition-colors"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="md:hidden bg-brand-900 border-t border-white/5 absolute top-[calc(100%+8px)] left-0 right-0 overflow-hidden rounded-md shadow-2xl"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {navLinks.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="text-white font-bold text-xl text-left tracking-tight pb-4 border-b border-white/5"
                                >
                                    {item}
                                </button>
                            ))}
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full py-4 bg-white text-brand-900 rounded-md text-lg font-bold shadow-lg"
                            >
                                Let's talk
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Header;
