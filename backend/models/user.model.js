const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    password:{
        type:String,
        required:true,
    },
    image:{
        type:String
    },
    // RBAC
    role:{
        type:String,
        enum:["admin","user","moderator"],
        default:"user"
    },
    otp: { type: String }, 
    otpExpires: { type: Date }
},{timestamps:true});

module.exports = mongoose.model("User",userSchema);