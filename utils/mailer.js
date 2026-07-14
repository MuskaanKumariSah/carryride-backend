const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTPEmail = async (toEmail, otp) => {

    await transporter.sendMail({
        from: `"CarryRide" <${process.env.EMAIL_USER}>`,
        to: toEmail,
        subject: "Your CarryRide Verification Code",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>🚕 CarryRide Email Verification</h2>
                <p>Your verification code is:</p>
                <h1 style="letter-spacing: 4px;">${otp}</h1>
                <p>This code expires in 10 minutes.</p>
            </div>
        `
    });

};

module.exports = { sendOTPEmail };