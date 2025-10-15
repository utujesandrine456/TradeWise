import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MdEmail, MdCheckCircle, MdRefresh, MdArrowBack } from 'react-icons/md';
import { Eye, EyeOff, Sparkles, ArrowRight, Moon, Sun, Mail, Clock, Shield } from 'lucide-react';
import backendApi from '../utils/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const VerifyEmail = () => {
    const navigate = useNavigate();
    const [verificationData, setVerificationData] = useState(null);
    const [verificationCode, setVerificationCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [timeLeft, setTimeLeft] = useState(10 * 60);
    const [dark, setDark] = useState(false);


    useEffect(() => {
        try {
            const pendingVerification = localStorage.getItem('pendingVerification');
            if (!pendingVerification) {
                navigate('/signup');
                return;
            }

            const parsed = JSON.parse(pendingVerification);
            if (!parsed?.email) {
                navigate('/signup');
                return;
            }

            setVerificationData(parsed);
        } catch (e) {
            navigate('/signup');
        }
    }, [navigate]);


    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (!verificationCode || verificationCode.length < 6) {
            setError("Please enter the 6-digit verification code");
            setLoading(false);
            return;
        }

        try {
            if (!verificationData) {
                setError("Missing verification context");
                setLoading(false);
                return;
            }

            const response = await backendApi.post("/auth/account/verify", { 
                email: verificationData.email,
                otp: verificationCode
            });

            const { token, user, message } = response.data;

            localStorage.setItem("accessToken", token);
            localStorage.setItem("currentUser", JSON.stringify(user));
            localStorage.removeItem("pendingVerification");

            toast.success(message || 'Email verified successfully!');
            setSuccess(message || 'Email verified successfully!');
            

            setTimeout(() => navigate('/stocks'), 1500);
        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.message || error.message || "Invalid verification code";
            setError(msg);
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };


    const handleResendCode = async () => {
        setResendLoading(true);
        try {
            if (!verificationData) {
                setError("Missing verification context");
                setResendLoading(false);
                return;
            }

            await backendApi.post("/auth/account/send", { 
                email: verificationData.email 
            });
            
            setTimeLeft(10 * 60); 
            setError('');
            setVerificationCode('');
            toast.success('Verification code resent successfully!');
        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.message || error.message || "Failed to resend code";
            setError(msg);
            toast.error(msg);
        } finally {
            setResendLoading(false);
        }
    };

    if (!verificationData) {
    return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading verification...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick pauseOnHover draggable theme="colored" />

            <div className={`${dark ? 'dark' : ''}`}>
                <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-gradient-to-b from-white to-brand-50 dark:from-[#0B0B10] dark:to-[#0B0B10]">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                        <div className="absolute top-20 left-20 w-32 h-32 bg-brand-500 rounded-full blur-3xl animate-pulse"></div>
                        <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setDark(!dark)} 
                        aria-label="Toggle theme" 
                        className="z-10 fixed top-5 right-5 p-2 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur border border-white/30 dark:border-white/10 shadow-soft hover:shadow-glow transition"
                    >
                        {dark ? <Sun size={18} className="text-amber-300"/> : <Moon size={18} className="text-gray-700"/>}
                    </button>

                    {/* Back Button */}
                    <button
                        onClick={() => navigate('/signup')} 
                        className="z-10 fixed top-5 left-5 p-2 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur border border-white/30 dark:border-white/10 shadow-soft hover:shadow-glow transition"
                    >
                        <MdArrowBack size={18} className="text-gray-700 dark:text-white"/>
                    </button>

                    <div className="relative flex w-full max-w-4xl h-auto my-10 rounded-3xl shadow-2xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10">
                        {/* Form Section */}
                        <div className="w-full flex flex-col justify-center p-10 bg-gradient-to-b from-white/90 to-brand-50/60 dark:from-white/[0.06] dark:to-white/[0.02] relative">
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-brand-500/10 rounded-full -mr-10 animate-float"></div>

                            <form onSubmit={handleVerifyEmail} className="w-full max-w-md mx-auto flex flex-col gap-6">
                                <div className="text-center space-y-4">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 text-brand-700 dark:bg-white/10 dark:text-white/90">
                                        <Shield size={16}/> Secure Verification
                                    </div>
                                    
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            <div className="w-20 h-20 bg-gradient-to-r from-brand-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                                                <Mail size={32} className="text-white"/>
                                            </div>
                                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                                <MdCheckCircle size={16} className="text-white"/>
                                            </div>
                                        </div>
                                    </div>

                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-brand-500 to-amber-600 bg-clip-text text-transparent">
                                        Verify Your Email
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                                        We've sent a verification code to<br />
                                        <span className="font-semibold text-brand-600 dark:text-brand-400">
                                            {verificationData.email}
                                        </span>
                                    </p>
                                </div>

                                {error && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-center text-sm animate-pulse">
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-center text-sm animate-pulse">
                                        {success}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-md font-medium text-gray-700 dark:text-gray-300">
                                            Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter 6-digit code"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 6))}
                                            required
                                            className="w-full px-4 py-3 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/40 focus:border-transparent text-normal bg-white/80 dark:bg-white/5 dark:text-white text-center font-mono tracking-widest"
                                        />
                                    </div>

                                    {/* Timer */}
                                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <Clock size={16}/>
                                        <span>Code expires in: </span>
                                        <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-brand-600'}`}>
                                            {formatTime(timeLeft)}
                                        </span>
                </div>
            </div>

                                <button
                                    type="submit"
                                    disabled={loading || verificationCode.length < 6}
                                    className="w-full py-3 mt-1 bg-gradient-to-r from-brand-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-brand-600 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Verifying...
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-2">
                                            Verify Email <ArrowRight size={18}/>
                                        </span>
                                    )}
                                </button>

                                <div className="text-center">
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={resendLoading}
                                        className="text-brand-600 dark:text-brand-400 font-semibold underline hover:text-amber-600 transition-colors disabled:opacity-50"
                                    >
                                        {resendLoading ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-brand-600 border-t-transparent rounded-full animate-spin"></div>
                                                Resending...
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-2">
                                                <MdRefresh size={16}/>
                                                Resend Code
                                            </span>
                                        )}
                                    </button>
                                </div>

                                <div className="grid grid-cols-3 items-center gap-3 mt-1">
                                    <div className="h-[1px] bg-gray-200 dark:bg-white/10"></div>
                                    <div className="text-xs text-gray-400 text-center">or</div>
                                    <div className="h-[1px] bg-gray-200 dark:bg-white/10"></div>
                                </div>

                                <p className="text-center text-sm text-gray-500 dark:text-gray-300">
                                    Didn't receive the email? Check your spam folder or{' '}
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        className="text-brand-600 font-semibold underline hover:text-amber-600"
                                    >
                                        try again
                                    </button>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyEmail;