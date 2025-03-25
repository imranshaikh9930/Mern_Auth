import React, { useEffect, useRef } from "react";
import "./VerifyOtp.css";

const VerifyOtp = ({ handleVerifyOTP, handleChange, otp ,inputRefs}) => {
  

  useEffect(() => {
    inputRefs.current[0]?.focus(); // Auto-focus first input
  }, []);

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "Enter") {
      handleSubmit(e); // Allow "Enter" to submit OTP
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
      <form className="form" onSubmit={handleSubmit}>
        <div className="title">OTP</div>
        <div className="title">Verification Code</div>
        <p className="message">
          We have sent a verification code to your email address
        </p>
        <div className="inputs">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)} // ✅ Fixed: Passing index
              onKeyDown={(e) => handleKeyDown(index, e)}
            />
          ))}
        </div>
        <button type="submit" className="action">
          Verify Otp
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
