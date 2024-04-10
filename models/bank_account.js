const mongoose = require("mongoose");

const bankAccountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    bank_acc_no:{
        type:String
    },
    bank_name:{
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
    // bank_acc:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "banks",
    // },
    upi_id:{
        type:String
    }

},{timestamps:true})

const BankAccount = new mongoose.model("bankAccount",bankAccountSchema);

module.exports = BankAccount;

