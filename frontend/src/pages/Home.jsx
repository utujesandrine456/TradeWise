import React, { useEffect, useState, useRef } from 'react';
import images from '../utils/images';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
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
        review: "The platform offers clean analytics and helpful breakdowns that make my trading easier. I can quickly view my results and stay organized without feeling overwhelmed.",
        date: 'June 10, 2024'
    },
    {
        name: 'John D.',
        avatar: '/Profile2.jpg',
        rating: 4,
        review: "I really like how Stocka protects my information while giving me meaningful insights into my profit margins. The system feels secure, and the organized data helps me evaluate trades.",
        date: 'June 7, 2024'
    }
];


const faqs = [
    {
        question: 'What is Stocka for modern traders?',
        answer: 'Stocka is a high-fidelity transaction tracker designed for professional traders. It helps you manage expenses, debits, and credits while providing weekly profit/loss analytics.'
    },
    {
        question: 'How do I use the app to track my capital?',
        answer: 'Our platform allows you to record every buy and sell transaction instantly. The system then automatically calculates your inflow/outflow and net benefit.'
    },
    {
        question: 'Is the platform free to use?',
        answer: 'Stocka offers a tiered model starting with a robust free trial. We provide premium features for traders who need deep analytics and global infrastructure support.'
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
                            className="w-full px-8 py-4 flex items-center justify-between text-left transition-all cursor-pointer"
                        >
                            <span className={`text-lg font-semibold font-brand-500 transition-colors duration-300 ${isOpen ? 'text-obsidian-800' : 'text-obsidian-600'}`}>
                                {faq.question}
                            </span>
                            <div className={`flex-shrink-0 ml-8 w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-brand-500 border-brand-500 text-white rotate-180' : 'border-brand-200 text-brand-500 group-hover:border-brand-200'}`}>
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
        <div className="text-[#09111E] bg-white selection:bg-brand-500 selection:text-white overflow-x-hidden">
            <Header />

            <div id="home" className="relative w-full min-h-screen overflow-hidden flex items-center pt-24 pb-12">
                <div className="absolute inset-0 bg-[#09111E] overflow-hidden pointer-events-none">
                    <svg className="absolute inset-0 w-full h-full">
                        <defs>
                            <pattern id="diamondHero" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
                                <path d="M36 2 L70 36 L36 70 L2 36 Z" fill="none" stroke="rgba(102,124,155,0.25)" strokeWidth="1.2" />
                                <path d="M36 14 L58 36 L36 58 L14 36 Z" fill="none" stroke="rgba(102,124,155,0.1)" strokeWidth="0.8" />
                            </pattern>
                        </defs>
                        <rect x="0" y="0" width="100%" height="100%" fill="url(#diamondHero)" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        <motion.div
                            className="flex-1 text-left"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white mb-8 leading-[1.1] tracking-tight">
                                Master Your Trading Performance.
                            </h1>
                            <p className="text-lg text-white/60 mb-12 max-w-xl leading-relaxed font-medium">
                                Empowering traders to track expenses, credits, and debits with surgical precision. Control your cash flow and optimize your profit margins in real-time.
                            </p>
                            <div className="flex flex-wrap gap-6">
                                <button
                                    onClick={() => navigate('/signup')}
                                    className="px-6 py-4 bg-white text-[#09111E] rounded-md font-semibold text-lg hover:bg-[#09111E] transition-all shadow-glow active:scale-95 flex items-center gap-3"
                                >
                                    Get Started <ArrowRight size={20} />
                                </button>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex-1 relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.2, delay: 0.4 }}
                        >
                            <div className="relative group">
                                <motion.div
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                    className="relative z-10 p-4 bg-white/5 backdrop-blur-3xl rounded-md border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
                                >
                                    <div className="relative overflow-hidden rounded-md border border-white/10">
                                        <img
                                            src={images.Stocka}
                                            alt="Dashboard Mockup"
                                            className="w-full h-auto grayscale-[0.2] brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-brand-600/40 to-transparent" />
                                    </div>

                                    <motion.div
                                        className="absolute -top-6 -left-6 bg-brand-500 p-6 rounded-md shadow-glow border border-brand-400/50"
                                        whileHover={{ scale: 1.1, rotate: -3 }}
                                    >
                                        <div className="text-white font-bold text-2xl">+18.4%</div>
                                        <div className="text-white/60 text-[10px] font-bold">Net benefit</div>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* About Section - Modern & Innovative */}
            <section id="about" className="relative py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        {/* Innovation Side */}
                        <motion.div
                            className="lg:w-1/2"
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                        >
                            <div className="inline-block px-4 py-1.5 rounded-md bg-brand-50 text-brand-500 font-bold text-sm mb-8 border border-brand-100">
                                Trade Analytics
                            </div>
                            <h2 className="text-4xl lg:text-7xl font-black text-[#09111E] mb-8 leading-tight">
                                Complete clarity on your <br />
                                <span className="text-brand-500">trade capital.</span>
                            </h2>
                            <p className="text-xl text-[#09111E]/60 leading-relaxed font-medium mb-12 max-w-xl">
                                Stocka provides a high-fidelity environment for recording buy and sell transactions. Monitor every Frw of inflow and outflow to calculate your true weekly benefit.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-6 bg-brand-50 cursor-pointer rounded-md border border-brand-100 group hover:bg-[#09111E] transition-colors duration-500">
                                    <h4 className="text-xl font-bold text-[#09111E] mb-2 group-hover:text-white transition-colors">Inflow control</h4>
                                    <p className="text-[#09111E]/50 group-hover:text-white/60 text-sm font-medium transition-colors">Track every credit and deposit to your trading account.</p>
                                </div>
                                <div className="p-6 bg-brand-50 cursor-pointer rounded-md border border-brand-100 group hover:bg-[#09111E] transition-colors duration-500">
                                    <h4 className="text-xl font-bold text-[#09111E] mb-2 group-hover:text-white transition-colors">Outflow tracking</h4>
                                    <p className="text-[#09111E]/50 group-hover:text-white/60 text-sm font-medium transition-colors">Record expenses, debits, and procurement costs instantly.</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Visual Side */}
                        <motion.div
                            className="lg:w-1/2 relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                        >
                            <div className="relative z-10 bg-brand-500 p-8 rounded-md shadow-2xl border border-white/5">
                                <div className="mb-8 flex items-center justify-between">
                                    <h4 className="text-white font-bold text-lg">Weekly performance</h4>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-end justify-between h-40 gap-3">
                                    {[60, 40, 90, 70, 100, 80, 110].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            whileInView={{ height: `${h}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className={`flex-1 rounded-t-sm ${h > 80 ? 'bg-white' : 'bg-white/40'}`}
                                        />
                                    ))}
                                </div>
                                <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-8">
                                    <div>
                                        <div className="text-white/40 text-[10px] font-bold mb-1">Total revenue</div>
                                        <div className="text-white font-black text-xl">4.2M Frw</div>
                                    </div>
                                    <div>
                                        <div className="text-white/40 text-[10px] font-bold mb-1">Net profit</div>
                                        <div className="text-white font-black text-xl">+18%</div>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -top-12 -right-12 w-64 h-64 bg-brand-500/10 rounded-full blur-[80px]" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Services Section - Premium & Professional */}
            <section id="services" className="relative py-24 bg-brand-50/30 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <div className="inline-block px-4 py-1.5 rounded-md bg-brand-500/10 border border-brand-500/20 text-[#09111E] font-bold text-sm mb-6">
                            Financial Ecosystem
                        </div>
                        <h2 className="text-4xl lg:text-7xl font-black text-[#09111E] leading-tight">
                            Track every coin <br />
                            <span className="text-brand-500">with ease.</span>
                        </h2>
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
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-10 bg-white rounded-md border border-brand-100/50 shadow-sm hover:shadow-xl cursor-pointer hover:border-brand-500 transition-all duration-500 group"
                            >
                                <div className="w-16 h-16 bg-brand-50 rounded-md flex items-center justify-center text-brand-500 mb-8 group-hover:bg-[#09111E] group-hover:text-white transition-all duration-500">
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-bold text-[#09111E] mb-4 tracking-tight">
                                    {service.title}
                                </h3>
                                <p className="text-[#09111E]/50 leading-relaxed font-semibold">
                                    {service.desc}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials - Deep Contrast Background */}
            <section className="relative py-20 bg-[#09111E] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-px bg-white/5" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-4xl lg:text-6xl font-black text-white mb-16"
                    >
                        Success Stories from <br />
                        Our Global Partners.
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
                                        <Star key={i} size={18} className="fill-white text-white" />
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
                                        <div className="text-white/40 text-[10px] font-bold ">{testimonial.date}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="contact" className="relative py-20 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="bg-[#09111E] rounded-[3rem] overflow-hidden shadow-2xl relative">

                        <div className="flex flex-col lg:flex-row">
                            <div className="lg:w-[45%] p-12 lg:p-20 relative z-10 bg-[#09111E]">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="space-y-12 mb-12"
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
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-50 group-hover:border-white transition-all duration-500">
                                                <Mail className="text-white group-hover:text-[#09111E]" size={24} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">Email Inquiry</div>
                                                <div className="text-white/40 font-semibold">tradewise.app456@gmail.com</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6 group">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-50 group-hover:border-white transition-all duration-500">
                                                <Phone className="text-white group-hover:text-[#09111E]" size={24} />
                                            </div>
                                            <div>
                                                <div className="text-white font-bold">Phone Number</div>
                                                <div className="text-white/40 font-semibold">+250 785 805 869</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="">
                                        <div className="text-white/30 font-black text-7xl absolute select-none text-center justify-center items-center">STOCKA</div>
                                    </div>
                                </motion.div>
                            </div>

                            <div className="flex-1 p-12 lg:p-20 bg-white relative">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    className="space-y-10"
                                >
                                    <form onSubmit={handleContactUs} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-3">
                                                <label className="text-[#09111E] font-bold text-sm pl-1">Full Name</label>
                                                <div className="relative group">
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={contactUsData.name}
                                                        onChange={handleContactUsDataChange}
                                                        placeholder="Enter your name"
                                                        className="w-full px-6 py-5 bg-brand-50 border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-brand-650 placeholder:text-[#09111E]/40"
                                                        required
                                                    />
                                                    <FaUser className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-200 group-focus-within:text-brand-500 transition-colors" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <label className="text-[#09111E] font-bold text-sm pl-1">Business Email</label>
                                                <div className="relative group">
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={contactUsData.email}
                                                        onChange={handleContactUsDataChange}
                                                        placeholder="name@company.com"
                                                        className="w-full px-6 py-5 bg-brand-50 border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-brand-650 placeholder:text-[#09111E]/40"
                                                        required
                                                    />
                                                    <Mail className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-200 group-focus-within:text-brand-500 transition-colors" size={20} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-[#09111E] font-bold text-sm pl-1">Inquiry Details</label>
                                            <div className="relative group">
                                                <textarea
                                                    name="message"
                                                    value={contactUsData.message}
                                                    onChange={handleContactUsDataChange}
                                                    placeholder="Tell us about your requirements..."
                                                    rows={4}
                                                    className="w-full px-6 py-5 bg-brand-50 border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all font-medium text-brand-650 placeholder:text-[#09111E]/40 resize-none"
                                                    required
                                                />
                                                <MessageCircle className="absolute right-6 bottom-6 text-brand-200 group-focus-within:text-brand-500 transition-colors" size={20} />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className="w-fit px-8 py-4 text-center justify-center items-center bg-[#09111E] text-white rounded-lg font-bold text-lg hover:bg-[#09111E] transition-all shadow-glow active:scale-95 flex gap-4 disabled:opacity-50"
                                        >
                                            {sending ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-md animate-spin" /> : <>Transmit Message <Send size={22} /></>}
                                        </button>
                                    </form>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="faq" className="relative py-20 bg-white overflow-hidden">
                <div className="max-w-4xl mx-auto text-center mb-20 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="inline-block px-5 py-2 rounded-md bg-brand-50 text-brand-500 font-bold text-[14px] mb-8 border border-brand-100 "
                    >
                        Common Questions
                    </motion.div>
                    <h2 className="text-4xl lg:text-6xl font-black text-[#09111E] mb-6">
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
