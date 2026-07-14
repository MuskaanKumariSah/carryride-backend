const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyOtp,
    resendOtp,
    getUserRideHistory,
    getUserLuggageHistory
} = require("../controllers/userController");

router.post(
    "/register",
    registerUser
);

router.post(
    "/login",
    loginUser
);

router.post(
    "/verify-otp",
    verifyOtp
);

router.post(
    "/resend-otp",
    resendOtp
);

router.get(
    "/rides/:userId",
    getUserRideHistory
);

router.get(
    "/luggage/:userId",
    getUserLuggageHistory
);

module.exports = router;