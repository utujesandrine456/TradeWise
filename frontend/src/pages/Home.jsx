import React, { useEffect, useState, useRef } from 'react';
import images from '../utils/images';
import { FaUser, FaRegCommentDots, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { MdEmail, MdDashboard } from 'react-icons/md';
import { IoCall, IoLocationSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight, Quote, Star, Mail, MapPin, Phone, Clock, Send, MessageCircle } from "lucide-react";
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
        image: images.TradeWise,
        title: "Smart Trading Made Simple",
        desc: "Easily track your products, sales, and stock levels without any manual work. Stay updated in real time so you always know exactly what’s happening in your business.",
    },
    {
        image: images.Smile,
        title: "Powerful Insights. Smarter Decisions.",
        desc: "Get clear insights into your inventory, expenses, and performance through simple, visual analytics. Make smarter, faster decisions with data that’s organized and easy to understand.",
    },
    {
        image: images.Device,
        title: "Run & Grow Your Business Seamlessly",
        desc: "Manage all your transactions, records, and finances from one clean dashboard designed for speed and simplicity. Stay organized and focused on growth while the system handles the heavy work.",
    },
];

const testimonials = [
    {
        name: 'Alex M.',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 5,
        review: "TradeWise has helped me understand my trades with clear insights and reliable tools. It makes tracking performance simple, and I feel confident making decisions with it.",
        date: 'June 13, 2024'
    },
    {
        name: 'Sarah K.',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 3,
        review: "The platform offers clean analytics and helpful breakdowns that make my trading easier. I can quickly view my results and stay organized without feeling overwhelmed at all.",
        date: 'June 10, 2024'
    },
    {
        name: 'John D.',
        avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
        rating: 4,
        review: "I really like how TradeWise protects my information while giving me meaningful insights. The system feels secure, and the organized data helps me evaluate trades comfortably.",
        date: 'June 7, 2024'
    }
];


