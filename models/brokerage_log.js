const mongoose = require("mongoose");
const BrokerageLogSchema = new mongoose.Schema({
    client_id:{
        type:String
    },
    client_name:{
        type:String
    },
    branche_code:{
        type:String
    },
    branche_name:{
        type:String
    },
    turn_over:{
        type:Number
    },
    brok:{
        type:Number
    },
    perc:{
        type:Number
    },
    comm:{
        type:Number
    },
    net_recd:{
        type:Number
    },
    cuml_tv_brok:{
        type:Number
    }

}, {timestamps: true})


const BrokerageLog = new mongoose.model("brokerageLogs",BrokerageLogSchema);

module.exports = BrokerageLog;

 