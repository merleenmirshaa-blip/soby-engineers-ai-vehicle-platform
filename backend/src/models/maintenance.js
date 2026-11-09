const mongoose = require("mongoose");

const maintenanceSchema = new mongoose.Schema({

    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle"
    },

    serviceDate: {
        type: Date,
        required: true
    },

    serviceType: {
        type: String,
        required: true
    },

    cost: {
        type: Number,
        required: true
    },

    notes: {
        type: String
    }

});

module.exports = mongoose.model("Maintenance", maintenanceSchema);