const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// =======================
// Register API
// =======================
exports.register = (req, res) => {
    console.log("✅ Register API called");
    console.log(req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const checkUser =
        "SELECT * FROM users WHERE email = ?";

    db.query(
        checkUser,
        [email],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err
                });
            }

            if (result.length > 0) {
                return res.status(400).json({
                    message: "Email already exists"
                });
            }

            bcrypt.hash(
                password,
                10,
                (err, hash) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    const sql =
                        "INSERT INTO users(name,email,password) VALUES(?,?,?)";

                    db.query(
                        sql,
                        [name, email, hash],
                        (err, result) => {

                            if (err) {
                                return res.status(500).json({
                                    message:
                                        "User registration failed",
                                    error: err
                                });
                            }

                            return res.status(201).json({
                                message:
                                    "User registered successfully",
                                userId: result.insertId
                            });

                        }
                    );
                }
            );
        }
    );
};


// =======================
// Login API
// =======================
exports.login = (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message:
                "Email and Password are required"
        });
    }

    const sql =
        "SELECT * FROM users WHERE email = ?";

    db.query(
        sql,
        [email],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            const user = result[0];

            bcrypt.compare(
                password,
                user.password,
                (err, isMatch) => {

                    if (err) {
                        return res.status(500).json(err);
                    }

                    if (!isMatch) {
                        return res.status(401).json({
                            message:
                                "Invalid Password"
                        });
                    }

                    const token = jwt.sign(
                        {
                            id: user.id,
                            email: user.email
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "1d"
                        }
                    );

                    return res.status(200).json({
                        message:
                            "Login Successful",
                        token,
                        user: {
                            id: user.id,
                            name: user.name,
                            email: user.email
                        }
                    });

                }
            );
        }
    );
};


// =======================
// Forgot Password API
// =======================
exports.forgotPassword = (req, res) => {

    console.log("✅ Forgot Password API called");
    console.log(req.body);

    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            message: "Email is required"
        });
    }

    const sql =
        "SELECT id, name, email FROM users WHERE email = ?";

    db.query(
        sql,
        [email],
        (err, result) => {

            if (err) {
                console.error(
                    "Forgot Password DB Error:",
                    err
                );

                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message:
                        "No account found with this email"
                });
            }

            return res.status(200).json({
                message:
                    "Email verified. You can now reset your password.",
                email: result[0].email
            });

        }
    );
};


// =======================
// Reset Password API
// =======================
exports.resetPassword = (req, res) => {

    console.log("✅ Reset Password API called");
    console.log(req.body);

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message:
                "Email and Password are required"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            message:
                "Password must be at least 6 characters"
        });
    }

    const checkUser =
        "SELECT id FROM users WHERE email = ?";

    db.query(
        checkUser,
        [email],
        (err, result) => {

            if (err) {
                console.error(
                    "Reset Password DB Error:",
                    err
                );

                return res.status(500).json({
                    message: "Database Error"
                });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            bcrypt.hash(
                password,
                10,
                (err, hash) => {

                    if (err) {
                        console.error(
                            "Password Hash Error:",
                            err
                        );

                        return res.status(500).json({
                            message:
                                "Password encryption failed"
                        });
                    }

                    const updateSQL =
                        "UPDATE users SET password = ? WHERE email = ?";

                    db.query(
                        updateSQL,
                        [hash, email],
                        (err) => {

                            if (err) {
                                console.error(
                                    "Password Update Error:",
                                    err
                                );

                                return res.status(500).json({
                                    message:
                                        "Password update failed"
                                });
                            }

                            console.log(
                                "✅ Password updated successfully"
                            );

                            return res.status(200).json({
                                message:
                                    "Password updated successfully"
                            });

                        }
                    );

                }
            );

        }
    );
};