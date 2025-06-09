const express  = require("express");
const multer = require("multer");
const nodemailer =require("nodemailer");
const authorizeRole = require("../middleware/authorizeRole");
const path = require('path');
const {googleController,registerController,loginController,forgotPassword,verifyOTP,resetPassword,resendOTP} = require('../controllers/auth.controller');
const userModel = require("../models/user.model");
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

// RBAC
router.post("/admin/create-user",authorizeRole("admin"),async(req,res)=>{

    try{
        const {name,email,password,role} = req.body;
        const hashedPassword = await bcrypt.hash(password,process.env.SALT);
        const newUser = new userModel()
        await newUser.save();
        res.status(201).json({message:"Admin created new user"})


    }catch(err){
        res.status(500).json({message:"internal server error"})
    }
})

router.post("/forgot-password",forgotPassword);
router.post("/verify-otp",verifyOTP);
router.post("/reset-password",resetPassword);
router.post("/resend-otp",resendOTP);

module.exports = router
