const db = require("../config/db");

const getDashboardStats = (req, res) => {

    db.serialize(() => {

        let stats = {};

        db.get(
            "SELECT COUNT(*) AS totalUsers FROM users",
            [],
            (err, row) => {

                stats.totalUsers = row.totalUsers;

                db.get(
                    "SELECT COUNT(*) AS totalDrivers FROM drivers",
                    [],
                    (err, row) => {

                        stats.totalDrivers = row.totalDrivers;

                        db.get(
                            "SELECT COUNT(*) AS totalRides FROM rides",
                            [],
                            (err, row) => {

                                stats.totalRides = row.totalRides;

                                db.get(
                                    "SELECT COUNT(*) AS totalLuggage FROM luggage_bookings",
                                    [],
                                    (err, row) => {

                                        stats.totalLuggage = row.totalLuggage;

                                        db.get(
                                            "SELECT COUNT(*) AS completedRides FROM rides WHERE status='Completed'",
                                            [],
                                            (err, row) => {

                                                stats.completedRides = row.completedRides;

                                                db.get(
                                                    "SELECT COUNT(*) AS deliveredLuggage FROM luggage_bookings WHERE status='Delivered'",
                                                    [],
                                                    (err, row) => {

                                                        stats.deliveredLuggage = row.deliveredLuggage;

                                                        db.get(
                                                            "SELECT SUM(price) AS luggageRevenue FROM luggage_bookings",
                                                            [],
                                                            (err, row) => {

                                                                stats.luggageRevenue = row.luggageRevenue || 0;

                                                                db.get(
                                                                    "SELECT SUM(fare) AS rideRevenue FROM rides",
                                                                    [],
                                                                    (err, row) => {

                                                                        stats.rideRevenue = row.rideRevenue || 0;

                                                                        stats.totalRevenue =
                                                                            stats.luggageRevenue +
                                                                            stats.rideRevenue;

                                                                        res.json(stats);
                                                                    }
                                                                );
                                                            }
                                                        );
                                                    }
                                                );
                                            }
                                        );
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );

    });
};

const getAllUsers = (req, res) => {

    db.all(
        "SELECT id, name, email, created_at FROM users",
        [],
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

const getAllDrivers = (req, res) => {

    db.all(
        `SELECT
            id,
            name,
            email,
            phone,
            vehicle_type,
            vehicle_number,
            status
         FROM drivers`,
        [],
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

const getAllRides = (req, res) => {

    db.all(
        "SELECT * FROM rides",
        [],
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

const getAllLuggage = (req, res) => {

    db.all(
        "SELECT * FROM luggage_bookings",
        [],
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
    getDashboardStats,
    getAllUsers,
    getAllDrivers,
    getAllRides,
    getAllLuggage
};