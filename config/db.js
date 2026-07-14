const sqlite3 = require("sqlite3").verbose();
const path = require("path");
require("dotenv").config();

const dbPath = path.join(__dirname, "..", "database", "carryride.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("SQLite Database Connected");
    }
});

module.exports = db;