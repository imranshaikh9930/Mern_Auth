const express  = require("express");
const multer = require("multer");
const nodemailer =require("nodemailer");
const path = require('path');
const {googleController,registerController,loginController,forgotPassword,verifyOTP,resetPassword} = require('../controllers/auth.controller');
const router = express.Router();




// Storage setup for Multer (temporary storage)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Files are stored temporarily before Cloudinary upload
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// File filter (Allow only images)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

// Multer upload middleware
const upload = multer({ 
    storage: storage, 
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});


  




router.get("/google",googleController);
router.post("/register",upload.single("image"),registerController);
router.post("/login",upload.single("image"),loginController);
router.post("/forgot-password",forgotPassword);
router.post("/verify-otp",verifyOTP);
router.post("/reset-password",resetPassword);

module.exports = router
