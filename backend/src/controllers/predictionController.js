const db = require("../config/db");

// ===============================
// GET ALL PREDICTION HISTORY
// ===============================
exports.getPredictions = (req, res) => {

    console.log("=================================");
    console.log("PREDICTION HISTORY REQUEST");
    console.log("USER:", req.user);
    console.log("=================================");

    const sql = `
        SELECT
            p.id,
            p.vehicle_id,
            p.health_score,
            p.predicted_issue,
            p.confidence,
            v.vehicle_name,
            v.model,
            v.registration_number,
            v.manufacturer,
            v.user_id
        FROM predictions p
        INNER JOIN vehicles v
            ON p.vehicle_id = v.id
        ORDER BY p.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("❌ Prediction SQL Error:", err);

            return res.status(500).json({
                success: false,
                message: "Database error",
                error: err.message
            });
        }

        console.log("✅ Prediction records found:", results.length);
        console.log(results);

        return res.json({
            success: true,
            count: results.length,
            predictions: results
        });
    });
};