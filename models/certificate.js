const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: [true, "User is required"]
    },
    // holding:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"holdings",
    // },
    // preshare:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"preShare",
    // },
    account_creation_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"accountCreationRequests",
    },
    name:{
        type:String
    },
    file:{
        type:String
    },
    file_type:{
        type:String,
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps: true})

const Certificate = new mongoose.model("certificates",certificateSchema);

module.exports = Certificate;