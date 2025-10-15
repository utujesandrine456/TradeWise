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
            <div className="absolute top-20 left-20 w-32 h-32 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-emerald-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-brand-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>


          <button 
            onClick={() => setDark(!dark)} 
            aria-label="Toggle theme" 
            className="z-10 fixed top-5 right-5 p-2 rounded-full bg-white/70 dark:bg-black/40 backdrop-blur border border-white/30 dark:border-white/10 shadow-soft hover:shadow-glow transition"
          >
            {dark ? <Sun size={18} className="text-amber-300"/> : <Moon size={18} className="text-gray-700"/>}
          </button>

          <div className="relative flex w-full max-w-4xl h-auto my-10 rounded-3xl shadow-2xl overflow-hidden bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10">
            {/* Success Section */}
            <div className="w-full flex flex-col justify-center p-10 bg-gradient-to-b from-white/90 to-brand-50/60 dark:from-white/[0.06] dark:to-white/[0.02] relative">
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-20 h-20 bg-green-500/10 rounded-full -mr-10 animate-float"></div>

              <div className="w-full max-w-2xl mx-auto text-center space-y-8">
                {/* Success Icon */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-32 h-32 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                      <CheckCircle size={64} className="text-white"/>
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center animate-pulse">
                      <Sparkles size={24} className="text-white"/>
                    </div>
                  </div>
                </div>

                {/* Success Message */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    <Mail size={16}/> Email Verified Successfully
                  </div>
                  
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                    Welcome to TradeWise!
                  </h1>
                  
                  <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Your email has been verified successfully. You're now ready to set up your inventory and start managing your business with TradeWise.
                  </p>
                </div>

                {/* Features Preview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
                  <div className="bg-white/50 dark:bg-white/5 p-6 rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <div className="w-12 h-12 bg-gradient-to-r from-brand-500 to-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Package size={24} className="text-white"/>
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Inventory Management</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Track your stock levels, set alerts, and manage your inventory efficiently.</p>
                  </div>

                  <div className="bg-white/50 dark:bg-white/5 p-6 rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <TrendingUp size={24} className="text-white"/>
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Sales Analytics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Get insights into your sales performance and business growth.</p>
                  </div>

                  <div className="bg-white/50 dark:bg-white/5 p-6 rounded-xl border border-white/20 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users size={24} className="text-white"/>
                    </div>
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Business Growth</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Scale your business with powerful tools and insights.</p>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-gradient-to-r from-brand-50 to-amber-50 dark:from-brand-900/20 dark:to-amber-900/20 p-6 rounded-xl border border-brand-200 dark:border-brand-800">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Next Steps</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Let's set up your initial inventory to get you started with TradeWise.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-brand-600 dark:text-brand-400">
                    <span>Redirecting to stock setup in</span>
                    <span className="font-mono font-bold text-lg">{countdown}</span>
                    <span>seconds</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleContinue}
                    className="px-8 py-4 bg-gradient-to-r from-brand-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-500 hover:to-brand-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <span>Continue to Stock Setup</span>
                    <ArrowRight size={20}/>
                  </button>
                  
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-8 py-4 border-2 border-brand-300 dark:border-brand-600 text-brand-600 dark:text-brand-400 font-semibold rounded-xl hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>Go to Dashboard</span>
                  </button>
                </div>

                {/* Footer */}
                <div className="pt-8 border-t border-gray-200 dark:border-white/10">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Need help? Check out our{' '}
                    <a href="#" className="text-brand-600 dark:text-brand-400 hover:underline">
                      getting started guide
                    </a>
                    {' '}or{' '}
                    <a href="#" className="text-brand-600 dark:text-brand-400 hover:underline">
                      contact support
                    </a>
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
