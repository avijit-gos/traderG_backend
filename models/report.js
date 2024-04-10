const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: [true, "User is required"]
    },
    query:{
        type:String
    }
},{timestamps: true})

const Report = new mongoose.model("reports",reportSchema);

module.exports = Report;