const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// DRIVER REGISTER
const registerDriver = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            phone,
            vehicle_type,
            vehicle_number
        } = req.body;

        if (
            !name ||
            !email ||
            !password ||
            !phone ||
            !vehicle_type ||
            !vehicle_number
        ) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        db.get(
            "SELECT * FROM drivers WHERE email = ?",
            [email],
            async (err, driver) => {
                if (err) {
                    return res.status(500).json({
                        message: "Database error"
                    });
                }

                if (driver) {
                    return res.status(400).json({
                        message: "Driver already exists"
                    });
                }

                const hashedPassword =
                    await bcrypt.hash(password, 10);

                db.run(
                    `INSERT INTO drivers
                    (name,email,password,phone,vehicle_type,vehicle_number)
                    VALUES (?,?,?,?,?,?)`,
                    [
                        name,
                        email,
                        hashedPassword,
                        phone,
                        vehicle_type,
                        vehicle_number
                    ],
                    function (err) {
                        if (err) {
                            return res.status(500).json({
                                message: "Registration failed"
                            });
                        }

                        res.status(201).json({
                            message: "Driver registered successfully",
                            driverId: this.lastID
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

// DRIVER LOGIN
const loginDriver = (req, res) => {
    const { email, password } = req.body;

    db.get(
        "SELECT * FROM drivers WHERE email = ?",
        [email],
        async (err, driver) => {

            if (err) {
                return res.status(500).json({
                    message: "Database error"
                });
            }

            if (!driver) {
                return res.status(404).json({
                    message: "Driver not found"
                });
            }

            const isMatch = await bcrypt.compare(
                password,
                driver.password
            );

            if (!isMatch) {
                return res.status(401).json({
                    message: "Invalid credentials"
                });
            }

            const token = jwt.sign(
                {
                    id: driver.id,
                    role: "driver"
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h"
                }
            );

            res.json({
    message: "Login successful",
    token,
    driver: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        phone: driver.phone,
        vehicle_type: driver.vehicle_type,
        vehicle_number: driver.vehicle_number
    }
});
        }
    );
};

const getDriverEarnings = (req, res) => {

    const driverId = req.params.driverId;

    db.get(
        `
        SELECT
        (
            SELECT COALESCE(SUM(fare),0)
            FROM rides
            WHERE driver_id = ?
            AND status = 'Completed'
        )
        +
        (
            SELECT COALESCE(SUM(price),0)
            FROM luggage_bookings
            WHERE driver_id = ?
            AND status = 'Delivered'
        )
        AS totalEarnings
        `,
        [driverId, driverId],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(row);
        }
    );
};

const updateLocation = (req, res) => {

    console.log("LOCATION BODY:", req.body);

    const {
        driver_id,
        latitude,
        longitude
    } = req.body;

    console.log(
        "Driver:",
        driver_id,
        "Lat:",
        latitude,
        "Lng:",
        longitude
    );

    db.run(
        `
        UPDATE drivers
        SET latitude = ?,
            longitude = ?
        WHERE id = ?
        `,
        [latitude, longitude, driver_id],
        function(err) {

            if (err) {
                console.log("SQL ERROR:");
                console.log(err);

                return res.status(500).json({
                    message: err.message
                });
            }

            console.log(
                "Rows Updated:",
                this.changes
            );

            res.json({
                message: "Location Updated"
            });
        }
    );
};

const getDriverLocation = (req, res) => {

    const driverId = req.params.driverId;

    db.get(
        `
        SELECT
            id,
            name,
            latitude,
            longitude,
            vehicle_type,
            vehicle_number
        FROM drivers
        WHERE id = ?
        `,
        [driverId],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(row);
        }
    );
};

module.exports = {
    registerDriver,
    loginDriver,
    getDriverEarnings,
    updateLocation,
    getDriverLocation
};