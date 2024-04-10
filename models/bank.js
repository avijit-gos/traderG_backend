const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema({
    name:{
        type: String
    },
    status:{
        type:Boolean,
        default:true
    }

}, {timestamps: true})

const Bank = new mongoose.model("banks",bankSchema);

module.exports = Bank;