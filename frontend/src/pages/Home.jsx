import React, { useEffect, useState, useRef } from 'react';
import images from '../utils/images';
import { FaUser, FaRegCommentDots, FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { MdEmail, MdDashboard } from 'react-icons/md';
import { IoCall, IoLocationSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
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
            <h3 className="text-4xl text-brand-600 mb-2 font-brand-500">
                {formatNumber(count)}{suffix}
            </h3>
            <p className="text-brand-400 text-lg font-bold capitalize">{label}</p>
        </div>
    );
};


const WorkStepCard = ({ number, title, description, index = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2, type: "spring", stiffness: 100 }}
            whileHover={{ y: -15, scale: 1.03 }}
            className={`bg-white rounded-3xl p-10 shadow-lg flex-1 relative z-10 cursor-pointer flex flex-col items-center group overflow-hidden border border-brand-50`}
        >
            <motion.div
                className={`flex items-center justify-center mx-auto mb-6 text-brand-100 text-[120px] font-brand-500 absolute -top-4 -left-4 opacity-30 z-0 transition-colors group-hover:text-brand-200`}
                transition={{ duration: 0.3 }}
            >
                {number}
            </motion.div>
            <h3 className={`text-brand-900 text-2xl font-brand-500 mb-4 text-center transition-colors duration-300 group-hover:text-brand-600 capitalize z-10 mt-8`}>{title}</h3>
            <p className={`text-brand-500 text-lg leading-relaxed text-center font-medium z-10`}>{description}</p>
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
        <div className="relative min-w-[300px] max-w-lg flex-1 flex justify-center">
            <button onClick={goPrev} className="absolute left-[-20px] md:left-[-40px] top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-3xl text-brand-300 z-20 hover:text-brand-600 transition-colors">&#8592;</button>
            <div className={`bg-white rounded-lg shadow-sm p-10 min-w-[280px] w-full flex flex-col items-center border border-brand-100 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                <img src={testimonials[index].avatar} alt={`${testimonials[index].name} avatar`} className="w-20 h-20 rounded-full object-cover border-4 border-brand-50 mb-6 shadow-sm" />
                <div className="font-brand-500 text-2xl text-brand-900 mb-2">{testimonials[index].name}</div>
                <div className="text-brand-500 text-2xl mb-6">
                    {Array(testimonials[index].rating).fill().map((_, i) => <span key={i}>&#9733;</span>)}
                </div>
                <div className="text-brand-600 text-lg text-center mb-8 leading-relaxed font-medium">
                    "{testimonials[index].review}"
                </div>
                <div className="text-brand-400 text-base font-bold">{testimonials[index].date}</div>
            </div>

            <button onClick={goNext} className="absolute right-[-20px] md:right-[-40px] top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-3xl text-brand-300 z-20 hover:text-brand-600 transition-colors">&#8594;</button>

            <div className="absolute bottom-[-40px] left-1/2 -translate-x-1/2 flex gap-3">
                {testimonials.map((_, i) => (
                    <span key={i} className={`w-${i === index ? '6' : '2'} h-2 rounded-full transition-all duration-300 ${i === index ? 'bg-brand-600' : 'bg-brand-200'}`}></span>
                ))}
            </div>
        </div>
    );
}


const FAQList = () => {
    const [openIndex, setOpenIndex] = useState(null);
    return (
        <div className="flex flex-col gap-6 w-full max-w-3xl">
            {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-lg shadow-sm p-8 cursor-pointer transition-all hover:shadow-md border border-brand-100" onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-brand-500 text-brand-900">{faq.question}</span>
                        <span className="ml-5 transition-transform duration-300 text-brand-600">
                            {openIndex === idx ? (
                                <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <rect x="10" y="17" width="16" height="2" rx="1" fill="currentColor" />
                                </svg>
                            ) : (
                                <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="17" stroke="currentColor" strokeWidth="3" fill="none" />
                                    <rect x="10" y="17" width="16" height="2" rx="1" fill="currentColor" />
                                    <rect x="17" y="10" width="2" height="16" rx="1" fill="currentColor" />
                                </svg>
                            )}
                        </span>
                    </div>
                    <AnimatePresence>
                        {openIndex === idx && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-5 text-brand-500 text-lg leading-relaxed font-medium">
                                    {faq.answer}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
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
                        <h1 className={`text-3xl font-brand-500 tracking-tight ${scrolled ? 'text-brand-900' : 'text-white drop-shadow-md'}`}>TradeWise</h1>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        {['Home', 'About', 'Services', 'Contact', 'Faq'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                onClick={(e) => { e.preventDefault(); scrollToSection(item.toLowerCase()); }}
                                className={`font-brand-500 transition-all relative group text-lg ${scrolled ? 'text-brand-500 hover:text-brand-900' : 'text-white/80 hover:text-white drop-shadow-sm'}`}
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
                                    className={`px-4 py-2 text-lg font-brand-500 transition-colors ${scrolled ? 'text-brand-600 hover:text-brand-900' : 'text-white hover:text-white/80 drop-shadow-sm'}`}
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
                        <div className="absolute inset-0 bg-brand-500/40" />
                    </motion.div>
                </AnimatePresence>

                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
                    <motion.div
                        key={`text-${current}`}
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
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
                            className="group relative inline-flex items-center gap-4 px-10 py-5 bg-white text-brand-900 rounded-lg text-lg font-brand-500 overflow-hidden transition-all hover:bg-brand-50 shadow-xl"
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
                    <div className="inline-block px-4 py-1.5 rounded-full bg-brand-50 text-brand-600 font-brand-500 text-sm tracking-widest mb-6 border border-brand-100 uppercase">
                        Our Story
                    </div>
                    <h2 className="text-5xl lg:text-7xl font-brand-500 mb-10 leading-tight text-brand-900 capitalize">
                        About <span className="text-brand-600">TradeWise</span>
                    </h2>

                    <p className="text-xl text-brand-500 leading-relaxed mb-8 font-medium">
                        TradeWise is built to transform the way traders and small businesses manage their operations.
                        We focus on delivering powerful insights without overwhelming you with complexity.
                        Whether you're tracking inventory, calculating profit, or analyzing trends, TradeWise helps you work smarter, faster, and more accurately.
                    </p>

                    <p className="text-xl text-brand-500 leading-relaxed mb-12 font-medium">
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
                            <span className="text-brand-900 text-lg font-brand-500 capitalize">Live Market Data</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Services Section */}
            <div id="services" className="py-32 bg-brand-600 relative overflow-hidden rounded-t-[4rem] md:rounded-t-[6rem] -mt-10 z-20 shadow-[0_-20px_50px_rgba(252,158,79,0.1)]">
                <div className="absolute inset-0 bg-[radial-gradient(#FC9E4F33_2px,transparent_2px)] bg-[size:30px_30px] opacity-70"></div>

                <motion.div
                    className="text-center mb-24 relative px-6 z-10"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white text-brand-600 font-brand-500 text-sm tracking-widest mb-6 shadow-md uppercase">
                        Our Process
                    </div>
                    <h4 className="text-white text-5xl lg:text-7xl font-brand-500 mb-8 capitalize">
                        Take A Look At Our Worksteps
                    </h4>
                    <p className="text-white/90 text-xl max-w-3xl mx-auto leading-relaxed font-medium">
                        Discover how TradeWise simplifies your trading journey with our intuitive three-step process.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row justify-between gap-12 px-6 lg:px-24 relative max-w-7xl mx-auto z-10">
                    <WorkStepCard
                        index={0}
                        number="1"
                        title="Enter Trade Details"
                        description="Input purchase price, selling price, and quantity for any asset with our user-friendly interface."
                    />
                    <WorkStepCard
                        index={1}
                        number="2"
                        title="Calculate Profits"
                        description="Get instant profit/loss, ROI, and fee calculations with our advanced algorithms."
                    />
                    <WorkStepCard
                        index={2}
                        number="3"
                        title="Track & Analyze"
                        description="Save trades to your journal and view performance trends over time with detailed analytics."
                    />
                </div>
            </div>

            <div className="bg-white py-32 px-6 lg:px-24 flex flex-col lg:flex-row justify-evenly items-center gap-16 flex-wrap relative overflow-hidden bg-[repeating-linear-gradient(45deg,#FC9E4F05,#FC9E4F05_1px,transparent_1px,transparent_10px)] rounded-b-[4rem] md:rounded-b-[6rem] shadow-xl z-30">
                <motion.div
                    className="max-w-xl min-w-[300px] flex-1 relative z-10"
                    initial={{ opacity: 0, scale: 0.9, x: -30 }}
                    whileInView={{ opacity: 1, scale: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="inline-block px-4 py-1.5 rounded-full bg-white text-brand-600 font-brand-500 text-sm tracking-widest mb-6 border-2 border-brand-600 uppercase">
                        Feedback
                    </div>
                    <h2 className="text-4xl lg:text-6xl font-brand-500 text-brand-900 mb-8 leading-tight capitalize">
                        What People Think<br />About <span className="text-brand-600">TradeWise</span>
                    </h2>
                    <p className="text-brand-500 text-xl mb-8 leading-relaxed font-medium">
                        Users rave about TradeWise's efficiency and reliability. Many have praised the smart trading calculator for significantly reducing their time spent on calculations and making their trading experience smoother. The privacy-first approach is also highly appreciated, ensuring users' data is always secure.
                    </p>
                    <p className="text-brand-500 text-xl leading-relaxed font-medium">
                        Additionally, TradeWise has received high marks for its accurate and real-time analytics, helping users make better trading decisions. The platform is also lauded for its user-friendly interface and comprehensive reporting tools.
                    </p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    <TestimonialCarousel />
                </motion.div>
            </div>

            {/* Contact Section */}
            <div id="contact" className="bg-white py-32 flex flex-col items-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#FC9E4F08_1px,transparent_1px),linear-gradient(to_bottom,#FC9E4F08_1px,transparent_1px)] bg-[size:64px_64px]"></div>
                <div className="px-6 py-2 rounded-full bg-brand-500 text-white font-brand-500 text-sm tracking-widest mb-8 shadow-md border-2 border-brand-500 flex items-center gap-3 z-10 uppercase">
                    <FaRegCommentDots size={18} />
                    Get In Touch
                </div>

                <h2 className="text-center text-5xl lg:text-7xl font-brand-500 mb-10 tracking-tight z-10 leading-[1.1] text-brand-900 capitalize">
                    Any <span className="text-brand-600 underline decoration-brand-200 underline-offset-8">Insights</span> ?<br />
                    Feel Free To <span className="text-brand-600">Contact</span> Us
                </h2>

                <p className="text-brand-500 font-medium text-center text-xl max-w-2xl mx-auto mb-20 leading-relaxed px-6 z-10">
                    Discover valuable insights and solutions tailored to your trading needs. Contact us today to learn more about how we can streamline your journey and enhance your experience.
                </p>

                <motion.form
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3, type: "spring" }}
                    className="w-full max-w-5xl mx-auto flex flex-col gap-10 px-6 z-10"
                >
                    <div className="flex gap-10 flex-wrap">
                        <div className="flex-1 min-w-[300px]">
                            <label className="text-brand-900 text-lg ml-2 mb-3 block font-bold capitalize">Your Name</label>
                            <div className="flex items-center bg-white rounded-lg px-6 py-5 border-2 border-brand-600 focus-within:border-brand-500 transition-all group shadow-sm">
                                <FaUser size={18} className="text-brand-500 group-focus-within:scale-110 transition-all z-10" />
                                <input type="text" name="name" placeholder="Enter Your Name" value={contactUsData.name} onChange={handleContactUsDataChange} className="bg-transparent border-none outline-none text-brand-900 text-lg ml-5 w-full placeholder-gray-400 font-medium z-10" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-[300px]">
                            <label className="text-brand-900 text-lg ml-2 mb-3 block font-bold capitalize">Your Email</label>
                            <div className="flex items-center bg-white rounded-lg px-6 py-5 border-2 border-brand-600 focus-within:border-brand-500 transition-all group shadow-sm">
                                <MdEmail size={20} className="text-brand-500 group-focus-within:scale-110 transition-all z-10" />
                                <input type="email" name="email" placeholder="Enter Your Email" value={contactUsData.email} onChange={handleContactUsDataChange} className="bg-transparent border-none outline-none text-brand-900 text-lg ml-5 w-full placeholder-gray-400 font-medium z-10" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 relative z-10">
                        <label className="text-brand-900 text-lg ml-2 mb-3 block font-bold capitalize">Your Message</label>
                        <div className="flex items-start bg-white rounded-lg px-6 py-5 border-2 border-brand-600 focus-within:border-brand-500 transition-all group shadow-sm">
                            <FaRegCommentDots size={20} className="text-brand-500 mt-1 group-focus-within:scale-110 transition-all" />
                            <textarea placeholder="Enter Your Message" name="message" value={contactUsData.message} onChange={handleContactUsDataChange} className="bg-transparent border-none outline-none text-brand-900 text-lg ml-5 w-full min-h-[160px] resize-none placeholder-gray-400 font-medium" />
                        </div>
                    </div>
                    <div className="flex justify-center mt-6">
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-brand-600 text-white px-16 py-5 rounded-xl text-xl font-brand-500 shadow-xl hover:bg-brand-700 transition-all border border-brand-50"
                            onClick={handleContactUs}
                        >
                            {sending ? 'Sending...' : 'Send Message'}
                        </motion.button>
                    </div>
                </motion.form>
            </div>

            {/* FAQ Section */}
            <div id="faq" className="bg-brand-500 text-white px-6 lg:px-48 py-32 relative overflow-hidden rounded-t-[4rem] md:rounded-t-[6rem] -mt-10 z-20 border-t-8 border-brand-500 shadow-[0_-20px_50px_rgba(252,158,79,0.2)]">
                <div className="absolute inset-0 bg-[radial-gradient(#FC9E4F1a_1px,transparent_1px)] bg-[size:16px_16px] opacity-70"></div>
                <motion.div
                    className="flex justify-center items-center flex-wrap flex-col z-10 relative"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="text-center max-w-3xl mb-16">
                        <div className="inline-block px-4 py-1.5 rounded-full bg-white text-brand-500 font-brand-500 text-sm tracking-widest mb-6 border-2 border-white uppercase">
                            FAQ
                        </div>
                        <h2 className="text-white text-4xl lg:text-6xl font-brand-500 mb-8 capitalize">
                            Does This Sound Like Your{" "}
                            <span className="text-brand-600">Question?</span>
                        </h2>
                        <p className="text-brand-500 text-xl leading-relaxed font-medium">
                            Find answers to commonly asked questions about our products and
                            services here. Can't find what you're looking for? Reach out for
                            personalized help.
                        </p>
                    </div>
                    <FAQList />
                </motion.div>
            </div>

            <Footer />
        </div>
    );
}

export default Home;
