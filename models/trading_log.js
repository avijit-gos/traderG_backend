const mongoose = require("mongoose");
const tradingLogSchema = new mongoose.Schema({
    // uniqueId:{
    //     type:String
    // },
    exchange:{
        type:String
    },
    scrip_code:{
        type:String
    },
    // user_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "users",
    // },
    // acc_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "accountCreationRequests",
    // },
    user:{
        type:String
    },
    client_id:{
        type:String
    },
    client_name:{
        type:String
    },
    instrument:{
        type:String
    },
    instrument_name:{
        type:String
    },
    symbol:{
        type:String
    },
    exp_date:{
        type:Date
    },
    strike_price:{
        type:Number
    },
    option_type:{
        type:String
    },
    scrip_name:{
        type:String
    },
    buy_qty:{
        type:Number
    },
    buy_lot:{
        type:Number
    },
    buy_weight:{
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
    sell_weight:{
        type:Number
    },
    sell_val:{
        type:Number
    },
    sell_avg:{
        type:Number
    },
    net_qty:{
        type:Number
    },
    net_lot:{
        type:Number
    },
    net_weight:{
        type:Number
    },
    net_val:{
        type:Number
    },
    net_price:{
        type:Number
    },
    market_price:{
        type:Number
    },
    mtmv_pos:{
        type:Number
    },
    mtm_g_l:{
        type:Number
    },
    product_type:{
        type:String
    },
    group:{
        type:String
    },
    dpr_range:{
        type:String
    },
    maturity_date:{
        type:String
    },
    yield:{
        type:String

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
    total_weight:{
        type:Number
    },
    brokerage:{
        type:String
    },
    net_mtm:{
        type:Number
    },
    net_value:{
        type:Number
    },
    option_flag:{
        type:String
    },
    var:{
        type:Number
    },
    var_amt:{
        type:Number
    },
    sm_category:{
        type:String
    },
    category:{
        type:String,
        //  enum: {
        //     values: ["normal", "global"],
        //     message: '{VALUE} is not a correct, expected normal, global'
        // }
    },
    expense:{
        type:String
    },
    expense_excercise:{
        type:String
    },
    cf_avg_price:{
        type:Number
    },
    actual_mtm:{
        type:Number
    },
    unsettled:{
        type:Number
    },
    quantity:{
        type:Number
    }

 }, {timestamps: true})


const TradingLog = new mongoose.model("tradingLogs",tradingLogSchema);

module.exports = TradingLog;

 
 