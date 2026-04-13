import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const NotFound = () => {
  const { trader: user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09111E] flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden font-Urbanist">
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <pattern id="diamondNotFound" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
              <path d="M36 2 L70 36 L36 70 L2 36 Z" fill="none" stroke="rgba(102,124,155,0.2)" strokeWidth="1.2" />
              <path d="M36 14 L58 36 L36 58 L14 36 Z" fill="none" stroke="rgba(102,124,155,0.08)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#diamondNotFound)" />
        </svg>
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-[100px] xs:text-[120px] sm:text-[150px] md:text-[180px] lg:text-[220px] xl:text-[250px] font-black text-white leading-none drop-shadow-2xl">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-3 px-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Page Not Found
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/60 font-medium max-w-2xl mx-auto px-4 tracking-wide leading-relaxed italic">
              Oops! The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
          </div>

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10 px-4"
          >
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-500 text-white px-10 py-4 rounded-md font-bold text-lg shadow-xl hover:bg-[#09111E] transition-all duration-300 tracking-wide"
            >
              <ArrowLeft size={22} />
              <span>Go Back</span>
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/5 text-white border border-white/10 px-10 py-4 rounded-md font-bold text-lg hover:bg-white/10 transition-all duration-300 tracking-wide"
            >
              <Home size={22} />
              Go Homepage
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 text-brand-400 font-semibold px-4 tracking-wide italic opacity-60"
          >
            <Search size={18} className="sm:w-5 sm:h-5" />
            <p className="text-[10px] sm:text-xs text-center">
              Looking for something specific? Try searching from the homepage.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
