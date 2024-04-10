const mongoose = require("mongoose");
const BrokeragedummySchema = new mongoose.Schema({
    client_id:{
        type:String
    },
    turnover:{
        type:Number
    },
    brokerage:{
        type:Number
    },
    stt:{
        type:Number
    },
    transaction_charges:{
        type:Number
    },
    gst:{
        type:Number
    },
    sebi_charges:{
        type:Number
    },
    stamp_charges:{
        type:Number
    },
    ipft:{
        type:Number
    },
    total_brokerage:{
        type:Number
    }

}, {timestamps: true})


const BrokerageDummyLog = new mongoose.model("brokeragedummyLogs",BrokeragedummySchema);

module.exports = BrokerageDummyLog;
