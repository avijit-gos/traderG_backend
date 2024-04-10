const mongoose = require("mongoose");

const accountCreationRequestSchema = new mongoose.Schema({
   user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User is required"]
   },
   product:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: [true, "Product is required"]
   },
//    product_detail_id:{
//         type: mongoose.Schema.Types.ObjectId,
//         refPath: "product_detail_ref"
//    },
//    product_detail_ref:{
//         type: String,
//         enum: {
//             values: ["holdings", "preShare","trading"]
//         }
//    },
   per_capital:{
        type:Number
   },
    capital:{
        type:Number
    },
    old_capital:{
        type:Number
    },
    tenure:{
        type:Number
    },
    old_tenure:{
        type:Number
    },
    old_tenure_type:{
        type:String,
        enum:{
            values:["days","months","years"],
            message:"{VALUE} is not a correct value.Expect days,months,years"
        }
    },
    type:{
        type:String,
        enum:{
            values:["days","months","years"],
            message:"{VALUE} is not a correct value.Expect days,months,years"
        }
    },
    client_id:{
        type:String
    },
    wallet_id:{
        type:String
    },
    dp_id:{
        type:String
    },
    application_id:{
        type:String
    },
    consultant_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "consultants",
    },
    // no_of_shares:{
    //     type:Number
    // },
    // fname:{
    //     type:String,
    //     //required: [true, "fname is required"]
    // },
    // lname:{
    //     type:String,
    //     //required: [true, "lname is required"]
    // },
    // email:{
    //     type:String,
    //     //required: [true, "Email is required"]
    // },
    // phone_no:{
    //     type: String,
    //     //required: [true, "Mobile no. is required"],
    //     type: String,
    //     validate(value) {
    //         if(value.length !== 10) {
    //             throw new Error("mobile no should be a 10 digit number")
    //         }
    //     }
    // },
    // address:{
    //     type:String,
    //     minlength: [2, "address minimum contains 2 letters"],
    // },
    // state:{
    //     type:String,
    //     minlength: [2, "state minimum contains 2 letters"],
    // },
    // city:{
    //     type:String,
    //     minlength: [2, "city minimum contains 2 letters"],
    // },
    // pin:{
    //     type:String,
    //     minlength: [6, "Pin minimum contains 6 characters"],
    // },
    // date_of_birth:{
    //     type:Date,
    // },
    // gender:{
    //     type:String,
    //     enum:{
    //         values:["male","female","transgender"],
    //         message:"{VALUE} is not a correct value.Expect male,female,transgender"
    //     }
    // },
    // occupation:{
    //     type:String
    // },
    // user_image:{
    //     type:String
    // },
    // pan_no:{
    //     type:String
    // },
    // pan_image:{
    //     type:String
    // },
    // adhaar_no:{
    //     type:String
    // },
    // adhaar_image:{
    //     type:String
    // },
    is_kyc_completed:{
        type:Boolean,
        default:false
    },
    kyc_reason:{
        type:String
    },
    payment_reason:{
        type:"String"
    },
    account_reason:{
        type:"String"
    },
    aggrement_reason:{
        type:"String"
    },
    is_payment_made:{
        type:Boolean,
        default:false
    },
    is_account_opened:{
        type:Boolean,
        default:false
    },
    is_aggrement_signed:{
        type:Boolean,
        default:false
    },
    user_kyc_completed:{
        type:Boolean,
        default:false
    },
    user_aggrement_completed:{
        type:Boolean,
        default:false
    },
    user_payment_completed:{
        type:Boolean,
        default:false
    },
    // payment_method:{
    //     type:String
    // },
    request_no:{
        type:String
    },
    request_creation_date:{
        type:Date
    },
    kyc_compleation_date:{
        type:Date
    },
    payment_date:{
        type:Date
    },
    transaction_id:{
        type:String
    },
    account_opening_date:{
        type:Date
    },
    aggrement_date:{
        type:Date
    },
    agreement_file:{
        type:String
    },
    user_signed_file:{
        type:String
    },
    aggrement_text:{
        type:String
    },
    re_inv_date:{
        type:Date
    },
    is_newInv_approved:{
        type:Boolean,
        //default:false
    },
    // user_payment_file:{
    //     type:String
    // },
    arihant_open_account:{
        type:Boolean,
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
        },
        pre_turnover:{
            type:Number
        },
        pre_brokerage:{
            type:Number
        },
        pre_mtm:{
            type:Number
        },
        trading_payment_file:{
            type:String
        },
        trading_payment_detail:{
            type:String
        },
       },
    holding_details:{
        holding_month:{
            type:Number
        },
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
        start_date:{
            type:Date
        },
        maturity_date:{
            type:Date
        },
        return_slab:{
            type:Number
        },
        monthly_dividend_date:{
            type:Date
        },
        holding_payment_file:{
            type:String
        },
        holding_payment_detail:{
            type:String
        },
        re_inv_amount:{
            type:Number
        },
        old_holding_month:{
            type: Number
        },
        old_return_slab:{
            type:Number
        },
        old_maturity_date:{
            type:Date
        },
        old_monthly_return:{
            type:Number
        },
        old_total_return:{
            type:Number
        },
        pre_monthly_return_amount:{
            type:Number
        },
        pre_total_return:{
            type:Number
        },
        pre_maturity_date:{
            type:Date
        },
        pre_return_slab:{
            type:Number
        }
    },
    pre_share_details:{
        share:{
            type:Number
        },
        holding_month:{
            type:Number
        },
        monthly_return_rate:{
            type:Number
        },
        fixed_dividend_amount:{
            type:Number
        },
        monthly_dividend_amount:{
            type:Number
        },
        start_date:{
            type:Date
        },
        maturity_date:{
            type:Date
        },
        re_inv_amount:{
            type:Number
        },
        old_share:{
            type:Number
        },
        old_fixed_dividend_amount:{
            type:Number
        },
        old_monthly_dividend_amount:{
            type:Number
        },
        pre_share_payment_file:{
            type:String
        },
        pre_share_payment_detail:{
            type:String
        },
        exsisting_share:{
            type:Number
        },
        pre_fixed_dividend_amount:{
            type:Number
        },
        pre_monthly_dividend_amount:{
            type:Number
        },
    },
    kyc_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "kyc",
    },
    is_inv_req_exist:{
        type:Boolean
    },
   status: {
    type: Boolean,
    default: false
}
}, {timestamps: true})


// accountCreationRequestSchema.pre("save",async function(next){
//     try{
//         this.transaction_id = 'TRANS' + Date.now();
//         next();
//     }catch(error){
//         return next(error);
//     }
// });




accountCreationRequestSchema.pre("save", async function (next) {
  try {
    const user = await mongoose.model("users").findById(this.user).exec();

    if (!user || !user.date_of_birth) {
      return next(new Error("User not found or Date of birth is required."));
    }

    const birthDate = user.date_of_birth;
    const currentDate = new Date();
    const ageDiff = currentDate - birthDate;
    const ageDate = new Date(ageDiff); 
    const userAge = Math.abs(ageDate.getUTCFullYear() - 1970); 

    const minimumAgeRequired = 18; 

    if (userAge < minimumAgeRequired) {
      return next(new Error("User must be at least 18 years old to create an account."));
    }

    this.transaction_id = 'TRANS' + Date.now();
    next();
  } catch (error) {
    return next(error);
  }
});



const AccountCreationRequest = new mongoose.model("accountCreationRequests",accountCreationRequestSchema);

module.exports = AccountCreationRequest;


