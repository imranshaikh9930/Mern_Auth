import React, { useEffect, useRef } from "react";
import "./VerifyOtp.css";
import axios from "axios";
import { api } from "../helper/getCode";

// eslint-disable-next-line react/prop-types
const VerifyOtp = ({ handleVerifyOTP, handleChange, otp ,inputRefs,email,setStep}) => {
  

  useEffect(() => {
    inputRefs.current[0]?.focus(); // Auto-focus first input
  }, []);


  console.log("email",email);
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "Enter") {
      handleSubmit(e); // Allow "Enter" to submit OTP
    }
  };

const resendOtp = async (e) => {
  e.preventDefault();
  console.log("Resend button clicked, email:", email);

  try {
    const resp = await axios.post(
      "http://localhost:8080/auth/resend-otp",
      { email },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("Resend success:", resp.data.message);
    setStep(2);
  } catch (err) {
    console.error("Resend failed:", err);
    console.error(err.response?.data?.error || err.message);
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    console.log("Entered OTP:", otpCode);
    handleVerifyOTP(otpCode);
  };

  return (
    <div>
  
<form className="otp-Form" onSubmit={handleSubmit}>
 
  <span className="mainHeading">Enter OTP</span>
  <p className="otpSubheading">We have sent a verification code to your mobile number</p>
 <div className="input-Container">
  {otp.map((digit, index) => (
    <input
      key={index}
      ref={(el) => (inputRefs.current[index] = el)}
      className="otp-input"
      type="text"
      inputMode="numeric"
      pattern="\d*"
      maxLength="1"
      value={digit}
      onChange={(e) => handleChange(index, e.target.value)}
      onKeyDown={(e) => handleKeyDown(index, e)}
    />
  ))}
</div>

   <button className="verifyButton" type="submit">Verify</button>
     <button className="exitBtn">×</button>
     <p className="resendNote">Didn't receive the code? <button className="resendBtn" onClick={resendOtp}>Resend Code</button></p>
     
</form>



    </div>
  );
};

export default VerifyOtp;

