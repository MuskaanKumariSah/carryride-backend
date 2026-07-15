const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../utils/mailer");

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        db.get(
            "SELECT * FROM users WHERE email = ?",
            [email],
            async (err, user) => {

                if (err) {
                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                if (user) {
                    return res.status(400).json({
                        message: "Email already exists"
                    });
                }

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                // OTP email disabled for now (auto-verify) — see note in mailer.js
                db.run(
                    `INSERT INTO users
                    (name, email, password, is_verified)
                    VALUES (?, ?, ?, 1)`,
                    [name, email, hashedPassword],
                    function (err) {

                        if (err) {
                            return res.status(500).json({
                                message: "Failed to register user"
                            });
                        }

                        res.status(201).json({
                            message: "User registered successfully.",
                            userId: this.lastID
                        });
                    }
                );
            }
        );

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

const verifyOtp = (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({
            message: "Email and OTP are required"
        });
    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        (err, user) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            if (user.is_verified) {
                return res.status(400).json({
                    message: "Email already verified"
                });
            }

            if (user.otp !== otp) {
                return res.status(400).json({
                    message: "Invalid OTP"
                });
            }

            if (new Date(user.otp_expires) < new Date()) {
                return res.status(400).json({
                    message: "OTP has expired"
                });
            }

            db.run(
                `UPDATE users
                 SET is_verified = 1, otp = NULL, otp_expires = NULL
                 WHERE email = ?`,
                [email],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            message: "Failed to verify OTP"
                        });
                    }

                    res.json({
                        message: "Email verified successfully"
                    });
                }
            );
        }
    );
};

const resendOtp = (req, res) => {

    const { email } = req.body;

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {

            if (err) {
                return res.status(500).json({ message: "Database error" });
            }

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            if (user.is_verified) {
                return res.status(400).json({ message: "Email already verified" });
            }

            const otp = generateOTP();
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

            db.run(
                "UPDATE users SET otp = ?, otp_expires = ? WHERE email = ?",
                [otp, otpExpires, email],
                async (err) => {

                    if (err) {
                        return res.status(500).json({ message: "Failed to resend OTP" });
                    }

                    try {
                        await sendOTPEmail(email, otp);
                    } catch (mailErr) {
                        console.log("OTP RESEND EMAIL ERROR:", mailErr);
                        return res.status(500).json({ message: "Failed to send OTP email" });
                    }

                    res.json({ message: "OTP resent successfully" });
                }
            );
        }
    );
};

const loginUser = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password required"
        });
    }

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const match =
                await bcrypt.compare(
                    password,
                    user.password
                );

            if (!match) {
                return res.status(401).json({
                    message: "Invalid password"
                });
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    role: "user"
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            );

            res.json({
            message: "Login successful",
            token,
            userId: user.id,
            name: user.name
});
        }
    );
};

const getUserRideHistory = (req, res) => {

    const userId = req.params.userId;

    db.all(
        "SELECT * FROM rides WHERE user_id = ?",
        [userId],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);
        }
    );
};

const getUserLuggageHistory = (req, res) => {

    const userId = req.params.userId;

    db.all(
        "SELECT * FROM luggage_bookings WHERE user_id = ?",
        [userId],
        (err, rows) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);
        }
    );
};

module.exports = {
    registerUser,
    verifyOtp,
    resendOtp,
    loginUser,
    getUserRideHistory,
    getUserLuggageHistory
};