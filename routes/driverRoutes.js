const express = require("express");
const router = express.Router();
const {
    registerDriver,
    loginDriver,
    getDriverEarnings,
    updateLocation,
    getDriverLocation
} = require("../controllers/driverController");
router.post(
    "/register",
    registerDriver
);
router.post(
    "/login",
    loginDriver
);
router.get("/test", (req, res) => {
    res.json({ message: "Driver route working" });
});

router.get(
    "/earnings/:driverId",
    getDriverEarnings
);

router.post(
    "/location",
    updateLocation
);

router.get("/columns", (req, res) => {

    const db = require("../config/db");

    db.all(
        "PRAGMA table_info(drivers)",
        [],
        (err, rows) => {

            if (err) {
                return res.json(err);
            }

            res.json(rows);
        }
    );
});

router.get(
    "/location/:driverId",
    getDriverLocation
);

module.exports = router;