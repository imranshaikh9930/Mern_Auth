# 🛡️ MERN Auth System with Google OAuth, Email OTP, Cloudinary & RBAC

A complete MERN (MongoDB, Express, React, Node.js) authentication system with:

- ✅ JWT Authentication (Access & Refresh Tokens)
- ✅ Google Sign-In (OAuth2)
- ✅ Email OTP verification (via Nodemailer)
- ✅ Role-Based Access Control (RBAC): Admin/User
- ✅ Cloudinary integration for profile image uploads

## 🔧 Tech Stack

### 🖥 Frontend
- React
- React Router
- Axios
- React Hot Toast
- Tailwind CSS or Custom CSS
- @react-oauth/google

### 🛠 Backend
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT (jsonwebtoken)
- Bcrypt
- Nodemailer
- Cloudinary SDK
- Multer

---

## ⚙️ Features

- 🔐 Register with Email + OTP Verification
- 🔐 Login with Email + Password
- 🔐 Login with Google (OAuth2)
- 🖼 Upload Profile Image to Cloudinary
- 🧪 JWT Authentication (Access & Refresh tokens)
- 👨‍⚖️ Role-based Access Control (RBAC): Admin / User
- 🛠 Reset Password via Email OTP
- 🛡 Secure Password Hashing via bcrypt

---

## 📂 Project Structure

```bash
├── Frontend/
│ └── src/
│ ├── Components/
│ │ ├── AuthForm.jsx / AuthForm.css
│ │ ├── ForgotPassword.jsx / ForgotPassword.css
│ │ ├── Loader.jsx / Loader.css
│ │ ├── ResetPassword.jsx
│ │ ├── Upload.jsx / Upload.css
│ │ ├── VerifyOtp.jsx / VerifyOtp.css
│ ├── helper/
│ │ └── getCode.js
│ ├── App.jsx
│ ├── Dashboard.jsx
│ ├── GoogleLogin.jsx
│ └── App.css

└── backend/
├── controllers/
│ └── auth.controller.js
├── lib/
│ └── connectDb.js
├── middleware/
│ ├── authMiddleware.js
│ └── authorizeRole.js
├── models/
│ └── user.model.js
├── routes/
│ └── authRoute.js
├── uploads/
├── utils/
│ ├── cloudinary.js
│ ├── googleClient.js
│ ├── otpGenerator.js
│ └── transporter.js
├── index.js
└── .env

```
https://mern-auth-96ae.vercel.app/register
