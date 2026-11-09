const mongoose=require("mongoose");

const predictionSchema=new mongoose.Schema({

    vehicle:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vehicle"
    },

    prediction:String,

    confidence:Number,

    createdAt:{
        type:Date,
        default:Date.now
    }

});

module.exports=mongoose.model("Prediction",predictionSchema);