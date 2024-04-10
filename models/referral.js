const mongoose = require("mongoose");

const referralSchema = new mongoose.Schema({
    referral_code:{
        type:String
    },
    refered_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: [true, "User is required"]
    },
    refered_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: [true, "User is required"]
    }

   
},{timestamps: true})

const Referral = new mongoose.model("referral",referralSchema);

module.exports = Referral;