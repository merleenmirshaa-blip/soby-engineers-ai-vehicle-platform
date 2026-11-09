const db = require("../config/db");

console.log("Vehicle Controller Loaded");

// =======================
// Add Vehicle
// =======================
exports.addVehicle = (req, res) => {

    const user_id = req.user.id;

    const {
        vehicle_name,
        model,
        registration_number,
        fuel_type,
        manufacturer,
        purchase_date,
        mileage,
        engine_type,
        vehicle_usage
    } = req.body;

    // Required fields
    if (
        !vehicle_name ||
        !model ||
        !registration_number ||
        !fuel_type ||
        !engine_type ||
        !vehicle_usage
    ) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    // SQL query
    const sql = `
        INSERT INTO vehicles
        (
            user_id,
            vehicle_name,
            model,
            registration_number,
            manufacturer,
            fuel_type,
            purchase_date,
            mileage,
            engine_type,
            vehicle_usage
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Values
    const values = [
        user_id,
        vehicle_name,
        model,
        registration_number,
        manufacturer,
        fuel_type,
        purchase_date,
        mileage,
        engine_type,
        vehicle_usage
    ];

    console.log("Vehicle Data Received:", values);

    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {

                console.error(
                    "Add Vehicle Database Error:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to add vehicle",
                    error: err.sqlMessage || err.message
                });
            }

            return res.status(201).json({
                message: "Vehicle added successfully",
                vehicleId: result.insertId
            });

        }
    );

};


// =======================
// View Vehicles
// =======================
exports.getVehicles = (req, res) => {

    const user_id = req.user.id;

    const sql = `
        SELECT *
        FROM vehicles
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    db.query(
        sql,
        [user_id],
        (err, result) => {

            if (err) {

                console.error(
                    "Get Vehicles Error:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch vehicles",
                    error: err.sqlMessage || err.message
                });
            }

            return res.status(200).json(result);

        }
    );

};


// =======================
// Update Vehicle
// =======================
exports.updateVehicle = (req, res) => {

    console.log("BODY RECEIVED:", req.body);

    const user_id = req.user.id;
    const vehicle_id = req.params.id;

    const {
        vehicle_name,
        model,
        registration_number,
        manufacturer,
        fuel_type,
        purchase_date,
        mileage,
        engine_type,
        vehicle_usage
    } = req.body;

    if (
        !vehicle_name ||
        !model ||
        !registration_number ||
        !fuel_type ||
        !engine_type ||
        !vehicle_usage
    ) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    const sql = `
        UPDATE vehicles
        SET
            vehicle_name = ?,
            model = ?,
            registration_number = ?,
            manufacturer = ?,
            fuel_type = ?,
            purchase_date = ?,
            mileage = ?,
            engine_type = ?,
            vehicle_usage = ?
        WHERE id = ? AND user_id = ?
    `;

    const values = [
        vehicle_name,
        model,
        registration_number,
        manufacturer,
        fuel_type,
        purchase_date,
        mileage,
        engine_type,
        vehicle_usage,
        vehicle_id,
        user_id
    ];

    db.query(
        sql,
        values,
        (err, result) => {

            if (err) {

                console.error(
                    "Update Vehicle Error:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to update vehicle",
                    error: err.sqlMessage || err.message
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Vehicle not found"
                });
            }

            return res.status(200).json({
                message: "Vehicle updated successfully"
            });

        }
    );

};


// =======================
// Delete Vehicle
// =======================
exports.deleteVehicle = (req, res) => {

    const user_id = req.user.id;
    const vehicle_id = req.params.id;

    const sql = `
        DELETE FROM vehicles
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        sql,
        [vehicle_id, user_id],
        (err, result) => {

            if (err) {

                console.error(
                    "Delete Vehicle Error:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to delete vehicle",
                    error: err.sqlMessage || err.message
                });
            }

            if (result.affectedRows === 0) {

                return res.status(404).json({
                    message: "Vehicle not found"
                });
            }

            return res.status(200).json({
                message: "Vehicle deleted successfully"
            });

        }
    );

};