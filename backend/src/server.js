require("dotenv").config();

const app = require("./app");
require("./config/db");
const imagePredictionRoutes = require("./routes/imagePredictionRoutes");

const PORT = process.env.PORT || 5000;


app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});