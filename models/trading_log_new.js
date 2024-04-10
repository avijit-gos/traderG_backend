const mongoose = require("mongoose");
const tradingLogNewSchema = new mongoose.Schema({
    client_id:{
        type:String
    },
    client_name:{
        type:String
    },
    symbol:{
        type:String
    },
    exp_date:{
        type:Date
    },
    scrip_name:{
        type:String
    },
    buy_lot:{
        type:Number
    },
    buy_val:{
        type:Number
    },
    buy_avg:{
        type:Number
    },
    sell_qty:{
        type:Number
    },
    sell_lot:{
        type:Number
    },
    sell_val:{
        type:Number
    },
    sell_avg:{
        type:Number
    },
    mtm_g_l:{
        type:Number
    },
    total_value:{
        type:Number
    },
    total_qty:{
        type:Number
    },
    total_lot:{
        type:Number
    },
    brokerage:{
        type:Number
    },
    type:{
        type:String
    },
    turnover:{
        type:Number
    },
    status:{
        type:Boolean,
        default: true
    }

},{timestamps: true});

const TradingNewLog = new mongoose.model("tradingNewLogs",tradingLogNewSchema);

module.exports = TradingNewLog;