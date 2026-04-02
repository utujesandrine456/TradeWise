import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const NotFound = () => {
  const { trader: user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 relative overflow-hidden font-afacad">
      <div className="max-w-4xl w-full text-center relative z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 sm:mb-8"
        >
          <h1 className="text-[100px] xs:text-[120px] sm:text-[150px] md:text-[180px] lg:text-[220px] xl:text-[250px] font-bold text-brand-500 leading-none drop-shadow-2xl">
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
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black">
              Page Not Found
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-black font-medium max-w-2xl mx-auto px-4">
              Oops! The page you're looking for doesn't exist or has been moved.
              Let's get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mt-6 sm:mt-8 px-4"
          >
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-500 to-amber-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
              Go Back
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-brand-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-brand-200"
            >
              <Home size={20} className="sm:w-6 sm:h-6" />
              Go to Homepage
            </Link>

            {user && (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-brand-400 to-brand-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
                Dashboard
              </Link>
            )}
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-8 sm:mt-12 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-3 text-black font-bold px-4"
          >
            <Search size={18} className="sm:w-5 sm:h-5" />
            <p className="text-xs sm:text-sm text-center">
              Looking for something specific? Try searching from the homepage.
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Decorations */}
      <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-16 h-16 sm:w-20 sm:h-20 bg-brand-200 rounded-full blur-3xl opacity-50 animate-float"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-20 h-20 sm:w-32 sm:h-32 bg-amber-200 rounded-full blur-3xl opacity-50 animate-float" style={{ animationDelay: '1s' }}></div>
    </div>
  );
};

export default NotFound;
