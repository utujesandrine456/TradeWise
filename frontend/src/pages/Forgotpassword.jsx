import {React, useState, useEffect} from 'react'
import Signupimage from '../assets/Login.jpg'

const Forgotpassword = () => {

  const [email , setemail] = useState('');
  const [code, setCode] = useState(['','','','','','']);
  const [step, setStep]= useState(1);
  const [isloading, setIsloading]= useState(1);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setIsloading(true);

    setTimeout(() => {
      setIsloading(false);
      setStep(2);
    }, 1500);
  };


  const handleCodeChange = (index, value) => {
      if(!/^\d*$/.test(value) ) return ;

      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);


      if(value && index < 5){
        document.getElementById(`code-${index + 1}`).focus();
      }
  }



  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setIsloading(true);

    setTimeout(() => {
      setIsloading(false);
      alert('Password reset instructions have been to your email!');

    }, 1500);

  };

  return (
    <div className='bg-black h-screen flex flex-1 justify-between'>
      <div className='flex flex-col items-center justify-center bg-white '>
        <h1 className='text-black text-5xl font-bold my-4 text-center mb-10'>Welcome Back at <span className='text-[#BE741E]'>TradeWise</span></h1>
        
        {step === 1 ? 
          <>
            <p className='text-black/80 text-normal text-center px-auto mb-4'>Please provide a valid email address so we can send you <br></br>  a code or link to reset your password.</p>
            <form onSubmit={handleEmailSubmit} className='space-x-4'>
              <input type="email" placeholder="Email" className='w-100 py-2 px-4 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent' />
              <button type="submit" className=" py-2 px-6 mt-4 bg-[#BE741E] text-sm text-white font-medium rounded-lg hover:bg-[#cc8b3a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed" >Submit</button>
            </form>
          </>

          : 

          <>
            <p className='text-black/80 text-normal text-center mb-4'>
              We've sent a 6-digit code to your email<br />
              Please enter it below to reset your password.
            </p>
            <form onSubmit={handleCodeSubmit} className='space-x-4'>
                <div className='flex flex-col items-center justify-center space-y-6'>
                  <div className=' flex space-x-4'>
                    {code.map((digit, index) => (
                      <input key={index} id={`code-${index}`}
                      type="text"
                      maxLenght="1"
                      value={digit}
                      onChange={(e) => handleCodeChange(index , e.target.value)} className='w-12 h-12 text-center text-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#BE741E] focus:border-transparent' required />
                    ))}
                  </div>

                  <button type='submit' className='w-full py-3 px-6 bg-[#BE741E] text-sm text-white font-medium rounded-lg hover:bg-[#cc8b3a] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed' disabled={ isloading || code.some(digit => digit === '')}>{isloading ? "Verifying" : "Verify Code"}</button>
                  <button type="button" className='text-[#BE741E] text-sm hover:underline' onClick={() => setStep(1)} >Back To Email</button>
                </div>
            </form>
          
          </>
          
        }
        
      </div>

      <div className='w-1/2 h-[100vh] flex items-center justify-center bg-gray-50'>
        <img src={Signupimage} alt="login" className='w-full h-full object-cover' />
      </div>
    </div>
  )
}

export default Forgotpassword;