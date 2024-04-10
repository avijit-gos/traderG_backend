const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
    content:{
        type:String,
        required: [true, "Content is required"]
    },
    file:{
        type:String
    }

}, {timestamps: true})

const Asset = new mongoose.model("assets",assetSchema);

module.exports = Asset;