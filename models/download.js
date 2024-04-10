const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema({
    file:{
        type:String
    },
    name:{
        type:String
    },
    status:{
        type:Boolean,
        default:true
    }
},{timestamps: true})

const Download = new mongoose.model("downloads",downloadSchema);

module.exports = Download;