const db = require("../config/db");

console.log("Maintenance Controller Loaded");

// ==========================================
// ADD MAINTENANCE
// ==========================================
exports.addMaintenance = (req, res) => {

    const userId = req.user.id;

    const {
        vehicle_id,
        service_type,
        service_date,
        next_service_date,
        mileage_at_service,
        cost,
        service_center,
        notes
    } = req.body;

    // Required field validation
    if (!vehicle_id || !service_type || !service_date) {
        return res.status(400).json({
            message: "Vehicle, service type and service date are required"
        });
    }

    // Make sure the vehicle belongs to the logged-in user
    const checkVehicleSql = `
        SELECT id
        FROM vehicles
        WHERE id = ? AND user_id = ?
    `;

    db.query(
        checkVehicleSql,
        [vehicle_id, userId],
        (err, vehicleResult) => {

            if (err) {
                console.log("Vehicle Check Error:", err);

                return res.status(500).json({
                    message: "Database error while checking vehicle",
                    error: err.message
                });
            }

            if (vehicleResult.length === 0) {
                return res.status(404).json({
                    message: "Vehicle not found or access denied"
                });
            }

            // Insert maintenance record
            const sql = `
                INSERT INTO maintenance
                (
                    vehicle_id,
                    service_type,
                    service_date,
                    next_service_date,
                    mileage_at_service,
                    cost,
                    service_center,
                    notes
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const values = [
                vehicle_id,
                service_type,
                service_date,
                next_service_date || null,
                mileage_at_service || null,
                cost || null,
                service_center || null,
                notes || null
            ];

            db.query(sql, values, (err, result) => {

                if (err) {
                    console.log("Add Maintenance Error:", err);

                    return res.status(500).json({
                        message: "Failed to add maintenance record",
                        error: err.message
                    });
                }

                return res.status(201).json({
                    message: "Maintenance record added successfully",
                    maintenanceId: result.insertId
                });
            });
        }
    );
};


// ==========================================
// GET MAINTENANCE HISTORY
// ==========================================
exports.getMaintenance = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            m.id,
            m.vehicle_id,
            v.vehicle_name,
            v.model,
            v.registration_number,
            m.service_type,
            m.service_date,
            m.next_service_date,
            m.mileage_at_service,
            m.cost,
            m.service_center,
            m.notes
        FROM maintenance m
        INNER JOIN vehicles v
            ON m.vehicle_id = v.id
        WHERE v.user_id = ?
        ORDER BY m.service_date DESC, m.id DESC
    `;

    db.query(sql, [userId], (err, results) => {

        if (err) {
            console.log("Get Maintenance Error:", err);

            return res.status(500).json({
                message: "Failed to fetch maintenance records",
                error: err.message
            });
        }

        return res.status(200).json(results);
    });
};


// ==========================================
// UPDATE MAINTENANCE
// ==========================================
exports.updateMaintenance = (req, res) => {

    const userId = req.user.id;
    const maintenanceId = req.params.id;

    const {
        service_type,
        service_date,
        next_service_date,
        mileage_at_service,
        cost,
        service_center,
        notes
    } = req.body;

    if (!service_type || !service_date) {
        return res.status(400).json({
            message: "Service type and service date are required"
        });
    }

    const sql = `
        UPDATE maintenance m
        INNER JOIN vehicles v
            ON m.vehicle_id = v.id
        SET
            m.service_type = ?,
            m.service_date = ?,
            m.next_service_date = ?,
            m.mileage_at_service = ?,
            m.cost = ?,
            m.service_center = ?,
            m.notes = ?
        WHERE
            m.id = ?
            AND v.user_id = ?
    `;

    const values = [
        service_type,
        service_date,
        next_service_date || null,
        mileage_at_service || null,
        cost || null,
        service_center || null,
        notes || null,
        maintenanceId,
        userId
    ];

    db.query(sql, values, (err, result) => {

        if (err) {
            console.log("Update Maintenance Error:", err);

            return res.status(500).json({
                message: "Failed to update maintenance record",
                error: err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Maintenance record not found or access denied"
            });
        }

        return res.status(200).json({
            message: "Maintenance record updated successfully"
        });
    });
};


// ==========================================
// DELETE MAINTENANCE
// ==========================================
exports.deleteMaintenance = (req, res) => {

    const userId = req.user.id;
    const maintenanceId = req.params.id;

    const sql = `
        DELETE m
        FROM maintenance m
        INNER JOIN vehicles v
            ON m.vehicle_id = v.id
        WHERE
            m.id = ?
            AND v.user_id = ?
    `;

    db.query(
        sql,
        [maintenanceId, userId],
        (err, result) => {

            if (err) {
                console.log("Delete Maintenance Error:", err);

                return res.status(500).json({
                    message: "Failed to delete maintenance record",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Maintenance record not found or access denied"
                });
            }

            return res.status(200).json({
                message: "Maintenance record deleted successfully"
            });
        }
    );
};