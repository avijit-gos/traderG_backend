const mongoose = require("mongoose");

const officDataSchema = new mongoose.Schema({
    doc_date:{
        type:Date
    },
    // doc_time:{
    //     type:String
    // },
    script:{
        type:String
    },
    capital:{
        type:Number
    },
    // strategy_id:{
    //     type:String
    // },
    // broker:{
    //     type:String
    // },
    // exchange:{
    //     type:String
    // },
    // instrument:{
    //     type:String
    // },
    // underlying:{
    //     type:String
    // },
    // quantity:{
    //     type:Number
    // },
    // price_type:{
    //     type:String
    // },
    entry_price:{
        type:Number
    },
    // amount_buy:{
    //     type:Number
    // },
    // amount_sell:{
    //     type:Number
    // },
    gain_loss:{
        type:Number
    },
    current_position:{
        type:String
    },
    position:{
        type:String
    },
    search_date:{
        type:String
    }

}, {timestamps: true})

const OfficeData = new mongoose.model("officDatas",officDataSchema);

module.exports = OfficeData;