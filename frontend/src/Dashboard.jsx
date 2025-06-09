import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import defaultImg from "./assets/default.png"
// import "./Dashboard.css"; // Import external CSS

const Dashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = localStorage.getItem("user-info");
        if (getUser) {
            setUserInfo(JSON.parse(getUser));
        }
    }, []);

   
    const handleLogOut = () => {
        localStorage.removeItem("user-info");
        toast.success("Logout Successful");
        navigate("/register");
    };

    return (
        <div className={`dashboard-container`}>
         
         

            <div className="dashboard-card">
                {userInfo ? (
                    <>
                    <h2>{userInfo.user?.role === "admin" ? "Admin Dashboard":"User DashBoard"}</h2>
                        <img
                            src={userInfo?.user?.image || userInfo?.image || defaultImg}
                            alt={userInfo?.user?.name || userInfo?.name || "User"}
                            className="profile-img"
                        />
                        <h1 className="username">
                            Welcome, {userInfo?.user?.name || userInfo?.name} 🎉
                        </h1>
                        <h3 className="email">{userInfo?.user?.email || userInfo?.email}</h3>

                        <button onClick={handleLogOut} className="logout-btn">
                            Logout
                        </button>
                    </>
                ) : (
                    <h2 className="not-logged-in">User not logged in!</h2>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
