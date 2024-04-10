const mongoose = require("mongoose");

const InvestmentAccountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: [true, "User is required"]
    },
    accountId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountCreationRequests",
        required: [true, "AccountId is required"]
    },
    product:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      //  required: [true, "Product is required"]
    },
    re_inv_amount:{
        type:Number
    },
    tenure:{
        type:Number
    },
    re_inv_date:{
        type:Date
    },
    type:{
        type:String,
        enum:{
            values:["days","months","years"],
            message:"{VALUE} is not a correct value.Expect days,months,years"
        }
    },
    consultant_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "consultants",
    },
    trading_details:{
        risk:{
            type:Number
        },
        reward:{
            type:Number
        },
        turnover:{
            type:Number
        },
        brokerage:{
            type:Number
        },
        mtm:{
            type:Number
        },
        capital:{
            type:Number
        },
        new_trade_amt:{
            type:Number
        },
        old_turnover:{
            type:Number
        },
        old_brokerage:{
            type:Number
        },
        old_mtm:{
            type:Number
        },
        segment:{
            type:String
        },
        trading_type:{
            type:String
        },
        consulting_fees:{
            type:String
        },
        transaction_file:{
            type:String
        }
       },
    holding_details:{
        monthly_return_rate:{
            type:Number
        },
        monthly_return_amount:{
            type:Number
        },
        total_return:{
            type:Number
        },
        maturity_amount:{
            type:Number
        },
        maturity_date:{
            type:Date
        },
        return_slab:{
            type:Number
        },
        holding_payment_file:{
            type:String
        },
        holding_payment_detail:{
            type:String
        },
    },
    pre_share_details:{
        monthly_return_rate:{
            type:Number
        },
        fixed_dividend_amount:{
            type:Number
        },
        monthly_dividend_amount:{
            type:Number
        },
        share:{
            type:Number
        },
        pre_share_payment_file:{
            type:String
        },
        pre_share_payment_detail:{
            type:String
        },

    },
    user_payment_completed:{
        type:Boolean,
        default:false
    },
    is_payment_completed:{
        type:Boolean,
        default:false
    },
    user_aggrement_completed:{
        type:Boolean,
        default:false
    },
    is_aggrement_completed:{
        type:Boolean,
        default:false
    },
    agreement_file:{
        type:String
    },
    user_signed_file:{
        type:String
    },
    is_account_opened:{
        type:Boolean,
        default:false
    },
    wallet_id:{
        type:String
    },
    is_newInv_approved:{
        type:Boolean,
        default:false
    },

}, {timestamps: true})



const InvestmentAccount = new mongoose.model("investmentAccounts",InvestmentAccountSchema);

module.exports = InvestmentAccount;