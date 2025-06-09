import React,{ lazy, Suspense,useState, useRef } from "react";
import { api } from "../helper/getCode";
// import VerifyOtp from "./VerifyOtp";
import "./ForgotPassword.css";
// import ResetPassword from "./ResetPassword";
const ResetPassword = lazy(()=> import("./ResetPassword"));
const VerifyOtp = lazy(()=>import ("./VerifyOtp"));
import Loader from "./Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading,setLoading] = useState(false);
  const inputRefs = useRef([]);

  // handleOtp Send

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const resp = await api.post(
        "/forgot-password",
        { email },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
          setLoading(false);
      console.log(resp.data.message); // Axios me `.data` use hota hai
      setStep(2);
    } catch (err) {
      console.log(err.response?.data?.error || err.message);
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      const otpCode = otp.join(""); // Ensure OTP is a string
      const resp = await api.post(
        "/verify-otp",
        { email, otp: otpCode },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(resp.data.message); // Directly accessing response message
      setStep(3);
    } catch (err) {
      console.log(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return; // Allow only numbers

    const newOtp = [...otp]; // Copy existing OTP array
    newOtp[index] = value; // Update only the changed index
    setOtp(newOtp);

    // Auto move to next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleResetPassword = async () => {
    try {
      const resp = await api.post(
        "/reset-password",
        { email, newPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await resp.data;

      console.log(data.message);
      setStep(1);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
     <Suspense fallback={<><Loader/></>}>

 
      <div>
      {step === 1 && (
  <div className="form-container">
    <div className="logo-container">Forgot Password</div>

    <form className="form" onSubmit={handleSendOTP}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <button className="form-submit-btn" type="submit">
       {loading ? <Loader/>:"Send Email"} 
      </button>
    </form>

    {/* <p className="signup-link">
      Don't have an account?
      <a href="#" className="signup-link link">Sign up now</a>
    </p> */}
  </div>
)}


        {step === 2 && (
          <div>
            <VerifyOtp
              handleVerifyOTP={handleVerifyOTP}
              handleChange={handleChange}
              setOtp={setOtp}
              otp={otp}
              inputRefs={inputRefs}
              email={email}
              setStep={setStep}
            />
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
          <ResetPassword handleResetPassword={handleResetPassword} newPassword={newPassword} setNewPassword={setNewPassword}/>
        )}
      </div>
          </Suspense>
    </div>
  );
};

export default ForgotPassword;
