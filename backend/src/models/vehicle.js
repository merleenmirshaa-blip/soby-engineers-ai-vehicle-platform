const mongoose=require("mongoose");

const vehicleSchema=new mongoose.Schema({

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    vehicleName:String,

    model:String,

    registrationNumber:String,

    fuelType:String,

    purchaseDate:Date,

    mileage:Number

});

module.exports=mongoose.model("Vehicle",vehicleSchema);