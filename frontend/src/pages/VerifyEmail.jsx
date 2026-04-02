import React, { useEffect, useState } from 'react';
import images from '../utils/images';
import { MdEmail } from "react-icons/md";
import OTPInput from '../components/OTPInput';
import backendApi from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from '../utils/toast';
import { fetchUser } from '../features/auth/authThuck';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);

    useEffect(() => {
        if (!user) navigate("/login");
        if (user.isVerified) navigate("/dashboard");
    }, [user, navigate]);

    const [otpCode, setOtpCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);

    useEffect(() => {
        if (resendCooldown <= 0) return;

        const interval = setInterval(() => {
            setResendCooldown(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [resendCooldown]);

    const handleVerifyEmail = async (e) => {
        e.preventDefault();
        if (!otpCode || otpCode.length < 6) {
            toast.error("Please enter the 6-digit code");
            return;
        }

        setLoading(true);
        try {
            if (!user) {
                toast.error("Missing verification context");
                return;
            }
            const { email } = user;
            await backendApi.post("/auth/account/verify", { otp: otpCode, email });

            await dispatch(fetchUser());

            toast.success('Your account is now verified');
            navigate("/land");
        } catch (error) {
            console.log(error)
            const msg = error.response?.data?.message || error.message || "Invalid code";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendLoading || resendCooldown > 0) return;

        setResendLoading(true);
        try {
            if (!user) {
                toast.error("Missing verification context");
                return;
            }
            const { email } = user;

            await backendApi.post("/auth/account/send", { email });
            setOtpCode("");
            setResendCooldown(30);
            toast.success("Verification code resent, Check your email");
        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || error.message || "Failed to resend code";
            toast.error(msg);
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className='flex flex-col w-full h-screen text-center px-6 md:px-[80px] bg-white font-afacad'>
            <div className='flex flex-row items-center justify-center my-14 space-x-4'>
                <img src={images.logo} alt="logo" className='w-[70px] h-[70px] rounded-2xl shadow-lg' />
                <h1 className='text-center text-5xl font-#FC9E4F text-#FC9E4F tracking-tighter'>TradeWise</h1>
            </div>

            <div className='max-w-2xl mx-auto w-full overflow-hidden rounded-[3rem] shadow-2xl border border-tomato-100'>
                <div className='bg-#FC9E4F text-white p-12'>
                    <div className="bg-tomato-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-glow">
                        <MdEmail className='text-white text-4xl' />
                    </div>
                    <h2 className='font-#FC9E4F text-4xl text-white mb-6 uppercase tracking-tight'>Verify Account</h2>
                    <p className='text-tomato-100 text-lg font-medium leading-relaxed opacity-80'>
                        Hi there,<br />
                        Please check your inbox for the 6-digit synchronization code and enter it below to authorize your session.
                    </p>
                </div>

                <div className='bg-white p-12 pt-8'>
                    <form className='space-y-10'>
                        <div className="flex justify-center transform scale-110">
                            <OTPInput length={6} onComplete={(code) => setOtpCode(code)} />
                        </div>
                        <div className='flex flex-col sm:flex-row gap-6 justify-center items-center'>
                            <button
                                className='w-full sm:w-auto bg-#FC9E4F text-white px-10 py-4 rounded-2xl font-#FC9E4F text-lg shadow-xl hover:bg-tomato-600 transition-all active:scale-95 disabled:opacity-30'
                                type="submit"
                                disabled={otpCode.length < 6 || loading}
                                onClick={handleVerifyEmail}
                            >
                                {loading ? "Verifying..." : "Confirm Code"}
                            </button>
                            <button
                                type="button"
                                className='w-full sm:w-auto border-2 border-#FC9E4F text-#FC9E4F px-10 py-4 rounded-2xl font-#FC9E4F text-lg hover:bg-tomato-50 transition-all disabled:opacity-30'
                                onClick={handleResendCode}
                                disabled={resendLoading || resendCooldown > 0}
                            >
                                {resendLoading ? "Sending..." : resendCooldown > 0 ? `Retry in ${resendCooldown}s` : "Resend Code"}
                            </button>
                        </div>
                    </form>
                </div>

                <div className='bg-tomato-500 p-8'>
                    <p className='text-white font-#FC9E4F text-sm uppercase tracking-widest'>
                        &copy; 2025 TradeWise <span className='mx-3 opacity-30'>|</span> Smart Trading Records
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
