const axios = require("axios");
const db = require("../config/db");

console.log("AI Controller Loaded");

// ======================================================
// PYTHON AI API
// ======================================================

const AI_API_URL = "http://127.0.0.1:8000/predict";

// ======================================================
// CALCULATE VEHICLE AGE
// ======================================================

const calculateVehicleAge = (purchaseDate) => {

    if (!purchaseDate) {
        return 0;
    }

    const purchase = new Date(purchaseDate);
    const today = new Date();

    let age =
        today.getFullYear() -
        purchase.getFullYear();

    const monthDifference =
        today.getMonth() -
        purchase.getMonth();

    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() < purchase.getDate()
        )
    ) {
        age--;
    }

    return Math.max(age, 0);
};

// ======================================================
// NORMALIZE PYTHON AI RESULT
// ======================================================

const normalizeAIResult = (aiResponse) => {

    console.log("\n======================================");
    console.log("RAW PYTHON RESPONSE");
    console.log("======================================");

    console.log(
        JSON.stringify(aiResponse, null, 2)
    );

    console.log("======================================");

    const result = aiResponse || {};

    return {

        health_score:
            Number(result.health_score ?? 0),

        health_status:
            result.health_status ??
            "Unknown",

        maintenance_probability:
            Number(
                result.maintenance_probability ?? 0
            ),

        prediction:
            result.prediction ??
            "No",

        recommendation:
            result.recommendation ??
            "Continue regular vehicle monitoring.",

        success:
            result.success !== false
    };
};

// ======================================================
// MANUAL AI PREDICTION
// POST /api/ai/predict
// ======================================================

exports.predictMaintenance = async (req, res) => {

    try {

        console.log("\n======================================");
        console.log("MANUAL AI PREDICTION");
        console.log("======================================");

        // ------------------------------------------------
        // PREPARE INPUT
        // ------------------------------------------------

        const aiInput = {

            vehicle_age:
                Number(
                    req.body.vehicle_age || 0
                ),

            mileage:
                Number(
                    req.body.mileage || 0
                ),

            fuel_type:
                req.body.fuel_type ||
                "Petrol",

            engine_type:
                req.body.engine_type ||
                "Medium",

            previous_maintenance_count:
                Number(
                    req.body.previous_maintenance_count ||
                    0
                ),

            days_since_last_maintenance:
                Number(
                    req.body.days_since_last_maintenance ||
                    0
                ),

            mileage_since_last_maintenance:
                Number(
                    req.body.mileage_since_last_maintenance ||
                    0
                ),

            average_monthly_mileage:
                Number(
                    req.body.average_monthly_mileage ||
                    0
                ),

            vehicle_usage:
                req.body.vehicle_usage ||
                "Medium"
        };

        // ------------------------------------------------
        // SHOW DATA SENT TO PYTHON
        // ------------------------------------------------

        console.log("\n======================================");
        console.log("DATA SENT TO PYTHON AI");
        console.log("======================================");

        console.log(
            JSON.stringify(
                aiInput,
                null,
                2
            )
        );

        console.log("======================================");

        // ------------------------------------------------
        // SEND TO PYTHON
        // ------------------------------------------------

        console.log(
            "\nSending data to Python AI..."
        );

        const aiResponse =
            await axios.post(
                AI_API_URL,
                aiInput
            );

        // ------------------------------------------------
        // RAW PYTHON RESPONSE
        // ------------------------------------------------

        console.log("\n======================================");
        console.log("PYTHON AI RAW RESPONSE");
        console.log("======================================");

        console.log(
            JSON.stringify(
                aiResponse.data,
                null,
                2
            )
        );

        console.log("======================================");

        // ------------------------------------------------
        // NORMALIZE
        // ------------------------------------------------

        const result =
            normalizeAIResult(
                aiResponse.data
            );

        // ------------------------------------------------
        // FINAL RESULT
        // ------------------------------------------------

        console.log("\n======================================");
        console.log("FINAL AI RESULT");
        console.log("======================================");

        console.log(result);

        console.log("======================================");

        return res.json(result);

    } catch (error) {

        console.error("\n======================================");
        console.error("AI PREDICTION ERROR");
        console.error("======================================");

        console.error(
            "Message:",
            error.message
        );

        if (error.response) {

            console.error(
                "Python Status:",
                error.response.status
            );

            console.error(
                "Python Response:",
                error.response.data
            );
        }

        console.error("======================================");

        return res.status(500).json({

            success: false,

            message:
                "AI prediction failed",

            error:
                error.message
        });
    }
};

