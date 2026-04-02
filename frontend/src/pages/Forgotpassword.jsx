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
    <div className="bg-[#FC9E4F] min-h-screen flex flex-col lg:flex-row font-afacad">
      <div className="flex flex-col items-center justify-center bg-white w-full lg:w-1/2 p-6 sm:p-10 min-h-screen">
        <div className="max-w-md w-full">
          <h1 className="text-[#FC9E4F] text-4xl sm:text-5xl font-bold text-center mb-8">
            Welcome Back at <span className="text-[#FC9E4F]">TradeWise</span>
          </h1>

          {/* Step 1: Email input */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="flex flex-col items-center space-y-6">
              <p className="text-black font-medium text-center mb-2 text-base">
                Please provide a valid email address so we can send you a verification code.
              </p>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all"
                required
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#FC9E4F] text-white font-bold rounded-xl hover:bg-[#cc8b3a] transition-all transform active:scale-[0.98] disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Sending Code...' : 'Send Reset Code'}
              </button>
            </form>
          )}

          {/* Step 2: OTP input */}
          {step === 2 && (
            <div className="relative flex flex-col items-center space-y-8">
              <p className="text-black font-medium text-center mb-2 text-base">
                Enter the 6-digit synchronization code sent to your email.
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
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all"
                    required
                    disabled={isLoading}
                  />
                ))}
              </div>
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 rounded-xl">
                  <div className="w-10 h-10 border-4 border-[#FC9E4F] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              <button
                onClick={() => setStep(1)}
                className="text-[#FC9E4F] font-bold hover:underline"
              >
                Back to Email
              </button>
            </div>
          )}

          {/* Step 3: Reset password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="flex flex-col items-center space-y-6">
              <p className="text-black font-medium text-center mb-2 text-base">
                Create a secure new password for your account.
              </p>

              <div className="w-full space-y-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3 px-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FC9E4F] transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full py-3 px-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FC9E4F] focus:border-transparent transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#FC9E4F] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#FC9E4F] text-white font-bold rounded-xl hover:bg-[#cc8b3a] transition-all transform active:scale-[0.98] disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? 'Resetting Password...' : 'Complete Reset'}
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
