import React, { useEffect, useState } from 'react';
import images from '../utils/images';
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight, Star, Mail, Phone, Clock, MessageCircle, Send } from "lucide-react";
import { Typewriter } from 'react-simple-typewriter';
import backendApi from '../utils/axiosInstance';
import { toast } from '../utils/toast';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser } from '../features/auth/authThuck';
import { handleError } from '../utils/handleError';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const testimonials = [
    {
        name: 'Alice M.',
        avatar: '/Profile1.jpg',
        rating: 5,
        review: <> <span className="font-nosifer font-normal">Stocka</span> has helped me understand my trades with clear insights and reliable tools. It makes tracking performance simple, and I feel confident making decisions with it.</>,
        date: 'June 13, 2024'
    },
    {
        name: 'Sarah K.',
        avatar: '/Profile3.jpg',
        rating: 3,
        review: "The platform offers clean analytics and helpful breakdowns that make my trading easier. I can quickly view my results and stay organized without feeling overwhelmed.",
        date: 'June 10, 2024'
    },
    {
        name: 'John D.',
        avatar: '/Profile2.jpg',
        rating: 4,
        review: <>I really like how <span className="font-nosifer font-normal">Stocka</span> protects my information while giving me meaningful insights into my profit margins. The system feels secure, and the organized data helps me evaluate trades.</>,
        date: 'June 7, 2024'
    }
];

const faqs = [
    {
        question: <>What is <span className="font-nosifer font-normal text-sm">Stocka</span> for modern traders?</>,
        answer: <><span className="font-nosifer font-normal text-sm">Stocka</span> is a high-fidelity transaction tracker designed for professional traders. It helps you manage expenses, debits, and credits while providing weekly profit/loss analytics flights.</>
    },
    {
        question: 'How do I use the app to track my capital?',
        answer: 'Our platform allows you to record every buy and sell transaction instantly. The system then automatically calculates your inflow/outflow and net benefit.'
    },
    {
        question: 'Is the platform free to use?',
        answer: <><span className="font-nosifer font-normal text-sm">Stocka</span> offers a tiered model starting with a robust free trial. We provide premium features for traders who need deep analytics and global infrastructure support.</>
    },
    {
        question: 'What types of transactions can I record?',
        answer: 'You can record all financial incidents including procurement costs, operational expenses, sales revenue, and credit/debit adjustments.'
    },
    {
        question: 'How secure is my trade data?',
        answer: 'Your data is stored with enterprise-grade encryption. Only you have access to your financial records, ensuring complete privacy for your trading strategies.'
    }
];