const faqs = [
    {
        question: 'What is the Smart Calculator for Modern Traders',
        answer: 'TradeWise is a smart trading calculator and portfolio tracker. It helps you calculate profits, losses, and ROI for your trades, and keeps all your trading activity organized in one place.'
    },
    {
        question: 'How do I use the app to track my profits?',
        answer: 'Our calculator uses precise formulas and up-to-date market data to ensure your trading calculations are as accurate as possible.'
    },
    {
        question: 'Is the app free to use?',
        answer: 'TradeWise supports multiple asset types, including stocks and crypto. You can track and analyze different types of trades in one unified dashboard.'
    },
    {
        question: 'What asset types does the app support?',
        answer: 'You can view your trading performance over time, including during market events or high-volatility periods, with our analytics and reporting tools.'
    },
    {
        question: 'How does the TradeWise protect my personal data?',
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
            className="bg-white p-8 rounded-lg shadow-sm flex-1 border border-brand-100 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-lg"
        >
            <h3 className="text-4xl text-black mb-2 font-brand-500">
                {formatNumber(count)}{suffix}
            </h3>
            <p className="text-black text-lg font-bold capitalize">{label}</p>
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
            className="group relative flex-1"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
            <div className="relative bg-white/80 backdrop-blur-md border border-brand-100 rounded-3xl p-10 h-full flex flex-col items-center text-center shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden">
                <div className="absolute -right-8 -top-8 w-32 h-32 bg-brand-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700" />

                <div className="relative mb-8">
                    <div className="w-20 h-20 bg-brand-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-200 group-hover:rotate-6 transition-transform duration-300">
                        {number}
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-black mb-4 relative z-10">{title}</h3>
                <p className="text-gray-600 leading-relaxed font-medium relative z-10">{description}</p>

                <div className="mt-8 flex items-center text-brand-600 font-bold gap-2 group-hover:gap-4 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0">
                    <span>Learn More</span>
                    <ArrowRight size={18} />
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
                className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-lg border border-brand-100 flex items-center justify-center text-brand-600 hover:bg-brand-600 hover:text-white transition-all duration-300 z-20 group"
            >
                <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
            </button>
            
            <div className={`relative bg-white rounded-[2.5rem] shadow-2xl p-12 border border-brand-50 transition-all duration-500 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
                <div className="absolute top-10 right-12 opacity-10">
                    <Quote size={80} className="text-brand-600" />
                </div>

                <div className="flex flex-col items-center">
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-brand-200 rounded-full blur-lg opacity-40 animate-pulse" />
                        <img 
                            src={testimonials[index].avatar} 
                            alt={`${testimonials[index].name}`} 
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl relative z-10" 
                        />
                    </div>

                    <div className="flex gap-1 mb-6">
                        {Array(5).fill().map((_, i) => (
                            <Star 
                                key={i} 
                                size={18} 
                                className={`${i < testimonials[index].rating ? 'text-brand-500 fill-brand-500' : 'text-brand-200'}`} 
                            />
                        ))}
                    </div>

                    <p className="text-xl text-gray-700 italic text-center mb-8 leading-relaxed font-medium">
                        "{testimonials[index].review}"
                    </p>

                    <div className="text-center">
                        <div className="text-2xl font-bold text-black mb-1">{testimonials[index].name}</div>
                        <div className="text-brand-600 font-bold text-sm tracking-widest uppercase">{testimonials[index].date}</div>
                    </div>
                </div>
            </div>

            <button 
                onClick={goNext} 
                className="absolute right-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-lg border border-brand-100 flex items-center justify-center text-brand-600 hover:bg-brand-600 hover:text-white transition-all duration-300 z-20 group"
            >
                <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3">
                {testimonials.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`transition-all duration-500 rounded-full h-1.5 ${i === index ? 'bg-brand-600 w-12' : 'bg-brand-200 w-3 hover:bg-brand-300'}`}
                    />
                ))}
            </div>
        </div>
    );
}


const FAQList = () => {
    const [openIndex, setOpenIndex] = useState(null);
    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
            {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                    <div 
                        key={idx} 
                        className={`group relative overflow-hidden transition-all duration-500 rounded-[2rem] border ${isOpen ? 'bg-white border-brand-200 shadow-2xl' : 'bg-gray-50/50 border-brand-50 hover:border-brand-100 hover:bg-white hover:shadow-xl'}`}
                    >
                        <button 
                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                            className="w-full px-10 py-8 flex items-center justify-between text-left transition-all"
                        >
                            <span className={`text-xl lg:text-2xl font-bold transition-colors duration-300 ${isOpen ? 'text-black' : 'text-gray-700'}`}>
                                {faq.question}
                            </span>
                            <div className={`flex-shrink-0 ml-8 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-brand-600 border-brand-600 text-white rotate-180' : 'border-brand-100 text-brand-600 group-hover:border-brand-200'}`}>
                                <ChevronRight className={`transition-transform duration-500 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                            </div>
                        </button>
                        
                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.5, type: "spring", bounce: 0 }}
                                >
                                    <div className="px-10 pb-10">
                                        <div className="w-full h-px bg-brand-50 mb-8" />
                                        <p className="text-lg text-gray-500 leading-relaxed font-medium">
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
        <div className="text-brand-50 bg-brand-900 selection:bg-accent-400 selection:text-brand-950 overflow-x-hidden">
            <motion.nav
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl py-4 shadow-sm border-b border-brand-50' : 'bg-transparent py-8'}`}
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
                <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('home')}>
                        <img src={images.logo} alt="logo" className="w-12 h-10 rounded-lg transition-transform group-hover:scale-110 shadow-sm object-cover" />
                        <h1 className={`text-3xl font-brand-500 tracking-tight ${scrolled ? 'text-black' : 'text-white drop-shadow-md'}`}>TradeWise</h1>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        {['Home', 'About', 'Services', 'Contact', 'Faq'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                onClick={(e) => { e.preventDefault(); scrollToSection(item.toLowerCase()); }}
                                className={`font-brand-500 transition-all relative group text-lg ${scrolled ? 'text-black hover:text-black' : 'text-white/80 hover:text-white drop-shadow-sm'}`}
                            >
                                {item}
                                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all group-hover:w-full ${scrolled ? 'bg-brand-600' : 'bg-white'}`}></span>
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        {loading ? (
                            <div className="animate-pulse w-20 h-6 bg-brand-100 rounded-lg"></div>
                        ) : !user ? (
                            <>
                                <button
                                    onClick={() => navigate('/login')}
                                    className={`px-4 py-2 text-lg font-brand-500 transition-colors ${scrolled ? 'text-black hover:text-black' : 'text-white hover:text-white/80 drop-shadow-sm'}`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="bg-brand-600 text-white px-8 py-2.5 text-lg rounded-lg font-brand-500 hover:bg-brand-700 transition-all transform hover:scale-105 shadow-lg active:scale-95"
                                >
                                    Signup
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="bg-brand-600 text-white px-8 py-3 rounded-lg font-brand-500 flex items-center gap-2 hover:bg-brand-700 transition-all shadow-lg active:scale-95"
                            >
                                <MdDashboard size={20} /> Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </motion.nav>

            <div id="home" className="relative w-full h-screen overflow-hidden bg-brand-500">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={current}
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${slides[current].image})` }}
                        initial={{ scale: 1.1, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="absolute inset-0 bg-black/60" />
                    </motion.div>
                </AnimatePresence>

                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                    <motion.div
                        key={`text-${current}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-brand-500 text-white mb-8 leading-tight tracking-tight drop-shadow-2xl">
                            <span className="block">
                                <Typewriter
                                    words={[slides[current].title]}
                                    loop={1}
                                    typeSpeed={70}
                                    deleteSpeed={50}
                                    delaySpeed={1000}
                                />
                            </span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
                            {slides[current].desc}
                        </p>
                        <motion.button
                            onClick={() => navigate('/signup')}
                            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-brand-700 rounded-lg text-lg font-brand-500 overflow-hidden transition-all hover:bg-brand-50 shadow-xl"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Get Started
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </motion.div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 z-20">
                    {slides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrent(idx)}
                            className={`h-2 rounded-full transition-all duration-500 ${idx === current ? 'bg-white w-12' : 'bg-white/40 w-4 hover:bg-white/60'}`}
                        />
                    ))}
                </div>

                <button
                    onClick={prevSlide}
                    className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 sm:p-5 rounded-full transition-all duration-300 shadow-xl hover:-translate-x-1 active:scale-95 border border-white/20"
                >
                    <ChevronLeft size={32} className="text-white" strokeWidth={2} />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md p-4 sm:p-5 rounded-full transition-all duration-300 shadow-xl hover:translate-x-1 active:scale-95 border border-white/20"
                >
                    <ChevronRight size={32} className="text-white" strokeWidth={2} />
                </button>
            </div>

            {/* About Section */}
            <div id="about" className="flex flex-col lg:flex-row justify-between items-center gap-20 py-32 px-8 lg:px-24 bg-white relative overflow-hidden bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
                <motion.div
                    className="flex-1 relative z-10"
                    initial={{ opacity: 0, x: -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8, type: "spring" }}
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-black font-brand-500 text-sm tracking-widest mb-6 border border-brand-100 uppercase">
                        Our Story
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-brand-500 mb-10 leading-tight text-black capitalize">
                        About <span className="text-black">TradeWise</span>
                    </h2>

                    <p className="text-xl text-black leading-relaxed mb-8 font-medium">
                        TradeWise is built to transform the way traders and small businesses manage their operations.
                        We focus on delivering powerful insights without overwhelming you with complexity.
                        Whether you're tracking inventory, calculating profit, or analyzing trends, TradeWise helps you work smarter, faster, and more accurately.
                    </p>

                    <p className="text-xl text-black leading-relaxed mb-12 font-medium">
                        Our platform brings together real-time analytics, automated calculations, and secure data handling —
                        all wrapped in a clean, user-friendly interface. From beginners to experienced entrepreneurs,
                        TradeWise empowers you to make confident decisions backed by reliable data.
                    </p>
                    <div className="flex flex-wrap gap-8 mt-12 pb-12 overflow-x-auto scrollbar-hidden">
                        <StatCard value={10000} suffix="+" label="Active Users" />
                        <StatCard value={99} suffix="%" label="Accuracy Rate" />
                        <StatCard value={24} suffix="/7" label="Support Availability" />
                    </div>
                </motion.div>

                <motion.div
                    className="flex-1 relative max-w-2xl z-10"
                    initial={{ opacity: 0, x: 60, rotate: -5 }}
                    whileInView={{ opacity: 1, x: 0, rotate: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 1, type: "spring", bounce: 0.3 }}
                >
                    <motion.div
                        className="absolute -top-6 -right-6 bg-brand-600 px-8 py-5 rounded-3xl shadow-xl z-20 flex items-center justify-center transform rotate-3"
                        whileHover={{ rotate: 0, scale: 1.1 }}
                    >
                        <span className="text-white text-lg font-brand-500 capitalize">Real-Time Analytics</span>
                    </motion.div>

                    <div className="relative p-4 bg-brand-50 rounded-[3rem] border border-brand-100 overflow-hidden">
                        <motion.img
                            src={images.TradeWise}
                            alt="TradeWise Demo"
                            className="w-full h-auto rounded-[2.5rem] shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>

                    <motion.div
                        className="absolute -bottom-6 -left-6 bg-white rounded-3xl shadow-xl px-8 py-5 z-20 flex items-center justify-center border border-brand-100"
                        whileHover={{ y: -10 }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-4 h-4 bg-brand-500 rounded-full animate-pulse shadow-sm"></div>
                            <span className="text-black text-lg font-brand-500 capitalize">Live Market Data</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Services Section */}
            <div id="services" className="py-32 bg-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,#FC9E4F08,transparent_50%),radial-gradient(circle_at_bottom_left,#FC9E4F08,transparent_50%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:40px_40px]" />

                <motion.div
                    className="text-center mb-24 relative px-6 z-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="inline-block px-6 py-2 rounded-full bg-brand-50 text-brand-600 font-bold text-xs tracking-[0.2em] mb-6 border border-brand-100 uppercase">
                        Our Process
                    </div>
                    <h4 className="text-black text-5xl lg:text-7xl font-bold mb-8 capitalize tracking-tight">
                        Streamlined Workflow<br />For <span className="text-brand-600">Smart Traders</span>
                    </h4>
                    <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                        Experience a seamless journey from data entry to deep insights with our optimized three-step workflow.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row justify-between gap-12 px-6 lg:px-24 relative max-w-7xl mx-auto z-10">
                    <WorkStepCard
                        index={0}
                        number="01"
                        title="Seamless Data Input"
                        description="Record your trades with millisecond precision using our optimized quick-entry system."
                    />
                    <WorkStepCard
                        index={1}
                        number="02"
                        title="Intelligent Analysis"
                        description="Watch as our neural engines calculate risk, ROI, and performance metrics in real-time."
                    />
                    <WorkStepCard
                        index={2}
                        number="03"
                        title="Actionable Insights"
                        description="Receive personalized strategies backed by historical data to maximize your future returns."
                    />
                </div>
            </div>

            <div className="bg-white py-48 px-6 lg:px-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#FC9E4F05,transparent_50%)]" />
                
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-24 relative z-10">
                    <motion.div
                        className="flex-1"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-block px-6 py-2 rounded-full bg-brand-50 text-brand-600 font-bold text-xs tracking-[0.2em] mb-8 border border-brand-100 uppercase">
                            Testimonials
                        </div>
                        <h2 className="text-5xl lg:text-7xl font-bold text-black mb-10 leading-tight tracking-tight">
                            Trusted By<br />Modern <span className="text-brand-600">Traders</span>
                        </h2>
                        <div className="space-y-8 font-medium text-lg text-gray-600 leading-relaxed max-w-xl">
                            <p>
                                Join thousands of satisfied users who have transformed their trading desk with our institutional-grade toolkit.
                            </p>
                            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-brand-100">
                                <div>
                                    <div className="text-3xl font-bold text-black mb-2">4.9/5</div>
                                    <div className="text-sm text-brand-600 font-bold uppercase tracking-widest">Average Rating</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-black mb-2">50k+</div>
                                    <div className="text-sm text-brand-600 font-bold uppercase tracking-widest">Active Accounts</div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex-1 w-full flex justify-center lg:justify-end"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <TestimonialCarousel />
                    </motion.div>
                </div>
            </div>

            {/* Contact Section */}
            <div id="contact" className="py-32 bg-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#FC9E4F05,transparent_50%)]" />
                
                <div className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-20 items-start">
                        {/* Info Column */}
                        <motion.div 
                            className="flex-1 space-y-12"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div>
                                <div className="inline-block px-6 py-2 rounded-full bg-brand-50 text-brand-600 font-bold text-xs tracking-[0.2em] mb-8 border border-brand-100 uppercase">
                                    Let's Connect
                                </div>
                                <h2 className="text-5xl lg:text-7xl font-bold text-black mb-8 leading-tight tracking-tight">
                                    Have Questions?<br />We're Here To <span className="text-brand-600 underline underline-offset-8 decoration-brand-200">Help</span>.
                                </h2>
                                <p className="text-gray-500 text-xl leading-relaxed font-medium max-w-md">
                                    Our experts are ready to assist you in optimizing your trading experience. Reach out via any of these channels.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <Mail size={28} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-1">Email Us</div>
                                        <div className="text-xl font-bold text-black">support@tradewise.com</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <Phone size={28} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-1">Call Us</div>
                                        <div className="text-xl font-bold text-black">+250 788 123 456</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 group">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-all duration-300 shadow-sm">
                                        <Clock size={28} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-brand-600 uppercase tracking-widest mb-1">Work Hours</div>
                                        <div className="text-xl font-bold text-black">Mon - Fri: 9:00 AM - 6:00 PM</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-8 border-t border-brand-50">
                                {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, idx) => (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ y: -5, scale: 1.1 }}
                                        className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-all shadow-sm"
                                    >
                                        <Icon size={20} />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Form Column */}
                        <motion.div 
                            className="flex-1 w-full relative group"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-brand-500/10 to-brand-600/10 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="relative bg-white rounded-[3rem] p-10 lg:p-14 shadow-2xl border border-brand-50">
                                <form className="space-y-8" onSubmit={handleContactUs}>
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <div className="relative">
                                            <FaUser className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" />
                                            <input 
                                                type="text" 
                                                name="name"
                                                value={contactUsData.name}
                                                onChange={handleContactUsDataChange}
                                                placeholder="John Doe"
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-600/20 focus:bg-white rounded-2xl py-5 pl-14 pr-6 text-black font-medium transition-all outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                                            <input 
                                                type="email" 
                                                name="email"
                                                value={contactUsData.email}
                                                onChange={handleContactUsDataChange}
                                                placeholder="john@example.com"
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-600/20 focus:bg-white rounded-2xl py-5 pl-14 pr-6 text-black font-medium transition-all outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Your Message</label>
                                        <div className="relative">
                                            <MessageCircle className="absolute left-6 top-6 text-gray-300" size={18} />
                                            <textarea 
                                                name="message"
                                                value={contactUsData.message}
                                                onChange={handleContactUsDataChange}
                                                placeholder="Tell us what's on your mind..."
                                                rows="5"
                                                className="w-full bg-gray-50 border-2 border-transparent focus:border-brand-600/20 focus:bg-white rounded-2xl py-5 pl-14 pr-6 text-black font-medium transition-all outline-none resize-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        disabled={sending}
                                        className="w-full py-6 bg-brand-600 hover:bg-brand-700 text-white rounded-2xl font-bold text-lg shadow-xl shadow-brand-100 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        {sending ? (
                                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span>Send Message</span>
                                                <Send size={18} />
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="bg-white py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#FC9E4F05,transparent_50%)]" />
                
                <motion.div
                    className="max-w-7xl mx-auto px-6 lg:px-24 relative z-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <div className="inline-block px-6 py-2 rounded-full bg-brand-50 text-brand-600 font-bold text-xs tracking-[0.2em] mb-6 border border-brand-100 uppercase">
                            Common Questions
                        </div>
                        <h2 className="text-black text-5xl lg:text-7xl font-bold mb-8 tracking-tight">
                            Got Questions?<br /><span className="text-brand-600">We've Got Answers</span>
                        </h2>
                        <p className="text-gray-500 text-xl leading-relaxed font-medium">
                            Explore our comprehensive FAQ to learn more about how TradeWise can elevate your trading strategy.
                        </p>
                    </div>
                    
                    <FAQList />

                    <div className="mt-20 text-center relative">
                        <div className="inline-flex flex-col sm:flex-row items-center gap-6 p-8 bg-gray-50 rounded-[2rem] border border-brand-50">
                            <p className="text-gray-600 font-medium">Still have questions that aren't answered here?</p>
                            <motion.button
                                onClick={() => scrollToSection('contact')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-8 py-4 bg-black text-white rounded-xl font-bold hover:bg-brand-600 transition-colors shadow-lg"
                            >
                                Contact Support
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}

export default Home;
