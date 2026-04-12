import React, { useEffect, useState, useRef } from 'react';
import images from '../utils/images';
import { FaUser, FaRegCommentDots, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { MdEmail, MdDashboard } from 'react-icons/md';
import { IoCall, IoLocationSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Quote, Star, Mail, MapPin, Phone, Clock, Send, MessageCircle, Globe } from "lucide-react";
import { Typewriter } from 'react-simple-typewriter';
import backendApi from '../utils/axiosInstance';
import { toast } from '../utils/toast';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../features/auth/authThuck';
import { handleError } from '../utils/handleError';
import Footer from '../components/Footer';
import Header from '../components/Header';


const slides = [
    {
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
        title: "Smart Trading Management",
        desc: "Easily track your products, sales, and stock levels without any manual work. Stay updated in real time so you always know exactly what’s happening in your business.",
    },
];

const testimonials = [
    {
        name: 'Alice M.',
        avatar: '/Profile1.jpg',
        rating: 5,
        review: "Stocka has helped me understand my trades with clear insights and reliable tools. It makes tracking performance simple, and I feel confident making decisions with it.",
        date: 'June 13, 2024'
    },
    {
        name: 'Sarah K.',
        avatar: '/Profile3.jpg',
        rating: 3,
        review: "The platform offers clean analytics and helpful breakdowns that make my trading easier. I can quickly view my results and stay organized without feeling overwhelmed at all.",
        date: 'June 10, 2024'
    },
    {
        name: 'John D.',
        avatar: '/Profile2.jpg',
        rating: 4,
        review: "I really like how Stocka protects my information while giving me meaningful insights. The system feels secure, and the organized data helps me evaluate trades comfortably.",
        date: 'June 7, 2024'
    }
];


const faqs = [
    {
        question: 'What is the smart calculator for modern traders?',
        answer: 'Stocka is a smart trading calculator and portfolio tracker. It helps you calculate profits, losses, and ROI for your trades, and keeps all your trading activity organized in one place.'
    },
    {
        question: 'How do I use the app to track my profits?',
        answer: 'Our calculator uses precise formulas and up-to-date market data to ensure your trading calculations are as accurate as possible.'
    },
    {
        question: 'Is the app free to use?',
        answer: 'Stocka supports multiple asset types, including stocks and crypto. You can track and analyze different types of trades in one unified dashboard.'
    },
    {
        question: 'What asset types does the app support?',
        answer: 'You can view your trading performance over time, including during market events or high-volatility periods, with our analytics and reporting tools.'
    },
    {
        question: 'How does Stocka protect my personal data?',
        answer: 'Your data is stored securely and is never shared. Only you have access to your trading records, and we use strong encryption to protect your information.'
    }
];


const StatCard = ({ value, suffix, label }) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isVisible) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.3 }
        );

        if (cardRef.current) {
            observer.observe(cardRef.current);
        }

        return () => {
            if (cardRef.current) {
                observer.unobserve(cardRef.current);
            }
        };
    }, [isVisible]);

    useEffect(() => {
        if (isVisible) {
            const duration = 1200;
            const steps = 50;
            const increment = value / steps;
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(timer);
        }
    }, [isVisible, value]);

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num;
    };

    return (
        <div
            ref={cardRef}
            className="glass-card p-8 rounded-md flex-1 border border-brand-100/20 transition-all duration-500 cursor-pointer hover:shadow-glow hover:-translate-y-2 group"
        >
            <h3 className="text-5xl lg:text-6xl text-obsidian-800 mb-2 font-semibold transition-colors group-hover:text-brand-600">
                {formatNumber(count)}{suffix}
            </h3>
            <p className="text-obsidian-500 text-sm font-semibold tracking-wide">{label}</p>
        </div>
    );
};


const WorkStepCard = ({ number, title, description, index = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.1, type: "spring", bounce: 0.4 }}
            whileHover={{ y: -10 }}
            className="group relative flex-1 cursor-pointer"
        >
            <div className="absolute inset-0 bg-brand-500/10 rounded-md blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative glass-card border border-brand-100/20 rounded-md p-10 h-full flex flex-col items-start text-left shadow-premium hover:shadow-glow transition-all duration-500 overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-50 rounded-md opacity-30 group-hover:scale-150 transition-transform duration-700" />

                <div className="relative mb-8 text-7xl font-bold text-brand-100/50 group-hover:text-brand-500/20 transition-colors">{number}</div>

                <h3 className="text-2xl font-bold text-obsidian-800 mb-4 relative z-10">{title}</h3>
                <p className="text-obsidian-500 leading-relaxed font-medium relative z-10">{description}</p>

                <div className="mt-auto pt-8">
                    <div className="w-10 h-1 bg-brand-100 group-hover:w-20 group-hover:bg-brand-500 transition-all duration-500 rounded-md" />
                </div>
            </div>
        </motion.div>
    );
};


