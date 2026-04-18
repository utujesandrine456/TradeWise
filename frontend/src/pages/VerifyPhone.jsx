import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdPhoneIphone, MdRefresh, MdArrowBack, MdCheckCircle } from "react-icons/md";
import { Smartphone, Clock, Shield, ArrowRight, Sun, Moon, Lock } from 'lucide-react';
import OTPInput from '../components/OTPInput';
import backendApi from '../utils/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../utils/toast';

const VerifyPhone = () => {
    const navigate = useNavigate();
    const { trader: user, checkAuth } = useAuth();
    const [otpCode, setOtpCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [dark, setDark] = useState(true);

    useEffect(() => {
        if (!user) {
            const savedTrader = localStorage.getItem('trader');
            if (!savedTrader) navigate("/signup");
        } else if (user.isVerified) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const interval = setInterval(() => {
            setResendCooldown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendCooldown]);

    const handleVerifyPhone = async (e) => {
        if (e) e.preventDefault();

        if (!otpCode || otpCode.length < 6) {
            toast.error("Please enter the 6-digit synchronization code");
            return;
        }

        setLoading(true);
        try {
            const phone = user?.phone || JSON.parse(localStorage.getItem('pendingVerification'))?.phone;
            if (!phone) {
                toast.error("Missing verification context. Please try signing up again.");
                navigate("/signup");
                return;
            }

            await backendApi.post("/auth/account/verify", { otp: otpCode, phone });

            const currentTrader = JSON.parse(localStorage.getItem('trader') || '{}');
            currentTrader.isVerified = true;
            localStorage.setItem('trader', JSON.stringify(currentTrader));

            await checkAuth();

            toast.success('Identity Secured. Welcome to TradeWise.');
            navigate("/dashboard");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Invalid Synchronization Code";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendLoading || resendCooldown > 0) return;

        setResendLoading(true);
        try {
            const phone = user?.phone || JSON.parse(localStorage.getItem('pendingVerification'))?.phone;
            if (!phone) {
                toast.error("Missing verification context");
                return;
            }

            await backendApi.post("/auth/account/send", { phone });
            setOtpCode("");
            setResendCooldown(60);
            toast.success("Security code transmitted successfully.");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Transmission failed";
            toast.error(msg);
        } finally {
            setResendLoading(false);
        }
    };

    const phoneNum = user?.phone || JSON.parse(localStorage.getItem('pendingVerification'))?.phone || 'your phone number';

    return (
        <div className={`${dark ? 'dark' : ''} font-Urbanist selection:bg-brand-500 selection:text-white`}>
            <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-[#F9FBFF] dark:bg-[#09111E] px-4 transition-colors duration-700">
                <button
                    onClick={() => navigate('/signup')}
                    className="z-20 fixed top-8 left-8 flex items-center gap-2 text-[#09111E]/40 dark:text-white/40 hover:text-brand-500 dark:hover:text-brand-500 font-semibold text-md transition-all"
                >
                    <MdArrowBack size={18} /> Re-Enter Details
                </button>

                <div className="relative z-10 w-full max-w-xl">
                    <div className="bg-white dark:bg-[#0D1625] rounded-[2.5rem] p-8 md:p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] dark:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] border border-brand-100 dark:border-white/10 transition-all duration-500">
                        <div className="flex flex-col items-center text-center">
                            <div className="mb-10 relative">
                                <div className="w-24 h-24 bg-brand-500 rounded-3xl flex items-center justify-center shadow-2xl rotate-6 transform hover:rotate-0 transition-transform duration-500 group">
                                    <Smartphone size={44} className="text-white -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center border-4 border-white dark:border-[#0D1625] shadow-lg">
                                    <Lock size={18} className="text-white" />
                                </div>
                            </div>

                            <div className="space-y-4 mb-12">
                                <h2 className="text-5xl font-black text-[#09111E] dark:text-white tracking-tighter leading-none">
                                    Verify Access
                                </h2>
                                <p className="text-[#09111E]/40 dark:text-white/40 font-medium text-md max-w-sm mx-auto">
                                    A security code was transmitted to <span className="text-white text-lg">{phoneNum}</span>
                                </p>
                            </div>

                            <div className="w-full space-y-10">
                                <div className="flex justify-center scale-110 md:scale-125 my-4">
                                    <OTPInput length={6} onComplete={(code) => setOtpCode(code)} />
                                </div>

                                <div className="flex items-center justify-center gap-3 py-3 px-6 rounded-2xl bg-brand-500/5 dark:bg-white/5 border border-brand-500/10 dark:border-white/5 w-fit mx-auto">
                                    <Clock size={16} className="text-white" />
                                    {resendCooldown > 0 ? (
                                        <span className="text-md font-semibold text-[#FFFFFF] dark:text-white/80">
                                            Resend Code in: <span className="text-brand-500">{resendCooldown}s</span>
                                        </span>
                                    ) : (
                                        <button
                                            onClick={handleResendCode}
                                            disabled={resendLoading}
                                            className="text-md font-semibold text-white hover:underline flex items-center gap-2"
                                        >
                                            {resendLoading ? <MdRefresh size={18} className="animate-spin" /> : <MdRefresh size={18} />}
                                            Retransmit Code
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={handleVerifyPhone}
                                    disabled={loading || otpCode.length < 6}
                                    className="w-full py-4 text-lg bg-white cursor-pointer text-brand-600 font-semibold rounded-xl hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.4)] transition-all duration-300 disabled:opacity-30 disabled:grayscale active:scale-[0.98] flex items-center justify-center gap-3 overflow-hidden group"
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin font-semibold" />
                                    ) : (
                                        <>
                                        Verify Now
                                            <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default VerifyPhone;
