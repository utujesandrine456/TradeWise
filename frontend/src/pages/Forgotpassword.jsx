import { useState, useRef } from 'react'
import backendApi from '../utils/axiosInstance'
import { handleError } from '../utils/handleError'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from '../utils/toast'

const Forgotpassword = () => {
  const [identifier, setIdentifier] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false);
  const [dark] = useState(true);

  const inputRefs = useRef([])
  const navigate = useNavigate()

  // Step 1: Request OTP
  const handleIdentifierSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (!identifier) {
      toast.error('Please enter your phone or email')
      setIsLoading(false);
      return;
    }
    try {
      const isEmail = identifier.includes('@');
      const payload = isEmail ? { email: identifier } : { phone: identifier };

      await backendApi.post('/auth/password/forget', payload)
      setStep(2)
      toast.success(`Verification code sent to your ${isEmail ? 'email' : 'phone'}`)
    } catch (error) {
      const { message } = handleError(error)
      toast.error(message || 'Recovery failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const verificationCode = code.join('');
      const isEmail = identifier.includes('@');
      const payload = isEmail
        ? { email: identifier, otp: verificationCode, password }
        : { phone: identifier, otp: verificationCode, password };

      await backendApi.post('/auth/password/reset', payload)
      toast.success('Identity Synchronized. Access Restored.')
      navigate('/login')
    } catch (error) {
      const { message } = handleError(error)
      toast.error(message || 'Invalid or expired synchronization code')
      setStep(2)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    if (newCode.every(char => char !== '') && newCode.length === 6) {
      setStep(3);
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    const newCode = [...code];
    pasteData.forEach((char, index) => {
      if (index < 6 && /^\d/.test(char)) {
        newCode[index] = char;
      }
    });
    setCode(newCode);
    const lastIndex = Math.min(pasteData.length - 1, 5);
    if (lastIndex >= 0) {
      inputRefs.current[lastIndex].focus();
    }
    if (newCode.every(char => char !== '')) {
      setStep(3);
    }
  };

  return (
    <div className={`${dark ? 'dark' : ''} min-h-screen flex overflow-hidden bg-[#181A1E] font-Urbanist`}>
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-16 overflow-hidden">
        <div className="absolute inset-0 bg-[#09111E]">
          <svg className="absolute inset-0 w-full h-full opacity-30">
            <defs>
              <pattern id="diamondRecovery" x="0" y="0" width="72" height="72" patternUnits="userSpaceOnUse">
                <path d="M36 2 L70 36 L36 70 L2 36 Z" fill="none" stroke="rgba(102,124,155,0.4)" strokeWidth="1.2" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#diamondRecovery)" />
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-500/5 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10">
          <h1 className="text-white font-nosifer font-black text-5xl">Stocka</h1>
        </div>

        <div className="relative z-10">
          <h2 className="text-white font-black text-6xl leading-tight mb-6">
            Security<br /><span className="text-brand-500">First.</span>
          </h2>
          <p className="text-white/30 font-bold text-xl leading-relaxed max-w-sm">
            Restoring your access through our encrypted quantum protocols.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 bg-[#F9FBFF] relative overflow-y-auto">
        <button
          onClick={() => navigate('/login')}
          className="absolute top-8 left-8 flex items-center gap-2 text-[#09111E]/40 hover:text-[#09111E] font-black text-xs transition-all"
        >
          <ArrowLeft size={16} /> Return to Login
        </button>

        <div className="w-full max-w-md">
          <div className="mb-12 text-center lg:text-left">
            <div className="inline-block px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 text-[10px] font-black mb-5">
              Access Recovery
            </div>
            <h2 className="text-5xl font-black text-[#09111E] mb-3 leading-tight">Restore<br />Session</h2>
            <p className="text-[#09111E]/40 font-bold">Follow the sequence to regain access.</p>
          </div>

          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] border border-brand-100">
            {step === 1 && (
              <form onSubmit={handleIdentifierSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#09111E]/60 pl-1">Phone or Email</label>
                  <input
                    type="text"
                    placeholder="Provide registered ID"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full px-6 py-5 bg-[#F9FBFF] border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm font-bold text-[#09111E] placeholder:text-[#09111E]/20"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-[#09111E] text-white font-black text-sm rounded-2xl hover:shadow-[0_20px_50px_-10px_rgba(9,17,30,0.3)] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <> Transmit Code <ArrowRight size={18} /> </>}
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-12 flex flex-col items-center">
                <div className="flex space-x-2 md:space-x-3 justify-center">
                  {code.map((char, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={char}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className="w-10 h-14 md:w-12 md:h-16 text-center text-2xl font-black border-2 border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all bg-[#F9FBFF] text-[#09111E]"
                      required
                      disabled={isLoading}
                    />
                  ))}
                </div>

                <div className="text-center space-y-4">
                  <p className="text-xs font-black text-[#09111E]/30">Awaiting sequence confirmation</p>
                  <button
                    onClick={() => setStep(1)}
                    className="text-brand-600 font-black text-[10px] hover:underline"
                  >
                    Change Identifier
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#09111E]/60 pl-1">New Secure Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-6 py-5 bg-[#F9FBFF] border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm font-bold text-[#09111E] placeholder:text-[#09111E]/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-[#09111E]/20 hover:text-[#09111E] transition-colors"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#09111E]/60 pl-1">Confirm Identity</label>
                    <input
                      type="password"
                      placeholder="Repeat password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-6 py-5 bg-[#F9FBFF] border border-brand-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm font-bold text-[#09111E] placeholder:text-[#09111E]/20"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-5 bg-brand-500 text-white font-black text-sm rounded-2xl hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.4)] transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <> Synchronize Identity <ArrowRight size={18} /> </>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forgotpassword;
