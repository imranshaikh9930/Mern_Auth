import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


const RefreshHandler = ({ setIsAuthenticated }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem("user-info");
    const token = userData ? JSON.parse(userData)?.token : null; 

    if (token) {
      setIsAuthenticated(true);

      if (location.pathname === "/register") {
        navigate("/dashboard", { replace: true }); // Replace to prevent going back to register
      }
    } else {
      setIsAuthenticated(false);
    }
  }, [location.pathname, navigate, setIsAuthenticated]); // Optimized dependencies

  return null;
};

export default RefreshHandler;

