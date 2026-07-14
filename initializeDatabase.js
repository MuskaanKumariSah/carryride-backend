const db = require("./config/db");

db.serialize(() => {

    // USERS TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            role TEXT DEFAULT 'user',
            is_verified INTEGER DEFAULT 0,
            otp TEXT,
            otp_expires DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("USERS TABLE ERROR:", err.message);
        else console.log("Users table OK");
    });

    // DRIVERS TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS drivers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            phone TEXT,
            vehicle_type TEXT,
            vehicle_number TEXT,
            status TEXT DEFAULT 'available',
            latitude REAL DEFAULT 0,
            longitude REAL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("DRIVERS TABLE ERROR:", err.message);
        else console.log("Drivers table OK");
    });

    // ADMINS TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS admins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("ADMINS TABLE ERROR:", err.message);
        else console.log("Admins table OK");
    });

    // BOOKINGS TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            driver_id INTEGER,
            booking_type TEXT,
            pickup_location TEXT,
            destination TEXT,
            vehicle_type TEXT,
            luggage_weight REAL,
            luggage_category TEXT,
            fare REAL,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("BOOKINGS TABLE ERROR:", err.message);
        else console.log("Bookings table OK");
    });

    // LUGGAGE BOOKINGS TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS luggage_bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            driver_id INTEGER,
            pickup_location TEXT NOT NULL,
            drop_location TEXT NOT NULL,
            luggage_type TEXT NOT NULL,
            weight REAL NOT NULL,
            vehicle_type TEXT NOT NULL,
            price REAL DEFAULT 0,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("LUGGAGE BOOKINGS TABLE ERROR:", err.message);
        else console.log("Luggage bookings table OK");
    });

    // RIDES TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS rides (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            driver_id INTEGER,
            pickup_location TEXT,
            drop_location TEXT,
            passengers INTEGER,
            vehicle_type TEXT,
            fare REAL,
            status TEXT DEFAULT 'Pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("RIDES TABLE ERROR:", err.message);
        else console.log("Rides table OK");
    });

    // PAYMENTS TABLE
    db.run(`
        CREATE TABLE IF NOT EXISTS payments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            booking_id INTEGER,
            amount REAL,
            payment_method TEXT,
            payment_status TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error("PAYMENTS TABLE ERROR:", err.message);
        else console.log("Payments table OK");
    });

    console.log("CarryRide Database Initialization Script Finished");
});

db.close();