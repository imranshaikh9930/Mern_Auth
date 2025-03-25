import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./helper/getCode";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const GoogleLogin = () => {
  const navigate = useNavigate();

  const responseGoogle = async (authResult) => {
    try {
      if (authResult.code) {
        const result = await googleAuth(authResult.code);
        const { email, name, img } = result.data.user;
        const token = result.data.token;

        const userInfo = { email, name, token, image };
        localStorage.setItem("user-info", JSON.stringify(userInfo));

        toast.success("Login SuccessFul")
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });

  return (
    <div
      style={{
        border: "1px solid black",
        padding: "1rem",
        borderRadius: "15px",
        cursor: "pointer",
        background: "lightGray",
        textAlign: "center",
      }}
      onClick={googleLogin}
      className="sign-in_ggl"
    >
    <FcGoogle size={35} /> {" "}  Sign in with Google 
    </div>
  );
};

export default GoogleLogin;
