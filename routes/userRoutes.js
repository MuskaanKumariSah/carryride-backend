const express = require("express");
const router = express.Router();

const {
    registerUser,
    verifyOtp,
    resendOtp,
    loginUser,
    getUserRideHistory,
    getUserLuggageHistory
} = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/login", loginUser);

router.get("/rides/:userId", getUserRideHistory);
router.get("/luggage/:userId", getUserLuggageHistory);

module.exports = router;