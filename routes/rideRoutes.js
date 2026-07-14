const express = require("express");

const router = express.Router();

const {
    createRide,
    getAllRides,
    acceptRide,
    transitRide,
    completeRide,
    cancelRide,
    getUserRides,
    getPendingRides,
    estimateFare 
} = require("../controllers/rideController");

router.post(
    "/create",
    createRide
);

router.get(
    "/all",
    getAllRides
);

router.put(
    "/accept/:id",
    acceptRide
);

router.put(
    "/transit/:id",
    transitRide
);

router.put(
    "/complete/:id",
    completeRide
);

router.get(
    "/user/:userId",
    getUserRides
);

router.get(
    "/pending",
    getPendingRides
);

router.put(
    "/cancel/:id",
    cancelRide
);
router.post(
    "/estimate-fare",
    estimateFare
);
module.exports = router;