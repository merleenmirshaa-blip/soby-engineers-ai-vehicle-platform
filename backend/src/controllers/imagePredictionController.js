const db = require("../config/db");

console.log("Image Prediction Controller Loaded");

// ==========================================
// SAVE IMAGE AI PREDICTION
// ==========================================
exports.saveImagePrediction = (req, res) => {

    const userId = req.user.id;

    const {
        vehicle_id,
        image_name,
        prediction,
        confidence,
        recommendation
    } = req.body;

    // ==========================================
    // REQUIRED FIELD VALIDATION
    // ==========================================
    if (!image_name) {
        return res.status(400).json({
            success: false,
            message: "Image name is required"
        });
    }

    if (!prediction) {
        return res.status(400).json({
            success: false,
            message: "Prediction is required"
        });
    }

    if (confidence === undefined || confidence === null) {
        return res.status(400).json({
            success: false,
            message: "Confidence is required"
        });
    }

    // ==========================================
    // INSERT IMAGE PREDICTION
    // ==========================================
    const sql = `
        INSERT INTO image_predictions
        (
            user_id,
            vehicle_id,
            image_name,
            prediction,
            confidence,
            recommendation
        )
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [
        userId,
        vehicle_id || null,
        image_name,
        prediction,
        confidence,
        recommendation || null
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.error(
                "Error saving image prediction:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Failed to save image prediction",
                error: err.message
            });
        }

        return res.status(201).json({
            success: true,
            message: "Image prediction saved successfully",
            predictionId: result.insertId
        });
    });
};


// ==========================================
// GET IMAGE PREDICTION HISTORY
// ==========================================
exports.getImagePredictions = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            ip.id,
            ip.user_id,
            ip.vehicle_id,
            ip.image_name,
            ip.prediction,
            ip.confidence,
            ip.recommendation,
            ip.created_at,
            v.vehicle_name,
            v.registration_number
        FROM image_predictions ip
        LEFT JOIN vehicles v
            ON ip.vehicle_id = v.id
        WHERE ip.user_id = ?
        ORDER BY ip.created_at DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.error(
                "Error fetching image predictions:",
                err
            );

            return res.status(500).json({
                success: false,
                message: "Failed to fetch image prediction history",
                error: err.message
            });
        }

        return res.status(200).json({
            success: true,
            predictions: results
        });
    });
};