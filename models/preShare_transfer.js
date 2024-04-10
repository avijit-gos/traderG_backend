const mongoose = require("mongoose");

const preShareTransferSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    acc_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountCreationRequests",
        //required: [true, "Product is required"]
    },
    demt_accNo:{
        type:String
    },
    dp_slip_no:{
        type:String
    },
    no_of_share:{
        type:Number
    },
    client_name:{
        type:String                      /// share client name
    },
    client_dp_id:{   
        type:String                         /// share client Id
    },
    current_share_value:{
        type:Number
    },
    dp_slip_file:{
        type:String
    },
    client_broker_name:{
        type:String
    },
    is_dp_file_upload:{
        type:Boolean,
        default:false
    }
    
},{timestamps:true})

const PreShareTransfer = new mongoose.model("preShareTransfer",preShareTransferSchema);

module.exports = PreShareTransfer;
