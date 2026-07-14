const express = require("express");

const router = express.Router();

const {
    createLuggageBooking,
    getAllLuggageBookings,
    acceptLuggageBooking,
    pickupLuggage,
    transitLuggage,
    deliverLuggage,
    getUserLuggage,
    cancelLuggage
} = require("../controllers/luggageController");

router.post(
    "/create",
    createLuggageBooking
);

router.get(
    "/all",
    getAllLuggageBookings
);

router.put(
    "/accept/:id",
    acceptLuggageBooking
);

router.put(
    "/pickup/:id",
    pickupLuggage
);

router.put(
    "/transit/:id",
    transitLuggage
);

router.put(
    "/deliver/:id",
    deliverLuggage
);

router.get(
    "/user/:userId",
    getUserLuggage
);

router.put(
    "/cancel/:id",
    cancelLuggage
);

module.exports = router;