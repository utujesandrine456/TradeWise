import React, { useEffect, useState } from 'react'
import styles from './Home.module.css'
import logo from '../assets/logo.png'
import { FaUser, FaRegCommentDots } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { FaTwitter } from 'react-icons/fa';
import { IoCall } from "react-icons/io5";
import { IoLocationSharp } from "react-icons/io5";
import { PiDownloadSimpleBold } from "react-icons/pi";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Typewriter } from 'react-simple-typewriter';




const slides = [
  {
    image: "./src/assets/TradeWis.jpg",
    title: "Trade with Precision & Confidence",
    desc: "Track your profits, losses, and ROI instantly with real-time analytics. TradeWise gives you clarity to see where your money goes and how it grows. Every trade is guided by data-driven insights for smarter investing. Make informed decisions and maximize your returns effortlessly.",
  },
  {
    image: "./src/assets/Smile.jpg",
    title: "Smart Insights, Smarter Decisions",
    desc: "Leverage AI-powered tools to identify market trends quickly. TradeWise analyzes patterns to help you make informed choices. Gain insights that turn data into actionable strategies. Make every trade count with confidence and precision.",
  },
  {
    image: "./src/assets/Devices.jpg",
    title: "Grow Your Portfolio Effortlessly",
    desc: "Manage and monitor all your investments from one dashboard. Stay ahead of the market with live updates and intelligent analytics. TradeWise helps you plan, invest, and grow systematically. Achieve your financial goals with clarity and ease.",
  },
];