const FAQList = () => {
    const [openIndex, setOpenIndex] = useState(null);
    return (
        <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto px-6 relative z-10">
            {faqs.map((faq, idx) => {
                const isOpen = openIndex === idx;
                return (
                    <motion.div
                        key={idx}
                        layout
                        className={`group relative overflow-hidden transition-all duration-500 rounded-3xl border cursor-pointer ${isOpen ? 'bg-white border-brand-400 shadow-premium' : 'bg-white/80 backdrop-blur-sm border-brand-50 hover:border-brand-200'}`}
                    >
                        <button
                            onClick={() => setOpenIndex(isOpen ? null : idx)}
                            className="w-full px-10 py-6 flex items-center justify-between text-left transition-all cursor-pointer"
                        >
                            <span className={`text-xl font-bold transition-colors duration-300 ${isOpen ? 'text-[#09111E]' : 'text-obsidian-600'}`}>
                                {faq.question}
                            </span>
                            <div className={`flex-shrink-0 ml-8 w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-[#09111E] border-[#09111E] text-white rotate-180' : 'border-brand-100 text-brand-400 group-hover:border-brand-400'}`}>
                                <ChevronRight size={20} className={`transition-transform duration-500 ${isOpen ? 'rotate-90' : 'rotate-0'}`} />
                            </div>
                        </button>

                        <AnimatePresence>
                            {isOpen && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                                >
                                    <div className="px-10 pb-10 pt-0">
                                        <div className="w-full h-px bg-brand-50 mb-8" />
                                        <p className="text-lg text-obsidian-500 leading-relaxed font-semibold">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
};

const Home = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
            await backendApi.post('/email/contact-us', contactUsData);
            toast.success("Message sent successfully");
        } catch (error) {
            const parsedError = handleError(error);
            toast.error(parsedError.message);
        } finally {
            setSending(false);
            setContatUsData({ name: '', email: '', message: '' });
        }
    };

    useEffect(() => {
        if (user === null) {
            dispatch(fetchUser());
        }
    }, [user, dispatch]);


    return (
        <div className="text-[#09111E] bg-white selection:bg-brand-500 selection:text-white overflow-x-hidden">
            <Header />

            <div id="home" className="relative w-full min-h-screen overflow-hidden flex items-center pt-24 pb-12">
                {/* Dynamic Mesh Gradient Background */}
                <div className="absolute inset-0 bg-[#09111E] overflow-hidden pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 2 }}
                        className="absolute inset-0"
                    >
                        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-blue-600/20 blur-[120px] animate-pulse" />
                        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-brand-500/30 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                    </motion.div>

                    <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true">
                        <defs>
                            <pattern id="diamondHero" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
                                <path d="M36,2 L70,36 L36,70 L2,36 Z" fill="none" stroke="rgba(102,124,155,0.4)" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#diamondHero)" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <motion.div
                            className="flex-1 text-left"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        >
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.8 }}
                                className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-[1.1]"
                            >
                                Master Your Trading Performance.
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="text-lg text-white/60 mb-12 max-w-xl leading-relaxed font-medium"
                            >
                                Empowering traders to track expenses, credits, and debits with surgical precision. Control your cash flow and optimize your profit margins in real-time.
                            </motion.p>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6, duration: 0.8 }}
                                className="flex flex-wrap gap-6"
                            >
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="px-8 py-4 bg-white text-[#09111E] rounded-md font-semibold text-lg hover:bg-brand-400 hover:text-white transition-all shadow-glow active:scale-95 flex items-center gap-3 group"
                                >
                                    Get Started
                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            className="flex-1 relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.4 }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-500/30 rounded-full blur-[120px] -z-10" />
                            <div className="absolute top-1/4 right-0 w-[200px] h-[300px] bg-blue-600/20 rounded-full blur-[100px] -z-10" />

                            <div className="relative group perspective-1000">
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative z-10 p-5 bg-white/[0.03] backdrop-blur-3xl rounded-2xl border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)]"
                                >
                                    <div className="relative overflow-hidden rounded-xl border cursor-pointer border-white/20 shadow-2xl transition-all duration-700 hover:shadow-brand-500/20 ring-1 ring-white/5">
                                        <img
                                            src={images.Stocka}
                                            alt="Dashboard Mockup"
                                            className="w-full h-auto grayscale contrast-125 brightness-50 group-hover:grayscale-0 group-hover:contrast-100 group-hover:brightness-100 transition-all duration-[800ms] ease-in-out transform group-hover:scale-[1.02]"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-[#09111E]/80 via-[#09111E]/20 to-brand-500/30 group-hover:opacity-0 transition-opacity duration-700 pointer-events-none" />
                                    </div>

                                    <motion.div
                                        className="absolute -top-8 -left-8 bg-brand-500/90 backdrop-blur-lg p-5 rounded-xl shadow-2xl border border-white/10 flex flex-col gap-1 items-start"
                                        animate={{ y: [0, 10, 0] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                            <div className="text-white/60 text-[10px] font-bold">Live Profit</div>
                                        </div>
                                        <div className="text-white font-black text-3xl">+18.4%</div>
                                    </motion.div>

                                    {/* Floating Element 2 - Bottom Right */}
                                    <motion.div
                                        className="absolute -bottom-10 -right-8 bg-[#09111E]/95 backdrop-blur-lg p-6 rounded-md cursor-pointer shadow-2xl border border-white/10 flex flex-col gap-4 items-start w-52"
                                        animate={{ y: [0, -12, 0] }}
                                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <div className="text-white/60 text-[10px] font-bold w-full flex justify-between">
                                            <span>Transactions</span>
                                            <span className="text-brand-400">Today</span>
                                        </div>
                                        <div className="flex items-end gap-2 w-full h-12">
                                            {[40, 70, 45, 90, 65, 100].map((h, i) => (
                                                <div key={i} className="flex-1 bg-white/10 rounded-t-sm relative group-hover:bg-brand-500 transition-colors duration-500" style={{ height: `${h}%` }}>
                                                    <div className="absolute bottom-0 left-0 w-full bg-brand-400 rounded-t-sm transition-all duration-700" style={{ height: h > 60 ? '100%' : '0%' }} />
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>

                                    {/* Floating Element 3 - Chip overlapping side */}
                                    <motion.div
                                        className="absolute top-1/2 -right-12 -translate-y-1/2 bg-white text-[#09111E] py-3 px-5 rounded-md shadow-2xl border border-white/20 font-bold text-sm flex items-center gap-2"
                                        animate={{ x: [0, -10, 0] }}
                                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                                    >
                                        27+ Active Traders
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* About Section - Modern & Innovative */}
            <section id="about" className="relative py-32 bg-white overflow-hidden">
                {/* Decorative Background for About */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        animate={{
                            scale: [1, 1.2, 1],
                            x: [0, 50, 0],
                            y: [0, 30, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-brand-50/50 rounded-full blur-[100px]"
                    />
                    <motion.div
                        animate={{
                            scale: [1.2, 1, 1.2],
                            x: [0, -40, 0],
                            y: [0, -20, 0]
                        }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-50/40 rounded-full blur-[120px]"
                    />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-20">
                        {/* Innovation Side */}
                        <motion.div
                            className="lg:w-1/2"
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block px-4 py-1.5 rounded-md bg-brand-50 text-brand-500 font-bold text-sm mb-8 border border-brand-100">
                                Trade Analytics
                            </div>
                            <h2 className="text-4xl lg:text-7xl font-black text-[#09111E] mb-8 leading-[1.05]">
                                Complete clarity on your <br />
                                <span className="text-brand-400">trade capital.</span>
                            </h2>
                            <p className="text-xl text-[#09111E]/60 leading-relaxed font-medium mb-12 max-w-xl">
                                <span className="font-nosifer font-normal text-lg">Stocka</span> provides a high-fidelity environment for recording buy and sell transactions. Monitor every Frw of inflow and outflow to calculate your true weekly benefit.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-8 bg-white cursor-pointer rounded-2xl border border-brand-100 group hover:bg-[#09111E] transition-all duration-500 shadow-soft hover:shadow-2xl"
                                >
                                    <h4 className="text-xl font-bold text-[#09111E] mb-3 group-hover:text-white transition-colors">Inflow control</h4>
                                    <p className="text-[#09111E]/50 group-hover:text-white/60 text-sm font-medium transition-colors">Track every credit and deposit to your trading account.</p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ y: -5 }}
                                    className="p-8 bg-white cursor-pointer rounded-2xl border border-brand-100 group hover:bg-[#09111E] transition-all duration-500 shadow-soft hover:shadow-2xl"
                                >
                                    <h4 className="text-xl font-bold text-[#09111E] mb-3 group-hover:text-white transition-colors">Outflow tracking</h4>
                                    <p className="text-[#09111E]/50 group-hover:text-white/60 text-sm font-medium transition-colors">Record expenses, debits, and procurement costs instantly.</p>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Visual Side */}
                        <motion.div
                            className="lg:w-1/2 relative"
                            initial={{ opacity: 0, scale: 0.9, rotateY: 20 }}
                            whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                        >
                            <div className="relative z-10 bg-[#09111E] p-10 rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 group overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-brand-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <div className="mb-10 flex items-center justify-between relative z-10">
                                    <h4 className="text-white font-bold text-lg">Weekly performance</h4>
                                    <div className="flex gap-1.5">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-end justify-between h-48 gap-4 relative z-10">
                                    {[60, 40, 90, 70, 100, 80, 110].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                                            className={`flex-1 rounded-t-lg ${h > 80 ? 'bg-brand-400' : 'bg-white/20'}`}
                                        />
                                    ))}
                                </div>
                                <div className="mt-10 pt-10 border-t border-white/5 grid grid-cols-2 gap-10 relative z-10">
                                    <div>
                                        <div className="text-white/40 text-[10px] font-bold mb-2">Total revenue</div>
                                        <div className="text-white font-black text-2xl">4.2M Frw</div>
                                    </div>
                                    <div>
                                        <div className="text-white/40 text-[10px] font-bold mb-2">Net profit</div>
                                        <div className="text-white font-black text-2xl">+18%</div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-400/20 rounded-full blur-[80px]" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Services Section - Premium & Professional */}
            <section id="services" className="relative py-32 bg-brand-50/50 overflow-hidden">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                    style={{ backgroundImage: 'radial-gradient(#09111E 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="inline-block px-4 py-1.5 rounded-md bg-brand-400/10 border border-brand-400/20 text-brand-400 font-bold text-sm mb-6"
                        >
                            Financial Ecosystem
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl lg:text-7xl font-black text-[#09111E] leading-tight"
                        >
                            Track every coin <br />
                            <span className="text-brand-400">with ease.</span>
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { title: "Transaction tracking", icon: <Clock />, desc: "Record every buy and sell incident instantly." },
                            { title: "Profit/Loss insights", icon: <Star />, desc: "Weekly analytics to see your business growth." },
                            { title: "Cash flow control", icon: <Mail />, desc: "Monitor debits, credits, and operational expenses." },
                            { title: "Weekly performance", icon: <ArrowRight />, desc: "Visual graphs representing your financial trends." }
                        ].map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.15, duration: 0.6 }}
                                whileHover={{ y: -10, transition: { duration: 0.3 } }}
                                className="p-10 bg-white rounded-3xl border border-brand-100/50 shadow-soft hover:shadow-2xl cursor-pointer hover:border-brand-400 transition-all duration-500 group"
                            >
                                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center text-brand-400 mb-8 group-hover:bg-[#09111E] group-hover:text-white transition-all duration-500 shadow-inner">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#09111E] mb-4">
                                    {service.title}
                                </h3>
                                <p className="text-[#09111E]/50 leading-relaxed font-semibold group-hover:text-brand-400 transition-colors">
                                    {service.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials - Deep Contrast Background */}
            <section className="relative py-32 bg-[#09111E] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-blue-900/20 rounded-full blur-[150px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl lg:text-6xl font-black text-white mb-20 leading-tight"
                    >
                        Success Stories from <br />
                        Our Global Partners.
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2, duration: 0.6 }}
                                whileHover={{ y: -12 }}
                                className="p-12 bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 text-left hover:bg-white/[0.07] transition-all duration-500 group relative"
                            >
                                <div className="absolute top-0 left-10 w-20 h-1 bg-brand-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="flex gap-1.5 mb-10">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} size={18} className="fill-brand-400 text-brand-400" />
                                    ))}
                                </div>
                                <p className="text-white/80 text-lg font-medium leading-relaxed mb-12 min-h-[120px] italic">
                                    "{testimonial.review}"
                                </p>
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-brand-400/20 p-0.5 overflow-hidden ring-2 ring-white/5 group-hover:ring-brand-400/30 transition-all">
                                        <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover rounded-[0.9rem]" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-lg">{testimonial.name}</div>
                                        <div className="text-brand-400 text-[11px] font-bold mt-1">{testimonial.date}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contact" className="relative py-32 bg-white overflow-hidden">
                {/* Background Mesh Gradient */}
                <div className="absolute inset-0 pointer-events-none opacity-40">
                    <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-brand-50/60 rounded-full blur-[80px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="bg-[#09111E] rounded-[2rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] relative border border-white/5">
                        <div className="flex flex-col lg:flex-row">
                            <div className="lg:w-[45%] p-12 lg:p-18 relative z-10 bg-[#09111E]">
                                <motion.div
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="space-y-12 mb-12"
                                >
                                    <div>
                                        <h2 className="text-4xl lg:text-7xl font-black text-white mb-8 leading-[1.05]">
                                            Let’s Scale <br />
                                            Together.
                                        </h2>
                                        <p className="text-white/60 text-xl font-medium leading-relaxed">
                                            Our engineers are ready to help you integrate <span className="font-nosifer font-normal text-lg">Stocka</span> into your global workflow.
                                        </p>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="flex items-center gap-8 group">
                                            <div className="w-16 h-16 rounded-md bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500 shadow-glow cursor-pointer">
                                                <Mail className="text-white group-hover:text-[#09111E]" size={28} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-lg">Email Inquiry</div>
                                                <div className="text-white/40 font-semibold text-base mt-0.5">tradewise.app456@gmail.com</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8 group">
                                            <div className="w-16 h-16 rounded-md bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all duration-500 shadow-glow cursor-pointer">
                                                <Phone className="text-white group-hover:text-[#09111E]" size={28} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold text-lg">Phone Number</div>
                                                <div className="text-white/40 font-semibold text-base mt-0.5">+250 785 805 869</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <div className="text-white font-nosifer font-black text-[1.8rem] absolute select-none leading-none">STOCKA</div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="flex-1 p-16 lg:p-24 bg-white relative">
                                <motion.div
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8 }}
                                    className="space-y-12"
                                >
                                    <form onSubmit={handleContactUs} className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-[#09111E] font-bold text-sm pl-2 opacity-60">Full Name</label>
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={contactUsData.name}
                                                        onChange={handleContactUsDataChange}
                                                        placeholder="Enter your name"
                                                        className="w-full px-8 py-4 bg-brand-50 border border-brand-100 rounded-lg focus:outline-none focus:ring-8 focus:ring-brand-400/5 focus:border-brand-400 transition-all font-semibold text-brand-650 placeholder:text-[#09111E]/30"
                                                        required
                                                    />
                                                    <FaUser className="absolute right-8 top-1/2 -translate-y-1/2 text-brand-200 group-focus-within:text-brand-400 transition-colors" />
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[#09111E] font-bold text-sm pl-2 opacity-60">Business Email</label>
                                                <div className="relative group">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={contactUsData.email}
                                                        onChange={handleContactUsDataChange}
                                                        placeholder="name@company.com"
                                                        className="w-full px-8 py-4 bg-brand-50 border border-brand-100 rounded-lg focus:outline-none focus:ring-8 focus:ring-brand-400/5 focus:border-brand-400 transition-all font-semibold text-brand-650 placeholder:text-[#09111E]/30"
                                                        required
                                                    />
                                                    <Mail className="absolute right-8 top-1/2 -translate-y-1/2 text-brand-200 group-focus-within:text-brand-400 transition-colors" size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[#09111E] font-bold text-sm pl-2 opacity-60">Inquiry Details</label>
                                            <div className="relative group">
                                                <textarea
                                                    name="message"
                                                    value={contactUsData.message}
                                                    onChange={handleContactUsDataChange}
                                                    placeholder="Tell us about your requirements..."
                                                    rows={5}
                                                    className="w-full px-8 py-6 bg-brand-50 border border-brand-100 rounded-lg focus:outline-none focus:ring-8 focus:ring-brand-400/5 focus:border-brand-400 transition-all font-semibold text-brand-650 placeholder:text-[#09111E]/30 resize-none"
                                                    required
                                                />
                                                <MessageCircle className="absolute right-8 bottom-8 text-brand-200 group-focus-within:text-brand-400 transition-colors" size={24} />
                                            </div>
                                        </div>

                                        <motion.button
                                            type="submit"
                                            disabled={sending}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-fit px-8 py-4 text-center justify-center items-center bg-[#09111E] text-white rounded-lg font-semibold text-lg hover:bg-brand-600 transition-all shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] flex gap-5 disabled:opacity-50"
                                        >
                                            {sending ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <>Send Message <Send size={24} /></>}
                                        </motion.button>
                                    </form>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="faq" className="relative py-32 bg-brand-50/20 overflow-hidden">
                {/* Decorative Shapes for FAQ */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[1px] h-full bg-brand-400 opacity-10" />
                    <div className="absolute top-0 right-1/4 w-[1px] h-full bg-brand-400 opacity-10" />
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-brand-400 opacity-10" />
                </div>

                <div className="max-w-4xl mx-auto text-center mb-24 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-5 py-2 rounded-md bg-brand-400/10 text-brand-400 font-bold text-[14px] mb-8 border border-brand-400/20"
                    >
                        Common Questions
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl lg:text-7xl font-black text-[#09111E] mb-8 leading-tight"
                    >
                        Frequently Asked <br />
                        <span className="text-brand-400">Questions.</span>
                    </motion.h2>
                </div>
                <FAQList />
            </section>

            <Footer />
        </div>
    );
}

export default Home;