const TestimonialCarousel = () => {
    const [index, setIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setIsTransitioning(true);
            setTimeout(() => {
                setIndex(prev => (prev + 1) % testimonials.length);
                setIsTransitioning(false);
            }, 300);
        }, 7000);
        return () => clearInterval(timer);
    }, []);

    const goPrev = (e) => {
        e.stopPropagation();
        setIsTransitioning(true);
        setTimeout(() => {
            setIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
            setIsTransitioning(false);
        }, 300);
    };

    const goNext = (e) => {
        e.stopPropagation();
        setIsTransitioning(true);
        setTimeout(() => {
            setIndex(prev => (prev + 1) % testimonials.length);
            setIsTransitioning(false);
        }, 300);
    };

    return (
        <div className="relative w-full max-w-2xl px-12">
            <button
                onClick={goPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-md bg-white shadow-premium border border-brand-100/20 flex items-center justify-center text-brand-600 hover:bg-brand-600 hover:text-white transition-all duration-300 z-20 group"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            </button>

            <div className={`relative glass-card rounded-md shadow-premium p-12 border border-white transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95 blur-md' : 'opacity-100 scale-100 blur-0'}`}>
                <div className="absolute top-10 right-12 opacity-5">
                    <Quote size={80} className="text-brand-600" />
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-brand-500 rounded-md blur-xl opacity-20 animate-pulse" />
                        <img
                            src={testimonials[index].avatar}
                            alt={`${testimonials[index].name}`}
                            className="w-20 h-20 rounded-md object-cover border-4 border-white shadow-glass relative z-10"
                        />
                    </div>

                    <div className="flex gap-1.5 mb-6">
                        {Array(5).fill().map((_, i) => (
                            <Star
                                key={i}
                                size={16}
                                className={`${i < testimonials[index].rating ? 'text-brand-500 fill-brand-500' : 'text-brand-100'}`}
                            />
                        ))}
                    </div>

                    <p className="text-xl text-obsidian-600 italic text-center mb-8 leading-relaxed font-medium">
                        "{testimonials[index].review}"
                    </p>

                    <div className="text-center">
                        <div className="text-2xl font-bold text-obsidian-800 mb-1">{testimonials[index].name}</div>
                        <div className="text-brand-500 font-semibold text-xs tracking-wide">{testimonials[index].date}</div>
                    </div>
                </div>
            </div>

            <button
                onClick={goNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-md bg-white shadow-premium border border-brand-100/20 flex items-center justify-center text-brand-600 hover:bg-brand-600 hover:text-white transition-all duration-300 z-20 group"
            >
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`transition-all duration-500 rounded-md h-1.5 cursor-pointer ${i === index ? 'bg-brand-500 w-10' : 'bg-brand-100 w-2.5 hover:bg-brand-200'}`}
                    />
                ))}
            </div>
        </div>
    );
}


