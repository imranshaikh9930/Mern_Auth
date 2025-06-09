import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import "./App.css";
import Dashboard from "./Dashboard";
import RefreshHandler from "./RefreshHandler";
import AuthForm from "./components/AuthForm";
import ForgotPassword from "./components/ForgotPassword";
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const userData = localStorage.getItem("user-info");
    return userData ? true : false;
  });

  useEffect(() => {
    const userData = localStorage.getItem("user-info");
    setIsAuthenticated(userData ? true : false);
  }, []);

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/register" />;
  };

  return (
    <>
      <Toaster />
      <Router>
        <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
        <Routes>
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<AuthForm />} />
          <Route path="/forgotPassword" element={<ForgotPassword/>} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
