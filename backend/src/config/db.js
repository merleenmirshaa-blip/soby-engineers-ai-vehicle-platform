const mysql = require("mysql2");

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {

    if (err) {

        console.log("❌ Database connection failed:");
        console.log(err);

    } else {

        console.log("✅ MySQL Connected Successfully");

        // CHECK DATABASE USED BY NODE
        db.query(
            "SELECT DATABASE() AS database_name",
            (error, result) => {

                if (error) {
                    console.log(
                        "Database check error:",
                        error
                    );
                } else {
                    console.log(
                        "NODE CONNECTED DATABASE:",
                        result
                    );
                }
            }
        );

        // CHECK PREDICTION COUNT
        db.query(
            "SELECT COUNT(*) AS prediction_count FROM predictions",
            (error, result) => {

                if (error) {
                    console.log(
                        "Prediction count error:",
                        error
                    );
                } else {
                    console.log(
                        "NODE PREDICTION COUNT:",
                        result
                    );
                }
            }
        );
    }
});

module.exports = db;