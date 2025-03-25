import React,{useState,useRef} from 'react'
import { api } from '../helper/getCode';
import VerifyOtp from './VerifyOtp';

const ForgotPassword = () => {
  const [email,setEmail] = useState();
  const[otp,setOtp] = useState(["","","","","",""]);
  const [newPassword,setNewPassword] = useState("");
  const[step,setStep] = useState(1);
  const inputRefs = useRef([]);

  // handleOtp Send

  const handleSendOTP = async()=>{
    try {
      const resp = await api.post("/forgot-password", { email }, { 
          headers: { 'Content-Type': 'application/json' } 
      });

      console.log(resp.data.message); // Axios me `.data` use hota hai
      setStep(2);

  } catch (err) {
      console.log(err.response?.data?.error || err.message);
  }
  }

  const handleVerifyOTP = async () => {
    try {
        const otpCode = otp.join("");  // Ensure OTP is a string
        const resp = await api.post("/verify-otp", { email, otp: otpCode }, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log(resp.data.message);  // Directly accessing response message
        setStep(3);  
    } catch (err) {
        console.log(err.response?.data?.message || "Something went wrong"); 
    }
};

const handleChange = (index, value) => {
  if (!/^\d?$/.test(value)) return; // Allow only numbers
  
  const newOtp = [...otp];  // Copy existing OTP array
  newOtp[index] = value;    // Update only the changed index
  setOtp(newOtp);

  // Auto move to next input
  if (value && index < otp.length - 1) {
    inputRefs.current[index + 1]?.focus();
  }
};

  const handleResetPassword = async()=>{
    try{
        const resp = await api.post("/reset-password",{email,newPassword},{
            headers:{
                "Content-Type":"application/json"
            }
        })
        const data = await resp.data;

        console.log(data.message);
        setStep(1);
    }catch(err){
        console.log(err);
    }
  }
    return (
    <div>
         <div>
      {step === 1 && (
        <div>
          <h2>Forgot Password</h2>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleSendOTP}>Send OTP</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <VerifyOtp handleVerifyOTP={handleVerifyOTP} handleChange={handleChange} setOtp={setOtp} otp={otp} inputRefs={inputRefs} />
          {/* <h2>Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOTP}>Verify OTP</button> */}
        </div>
      )}

      {step === 3 && (
        <div>
          <h2>Reset Password</h2>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
        </div>
      )}
    </div>
    </div>
  )
}

export default ForgotPassword