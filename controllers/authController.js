const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin = (req, res) => {
    const { username, password } = req.body;

    const query = `
        SELECT * FROM admins
        WHERE username = ?
    `;

    db.get(query, [username], async (err, admin) => {

        if (err) {
            return res.status(500).json({
                message: "Database error"
            });
        }

        if (!admin) {
            return res.status(404).json({
                message: "Admin not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isMatch) {
            return res.status(401).json({
                message: "Invalid password"
            });
        }

        const token = jwt.sign(
            {
                id: admin.id,
                role: "admin"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "24h"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });
    });
};

module.exports = {
    adminLogin
};