import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdRefresh, MdArrowBack, MdCheckCircle } from "react-icons/md";
import { Mail, Clock, Shield, ArrowRight, Sun, Moon } from 'lucide-react';
import OTPInput from '../components/OTPInput';
import backendApi from '../utils/axiosInstance';
import { useAuth } from '../hooks/useAuth';
import { toast } from '../utils/toast';
import images from '../utils/images';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const { trader: user, checkAuth } = useAuth();

    useEffect(() => {
        if (!user) {
            // Check if we have a trader in localStorage even if not in Context yet
            const savedTrader = localStorage.getItem('trader');
            if (!savedTrader) navigate("/signup");
        } else if (user.isVerified) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const [otpCode, setOtpCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [dark, setDark] = useState(false);

    useEffect(() => {
        if (resendCooldown <= 0) return;
        const interval = setInterval(() => {
            setResendCooldown(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [resendCooldown]);

    const handleVerifyEmail = async (e) => {
        if (e) e.preventDefault();

        if (!otpCode || otpCode.length < 6) {
            toast.error("Please Enter The 6-Digit Code");
            return;
        }

        setLoading(true);
        try {
            const email = user?.email || JSON.parse(localStorage.getItem('trader'))?.email;
            if (!email) {
                toast.error("Missing Verification Context. Please Try Signing Up Again.");
                navigate("/signup");
                return;
            }

            await backendApi.post("/auth/account/verify", { otp: otpCode, email });

            // Update local storage and context
            const currentTrader = JSON.parse(localStorage.getItem('trader') || '{}');
            currentTrader.isVerified = true;
            localStorage.setItem('trader', JSON.stringify(currentTrader));

            await checkAuth();

            toast.success('Your Account Is Now Verified');
            navigate("/land");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Invalid Code";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendLoading || resendCooldown > 0) return;

        setResendLoading(true);
        try {
            const email = user?.email || JSON.parse(localStorage.getItem('trader'))?.email;
            if (!email) {
                toast.error("Missing Verification Context");
                return;
            }

            await backendApi.post("/auth/account/send", { email });
            setOtpCode("");
            setResendCooldown(60);
            toast.success("Verification Code Resent. Check Your Email.");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Failed to resend code";
            toast.error(msg);
        } finally {
            setResendLoading(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${mins}:${secs}`;
    };

    return (
        <div className={`${dark ? 'dark' : ''} font-Urbanist`}>
            <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-gradient-to-b from-white to-brand-50 dark:from-[#0B0B10] dark:to-[#0B0B10] px-4">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-20 left-20 w-32 h-32 bg-brand-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={() => setDark(!dark)}
                    className="z-10 fixed top-5 right-5 p-2 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur border border-white/30 dark:border-white/10 shadow-soft hover:shadow-glow transition"
                >
                    {dark ? <Sun size={18} className="text-amber-300" /> : <Moon size={18} className="text-gray-700" />}
                </button>

                {/* Back Button */}
                <button
                    onClick={() => navigate('/signup')}
                    className="z-10 fixed top-5 left-5 p-2 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur border border-white/30 dark:border-white/10 shadow-soft hover:shadow-glow transition"
                >
                    <MdArrowBack size={18} className="text-gray-700 dark:text-white" />
                </button>

                <div className="relative flex w-full max-w-2xl h-auto my-10 rounded-md shadow-2xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10">
                    <div className="w-full flex flex-col justify-center p-8 sm:p-12 relative">
                        <div className="w-full max-w-md mx-auto flex flex-col gap-8">
                            <div className="text-center space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-brand-100 text-brand-700 dark:bg-white/10 dark:text-white/90 mx-auto">
                                    <Shield size={16} /> Secure Verification
                                </div>

                                <div className="flex justify-center">
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-brand-500 rounded-md flex items-center justify-center shadow-lg transform rotate-3">
                                            <Mail size={40} className="text-white transform -rotate-3" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-4 border-white dark:border-[#1a1a1a]">
                                            <MdCheckCircle size={20} className="text-white" />
                                        </div>
                                    </div>
                                </div>

                                <h2 className="text-4xl font-bold text-brand-900">
                                    Verify Your Email
                                </h2>
                                <p className="text-black font-medium text-base leading-relaxed">
                                    We've Sent A 6-Digit Synchronization Code To<br />
                                    <span className="font-bold text-black underline underline-offset-4">
                                        {user?.email || JSON.parse(localStorage.getItem('trader') || '{}')?.email || 'your email'}
                                    </span>
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex justify-center transform scale-110">
                                    <OTPInput length={6} onComplete={(code) => setOtpCode(code)} />
                                </div>

                                {/* Timer / Cooldown */}
                                <div className="flex items-center justify-center gap-2 text-sm text-black font-medium">
                                    <Clock size={16} />
                                    {resendCooldown > 0 ? (
                                        <span>Resend Available In: <span className="font-bold text-red-500">{resendCooldown}s</span></span>
                                    ) : (
                                        <span>Code Is Ready To Resend</span>
                                    )}
                                </div>

                                <button
                                    onClick={handleVerifyEmail}
                                    disabled={loading || otpCode.length < 6}
                                    className="w-full py-4 bg-brand-500 text-white font-bold rounded-md hover:bg-brand-600 transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-lg"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-md animate-spin"></div>
                                            Verifying...
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2">
                                            Confirm Code <ArrowRight size={20} />
                                        </span>
                                    )}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={resendLoading || resendCooldown > 0}
                                        className="text-black font-bold hover:text-amber-600 transition-colors disabled:opacity-30 flex items-center justify-center gap-2 mx-auto underline"
                                    >
                                        {resendLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
                                                Resending...
                                            </>
                                        ) : (
                                            <>
                                                <MdRefresh size={20} />
                                                Resend Code
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
