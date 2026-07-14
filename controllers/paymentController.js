const db = require("../config/db");

const createPayment = (req, res) => {

    const { rideId, amount, paymentMethod } = req.body;

    if (!amount || !paymentMethod) {
        return res.status(400).json({
            message: "Amount and payment method are required"
        });
    }

    db.run(
        `INSERT INTO payments
        (booking_id, amount, payment_method, payment_status)
        VALUES (?, ?, ?, 'Success')`,
        [rideId || null, amount, paymentMethod],
        function (err) {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Payment recorded successfully",
                transactionId: this.lastID,
                amount,
                paymentMethod,
                status: "Success"
            });
        }
    );
};

module.exports = { createPayment };