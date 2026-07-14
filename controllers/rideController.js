const sqlite3 = require("sqlite3").verbose();
 const fetch = require("node-fetch");

const db = new sqlite3.Database(
"./database/carryride.db"
);
const { getIO } = require("../socket/socket");
const estimateFare = async (req, res) => {

    const { pickup, drop, ratePerKm } = req.body;
    const key = process.env.GOOGLE_MAPS_BACKEND_KEY;

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(pickup)}&destinations=${encodeURIComponent(drop)}&key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const element = data.rows[0].elements[0];

        if (element.status !== "OK") {
            return res.status(400).json({ message: "Could not calculate route" });
        }

        const distanceKm = element.distance.value / 1000;
        const durationMin = element.duration.value / 60;
        const fare = Math.round(30 + distanceKm * ratePerKm);

        res.status(200).json({
            distanceKm: distanceKm.toFixed(1),
            durationMin: Math.round(durationMin),
            fare
        });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
const createRide = (req, res) => {

const {
    user_id,
    pickup_location,
    drop_location,
    passengers,
    vehicle_type,
    fare
} = req.body;

db.run(
    `
    INSERT INTO rides
    (
        user_id,
        pickup_location,
        drop_location,
        passengers,
        vehicle_type,
        fare
    )
    VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
        user_id,
        pickup_location,
        drop_location,
        passengers,
        vehicle_type,
        fare
    ],
    function(err) {

        if (err) {
            return res.status(500).json({
                message: err.message
            });
        }

        res.status(201).json({
            message: "Ride booked successfully",
            rideId: this.lastID,
            fare
        });
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

        res.status(200).json(rows);
    }
);

};

const acceptRide = (req, res) => {

    const rideId = req.params.id;
    const driverId = req.body.driver_id;

    db.run(
        `UPDATE rides
         SET driver_id = ?, status = 'Accepted'
         WHERE id = ?`,
        [driverId, rideId],
        function(err) {

            if (err) {
                return res.status(500).json({ message: err.message });
            }

            db.get(
                `SELECT user_id FROM rides WHERE id = ?`,
                [rideId],
                (err2, row) => {
                    if (!err2 && row) {
                        getIO().to(`user_${row.user_id}`).emit("rideStatusUpdate", {
                            rideId: Number(rideId),
                            status: "Accepted",
                            driverId
                        });
                    }
                }
            );

            res.status(200).json({
                message: "Ride accepted successfully"
            });
        }
    );
};

const transitRide = (req, res) => {

    const rideId = req.params.id;

    db.run(
        `UPDATE rides
         SET status = 'In Transit'
         WHERE id = ?`,
        [rideId],
        function(err) {

            if (err) {
                return res.status(500).json({ message: err.message });
            }

            db.get(
                `SELECT user_id FROM rides WHERE id = ?`,
                [rideId],
                (err2, row) => {
                    if (!err2 && row) {
                        getIO().to(`user_${row.user_id}`).emit("rideStatusUpdate", {
                            rideId: Number(rideId),
                            status: "In Transit"
                        });
                    }
                }
            );

            res.status(200).json({
                message: "Ride is now in transit"
            });
        }
    );
};

const completeRide = (req, res) => {

    const rideId = req.params.id;

    db.run(
        `UPDATE rides
         SET status = 'Completed'
         WHERE id = ?`,
        [rideId],
        function(err) {

            if (err) {
                return res.status(500).json({ message: err.message });
            }

            db.get(
                `SELECT user_id FROM rides WHERE id = ?`,
                [rideId],
                (err2, row) => {
                    if (!err2 && row) {
                        getIO().to(`user_${row.user_id}`).emit("rideStatusUpdate", {
                            rideId: Number(rideId),
                            status: "Completed"
                        });
                    }
                }
            );

            res.status(200).json({
                message: "Ride completed successfully"
            });
        }
    );
};

const getUserRides = (req, res) => {

const userId = req.params.userId;

db.all(
    `
    SELECT *
    FROM rides
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

const getPendingRides = (req, res) => {

db.all(
    `
    SELECT *
    FROM rides
    WHERE status = 'Pending'
    `,
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

const cancelRide = (req, res) => {

    const rideId = req.params.id;

    db.run(
        `
        UPDATE rides
        SET status = 'Cancelled'
        WHERE id = ?
        `,
        [rideId],
        function(err) {

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message:
                "Ride cancelled successfully"
            });
        }
    );
};

module.exports = {
createRide,
getAllRides,
acceptRide,
transitRide,
completeRide,
cancelRide,
getUserRides,
getPendingRides,
estimateFare 
};