const FAQList = () => {
    const [openIndex, setOpenIndex] = useState(null);
    return (
        <div className="flex flex-col gap-5 w-full max-w-4xl mx-auto px-6">
            {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                    <div
                        key={idx}
                        className={`group relative overflow-hidden transition-all duration-500 rounded-md border cursor-pointer ${isOpen ? 'bg-white border-brand-200 shadow-premium' : 'bg-white border-brand-50 hover:border-brand-100'}`}
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                            className="w-full px-8 py-7 flex items-center justify-between text-left transition-all cursor-pointer"
                        >
                            <span className={`text-xl font-brand-500 transition-colors duration-300 ${isOpen ? 'text-obsidian-800' : 'text-obsidian-600'}`}>
                                {faq.question}
                            </span>
                            <div className={`flex-shrink-0 ml-8 w-10 h-10 rounded-md border flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-brand-500 border-brand-500 text-white rotate-180' : 'border-brand-50 text-brand-500 group-hover:border-brand-200'}`}>
                                <ChevronRight size={18} className={`transition-transform duration-500 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                            </div>
                        </button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeInOut" }}
                                >
                                    <div className="px-8 pb-8 pt-0">
                                        <div className="w-full h-px bg-brand-50 mb-6" />
                                        <p className="text-base text-obsidian-500 leading-relaxed font-medium">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
            })}
        </div>
    );
};


const Home = () => {
    const [current, setCurrent] = useState(0);
    const { user, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [sending, setSending] = useState(false)
    const [contactUsData, setContatUsData] = useState({ name: '', email: '', message: '' });

    const handleContactUsDataChange = (e) => {
        const { name, value } = e.target;
        setContatUsData({ ...contactUsData, [name]: value });
    };

    const handleContactUs = async (e) => {
        e.preventDefault();
        if (contactUsData.name === '' || contactUsData.email === '' || contactUsData.message === '')
            return toast.error('Name, email and message are all required to send message');

        try {
            setSending(true);
            const res = await backendApi.post('/email/contact-us', contactUsData);
            toast.success("Message sent successfully");

        } catch (error) {
            const parsedError = handleError(error);
            console.log(error);
            console.log(parsedError);

            toast.error(parsedError.message);
        } finally {
            setSending(false);
            setContatUsData({ name: '', email: '', message: '' });
        }
    };

    const nextSlide = () => setCurrent((current + 1) % slides.length);
    const prevSlide = () => setCurrent((current - 1 + slides.length) % slides.length);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 14000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (user === null) {
            dispatch(fetchUser());
        }
    }, [user, dispatch]);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="text-brand-900 bg-white selection:bg-brand-500 selection:text-white overflow-x-hidden">
            <Header />


            {/* Hero Section Redesign */}
            <div id="home" className="relative w-full min-h-screen bg-brand-900 overflow-hidden flex items-center pt-24 pb-12">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-brand-950 opacity-10" />
                </div>

                <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        {/* Text Content */}
                        <motion.div
                            className="flex-1 text-left"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="inline-block px-4 py-1.5 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-400 font-bold text-xs tracking-wider mb-8"
                            >
                                NEW PLATFORM VERSION 2.0
                            </motion.div>
                            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tight">
                                Manage Your <br />
                                <span className="text-brand-500">Inventory</span> with <br />
                                Absolute <span className="text-white/40">Precision.</span>
                            </h1>
                            <p className="text-xl text-white/60 mb-12 max-w-xl leading-relaxed font-semibold">
                                Stocka is the professional management system built for speed, accuracy, and growth. Track every asset in real-time.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="px-10 py-5 bg-brand-500 text-white rounded-md font-bold text-lg hover:bg-brand-600 transition-all shadow-glow active:scale-95 flex items-center gap-3"
                                >
                                    Start Free Trial <ArrowRight size={20} />
                                </button>
                                <button
                                    onClick={() => scrollToSection('Services')}
                                    className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-md font-bold text-lg hover:bg-white/10 transition-all active:scale-95"
                                >
                                    View Features
                                </button>
                            </div>
                        </motion.div>

                        {/* Visual Content - Floating Mockup */}
                        <motion.div
                            className="flex-1 relative"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1, delay: 0.4 }}
                        >
                            <div className="relative group">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-brand-500 blur-[100px] opacity-20 animate-pulse" />

                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative z-10 p-4 bg-white/5 backdrop-blur-3xl rounded-md border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                                >
                                    <img
                                        src={images.Stocka}
                                        alt="Dashboard Mockup"
                                        className="w-full h-auto rounded-md shadow-2xl grayscale-[0.2] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                                    />

                                    {/* Overlay elements for interactivity */}
                                    <motion.div
                                        className="absolute -top-6 -left-6 bg-brand-500 p-6 rounded-md shadow-glow border border-brand-400/50"
                                        whileHover={{ scale: 1.1, rotate: -3 }}
                                    >
                                        <div className="text-white font-bold text-2xl">+42%</div>
                                        <div className="text-white/60 text-[10px] font-bold">Growth Velocity</div>
                                    </motion.div>

                                    <motion.div
                                        className="absolute -bottom-6 -right-6 glass-card p-6 rounded-md shadow-premium border border-white/10"
                                        whileHover={{ scale: 1.1, rotate: 3 }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 bg-emerald-500 rounded-sm animate-pulse" />
                                            <div className="text-brand-900 font-bold text-sm">System Online</div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* About Section - Unique Project Profile Layout (Now 2nd) */}
            <section id="About" className="relative py-20 bg-white overflow-hidden border-b border-brand-100">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-stretch gap-12">
                        {/* Metrics Column */}
                        <div className="lg:w-1/3 flex flex-col gap-6">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                className="p-8 bg-brand-900 rounded-2xl text-white flex flex-col justify-between h-full"
                            >
                                <div className="space-y-4">
                                    <div className="text-brand-400 font-bold text-xs tracking-widest uppercase">System Performance</div>
                                    <h3 className="text-4xl font-black leading-tight">Elite Efficiency.</h3>
                                </div>
                                <div className="mt-12 space-y-8">
                                    <div className="flex items-end justify-between border-b border-white/10 pb-4">
                                        <span className="text-white/40 font-bold text-sm uppercase">Uptime</span>
                                        <span className="text-3xl font-black">99.9%</span>
                                    </div>
                                    <div className="flex items-end justify-between border-b border-white/10 pb-4">
                                        <span className="text-white/40 font-bold text-sm uppercase">Security</span>
                                        <span className="text-3xl font-black">256-bit</span>
                                    </div>
                                    <div className="flex items-end justify-between border-b border-white/10 pb-4">
                                        <span className="text-white/40 font-bold text-sm uppercase">Support</span>
                                        <span className="text-3xl font-black">24/7/365</span>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Story & Visual Column */}
                        <div className="lg:w-2/3 flex flex-col gap-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="p-12 bg-brand-50 rounded-2xl flex-1 border border-brand-100"
                            >
                                <div className="max-w-2xl">
                                    <div className="inline-block px-4 py-1.5 rounded-md bg-brand-900 text-white font-bold text-xs tracking-wider mb-8">
                                        OUR STORY
                                    </div>
                                    <h2 className="text-5xl lg:text-7xl font-black text-brand-900 mb-8 leading-tight">
                                        Built for <br />
                                        <span className="text-brand-500">Scale.</span>
                                    </h2>
                                    <p className="text-xl text-brand-900/70 leading-relaxed font-semibold">
                                        Stocka was engineered to bridge the gap between high-frequency trading speed and enterprise stability. We provide the tools you need to manage your assets without the friction of legacy systems.
                                    </p>
                                </div>
                            </motion.div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="p-8 bg-white border border-brand-100 rounded-2xl shadow-sm"
                                >
                                    <div className="text-brand-500 mb-4"><Star size={32} /></div>
                                    <h4 className="text-xl font-bold text-brand-900 mb-2">Quality First</h4>
                                    <p className="text-brand-900/50 font-medium">Every line of code is optimized for maximum reliability.</p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="p-8 bg-white border border-brand-100 rounded-2xl shadow-sm"
                                >
                                    <div className="text-brand-500 mb-4"><Globe size={32} /></div>
                                    <h4 className="text-xl font-bold text-brand-900 mb-2">Global Reach</h4>
                                    <p className="text-brand-900/50 font-medium">Deployed across 5 continents for zero-latency access.</p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section id="Services" className="relative py-20 bg-white overflow-hidden">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/5 rounded-full blur-[120px]" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1.5 rounded-md bg-brand-500/10 border border-brand-500/20 text-brand-700 font-bold text-xs tracking-wider mb-6"
                        >
                            OUR ECOSYSTEM
                        </motion.div>
                        <h2 className="text-5xl lg:text-7xl font-black text-brand-900 leading-tight">
                            The Full Suite for <br />
                            Modern <span className="text-brand-500">Enterprises.</span>
                        </h2>
                    </div>
                </div>
            </section>

            {/* Services Continued - Grid */}
            <section className="py-20 bg-white border-t border-brand-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Real-time Metrics", icon: <Clock />, desc: "Track performance with millisecond precision." },
                            { title: "Smart Analytics", icon: <Star />, desc: "AI-powered insights for strategic growth." },
                            { title: "Global Security", icon: <Mail />, desc: "Enterprise-grade data protection protocol." },
                            { title: "Asset Pipeline", icon: <ArrowRight />, desc: "Seamless inventory and sale management." }
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="group p-8 bg-white rounded-2xl border border-brand-100 hover:border-brand-500 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-brand-50 rounded-xl flex items-center justify-center text-brand-500 mb-6 group-hover:bg-brand-900 group-hover:text-white transition-all duration-500">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-brand-900 mb-3 tracking-tight">
                                    {service.title}
                                </h3>
                                <p className="text-brand-900/50 leading-relaxed font-semibold text-sm">
                                    {service.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials - Deep Contrast Background */}
            <section className="relative py-20 bg-brand-900 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-white/5" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl lg:text-6xl font-black text-white mb-16"
                    >
                        Success Stories from <br />
                        Our <span className="text-brand-500">Global Partners.</span>
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15 }}
                                className="p-10 bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 text-left hover:bg-white/[0.08] transition-all duration-500"
                            >
                                <div className="flex gap-1 mb-8">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={18} className="fill-brand-500 text-brand-500" />
                                    ))}
                                </div>
                                <p className="text-white/80 text-lg font-medium leading-relaxed mb-10 min-h-[120px]">
                                    "{testimonial.review}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-brand-500/20 overflow-hidden">
                                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold">{testimonial.name}</div>
                                        <div className="text-white/40 text-[10px] font-bold tracking-widest uppercase">{testimonial.date}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Section - Innovation Focused Redesign */}
            <section id="Contact" className="relative py-20 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="bg-brand-900 rounded-[3rem] overflow-hidden shadow-2xl relative">

                        <div className="flex flex-col lg:flex-row">
                            {/* Left Side - Info */}
                            <div className="lg:w-[45%] p-12 lg:p-20 relative z-10 bg-brand-950">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="space-y-12"
                                >
                                    <div>
                                        <h2 className="text-4xl lg:text-6xl font-black text-white mb-6">
                                            Let’s Scale <br />
                                            Together.
                                        </h2>
                                        <p className="text-white/60 text-lg font-medium">
                                            Our engineers are ready to help you integrate Stocka into your global workflow.
                                        </p>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="flex items-center gap-6 group">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-500 group-hover:border-brand-500 transition-all duration-500">
                                                <Mail className="text-white" size={24} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">Email Inquiry</div>
                                                <div className="text-white/40 font-semibold">support@stocka.com</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 group">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-50 group-hover:border-white transition-all duration-500">
                                                <Globe className="text-white group-hover:text-brand-900" size={24} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">Global HQ</div>
                                                <div className="text-white/40 font-semibold">Silicon Valley, CA</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-12">
                                        <div className="text-white/20 font-black text-9xl absolute -bottom-10 -left-10 select-none">STOCKA</div>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Right Side - Form */}
                            <div className="flex-1 p-12 lg:p-20 bg-white relative">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="space-y-10"
                                >
                                    <form onSubmit={handleContactUs} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-brand-900 font-bold text-xs uppercase tracking-widest pl-1">Full Name</label>
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={contactUsData.name}
                                                        onChange={handleContactUsDataChange}
                                                        placeholder="Enter your name"
                                                        className="w-full px-6 py-5 bg-brand-50 border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-bold text-brand-950 placeholder:text-brand-900/40"
                                                        required
                                                    />
                                                    <FaUser className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-200 group-focus-within:text-brand-500 transition-colors" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-brand-900 font-bold text-xs uppercase tracking-widest pl-1">Business Email</label>
                                                <div className="relative group">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={contactUsData.email}
                                                        onChange={handleContactUsDataChange}
                                                        placeholder="name@company.com"
                                                        className="w-full px-6 py-5 bg-brand-50 border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-bold text-brand-950 placeholder:text-brand-900/40"
                                                        required
                                                    />
                                                    <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-200 group-focus-within:text-brand-500 transition-colors" size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-brand-900 font-bold text-xs uppercase tracking-widest pl-1">Inquiry Details</label>
                                            <div className="relative group">
                                                <textarea
                                                    name="message"
                                                    value={contactUsData.message}
                                                    onChange={handleContactUsDataChange}
                                                    placeholder="Tell us about your requirements..."
                                                    rows={4}
                                                    className="w-full px-6 py-5 bg-brand-50 border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-bold text-brand-950 placeholder:text-brand-900/40 resize-none"
                                                    required
                                                />
                                                <MessageCircle className="absolute right-6 bottom-6 text-brand-200 group-focus-within:text-brand-500 transition-colors" size={20} />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className="w-full py-6 bg-brand-900 text-white rounded-2xl font-black text-lg hover:bg-brand-800 transition-all shadow-glow active:scale-95 flex items-center justify-center gap-4 disabled:opacity-50"
                                        >
                                            {sending ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-md animate-spin" /> : <>Transmit Message <ArrowRight size={22} /></>}
                                        </button>
                                    </form>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="FAQ" className="relative py-20 bg-white overflow-hidden">
                <div className="max-w-4xl mx-auto text-center mb-20 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block px-5 py-2 rounded-md bg-brand-50 text-brand-500 font-bold text-[10px] tracking-[0.3em] mb-8 border border-brand-100 uppercase"
                    >
                        Common Questions
                    </motion.div>
                    <h2 className="text-4xl lg:text-6xl font-black text-brand-900 mb-6">
                        Frequently Asked <br />
                        <span className="text-brand-500">Questions.</span>
                    </h2>
                </div>
                <FAQList />
            </section>

            <Footer />
        </div>
    );
}

export default Home;
