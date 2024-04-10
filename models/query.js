const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: [true, "User is required"]
    },
    subject:{
        type:String,
        required: [true, "Subject is required"]
    },
    message:{
        type:String
    }
}, {timestamps: true});


const Query = new mongoose.model("queries", querySchema);

module.exports = Query;