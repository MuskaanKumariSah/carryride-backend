const jwt = require("jsonwebtoken");

// Verifies a valid JWT was sent, and that its role is "admin"
const verifyAdmin = (req, res, next) => {

    const authHeader = req.headers["authorization"];

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "No token provided"
        });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

        if (err) {
            return res.status(403).json({
                message: "Invalid or expired token"
            });
        }

        if (decoded.role !== "admin") {
            return res.status(403).json({
                message: "Access denied: admin only"
            });
        }

        req.admin = decoded;
        next();
    });
};

module.exports = { verifyAdmin };