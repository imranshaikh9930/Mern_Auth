const cloudinary = require("cloudinary").v2;
const {CloudinaryStorage} = require("multer-storage-cloudinary");
const multer  = require("multer");
require("dotenv").config();


// multer Storage config

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:"uploads",
        format:async(req,file)=>{
            return file.mimetype.split("/")[1];

        },
        allowed_formats:["png","jpeg","jpg"],

        public_id: (req, file) => `${Date.now()}_${file.originalname}`

    }
        

})

const upload = multer({ storage: storage });

module.exports = { upload, cloudinary };