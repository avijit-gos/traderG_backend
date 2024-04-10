const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
       // required: [true, "User is required"]
    },
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
    // acc_id:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "accountCreationRequests",
    //   //  required: [true, "AccId is required"]
    // },
   passbook_amt:[{
        type:{
        type:String,
        enum:{
            values:["credit","debit"],
            message:'please select between -credit/debit'
        }
    },
        amount:{
        type:Number
    },
    comment:{
        type:String
     },
    date:{
        type:Date
    },
    transaction_id:{
        type:String
    },
    transaction_detail:{
        type:String
    },

   }],
    total_amount:{
        type:Number,
        default:0
    },
    transaction_id:{
        type:String
    },
    transaction_detail:{
        type:String
    },
    acc_id:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"acc_type"
    },
    acc_type:{
        type:String,
        enum:{
            values:["accountCreationRequests","investmentAccounts"]
        }
   },
   wallet_id:{
    type:String
}

    // status:{
    //     type:Boolean,
    //     default:false
    // }

},{timestamps:true})

const Wallet = new mongoose.model("wallets",walletSchema);

module.exports = Wallet;