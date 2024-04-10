const mongoose = require("mongoose");
const capitalLogSchema = new mongoose.Schema({
    client_id:{
        type:String
    },
    client_name:{
        type:String
    },
    bse:{
        type:Number
    },
    nse:{
        type:Number
    },
    f_o:{
        type:Number
    },
    mcxc:{
        type:Number
    },
    nsec:{
        type:Number
    },
    net:{
        type:Number
    }

}, {timestamps: true})


const CapitalLog = new mongoose.model("capitalLogs",capitalLogSchema);

module.exports = CapitalLog;

 