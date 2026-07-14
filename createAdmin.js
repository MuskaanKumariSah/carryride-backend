const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function createAdmin() {

    const username = "admin";
    const password = "admin123";

    const hashedPassword = await bcrypt.hash(
        password,
        10
    );

    db.run(
        `
        INSERT INTO admins
        (username, password)
        VALUES (?, ?)
        `,
        [username, hashedPassword],
        function (err) {

            if (err) {
                console.log("Error:", err.message);
            } else {
                console.log("Admin created successfully");
                console.log("Username:", username);
                console.log("Password:", password);
            }

            db.close();
        }
    );
}

createAdmin();