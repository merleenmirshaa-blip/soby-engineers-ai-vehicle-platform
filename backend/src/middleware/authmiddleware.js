const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {

    console.log("=================================");
    console.log("AUTHORIZATION HEADER:");
    console.log(req.headers.authorization);
    console.log("=================================");

    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            message: "Access Denied. No token provided."
        });
    }

    // Accept Bearer token
    const parts = authHeader.trim().split(/\s+/);

    console.log("AUTH PARTS:", parts);

    if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
        return res.status(401).json({
            message: "Invalid authorization format.",
            received: authHeader
        });
    }

    const token = parts[1];

    console.log("TOKEN RECEIVED:", token);

    try {

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        console.log("DECODED TOKEN:", decoded);

        req.user = decoded;

        next();

    } catch (error) {

        console.log("JWT ERROR:", error.message);

        return res.status(401).json({
            message: "Invalid or Expired Token",
            error: error.message
        });
    }
};

module.exports = verifyToken;