import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { MdEmail } from "react-icons/md";
import { IoTimer } from "react-icons/io5";
import OTPInput from '../components1/OTPInput';
import backendApi from '../utils/axiosInstance';
import { useNavigate } from 'react-router-dom';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [verifyDetails, setVerifyDetails] = useState(null);

    // Load and validate verification context from localStorage
    useEffect(() => {
        try {
            const isVerifyDetails = localStorage.getItem('verifyAccount');
            if (!isVerifyDetails) {
                navigate(-1);
                return;
            }

            const parsed = JSON.parse(isVerifyDetails);
            if (!parsed?.verify || !parsed?.email) {
                navigate(-1);
                return;
            }

            setVerifyDetails(parsed);
        } catch (e) {
            navigate(-1);
        }
    }, [navigate]);

    const [timeLeft, setTimeLeft] = useState(10 * 60); // 10 mins
    const [otpCode, setOtpCode] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Timer
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

    // Verify API call
    const handleVerifyEmail = async (e) => {
        e.preventDefault();

        if (!otpCode || otpCode.length < 6) {
            setError("Please enter the 6-digit code");
            return;
        }

        setLoading(true);
        try {
            if (!verifyDetails) {
                setError("Missing verification context");
                return;
            }
            const { email } = verifyDetails;

            console.log("email and code: ", email, otpCode);
            await backendApi.post("/auth/account/verify", { token: otpCode, email });

            localStorage.removeItem("verifyAccount");

            navigate("/land");
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || error.message || "Invalid code");
        } finally {
            setLoading(false);
        }
    };

    // Resend API call
    const handleResendCode = async () => {
        try {
            if (!verifyDetails) {
                setError("Missing verification context");
                return;
            }
            const { email } = verifyDetails;

            await backendApi.post("/auth/account/resend-code", { email });
            setTimeLeft(10 * 60); // reset timer
            setError(null);
            setOtpCode(""); // clear old input
        } catch (error) {
            console.log(error);
            setError(error.response?.data?.message || error.message || "Failed to resend code");
        }
    };

    return (
        <div className='flex flex-col w-full h-full text-center px-[80px] bg-[#f3e7d9]'>
            <div className='flex flex-col'>
                <img
                src={logo}
                alt="logo"
                className='w-[90px] h-[70px] m-[40px] mt-[20px] mx-auto relative left-[-160px]'
                />
                <h1 className='text-center text-5xl font-bold text-[#be741e] mt-[-100px] mb-[50px]'>
                TradeWise
                </h1>
            </div>

            {error && <p className='text-red-500 bg-red-200 w-[50%] mx-auto p-2 rounded'>{error}</p>}

            <div className='bg-[#1C1206] text-white p-8'>
                <MdEmail className='text-white text-5xl mx-auto' />
                <h2 className='font-bold text-2xl text-[#BE741E] pt-2'>
                Verify Your Email Address
                </h2>
                <p className='mt-4'>
                Hi,<br />
                Please check your inbox and enter the verification<br />
                code below to verify your email address. The code<br />
                will expire in 10 minutes.
                </p>
            </div>

            <div className='bg-[#1c1206] p-3 text-[#BE741E]'>
                <div className='flex flex-row justify-center gap-2 items-center mb-4 text-[#fff]'>
                    <IoTimer className='text-3xl' />
                    <p className='font-bold text-[20px]'>
                        Timer {formatTime(timeLeft)}
                    </p>
                </div>
                <form
                    className='my-2'
                    onSubmit={handleVerifyEmail}
                >
                    <OTPInput
                        length={6}
                        onComplete={(code) => setOtpCode(code)}
                    />
                    <button
                        className='bg-[#BE741E] text-[#fff] px-6 py-2 rounded mt-4 disabled:opacity-50'
                        type="submit"
                        disabled={otpCode.length < 6 || loading}
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>
                </form>
                <div className='flex justify-center mt-3'>
                    <button
                        type="button"
                        className='font-bold text-[17px] underline hover:text-white transition-all duration-400'
                        onClick={handleResendCode}
                    >
                        Resend Code
                    </button>
                </div>
            </div>

            <div className='bg-[#BE741E] p-[15px]'>
                <p>&copy; 2025 <span className='font-bold text-white'>TradeWise</span>. All rights reserved.</p>
            </div>
        </div>
    );
};

export default VerifyEmail;
