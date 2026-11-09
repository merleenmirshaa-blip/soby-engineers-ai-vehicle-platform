const db = require("../config/db");

console.log("Report Controller Loaded");

// ==========================================
// MAINTENANCE REQUIREMENT REPORT
// ==========================================
exports.getMaintenanceRequirementReport = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            v.id,
            v.vehicle_name,
            v.registration_number,
            v.manufacturer,
            v.model,
            v.fuel_type,
            v.mileage,

            p.prediction,
            p.probability,
            p.health_score,
            p.health_status,
            p.predicted_at

        FROM vehicles v

        LEFT JOIN (
            SELECT p1.*
            FROM predictions p1
            INNER JOIN (
                SELECT
                    vehicle_id,
                    MAX(id) AS latest_id
                FROM predictions
                GROUP BY vehicle_id
            ) latest
                ON p1.id = latest.latest_id
        ) p
            ON v.id = p.vehicle_id

        WHERE v.user_id = ?

        ORDER BY
            CASE
                WHEN p.health_status = 'Critical' THEN 1
                WHEN p.health_status = 'Needs Attention' THEN 2
                WHEN p.health_status = 'Good' THEN 3
                WHEN p.health_status = 'Excellent' THEN 4
                ELSE 5
            END,
            v.id DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.log("Maintenance Requirement Report Error:", err);

            return res.status(500).json({
                message: "Failed to generate maintenance requirement report",
                error: err.message
            });
        }

        return res.status(200).json(results);
    });
};