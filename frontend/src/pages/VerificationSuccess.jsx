import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowRight, Mail, Sparkles, Package, TrendingUp, Users } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/stocks');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const handleContinue = () => {
    navigate('/stocks');
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={true} closeOnClick pauseOnHover draggable theme="colored" />

      <div className={`${dark ? 'dark' : ''}`}>
        <div className="min-h-screen flex items-center justify-center overflow-hidden relative bg-gradient-to-b from-white to-brand-50 dark:from-[#0B0B10] dark:to-[#0B0B10]">

          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 bg-brand-500 rounded-md blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#09111E] rounded-md blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-[#09111E] rounded-md blur-3xl animate-pulse delay-2000"></div>
          </div>


          <button
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
            className="z-10 fixed top-5 right-5 p-2 rounded-md bg-white/70 dark:bg-black/40 backdrop-blur border border-white/30 dark:border-white/10 shadow-soft hover:shadow-glow transition"
          >
            {dark ? <Sun size={18} className="text-amber-300" /> : <Moon size={18} className="text-gray-700" />}
          </button>

          <div className="relative flex w-full max-w-4xl h-auto my-10 rounded-md shadow-2xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10">
            {/* Success Section */}
            <div className="w-full flex flex-col justify-center p-10 bg-gradient-to-b from-white/90 to-brand-50/60 dark:from-white/[0.06] dark:to-white/[0.02] relative">
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-brand-500/10 rounded-md -mr-10 animate-float"></div>

              <div className="w-full max-w-2xl mx-auto text-center space-y-8">
                {/* Success Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-brand-500 rounded-md flex items-center justify-center shadow-2xl animate-bounce">
                      <CheckCircle size={64} className="text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-[#09111E] rounded-md flex items-center justify-center animate-pulse">
                      <Sparkles size={24} className="text-white" />
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-md bg-[#09111E] text-white font-bold text-xs shadow-xl">
                    <Mail size={16} /> Email Verification Complete
                  </div>

                  <h1 className="text-5xl font-bold text-[#09111E] tracking-tight">
                    Welcome to Stocka
                  </h1>

                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Your Email Has Been Verified Successfully. You're Now Ready To Set Up Your Inventory And Start Managing Your Business With Stocka.
                  </p>
                </div>

                {/* Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                  <div className="bg-white/50 dark:bg-white/5 p-6 rounded-md border border-brand-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <div className="w-12 h-12 bg-brand-500 rounded-md flex items-center justify-center mx-auto mb-4">
                      <Package size={24} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-[#09111E] mb-2">Inventory Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Track Your Stock Levels, Set Alerts, And Manage Your Inventory Efficiently.</p>
                  </div>

                  <div className="bg-white/50 dark:bg-white/5 p-6 rounded-md border border-brand-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <div className="w-12 h-12 bg-[#09111E] rounded-md flex items-center justify-center mx-auto mb-4">
                      <TrendingUp size={24} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-[#09111E] mb-2">Sales Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Get Insights Into Your Sales Performance And Business Growth.</p>
                  </div>

                  <div className="bg-white/50 dark:bg-white/5 p-6 rounded-md border border-brand-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <div className="w-12 h-12 bg-[#09111E] rounded-md flex items-center justify-center mx-auto mb-4">
                      <Users size={24} className="text-white" />
                    </div>
                    <h3 className="font-semibold text-[#09111E] mb-2">Business Growth</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Scale Your Business With Powerful Tools And Insights.</p>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-brand-50/50 dark:bg-[#09111E]/20 p-6 rounded-md border border-brand-200">
                  <h3 className="text-lg font-semibold text-[#09111E] mb-3">Next Steps</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Let's Set Up Your Initial Inventory To Get You Started With Stocka.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-[#09111E] font-bold">
                    <span>Redirecting To Stock Setup In</span>
                    <span className="font-mono font-bold text-lg">{countdown}</span>
                    <span>Seconds</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={handleContinue}
                    className="px-10 py-5 bg-[#09111E] text-white font-bold text-sm rounded-md hover:bg-[#09111E] transition-all duration-300 shadow-2xl active:scale-95 flex items-center justify-center gap-4 group/btn"
                  >
                    <span>Get Started</span>
                    <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-10 py-5 border-2 border-[#09111E] text-[#09111E] font-bold text-sm rounded-md hover:bg-brand-50 transition-all duration-300 flex items-center justify-center gap-4 active:scale-95"
                  >
                    <span>Go to Dashboard</span>
                  </button>
                </div>

                {/* Footer */}
                <div className="pt-12 border-t border-brand-100">
                  <p className="text-xs text-brand-300 font-semibold text-center">
                    Need support? Access our <a href="#" className="text-[#09111E] underline hover:opacity-70 transition-opacity">Documentation</a> or contact a <a href="#" className="text-[#09111E] underline hover:opacity-70 transition-opacity">Support Representative</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerificationSuccess;
