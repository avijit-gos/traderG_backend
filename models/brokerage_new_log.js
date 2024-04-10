const mongoose = require("mongoose");
const BrokerageNewLogSchema = new mongoose.Schema({
    trading_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tradingNewLogs",
    },
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


const BrokerageNewLog = new mongoose.model("brokerageNewLogs",BrokerageNewLogSchema);

module.exports = BrokerageNewLog;
