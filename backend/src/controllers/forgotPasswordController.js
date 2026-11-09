const db = require("../config/db");
const bcrypt = require("bcryptjs");

// ===============================
// Check Email
// ===============================
exports.forgotPassword = (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required",
        });
    }

    const sql = "SELECT * FROM users WHERE email = ?";

    db.query(sql, [email], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error",
                error: err,
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                message: "No account found with this email.",
            });
        }

        return res.status(200).json({
            message: "Email verified successfully.",
        });

    });
};

// ===============================
// Reset Password
// ===============================
exports.resetPassword = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and Password are required",
        });
    }

    bcrypt.hash(password, 10, (err, hash) => {

        if (err) {
            return res.status(500).json({
                message: "Password hashing failed",
                error: err,
            });
        }

        const sql =
            "UPDATE users SET password = ? WHERE email = ?";

        db.query(sql, [hash, email], (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err,
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "User not found",
                });
            }

            return res.status(200).json({
                message: "Password updated successfully.",
            });

        });

    });

};