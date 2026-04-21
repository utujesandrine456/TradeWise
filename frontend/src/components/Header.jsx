import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react';
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
            className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500 rounded-md border ${scrolled || mobileOpen
                ? 'bg-[#09111E] border-white/20 shadow-xl w-[90%] max-w-5xl'
                : 'bg-[#09111E]/80 backdrop-blur-md border-white/10 shadow-2xl w-[95%] max-w-6xl'
                }`}
        >
            <div className="px-6 py-4 flex justify-between items-center">
                <div
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => navigate('/')}
                >
                    <div className="w-10 h-10 rounded-full bg-blue-600/5 border border-white/10 p-1.5 transition-all group-hover:scale-110 group-hover:border-white/30 shadow-2xl">
                        <img src={images.logo} alt="Stocka Logo" className="w-full h-full object-contain brightness-0 invert" />
                    </div>
                    <h1 className="text-2xl font-nosifer font-bold text-white group-hover:text-white/90 transition-colors">Stocka</h1>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {navLinks.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            onClick={(e) => {
                                e.preventDefault();
                                scrollToSection(item.toLowerCase());
                            }}
                            className="relative group px-4 py-2 text-md font-semibold text-white/60 transition-colors hover:text-white"
                        >
                            <span>{item}</span>
                            <span className="absolute bottom-0 left-1/2 w-0 h-1 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full" />
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2 pr-1">
                    <div className="hidden md:block">
                        {!user ? (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="px-6 py-2.5 bg-white text-[#09111E] rounded-md font-bold text-sm transition-all active:scale-95 hover:bg-blue-600/90"
                                >
                                    Sign Up
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="px-6 py-2.5 bg-[#09111E] text-white border border-white rounded-md font-bold text-sm transition-all active:scale-95 hover:bg-blue-600/60 hover:text-[#fff]"
                                >
                                    Login
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="px-6 py-3 bg-white text-[#09111E] rounded-md font-bold text-sm transition-all active:scale-95 flex items-center gap-2 hover:bg-blue-600/90"
                            >
                                Dashboard
                            </button>
                        )}
                    </div>

                    <div className="md:hidden">
                        <button
                            className="p-2.5 bg-blue-600/5 text-white rounded-md transition-colors"
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
                        className="md:hidden bg-[#09111E] border-t border-white/5 absolute top-[calc(100%+8px)] left-0 right-0 overflow-hidden rounded-md shadow-2xl"
                    >
                        <div className="flex flex-col p-6 gap-6">
                            {navLinks.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => scrollToSection(item.toLowerCase())}
                                    className="text-white font-bold text-xl text-left pb-4 border-b border-white/5"
                                >
                                    {item}
                                </button>
                            ))}
                            {!user ? (
                                <div className="flex flex-col gap-4">
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="w-full py-4 bg-blue-600 text-[#fff] rounded-md text-lg font-bold shadow-lg"
                                    >
                                        Sign Up
                                    </button>
                                    <button
                                        onClick={() => navigate('/login')}
                                        className="w-full py-4 bg-[#09111E] text-white border border-white rounded-md text-lg font-bold shadow-lg hover:text-white"
                                    >
                                        Login
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/dashboard')}
                                    className="w-full py-4 bg-blue-600 text-[#09111E] rounded-md text-lg font-bold shadow-lg"
                                >
                                    Dashboard
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Header;
