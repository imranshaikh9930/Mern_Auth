const bcrypt = require("bcrypt");
const User  = require("../models/user.model");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cloudinary = require("cloudinary").v2; // Import Cloudinary

require("dotenv").config();
const { oauth2Client } = require("../utils/googleClient");
const otpGenerator = require("../utils/otpGenerator");
const transporter = require("../utils/transporter");
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const registerController = async (req, res) => {
    console.log("Received body:", req.body);
    console.log("Received file:", req.file)
    try {
        const { name, email, password } = req.body;
        // console.log(req);
        const file = req.file; // Uploaded file

        if (!name || !email || !password || !file) {
            return res.status(400).json({ message: "All fields are required" });
        }

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Upload image to Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(file.path, {
            folder: "profile_pictures",
            resource_type: "image"
        });

        const hashedPassword = await bcrypt.hash(password, parseInt(process.env.SALT));

        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            image: uploadedImage.secure_url
        });

        await newUser.save();

        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        console.error("Error in registerController:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log(email,password);

        if ( !email || !password ) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User does not exist" });
        }

        // console.log(user);

        // Compare passwords
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid Email Or Password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token, user });

    } catch (err) {
        console.error("Error in loginController:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const googleController = async (req, res) => {
    try {
        const code = req.query.code;
        const googleRes = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(googleRes.tokens);

        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        );

        const { email, name, picture } = userRes.data;
        let user = await User.findOne({ email });


        if (!user) {
            // Generate a random password 
            const randomPassword = Math.random().toString(36).slice(-8); 
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
          

            // Create a new user with hashed password
            user = await User.create({ 
                name, 
                email, 
                password: hashedPassword, 
                image: picture 
            });
        }


        const { _id } = user;
        const token = jwt.sign({ _id, email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ message: "success", token, user });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const forgotPassword = async (req, res) => {
    try {
        // console.log("Received request body:", req.body);  // ✅ Debugging

        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // console.log("Searching for user with email:", email);  // ✅ Debugging
        const user = await User.findOne({ email });

        // console.log("User found:", user);  // ✅ Debugging
        if (!user) return res.status(400).json({ message: "User not found" });

        const otp = otpGenerator();

        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        console.log("OTP generated:", otp);  // ✅ Debugging

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It will expire in 10 minutes.`,
        });

        res.status(200).json({ message: "OTP sent to email" });
    } catch (error) {
        console.error("Error in forgotPassword:", error);
        res.status(500).json({ error: error.message });
    }
};
const verifyOTP = async(req,res)=> {
    try {
        const { email, otp } = req.body;

        // console.log("Received Email:", email);
        // console.log("Received OTP:", otp);

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // console.log("Stored OTP:", user.otp);
        // console.log("Stored OTP Expiry:", user.otpExpires);
        // console.log("Current Time:", Date.now());

        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        if (Date.now() > user.otpExpires) {
            return res.status(400).json({ message: "OTP expired" });
        }

        // Clear OTP after successful verification
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: "OTP verified. You can now reset your password." });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const resetPassword = async(req,res)=>{
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
    
        if (!user) return res.status(400).json({ message: "User not found" });
    
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
    
        res.status(200).json({ message: "Password reset successful. You can now log in." });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}
module.exports = {
    googleController,
    registerController,
    loginController,
    forgotPassword,
    verifyOTP,
    resetPassword
};
