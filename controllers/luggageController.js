const db = require("../config/db");

// CREATE LUGGAGE BOOKING
const createLuggageBooking = (req, res) => {
    const {
        user_id,
        pickup_location,
        drop_location,
        luggage_type,
        weight,
        vehicle_type
    } = req.body;

    let rate = 5;

if (vehicle_type === "Auto") {
    rate = 8;
}

if (vehicle_type === "Car") {
    rate = 10;
}

if (vehicle_type === "Mini Truck") {
    rate = 15;
}

const price =
    50 + (Number(weight) * rate);

    db.run(
        `INSERT INTO luggage_bookings
        (
            user_id,
            pickup_location,
            drop_location,
            luggage_type,
            weight,
            vehicle_type,
            price
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
            user_id,
            pickup_location,
            drop_location,
            luggage_type,
            weight,
            vehicle_type,
            price
        ],
        function(err) {
            if (err) {
                return res.status(500).json({
                    message: "Booking failed"
                });
            }

            res.status(201).json({
                message: "Luggage booking created",
                bookingId: this.lastID,
                price
            });
        }
    );
};

const getAllLuggageBookings = (req, res) => {
    db.all(
        "SELECT * FROM luggage_bookings",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.status(200).json(rows);
        }
    );
};

const acceptLuggageBooking = (req, res) => {

    const bookingId = req.params.id;
    const { driver_id } = req.body;

    db.run(
        `
        UPDATE luggage_bookings
        SET
            driver_id = ?,
            status = 'Accepted'
        WHERE id = ?
        `,
        [driver_id, bookingId],
        function(err) {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.status(200).json({
                message: "Booking accepted successfully"
            });
        }
    );
};

const pickupLuggage = (req, res) => {

    const bookingId = req.params.id;

    db.run(
        `
        UPDATE luggage_bookings
        SET status = 'Picked Up'
        WHERE id = ?
        `,
        [bookingId],
        function(err) {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.status(200).json({
                message: "Luggage picked up"
            });
        }
    );
};

const transitLuggage = (req, res) => {

    const bookingId = req.params.id;

    db.run(
        `
        UPDATE luggage_bookings
        SET status = 'In Transit'
        WHERE id = ?
        `,
        [bookingId],
        function(err) {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.status(200).json({
                message: "Luggage is now in transit"
            });
        }
    );
};

const deliverLuggage = (req, res) => {

    const bookingId = req.params.id;

    db.run(
        `
        UPDATE luggage_bookings
        SET status = 'Delivered'
        WHERE id = ?
        `,
        [bookingId],
        function(err) {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            res.status(200).json({
                message: "Luggage delivered successfully"
            });
        }
    );
};

const getUserLuggage = (req, res) => {

    const userId = req.params.userId;

    db.all(
        `
        SELECT *
        FROM luggage_bookings
        WHERE user_id = ?
        ORDER BY id DESC
        `,
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

const cancelLuggage = (req, res) => {

    const bookingId =
        req.params.id;

    db.run(
        `
        UPDATE luggage_bookings
        SET status='Cancelled'
        WHERE id=?
        `,
        [bookingId],
        function(err){

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message:
                "Luggage booking cancelled"
            });
        }
    );
};

module.exports = {
    createLuggageBooking,
    getAllLuggageBookings,
    acceptLuggageBooking,
    pickupLuggage,
    transitLuggage,
    deliverLuggage,
    getUserLuggage,
    cancelLuggage
};