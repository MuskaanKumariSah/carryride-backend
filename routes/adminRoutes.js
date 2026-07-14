const express = require("express");

const router = express.Router();

const { verifyAdmin } = require("../middleware/authMiddleware");

const {
    getDashboardStats,
    getAllUsers,
    getAllDrivers,
    getAllRides,
    getAllLuggage
} = require("../controllers/adminController");

// All admin routes now require a valid admin JWT
router.get(
    "/dashboard",
    verifyAdmin,
    getDashboardStats
);
router.get(
    "/users",
    verifyAdmin,
    getAllUsers
);
router.get(
    "/drivers",
    verifyAdmin,
    getAllDrivers
);

router.get(
    "/rides",
    verifyAdmin,
    getAllRides
);

router.get(
    "/luggage",
    verifyAdmin,
    getAllLuggage
);

module.exports = router;