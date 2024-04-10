const mongoose = require("mongoose");

const withdrawalSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    // holding_id:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"holdings",
    // },
//     product_detail_id:{
//         type: mongoose.Schema.Types.ObjectId,
//         refPath: "product_detail_ref"
//    },
//    product_detail_ref:{
//         type: String,
//         enum: {
//             values: ["holdings", "preShare"]
//         }
//     },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        //required: [true, "Product is required"]
    },
    acc_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountCreationRequests",
        required: [true, "Product is required"]
    },
    amount:{
        type:Number
    },
    comment:{
        type:String
    },
    transaction_id:{
        type:String
    },
    transaction_detail:{
        type:String
    },
    bank_account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "bankAccount",
    },
    payment_method:{
        type:String
    },
    status:{
        type:Boolean,
        default:false
    },
    bank:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "banks",
    }
},{timestamps:true})

const Withdrawal = new mongoose.model("withdrawals",withdrawalSchema);

module.exports = Withdrawal;
