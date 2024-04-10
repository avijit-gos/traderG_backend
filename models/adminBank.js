const mongoose = require("mongoose");

const adminBankSchema = new mongoose.Schema({
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "admins",
       // required: [true, "User is required"]
    },
    acc_type:{
        type:String
    },
    company_name:{
        type:String
    },
    bank_acc_no:{
        type:String
    },
    bank_name:{
        type:String
    },
    branch_name:{
        type:String
    },
    bank_acc_type:{
        type:String
    },
    ifsc_code:{
        type:String
    },
    address:{
        type:String
    },
    mobile_no:{
        type:String
    },
    bank_acc:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "banks",
    }

},{timestamps:true})

const AdminBank = new mongoose.model("adminBanks",adminBankSchema);

module.exports = AdminBank;



