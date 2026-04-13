import { useState, useRef } from 'react'
import images from '../utils/images';
import backendApi from '../utils/axiosInstance'
import { handleError } from '../utils/handleError'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from '../utils/toast'

const Forgotpassword = () => {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const inputRefs = useRef([])
  const navigate = useNavigate()

  // Step 1: Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    if (!email) {
      toast.error('Please enter an email')
      setIsLoading(false);
      return;
    }
    try {
      await backendApi.post('/auth/password/forget', { email })
      setStep(2)
      toast.success('Verification code sent to your email')
    } catch (error) {
      const { message } = handleError(error)
      toast.error(message || 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  // Step 2: OTP input
  const handleCodeChange = (index, value) => {
    const lastChar = value.slice(-1)
    if (lastChar && !/^\d*$/.test(lastChar)) return

    const newCode = [...code]
    newCode[index] = lastChar
    setCode(newCode)

    if (lastChar && index < 5) inputRefs.current[index + 1]?.focus()

    // Trigger check and move to Step 3 if all filled
    if (newCode.every((c) => c !== '')) {
      setIsLoading(true)
      setTimeout(() => {
        setStep(3)
        setIsLoading(false)
      }, 1500)
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (code[index]) {
        const newCode = [...code]
        newCode[index] = ''
        setCode(newCode)
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus()
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) inputRefs.current[index - 1]?.focus()
    if (e.key === 'ArrowRight' && index < 5) inputRefs.current[index + 1]?.focus()
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const paste = e.clipboardData.getData('text').trim()
    if (!paste) return
    const pasteArray = paste.slice(0, 6).split('')
    const newCode = [...code]

    let startIndex = 0
    for (let i = 0; i < inputRefs.current.length; i++) {
      if (inputRefs.current[i] === e.target) {
        startIndex = i
        break
      }
    }

    for (let i = 0; i < pasteArray.length; i++) {
      const targetIndex = startIndex + i
      if (targetIndex < 6) newCode[targetIndex] = pasteArray[i]
    }

    setCode(newCode)
    const nextIndex = Math.min(startIndex + pasteArray.length, 5)
    inputRefs.current[nextIndex]?.focus()

    if (newCode.every((c) => c !== '')) {
      setIsLoading(true)
      setTimeout(() => {
        setStep(3)
        setIsLoading(false)
      }, 1500)
    }
  }

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const verificationCode = code.join('')
      await backendApi.post('/auth/password/reset', {
        email,
        otp: verificationCode,
        password,
      })
      toast.success('Password reset successfully!')
      navigate('/login')
    } catch (error) {
      const { message } = handleError(error)
      toast.error(message || 'Invalid or expired OTP')
      setStep(2) // Go back to step 2 to correct OTP
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-[#09111E] min-h-screen flex flex-col lg:flex-row font-Urbanist">
      <div className="flex flex-col items-center justify-center bg-white w-full lg:w-1/2 p-6 sm:p-10 min-h-screen">
        <div className="max-w-md w-full py-12">
          <h1 className="text-[#09111E] text-5xl font-bold text-center mb-8 tracking-tight">
            Account <span className="block text-brand-400">Recovery</span>
          </h1>

          {/* Step 1: Email input */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col items-center space-y-8">
              <p className="text-sm font-semibold text-brand-300 text-center mb-10 px-4 opacity-70">
                Enter your registered email address to receive a verification code.
              </p>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-4 px-6 border border-brand-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-brand-50/30 text-[#09111E] font-bold placeholder:text-brand-300"
                required
              />
              <button
                type="submit"
                className="w-full py-5 bg-[#09111E] text-white font-bold text-sm rounded-md hover:bg-[#09111E] transition-all shadow-2xl relative overflow-hidden group/btn"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500" />
                <span className="relative z-10">{isLoading ? 'Sending Code...' : 'Send Verification Code'}</span>
              </button>
            </form>
          )}

          {/* Step 2: OTP input */}
          {step === 2 && (
            <div className="relative flex flex-col items-center space-y-12">
              <p className="text-sm font-semibold text-brand-300 text-center mb-10 px-4 opacity-70">
                Enter the 6-digit code sent to your email address.
              </p>
              <div
                className="flex space-x-3 sm:space-x-4 justify-center"
                style={{ pointerEvents: isLoading ? 'none' : 'auto', opacity: isLoading ? 0.5 : 1 }}
              >
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
                    className="w-12 h-14 text-center text-2xl font-bold border border-brand-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-brand-50/30 text-[#09111E] shadow-sm"
                    required
                    disabled={isLoading}
                  />
                ))}
              </div>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-md">
                  <div className="w-12 h-12 border-4 border-[#09111E] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <button
                onClick={() => setStep(1)}
                className="text-[#09111E] font-bold text-xs hover:opacity-70 transition-opacity"
              >
                Back to Email Input
              </button>
            </div>
          )}

          {/* Step 3: Reset password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="flex flex-col items-center space-y-12">
              <p className="text-sm font-semibold text-brand-300 text-center mb-10 px-4 opacity-70">
                Choose a new secure password for your account.
              </p>

              <div className="w-full space-y-4">
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-4 px-6 pr-12 border border-brand-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-brand-50/30 text-[#09111E] font-bold placeholder:text-brand-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-brand-300 hover:text-[#09111E] transition-colors"
                  >
                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>

                <div className="relative group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-4 px-6 pr-12 border border-brand-100 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all bg-brand-50/30 text-[#09111E] font-bold placeholder:text-brand-300"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-brand-300 hover:text-[#09111E] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-5 bg-[#09111E] text-white font-bold text-sm rounded-md hover:bg-[#09111E] transition-all shadow-2xl relative overflow-hidden group/final"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-full group-hover/final:translate-x-0 transition-transform duration-500" />
                <span className="relative z-10">{isLoading ? 'Saving Password...' : 'Reset Password'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 h-full">
        <img src={images.Login} alt="login" className="w-full h-full object-cover" />
      </div>
    </div>
  )
}

export default Forgotpassword;