// ======================================================
// VEHICLE AI PREDICTION
// GET /api/ai/vehicle/:vehicleId/predict
// ======================================================

exports.predictVehicleMaintenance =
    async (req, res) => {

        try {

            const vehicleId =
                req.params.vehicleId;

            const userId =
                req.user?.id;

            console.log("\n======================================");
            console.log("VEHICLE AI PREDICTION");
            console.log("======================================");

            console.log(
                "Vehicle ID:",
                vehicleId
            );

            console.log(
                "User ID:",
                userId
            );

            // ------------------------------------------------
            // CHECK USER
            // ------------------------------------------------

            if (!userId) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Unauthorized. User not found."
                });
            }

            // ------------------------------------------------
            // GET VEHICLE DATA
            // ------------------------------------------------

            const sql = `

                SELECT

                    v.id,
                    v.user_id,
                    v.vehicle_name,
                    v.model,
                    v.registration_number,
                    v.manufacturer,
                    v.fuel_type,
                    v.engine_type,
                    v.vehicle_usage,
                    v.purchase_date,
                    v.mileage,

                    COUNT(m.id)
                        AS previous_maintenance_count,

                    MAX(m.service_date)
                        AS last_service_date,

                    MAX(m.mileage_at_service)
                        AS last_service_mileage

                FROM vehicles v

                LEFT JOIN maintenance m
                    ON v.id = m.vehicle_id

                WHERE v.id = ?
                AND v.user_id = ?

                GROUP BY

                    v.id,
                    v.user_id,
                    v.vehicle_name,
                    v.model,
                    v.registration_number,
                    v.manufacturer,
                    v.fuel_type,
                    v.engine_type,
                    v.vehicle_usage,
                    v.purchase_date,
                    v.mileage

            `;

            db.query(
                sql,
                [vehicleId, userId],
                async (err, results) => {

                    // =========================================
                    // DATABASE ERROR
                    // =========================================

                    if (err) {

                        console.error(
                            "\nDATABASE ERROR:"
                        );

                        console.error(err);

                        return res.status(500).json({

                            success: false,

                            message:
                                "Failed to retrieve vehicle data",

                            error:
                                err.message
                        });
                    }

                    // =========================================
                    // VEHICLE NOT FOUND
                    // =========================================

                    if (
                        !results ||
                        results.length === 0
                    ) {

                        return res.status(404).json({

                            success: false,

                            message:
                                "Vehicle not found or access denied."
                        });
                    }

                    // =========================================
                    // VEHICLE
                    // =========================================

                    const vehicle =
                        results[0];

                    console.log(
                        "\nVEHICLE DATA FROM DATABASE:"
                    );

                    console.log(vehicle);

                    // =========================================
                    // VEHICLE AGE
                    // =========================================

                    const vehicleAge =
                        calculateVehicleAge(
                            vehicle.purchase_date
                        );

                    // =========================================
                    // CURRENT MILEAGE
                    // =========================================

                    const currentMileage =
                        Number(
                            vehicle.mileage || 0
                        );

                    // =========================================
                    // LAST SERVICE MILEAGE
                    // =========================================

                    const lastServiceMileage =
                        Number(
                            vehicle.last_service_mileage ||
                            0
                        );

                    // =========================================
                    // MILEAGE SINCE LAST SERVICE
                    // =========================================

                    let mileageSinceLastMaintenance =
                        0;

                    if (
                        lastServiceMileage > 0
                    ) {

                        mileageSinceLastMaintenance =
                            Math.max(
                                currentMileage -
                                lastServiceMileage,
                                0
                            );

                    } else {

                        // No maintenance record
                        mileageSinceLastMaintenance =
                            currentMileage;
                    }

                    // =========================================
                    // DAYS SINCE LAST SERVICE
                    // =========================================

                    let daysSinceLastMaintenance =
                        0;

                    if (
                        vehicle.last_service_date
                    ) {

                        const lastService =
                            new Date(
                                vehicle.last_service_date
                            );

                        const today =
                            new Date();

                        const difference =
                            today.getTime() -
                            lastService.getTime();

                        daysSinceLastMaintenance =
                            Math.max(
                                Math.floor(
                                    difference /
                                    (
                                        1000 *
                                        60 *
                                        60 *
                                        24
                                    )
                                ),
                                0
                            );
                    }

                    // =========================================
                    // PREVIOUS MAINTENANCE COUNT
                    // =========================================

                    const previousMaintenanceCount =
                        Number(
                            vehicle.previous_maintenance_count ||
                            0
                        );

                    // =========================================
                    // AVERAGE MONTHLY MILEAGE
                    // =========================================

                    let averageMonthlyMileage =
                        0;

                    if (
                        vehicleAge > 0
                    ) {

                        averageMonthlyMileage =
                            currentMileage /
                            (
                                vehicleAge *
                                12
                            );

                    } else {

                        averageMonthlyMileage =
                            currentMileage;
                    }

                    averageMonthlyMileage =
                        Number(
                            averageMonthlyMileage.toFixed(2)
                        );

                    // =========================================
                    // PREPARE AI INPUT
                    // =========================================

                    const aiInput = {

                        vehicle_age:
                            Number(
                                vehicleAge
                            ),

                        mileage:
                            Number(
                                currentMileage
                            ),

                        fuel_type:
                            vehicle.fuel_type ||
                            "Petrol",

                        engine_type:
                            vehicle.engine_type ||
                            "Medium",

                        previous_maintenance_count:
                            previousMaintenanceCount,

                        days_since_last_maintenance:
                            daysSinceLastMaintenance,

                        mileage_since_last_maintenance:
                            mileageSinceLastMaintenance,

                        average_monthly_mileage:
                            averageMonthlyMileage,

                        vehicle_usage:
                            vehicle.vehicle_usage ||
                            "Medium"
                    };

                    // =========================================
                    // SHOW EXACT DATA SENT TO PYTHON
                    // =========================================

                    console.log("\n======================================");
                    console.log("DATA SENT TO PYTHON AI");
                    console.log("======================================");

                    console.log(
                        JSON.stringify(
                            aiInput,
                            null,
                            2
                        )
                    );

                    console.log("======================================");

                    // =========================================
                    // SEND TO PYTHON AI
                    // =========================================

                    console.log(
                        "\nSending vehicle data to Python AI..."
                    );

                    const aiResponse =
                        await axios.post(
                            AI_API_URL,
                            aiInput
                        );

                    // =========================================
                    // SHOW RAW PYTHON RESPONSE
                    // =========================================

                    console.log("\n======================================");
                    console.log("PYTHON AI RAW RESPONSE");
                    console.log("======================================");

                    console.log(
                        JSON.stringify(
                            aiResponse.data,
                            null,
                            2
                        )
                    );

                    console.log("======================================");

                    // =========================================
                    // NORMALIZE PYTHON RESULT
                    // =========================================

                    const result =
                        normalizeAIResult(
                            aiResponse.data
                        );

                    // =========================================
                    // FINAL AI RESULT
                    // =========================================

                    console.log("\n======================================");
                    console.log("PYTHON AI RESULT");
                    console.log("======================================");

                    console.log(result);

                    console.log("======================================");

                    // =========================================
                    // SAVE AI PREDICTION TO DATABASE
                    // =========================================
                    //
                    // Actual predictions table:
                    //
                    // id
                    // vehicle_id
                    // health_score
                    // predicted_issue
                    // confidence
                    //
                    // Mapping:
                    //
                    // health_score
                    //     -> result.health_score
                    //
                    // predicted_issue
                    //     -> result.prediction
                    //
                    // confidence
                    //     -> result.maintenance_probability
                    //
                    // =========================================

                    const insertPredictionSQL = `

                        INSERT INTO predictions
                        (
                            vehicle_id,
                            health_score,
                            predicted_issue,
                            confidence
                        )

                        VALUES (?, ?, ?, ?)

                    `;

                    db.query(
                        insertPredictionSQL,
                        [
                            vehicleId,

                            Math.round(
                                result.health_score
                            ),

                            result.prediction,

                            result.maintenance_probability
                        ],
                        (insertError, insertResult) => {

                            // =========================================
                            // INSERT ERROR
                            // =========================================

                            if (insertError) {

                                console.error(
                                    "\n======================================"
                                );

                                console.error(
                                    "FAILED TO SAVE AI PREDICTION"
                                );

                                console.error(
                                    "======================================"
                                );

                                console.error(
                                    insertError
                                );

                                // AI prediction is valid,
                                // so still return it to frontend.

                                return res.json({

                                    success: true,

                                    vehicle: {

                                        id:
                                            vehicle.id,

                                        vehicle_name:
                                            vehicle.vehicle_name,

                                        model:
                                            vehicle.model,

                                        registration_number:
                                            vehicle.registration_number,

                                        manufacturer:
                                            vehicle.manufacturer
                                    },

                                    input_data:
                                        aiInput,

                                    health_score:
                                        result.health_score,

                                    health_status:
                                        result.health_status,

                                    maintenance_probability:
                                        result.maintenance_probability,

                                    prediction:
                                        result.prediction,

                                    recommendation:
                                        result.recommendation,

                                    prediction_saved:
                                        false
                                });
                            }

                            // =========================================
                            // PREDICTION SAVED SUCCESSFULLY
                            // =========================================

                            console.log(
                                "\n======================================"
                            );

                            console.log(
                                "AI PREDICTION SAVED SUCCESSFULLY"
                            );

                            console.log(
                                "Prediction ID:",
                                insertResult.insertId
                            );

                            console.log(
                                "======================================"
                            );

                            // =========================================
                            // SEND RESULT TO FRONTEND
                            // =========================================

                            return res.json({

                                success: true,

                                vehicle: {

                                    id:
                                        vehicle.id,

                                    vehicle_name:
                                        vehicle.vehicle_name,

                                    model:
                                        vehicle.model,

                                    registration_number:
                                        vehicle.registration_number,

                                    manufacturer:
                                        vehicle.manufacturer
                                },

                                input_data:
                                    aiInput,

                                health_score:
                                    result.health_score,

                                health_status:
                                    result.health_status,

                                maintenance_probability:
                                    result.maintenance_probability,

                                prediction:
                                    result.prediction,

                                recommendation:
                                    result.recommendation,

                                prediction_saved:
                                    true,

                                prediction_id:
                                    insertResult.insertId
                            });
                        }
                    );
                }
            );

        } catch (error) {

            console.error("\n======================================");
            console.error("VEHICLE AI ERROR");
            console.error("======================================");

            console.error(
                "Message:",
                error.message
            );

            if (error.response) {

                console.error(
                    "Python Status:",
                    error.response.status
                );

                console.error(
                    "Python Response:",
                    error.response.data
                );
            }

            console.error("======================================");

            return res.status(500).json({

                success: false,

                message:
                    "Vehicle AI prediction failed",

                error:
                    error.message
            });
        }
    };