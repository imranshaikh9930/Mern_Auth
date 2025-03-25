const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const authRoute= require("./routes/authRoute");
const connectDb = require("./lib/connectDb");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});
// Routes
app.use("/auth", authRoute);
app.use("/images", express.static(path.join(__dirname, "../uploads")));

// Test API
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Database Connection & Server Start
const startServer = async () => {
    try {
        await connectDb();
        console.log("Database Connected Successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server is Running On Port ${PORT}`);
        });
    } catch (err) {
        console.error("Database Connection Failed:", err);
        process.exit(1); // Stop the app if DB connection fails
    }
};

startServer();
