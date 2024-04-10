const mongoose = require("mongoose");

const kycSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    user_image:{
        type:String
    },
    pan_no:{
        type:String,
       unique: true,
    },
    pan_image:{
        type:String
    },
    adhaar_no:{
        type:String
    },
    adhaar_image:{
        type:String
    },
    // pan_Id:{
    //     type:String,
    //     unique: true,
    // },
    status:{
        type:Boolean,
        default:true
    },
    isVerified:{
        type:Boolean,
        default:false
    }

}, {timestamps: true})


// kycSchema.index({ pan_no: 1 }, { unique: true });

const Kyc = new mongoose.model("kyc",kycSchema);

module.exports = Kyc;