const Home = () => {
    const [current, setcurrent ] = useState(0);

    const nextSlide = () => setcurrent((current + 1) % slides.length);
    const prevSlide = () => setcurrent((current -1 + slides.length) % slides.length);
    
    useEffect(() => {
        const timer = setInterval(() => {
            setcurrent((prev) => (prev + 1)  % slides.length);
        }, 14000);
        return () => clearInterval(timer);
    },[]);
    

  return (
    <>
        <div className={styles.home_container}>
            <div className={styles.home_navbar}>
                <img src={logo} alt="logo"  className={styles.home_navbar_logo}/>
                <h1 className={styles.home_navbar_title}>TradeWise</h1>
                <div className={styles.home_navbar_links}>
                    <a href="#">Home</a>
                    <a href="#">About</a>
                    <a href="#">Services</a>
                    <a href="#">Contact</a>
                </div>

                <div className={styles.home_navbar_buttons}>
                    <button ><Link to='/Signup'>Signup</Link></button>
                    <button ><Link to='/Login'>Login</Link></button>
                    <button style={{ background: '#BE741E', color: '#fff', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px' }}>
                        <PiDownloadSimpleBold style={{ fontSize: '1.2rem', marginRight: '4px' }} />
                        Download App
                    </button>
                </div>
            </div>

            <div className={styles.home_content}>
                <div className="relative w-screen h-screen overflow-hidden mt-16">
                    {slides.map((slide, index) => (
                        <motion.div key={index} className="absolute w-full h-full bg-center bg-cover flex flex-col justify-center items-center px-20 text-white" style={{ backgroundImage: `url(${slide.image})`, display: index === current ? "flex" : "none", }} initial={{ opacity: 0 }} animate={{ opacity: index === current ? 1 : 0 }} transition={{ duration: 1 }} >
                            <motion.h1 className="text-5xl font-bold mb-1 " initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} > 
                                <Typewriter words={[slide.title]} loop={true}
                                cursor
                                cursorStyle="|"
                                typeSpeed={70}
                                deleteSpeed={50}
                                delaySpeed={2000}
                            /></motion.h1>
                            <motion.p className="text-center text-lg mb-6 mx-40" initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }}> 
                                 <Typewriter
                                    words={[slide.desc]} 
                                    loop={true}
                                    cursor
                                    cursorStyle="_"
                                    typeSpeed={10}
                                    deleteSpeed={20}
                                    delaySpeed={2000}
                                />
                            </motion.p>
                            <motion.button className="bg-[#BE741E] px-6 py-3 text-sm rounded-full font-semibold text-white shadow-lg hover:bg-[#a4641c] transition-all" whileHover={{ scale: 1.05 }} > Get Started</motion.button>
                        </motion.div>
                    ))}

                    <button onClick={prevSlide} className="absolute left-5 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition">
                        <ChevronLeft size={28} color="#fff" />
                    </button>
                    <button onClick={nextSlide} className="absolute right-5 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition">
                        <ChevronRight size={28} color="#fff" />
                    </button>
                </div>
                
                <div className={styles.home_content_cards} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: '60px', padding: '60px', background: 'linear-gradient(135deg, #fff5eb 0%, #f3e7d9 100%)', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                        <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '25px', lineHeight: '1.2', color: 'black' }}>
                            About <span style={{ color: '#BE741E' }}>TradeWise</span>
                        </h2>
                        <p style={{ fontSize: '1.05rem', color: '#444', lineHeight: '1.8', marginBottom: '30px', fontWeight: '400' }}>
                            TradeWise is your ultimate companion in the world of trading. We combine cutting-edge technology with user-friendly design to provide traders with powerful tools for success. Our platform simplifies complex calculations while maintaining the highest standards of accuracy and security.
                        </p>
                        <div style={{ display: 'flex', gap: '25px', marginTop: '40px' }}>
                            <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', flex: 1, border: '1px solid rgba(255,182,8,0.1)', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                                <h3 style={{ fontSize: '2.5rem', color: '#BE741E', marginBottom: '10px', fontWeight: '700' }}>10k+</h3>
                                <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: '500' }}>Active Users</p>
                            </div>
                            <div style={{ background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', flex: 1, border: '1px solid rgba(255,182,8,0.1)', transition: 'transform 0.3s ease', cursor: 'pointer' }}>
                                <h3 style={{ fontSize: '2.5rem', color: '#BE741E', marginBottom: '10px', fontWeight: '700' }}>99%</h3>
                                <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: '500' }}>Accuracy Rate</p>
                            </div>
                        </div>
                    </div>

                    
                    <div style={{ 
                        flex: 1,
                        position: 'relative',
                        maxWidth: '600px',
                        zIndex: 1
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            right: '-20px',
                            background: '#BE741E',
                            padding: '15px 25px',
                            borderRadius: '12px',
                            boxShadow: '0 10px 20px rgba(255,182,8,0.2)',
                            zIndex: 2
                        }}>
                            <p style={{ 
                                color: '#fff',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                margin: 0
                            }}>Real-time Analytics</p>
                        </div>
                        <img 
                            src="./src/assets/TradeWise.jpg" 
                            alt="TradeWise Demo" 
                            style={{
                                width: '100%',
                                height: 'auto',
                                borderRadius: '30px',
                                boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
                                transform: 'perspective(1000px) rotateY(-5deg)',
                                transition: 'transform 0.3s ease',
                                border: '10px solid #fff'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: '-20px',
                            left: '-20px',
                            background: '#fff',
                            padding: '20px',
                            borderRadius: '15px',
                            boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                            zIndex: 2
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    background: '#4CAF50',
                                    borderRadius: '50%'
                                }}></div>
                                <p style={{ 
                                    color: '#333',
                                    fontSize: '1rem',
                                    fontWeight: '600',
                                    margin: 0
                                }}>Live Market Data</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className={styles.home_content_how}>
                    <div style={{
                        textAlign: 'center',
                        marginBottom: '60px',
                        position: 'relative'
                    }}>
                        <h4 style={{
                            color: 'black',
                            fontSize: '2.7rem',
                            fontWeight: '800',
                            marginBottom: '10px',
                            position: 'relative',
                            display: 'inline-block',
                            textAlign: 'center'
                        }}>
                            Take a look at our <span style={{ color: "#BE741E"}}>Worksteps</span>
                        </h4>
                        <p style={{
                            color: '#666',
                            fontSize: '1.05rem',
                            maxWidth: '800px',
                            margin: '0 auto',
                            lineHeight: '1.6'
                        }}>
                            Discover how TradeWise simplifies your trading journey with our intuitive three-step process
                        </p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '40px', padding: '0 40px', position: 'relative'}}>
                        <WorkStepCard 
                            number="1"
                            title="Enter Trade Details"
                            description="Input purchase price, selling price, and quantity for any asset with our user-friendly interface."
                        />
                        <WorkStepCard 
                            number="2"
                            title="Calculate Profits"
                            description="Get instant profit/loss, ROI, and fee calculations with our advanced algorithms."
                        />
                        <WorkStepCard 
                            number="3"
                            title="Track & Analyze"
                            description="Save trades to your journal and view performance trends over time with detailed analytics."
                        />
                    </div>
                </div>

            </div>


            
            <div style={{ background: 'linear-gradient(135deg, #fff5eb 0%, #f3e7d9 100%)', padding: '60px 0 80px 0', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: '48px', flexWrap: 'wrap', marginTop: '80px' }}>
                <div style={{ maxWidth: '600px', minWidth: '320px', flex: 1 }}>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#222', marginBottom: '18px', lineHeight: 1.1 }}>
                        What People Think<br />About <span style={{ color: '#BE741E' }}>TradeWise</span>
                    </h2>
                    <p style={{ color: '#444', fontSize: '1.05rem', marginBottom: '18px', lineHeight: 1.6 }}>
                        Users rave about TradeWise's efficiency and reliability. Many have praised the smart trading calculator for significantly reducing their time spent on calculations and making their trading experience smoother. The privacy-first approach is also highly appreciated, ensuring users' data is always secure.
                    </p>
                    <p style={{ color: '#444', fontSize: '1.05rem', lineHeight: 1.6 }}>
                        Additionally, TradeWise has received high marks for its accurate and real-time analytics, helping users make better trading decisions. The platform is also lauded for its user-friendly interface and comprehensive reporting tools.
                    </p>
                </div>
                <TestimonialCarousel />
            </div>

            

            
            <div style={{ backgroundColor: '#1C1206', color: '#fff', padding: '60px 0 80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <button style={{ background: 'none', border: '2px solid #fff', color: '#fff', borderRadius: '32px', padding: '10px 38px', fontSize: '1.2rem', fontWeight: 600, marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <FaRegCommentDots size={22} style={{ color: '#BE741E' }} />
                    Contact Us
                </button>
                <h2 style={{ textAlign: 'center', fontSize: '2.2rem', fontWeight: 700, marginBottom: '10px', letterSpacing: '1px' }}>
                    <span style={{ color: '#fff' }}>Any <span style={{ color: '#BE741E', position: 'relative' }}>Insights</span> ?</span><br />
                    <span style={{ color: '#fff' }}>Feel Free To <span style={{ color: '#BE741E' }}>Contact</span> Us</span>
                </h2>
                <p style={{ color: '#fff', textAlign: 'center', fontSize: '1rem', maxWidth: '700px', margin: '20px auto 38px auto' }}>
                    Discover valuable insights and solutions tailored to your trading needs. Contact us today to learn more about how we can streamline your journey and enhance your experience.
                </p>
                <form style={{ width: '100%', maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '260px' }}>
                            <label style={{ color: '#BE741E', fontSize: '1.1rem', marginBottom: '8px', display: 'block' }}>Name:</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '38px', padding: '16px 22px', marginTop: '8px', border: '1.5px solid #BE741E' }}>
                                <FaUser size={22} style={{ color: '#91530A' }} />
                                <input type="text" placeholder="Enter your name" style={{ background: 'none', border: 'none', outline: 'none', color: '#000', fontSize: '1.1rem', marginLeft: '14px', width: '100%' }} />
                            </div>
                        </div>
                        <div style={{ flex: 1, minWidth: '260px' }}>
                            <label style={{ color: '#BE741E', fontSize: '1.1rem', marginBottom: '8px', display: 'block' }}>Email:</label>
                            <div style={{ display: 'flex', alignItems: 'center', background: '#fff', borderRadius: '30px', padding: '16px 22px', marginTop: '8px', border: '1.5px solid #BE741E' }}>
                                <MdEmail size={22} style={{ color: '#91530A' }} />
                                <input type="email" placeholder="Enter your email" style={{ background: 'none', border: 'none', outline: 'none', color: '#000', fontSize: '1.1rem', marginLeft: '14px', width: '100%' }} />
                            </div>
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ color: '#BE741E', fontSize: '1.1rem', marginBottom: '8px', display: 'block' }}>Message:</label>
                        <div style={{ display: 'flex', alignItems: 'flex-start', background: '#fff', borderRadius: '38px', padding: '16px 22px', marginTop: '8px', border: '1.5px solid #BE741E' }}>
                            <FaRegCommentDots size={22} style={{ color: '#91530A', marginTop: '4px' }} />
                            <textarea placeholder="Enter your message" style={{ background: 'none', border: 'none', outline: 'none', color: '#000', fontSize: '1.1rem', marginLeft: '14px', width: '100%', minHeight: '80px', resize: 'vertical' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                        <button type="submit" style={{ background: '#BE741E', color: '#fff', border: 'none', borderRadius: '32px', padding: '14px 48px', fontSize: '1.2rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(145,83,10,0.09)', transition: 'background 0.2s' }}>
                            Send
                        </button>
                    </div>
                </form>
            </div>



            
             <div style={{ backgroundColor: "rgba(254, 251, 246, 0.8)", padding: "50px 200px"}}>
                <div
                    style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexWrap: "wrap",
                }}>
                    <div style={{ textAlign: "center" }}>
                    <h2
                        style={{
                        color: "#000",
                        fontSize: "2.7rem",
                        marginBottom: "30px",
                        fontWeight: "bold",
                        fontFamily: "Work Sans",
                    }}>
                        Does This Sound Like Your{" "}
                    <span style={{ color: "#BE741E" }}>Question?</span>
                    </h2>
                    <p
                        style={{
                        color: "#444",
                        fontSize: "1.03rem",
                        marginBottom: "50px",
                    }}>
                        Find answers to commonly asked questions about our products and
                        services here. Can't find what you're looking for? Reach out for
                        personalized help.
                    </p>

                    <FAQList />
                    </div>
                </div>
                </div>

            

            
            <div style={{ backgroundColor: '#91530A', color: '#fff', padding: '60px 0 40px 0', position: 'relative', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>
                    
                    
                    <div style={{ maxWidth: '600px', minWidth: '320px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', marginBottom: '18px'}}>
                            Download Now and begin your journey to better Trading
                        </h2>
                        <p style={{ fontSize: '1.18rem', color: '#f3e7d9', marginBottom: '32px', fontWeight: 400 }}>
                            Enhance your daily trading experience with TradeWise. Say goodbye to confusion and hello to seamless, smart trading decisions.
                        </p>
                        <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap' }}>
                            <a href="#" style={{ display: 'inline-block', background: '#fff', borderRadius: '16px', padding: '12px 28px', color: '#91530A', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(145,83,10,0.09)', textDecoration: 'none', transition: 'background 0.2s' }}>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" style={{ height: '32px', verticalAlign: 'middle' }} />
                            </a>
                            <a href="#" style={{ display: 'inline-block', background: '#fff', borderRadius: '16px', padding: '12px 28px', color: '#91530A', fontWeight: 700, fontSize: '1.1rem', boxShadow: '0 2px 8px rgba(145,83,10,0.09)', textDecoration: 'none', transition: 'background 0.2s' }}>
                                <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download on the App Store" style={{ height: '32px', verticalAlign: 'middle' }} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>


            
            <footer style={{
                background: 'linear-gradient(135deg, #232323 0%, #181818 100%)',
                color: '#fff',
                padding: '56px 0 24px 0',
                fontFamily: 'Inter, Arial, sans-serif',
                boxShadow: '0 -2px 16px rgba(145,83,10,0.08)',
                width: '100%'
            }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '40px',
                padding: '0 32px 32px 32px',
                borderBottom: '1px solid #333'
            }}>

                    
                    <div style={{ minWidth: '220px', flex: 1 }}>
                        <h3 style={{ color: '#BE741E', fontWeight: 700, fontSize: '1.5rem', marginBottom: '18px' }}>About Us</h3>
                        <p style={{ color: '#eee', fontSize: '1.08rem', marginBottom: '22px', lineHeight: 1.6 }}>
                            TradeWise delivers the finest trading experience right to your screen. We pride ourselves on accuracy, privacy, and exceptional service.
                        </p>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
                            <a href="#" style={{ color: '#fff', fontSize: '1.5rem' }}><FaFacebook /></a>
                            <a href="#" style={{ color: '#fff', fontSize: '1.5rem' }}><FaInstagram /></a>
                            <a href="#" style={{ color: '#fff', fontSize: '1.5rem' }}><FaTwitter /></a>
                            <a href="#" style={{ color: '#fff', fontSize: '1.5rem' }}><FaLinkedin /></a>
                        </div>
                    </div>

                    
                    <div style={{ minWidth: '180px', flex: 1 }}>
                        <h3 style={{ color: '#BE741E', fontWeight: 700, fontSize: '1.5rem', marginBottom: '18px' }}>Quick Links</h3>
                        <ul style={{ listStyle: 'none', padding: 0, color: '#eee', fontSize: '1.08rem', lineHeight: 2 }}>
                            <li><a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Home</a></li>
                            <li><a href="#" style={{ color: '#fff', textDecoration: 'none' }}>About</a></li>
                            <li><a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Services</a></li>
                            <li><a href="#" style={{ color: '#fff', textDecoration: 'none' }}>Contact</a></li>
                        </ul>
                    </div>


                    
                    <div style={{ minWidth: '220px', flex: 1 }}>
                        <h3 style={{ color: '#BE741E', fontWeight: 700, fontSize: '1.5rem', marginBottom: '20px' }}>Contact Info</h3>
                        <div style={{ color: '#eee', fontSize: '1.08rem', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <IoCall  style={{ color: '#BE741E' }} /> +250 785 805 869
                        </div>
                        <div style={{ color: '#eee', fontSize: '1.08rem', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                            <MdEmail  style={{ color: '#BE741E' }} /> support@tradewise.com
                        </div>
                        <div style={{ color: '#eee', fontSize: '1.08rem', display: 'flex', alignItems: 'center', gap: '10px',marginTop: '20px' }}>
                            <IoLocationSharp  style={{ color: '#BE741E' }} />Kigali, Rwanda
                        </div>
                        
                    </div>
                    

                    <div style={{ minWidth: '220px', flex: 1 }}>
                        <h3 style={{ color: '#BE741E', fontWeight: 700, fontSize: '1.5rem', marginBottom: '18px' }}>Newsletter</h3>
                        <p style={{ color: '#eee', fontSize: '1.08rem', marginBottom: '18px' }}>
                            Subscribe to our newsletter for updates, special offers, and exclusive deals.
                        </p>
                        <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input type="email" placeholder="Enter your email" style={{ background: '#232323', border: '1px solid #444', borderRadius: '6px', padding: '12px', color: '#fff', fontSize: '1rem', marginBottom: '8px' }} />
                            <button style={{ background: '#BE741E', color: '#232323', border: 'none', borderRadius: '6px', padding: '12px 0', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', transition: 'background 0.2s' }}>Subscribe</button>
                        </form>
                    </div>
                </div>
                <div style={{ textAlign: 'center', color: '#aaa', marginTop: '28px', fontSize: '1rem', letterSpacing: '0.5px' }}>
                    &copy; {new Date().getFullYear()} <span style={{ color: '#BE741E', fontWeight: 600 }}>TradeWise</span>. All rights reserved </div>
            </footer>
        </div>
    </>
  )
}



const FAQList = () => {
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
    const [openIndex, setOpenIndex] = React.useState(null);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px',}}>
            {faqs.map((faq, idx) => (
                <div key={idx} style={{ background: '#fff', borderRadius: '18px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', padding: '28px 32px', cursor: 'pointer', transition: 'box-shadow 0.2s' }} onClick={() => setOpenIndex(openIndex === idx ? null : idx)}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '1.1rem', fontWeight: 500, color: '#222', fontFamily: 'inherit' }}>{faq.question}</span>
                        <span style={{ marginLeft: '18px', transition: 'transform 0.2s' }}>
                            {openIndex === idx ? (
                                
                                <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="17" stroke="#91530A" strokeWidth="3" fill="none" />
                                    <rect x="10" y="17" width="16" height="2" rx="1" fill="#91530A" />
                                </svg>
                            ) : (
                                
                                <svg width="28" height="28" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="18" cy="18" r="17" stroke="#91530A" strokeWidth="3" fill="none" />
                                    <rect x="10" y="17" width="16" height="2" rx="1" fill="#91530A" />
                                    <rect x="17" y="10" width="2" height="16" rx="1" fill="#91530A" />
                                </svg>
                            )}
                        </span>
                    </div>
                    {openIndex === idx && (
                        <div style={{ marginTop: '18px', color: '#444', fontSize: '1.08rem', lineHeight: 1.6, transition: 'max-height 0.2s' }}>
                            {faq.answer}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};



const testimonials = [
    {
        name: 'Alex M.',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        rating: 5,
        review: "My family uses TradeWise to track our portfolio and ensure our investments are on the right path. It's a fantastic tool for both beginners and experienced traders.",
        date: 'June 13, 2024'
    },
    {
        name: 'Sarah K.',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
        rating: 3,
        review: "TradeWise's analytics are so clear and easy to use. I love how quickly I can see my profit and loss for every trade.",
        date: 'June 10, 2024'
    },
    {
        name: 'John D.',
        avatar: 'https://randomuser.me/api/portraits/men/65.jpg',
        rating: 4,
        review: "The privacy features are top-notch. I feel safe knowing my trading data is secure and only accessible by me.",
        date: 'June 7, 2024'
    }
];


function TestimonialCarousel() {
    const [index, setIndex] = React.useState(0);
    const [isTransitioning, setIsTransitioning] = React.useState(false);

    React.useEffect(() => {
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
        <div style={{ position: 'relative', minWidth: '370px', maxWidth: '420px', flex: 1, display: 'flex', justifyContent: 'center' }}>
            
            <button onClick={goPrev} style={{ position: 'absolute', left: '-38px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '2.7rem', color: '#BE741E', zIndex: 2 }}>&#8592;</button>
            

            <div style={{ 
                background: '#fff', 
                borderRadius: '18px', 
                boxShadow: '0 4px 24px rgba(145,83,10,0.13)', 
                padding: '38px 32px', 
                minWidth: '340px', 
                maxWidth: '400px', 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                border: '2px solid #f3e7d9',
                opacity: isTransitioning ? 0 : 1,
                transition: 'opacity 300ms ease-in-out'
            }}>
                <img src={testimonials[index].avatar} alt="User Avatar" style={{ 
                    width: '70px', 
                    height: '70px', 
                    borderRadius: '50%', 
                    objectFit: 'cover', 
                    border: '3px solid #91530A', 
                    marginBottom: '12px'
                }} />
                <div style={{ 
                    fontWeight: 700, 
                    fontSize: '1.25rem', 
                    color: '#BE741E', 
                    marginBottom: '8px'
                }}>{testimonials[index].name}</div>
                <div style={{ 
                    color: '#FFD600', 
                    fontSize: '1.5rem', 
                    marginBottom: '10px'
                }}>
                    {Array(testimonials[index].rating).fill().map((_, i) => <span key={i}>&#9733;</span>)}
                </div>
                <div style={{ 
                    color: '#444', 
                    fontSize: '1rem', 
                    textAlign: 'center', 
                    marginBottom: '18px', 
                    lineHeight: 1.5
                }}>
                    {testimonials[index].review}
                </div>
                <div style={{ 
                    color: '#888', 
                    fontSize: '1rem', 
                    marginTop: '8px'
                }}>{testimonials[index].date}</div>
            </div>
            
            

            <button onClick={goNext} style={{ position: 'absolute', right: '-38px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '2.7rem', color: '#BE741E', zIndex: 2 }}>&#8594;</button>
            
            
            <div style={{ position: 'absolute', bottom: '-32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                {testimonials.map((_, i) => (
                    <span key={i} style={{ 
                        width: i === index ? '14px' : '10px', 
                        height: i === index ? '14px' : '10px', 
                        borderRadius: '50%', 
                        background: i === index ? '#BE741E' : '#BE741E', 
                        display: 'inline-block', 
                        transition: 'all 300ms ease-in-out'
                    }}></span>
                ))}
            </div>
        </div>
    );
}



const WorkStepCard = ({ number, title, description }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <div 
            style={{
                background: '#fff',
                borderRadius: '20px',
                padding: '40px 30px',
                boxShadow: isHovered ? '0 20px 40px rgba(190, 116, 30, 0.15)' : '0 10px 30px rgba(190, 116, 30, 0.1)',
                flex: 1,
                position: 'relative',
                zIndex: 1,
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                border: '1px solid rgba(190, 116, 30, 0.1)',
                transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            
            {number !== "3" && (
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    right: '-40px',
                    width: '40px',
                    height: '2px',
                    background: 'linear-gradient(90deg, #BE741E 0%, rgba(190, 116, 30, 0.3) 100%)',
                    zIndex: 2,
                    transform: 'translateY(-50%)',
                    display: 'flex',
                    alignItems: 'center'
                }}>
                    <div style={{
                        position: 'absolute',
                        right: 0,
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#BE741E',
                        animation: 'pulse 2s infinite'
                    }}></div>
                </div>
            )}

            
            <div style={{
                width: '70px',
                height: '70px',
                background: isHovered ? 'linear-gradient(135deg, #BE741E 0%, #91530A 100%)' : '#BE741E',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 25px',
                color: '#fff',
                fontSize: '2rem',
                fontWeight: '700',
                boxShadow: isHovered ? '0 10px 20px rgba(190, 116, 30, 0.3)' : '0 5px 15px rgba(190, 116, 30, 0.2)',
                transition: 'all 0.3s ease',
                position: 'relative',
                zIndex: 3
            }}>
                {number}
                {isHovered && (
                    <div style={{
                        position: 'absolute',
                        top: '-5px',
                        left: '-5px',
                        right: '-5px',
                        bottom: '-5px',
                        border: '2px solid #BE741E',
                        borderRadius: '50%',
                        animation: 'ripple 1.5s infinite'
                    }}></div>
                )}
            </div>

            
            <h3 style={{
                color: '#333',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '15px',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.05)' : 'scale(1)'
            }}>{title}</h3>
            <p style={{
                color: '#666',
                fontSize: '1rem',
                lineHeight: '1.6',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                opacity: isHovered ? 1 : 0.8
            }}>{description}</p>

            
            {isHovered && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(190, 116, 30, 0.05) 0%, rgba(145, 83, 10, 0.02) 100%)',
                    borderRadius: '20px',
                    zIndex: -1
                }}></div>
            )}
        </div>
    );
};



export default Home;




