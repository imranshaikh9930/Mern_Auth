import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../helper/getCode";
import GoogleLogin from "../GoogleLogin"; 
import Upload from "./Upload";
import "./AuthForm.css";
import toast from "react-hot-toast";


const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    image: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Login API call
        // console.log("Logging in with:", formData);
        const response = await api.post("/login", {
          email: formData.email,
          password: formData.password,
        });

        // console.log("Login successful:", response.data);
        localStorage.setItem(
          "user-info",
          JSON.stringify({
            token: response.data.token,
            user: response.data.user,
          })
        );
        toast.success("Login SuccessFul;")
        navigate("/dashboard");
      } else {
        // Registration API call
        console.log("Registering with:", formData);
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        if (formData.image) {
          formDataToSend.append("image", formData.image);
        }

        const response = await api.post("/register", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success("Register SuccessFul;")
        console.log("Registration successful:", response.data);
        setIsLogin(true); // Switch to login after successful registration
      }
    } catch (error) {
      
      toast.error( error.response.data.message);
    }
  };

  return (
    <div className="main-container">
      <form className="form_container" onSubmit={handleSubmit}>
        <div className="title_container">
          <p className="title">{isLogin ? "Login" : "Register"}</p>
        </div>
        {!isLogin && (
          <div className="input_container">
            <label className="input_label">Name*</label>
            <input
              type="text"
              placeholder="John Doe"
              className="input_field"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
            />
          </div>
        )}
        <div className="input_container">
          <label className="input_label">Email*</label>
          <input
            type="email"
            placeholder="name@mail.com"
            className="input_field"
            name="email"
            value={formData.email}
            onChange={handleChange}
            
          />
        </div>
        <div className="input_container">
          <label className="input_label">Password*</label>
          <input
            type="password"
            placeholder="********"
            className="input_field"
            name="password"
            value={formData.password}
            onChange={handleChange}
            
          />
        </div>
        {!isLogin && (
          <div className="input_container">
            <label className="input_label">Upload Image*</label>
            <Upload formImage={formData.image} formData={formData} setFormData={setFormData} />
            <p style={{fontSize:"14px",fontWeight:"600",padding:"0" ,marginTop:"0.1rem",textDecoration:"underline"}}>{formData.image?.name}</p>
          </div>
        )}
        {isLogin && <Link to="/forgotPassword">Forgot Password</Link>}
        <button type="submit" className="submit_button sign-in_btn">
          {isLogin ? "Sign In" : "Sign Up"}
        </button>
        <p className="switch_text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span className="switch_link " onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>
       {isLogin &&  <GoogleLogin />} 
      </form>
    </div>
  );
};

export default AuthForm;
