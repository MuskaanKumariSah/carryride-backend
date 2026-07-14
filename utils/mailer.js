const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTPEmail = async (toEmail, otp) => {

    await resend.emails.send({
        from: "CarryRide <onboarding@resend.dev>",
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