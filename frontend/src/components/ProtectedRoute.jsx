import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({
  children,
  requireAuth = true,
  requireVerified = true,
}) => {
  const { trader: user, loading, checkAuth } = useAuth();
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading your workspace...");

  useEffect(() => {
    if (loading) {
      // Ensure initial loader is hidden
      const initialLoader = document.getElementById('initial-loader');
      if (initialLoader) {
        initialLoader.style.display = 'none';
        if (window.cleanupInitialLoader) {
          window.cleanupInitialLoader();
        }
      }

      setProgress(0);
      setLoadingText("Loading your workspace...");

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1.5;
        });
      }, 40);

      const textTimeout1 = setTimeout(() => {
        setLoadingText("Setting things up...");
      }, 1800);

      const textTimeout2 = setTimeout(() => {
        setLoadingText("Almost there...");
      }, 3500);

      return () => {
        clearInterval(interval);
        clearTimeout(textTimeout1);
        clearTimeout(textTimeout2);
      };
    }
  }, [loading]);

  if (loading) {
    const circumference = 2 * Math.PI * 54;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-brand-100 px-4">
        <div className="flex flex-col justify-center items-center gap-6 sm:gap-8 text-center">
          {/* Circular Progress */}
          <div className="relative w-32 h-32 sm:w-40 sm:h-40">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#FFE8C7"
                strokeWidth="8"
              />
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="#FC9E4F"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl sm:text-4xl font-bold text-black">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Text and Progress Bar */}
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <span className="text-lg sm:text-2xl font-bold text-gray-800 px-4">
              {loadingText}
            </span>
            <div className="w-full max-w-[200px] sm:max-w-xs mx-auto h-1.5 bg-brand-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-400 to-brand-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireVerified && user && !user.isVerified) {
    return <Navigate to="/email" replace />;
  }

  if (!requireAuth && user && !loading) {
    return <Navigate to={"/dashboard"} replace />;
  }

  return children;
};

export default ProtectedRoute;
