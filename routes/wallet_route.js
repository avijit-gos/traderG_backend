require("dotenv").config();
const express = require("express");
const Wallet = require("../models/wallet");
const WalletRoute = express.Router();
const AccountCreationRequest = require("../models/account_creation_request");
const Product = require("../models/product");
const isAuthenticate = require("../middleware/authcheck");
const InvestmentAccount = require("../models/newInvestment_account");

/**
 * This method is used for create Wallet
 */

 WalletRoute.post("/create",async(req,res)=>{
   try{
    const WalletData = new Wallet(req.body);
    const result = await WalletData.save();
    message = {
        error:false,
        message:"Wallet data added successfully",
        data:result
    };
        return res.status(200).send(message);
   }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err
        };
        return res.status(200).send(message);
   }
 });


 /**
 * This method is used for list of HoldingWallet
 */

  WalletRoute.get("/list",async(req,res)=>{
    try{
        let WalletData = await Wallet.find({}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ]);

        message = {
            error:false,
            message:"list of all Wallet",
            data:WalletData
        };
        res.status(200).send(message)
    }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err
        };
        res.status(200).send(message)
    }
});

 /**
 * This method is used for list of wallet ....list by userId and accountId
 */

  WalletRoute.get("/list-by-id/:userId/:accountid",isAuthenticate,async(req,res)=>{
    try{
        let WalletData = await Wallet.find({$and:[{user:req.params.userId},{acc_id:req.params.accountid}]}).populate([
            {
                path:"user",
                select:"fname lname"
            },
            {
                path:"product",
                select:"title"
            },
            {
                path:"acc_id",
                select:""
            }
        ]);

        message = {
            error:false,
            message:"list of  Wallet",
            data:WalletData
        };
        res.status(200).send(message)
    }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err
        };
        res.status(200).send(message)
    }
});

/**
 * This method is used for list of Wallet by userId
 */

 WalletRoute.get("/list-by-userId/:userId",isAuthenticate,async(req,res)=>{
    try{
        let WalletData = await Wallet.find({$and:[{user:req.params.userId},/*{status:true}*/]}).populate([
            {
                path:"user",
                select:"fname lname"
            },
            {
                path:"product",
                select:"title"
            },
            {
                path:"acc_id",
                select:"wallet_id dp_id capital"
            }
        ])/*.select("user product acc_id status")*/.sort({_id:-1});

        message = {
            error:false,
            message:"list of  Wallet",
            data:WalletData
        };
        res.status(200).send(message)
    }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err
        };
        res.status(200).send(message)
    }
});

/**
 * This method is to find block/unblock HoldingWallet
 */

 WalletRoute.get("/toggle-status",async(req,res)=>{
    try{
        let WalletData = await Wallet.find({status:true}).sort({_id:-1});

        message = {
            error: false,
            message:"list of Wallet",
            data:WalletData
        }
        return res.status(200).send(message);

    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err
        }
        return res.status(200).send(message);
    }
});

/**
 * This method is to upadte HoldingWallet
 * @param str holdingwalletId
 */

 WalletRoute.patch("/update/:walletId",isAuthenticate,async(req,res)=>{
    try{
        let result = await Wallet.findOneAndUpdate({_id:req.params.walletId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"Wallet updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Wallet not upadated"
            };
            return res.status(200).send(message);
        }
    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err
        }
        return res.status(200).send(message);
    }
});


/**
 * This method is to delete Holding 
 * @param str holdingwalletId
 */

 WalletRoute.delete("/delete/:walletId", async (req, res) => {
    try {
        const result = await Wallet.deleteOne({
            _id: req.params.walletId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Wallet deleted successfully!",
            };
            res.status(200).send(message);
        } else {
            message = {
                error: true,
                message: "Operation failed!",
            };
            res.status(200).send(message);
        }
    } catch (err) {
        message = {
            error: true,
            message: "Operation Failed!",
            data: err,
        };
        res.status(200).send(message);
    }
});



////////////////////////// new api ////////////////////////////

// WalletRoute.patch("/detail/:accId",async(req,res)=>{
//     try{
//        let result = await AccountCreationRequest.findOne({_id:req.params.accId});
//        let walletData = await Wallet.findOne({acc_id:req.params.accId});
//        let walletId = walletData?._id;
//        console.log("walletId>>>",walletId);
//        let resultData
//        if(result.is_kyc_completed == true && result.is_payment_made == true && result.is_aggrement_signed == true){
//         let pid = result?.product;
//         const productData = await Product.findOne({_id:pid});
//         const productTitle = productData?.title
//         console.log("productTitle>>>>>>>",productTitle);
//         console.log("totalRetun>>>>>>>",result?.holding_details.total_return);
//        // let resultData
//         if(productTitle == "holding"){
//             resultData = await Wallet.findOneAndUpdate({_id:walletId},{
//                 '$inc': { 'total_amount': result?.holding_details.total_return }, 
//                 '$push': {
//                         passbook_amt:{ 
//                             amount:result?.holding_details.total_return , 
//                             type: "credit",
//                             transaction_id:req.body.transaction_id,
//                             transaction_detail:req.body.transaction_detail
//                         }
//                     },
//                     // transaction_id:req.body.transaction_id,
//                     // transaction_detail:req.body.transaction_detail

//                 },{new:true});

//         }
//         else if(productTitle == "pre-share"){
//             resultData = await Wallet.findOneAndUpdate({id:walletId},{
//                 '$inc': { 'total_amount': result?.pre_share_details.monthly_dividend_amount }, 
//                 '$push': {
//                         passbook_amt:{ 
//                             amount:result?.pre_share_details.monthly_dividend_amount , 
//                             type: "credit",
//                             transaction_id:req.body.transaction_id,
//                             transaction_detail:req.body.transaction_detail
//                         }
//                     },
//                     // transaction_id:req.body.transaction_id,
//                     // transaction_detail:req.body.transaction_detail
//                 },{new:true});
//         }
        
//        }
//         message = {
//             error:false,
//             message:"wallet data",
//             data:resultData
//         };
//         res.status(200).send(message);
//     }catch(err){
//         message = {
//             error:true,
//             message:"Operation Failed",
//             data:err.toString()
//     };
//         res.status(200).send(message)
// }
// });


/////////////////////////////////// test update ////////////////////////////////////


WalletRoute.patch("/detail/:accId",async(req,res)=>{
    try{
       let result = await AccountCreationRequest.findOne({_id:req.params.accId});
    //    console.log("result",)
       let walletData = await Wallet.findOne({acc_id:req.params.accId});
       let walletId = walletData?._id;
       console.log("walletId>>>",walletId);
       let resultData;
       let accountUpdate;
       let amountData = req.body.amount;
       let creditDate = req.body.date;
      // let totalReturn = esult?.holding_details.total_return
       if(result.is_kyc_completed == true && result.is_payment_made == true && result.is_aggrement_signed == true){
        let pid = result?.product;
        const productData = await Product.findOne({_id:pid});
        const productTitle = productData?.title
        console.log("productTitle>>>>>>>",productTitle);
        console.log("totalRetun>>>>>>>",result?.holding_details.total_return);

       // let resultData
        if(productTitle == "holding"){
            let totalReturn = result?.holding_details.total_return + amountData;
            resultData = await Wallet.findOneAndUpdate({_id:walletId},{
                '$inc': { 'total_amount': amountData }, 
                '$push': {
                        passbook_amt:{ 
                            amount:amountData , 
                            type: "credit",
                            date:creditDate,
                            transaction_id:req.body.transaction_id,
                            transaction_detail:req.body.transaction_detail
                        }
                    },

                },{new:true});

            accountUpdate = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accId},{"holding_details.total_return":totalReturn},{new:true})

        }
        else if(productTitle == "pre-share"){
            let monthlyDevidend = result?.pre_share_details.monthly_dividend_amount + amountData;
            resultData = await Wallet.findOneAndUpdate({_id:walletId},{
                '$inc': { 'total_amount': amountData }, 
                '$push': {
                        passbook_amt:{ 
                            amount:amountData , 
                            type: "credit",
                            transaction_id:req.body.transaction_id,
                            transaction_detail:req.body.transaction_detail
                        }
                    },
                },{new:true});

                // console.log({resultData})

                accountUpdate = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accId},{"pre_share_details.monthly_dividend_amount":monthlyDevidend},{new:true})
        }
        
       }
        message = {
            error:false,
            message:"wallet data",
            data:resultData
        };
        res.status(200).send(message);
    }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err.toString()
    };
        res.status(200).send(message)
}
});

/////////////////////////////////// new inv acc update ////////////////////////////////////

WalletRoute.patch("/detail-new-invacc/:accId",async(req,res)=>{
    try{
       let result = await InvestmentAccount.findOne({_id:req.params.accId});
       console.log("result",)
       let walletData = await Wallet.findOne({acc_id:req.params.accId});
       let walletId = walletData?._id;
       console.log("walletId>>>",walletId);
       let resultData;
       let accountUpdate;
       let amountData = req.body.amount;
       let creditDate = req.body.date;
    //    let walletIDs = result?.wallet_id;
      // let totalReturn = esult?.holding_details.total_return
       if(result?.is_newInv_approved == true){
        let pid = result?.product;
        const productData = await Product.findOne({_id:pid});
        const productTitle = productData?.title
        console.log("productTitle>>>>>>>",productTitle);
        console.log("totalRetun>>>>>>>",result?.holding_details.total_return);

       // let resultData
        if(productTitle == "holding"){
            let totalReturn = result?.holding_details.total_return + amountData;
            resultData = await Wallet.findOneAndUpdate({_id:walletId},{
                '$inc': { 'total_amount': amountData }, 
                '$push': {
                        passbook_amt:{ 
                            amount:amountData , 
                            type: "credit",
                            date:creditDate,
                            transaction_id:req.body.transaction_id,
                            transaction_detail:req.body.transaction_detail
                        }
                    },

                },{new:true});

            accountUpdate = await InvestmentAccount.findOneAndUpdate({_id:req.params.accId},{"holding_details.total_return":totalReturn},{new:true})

        }
        else if(productTitle == "pre-share"){
            let monthlyDevidend = result?.pre_share_details.monthly_dividend_amount + amountData;
            resultData = await Wallet.findOneAndUpdate({_id:walletId},{
                '$inc': { 'total_amount': amountData }, 
                '$push': {
                        passbook_amt:{ 
                            amount:amountData , 
                            type: "credit",
                            transaction_id:req.body.transaction_id,
                            transaction_detail:req.body.transaction_detail
                        }
                    },
                },{new:true});

                // console.log({resultData})

                accountUpdate = await InvestmentAccount.findOneAndUpdate({_id:req.params.accId},{"pre_share_details.monthly_dividend_amount":monthlyDevidend},{new:true})
        }
        
       }
        message = {
            error:false,
            message:"wallet data",
            data:resultData
        };
        res.status(200).send(message);
    }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err.toString()
    };
        res.status(200).send(message)
}
});


///////////////////////////////////////////// wallet list for main account (admin) //////////////////////

WalletRoute.get("/wallet-list",async(req,res)=>{
    try{
        let WalletData = await Wallet.find({$and:[{product:req.query.product},{acc_type:"accountCreationRequests"}]}).populate([
            {
                path:"user",
                select:"fname lname"
            },
            {
                path:"product",
                select:"title"
            },
            {
                path:"acc_id",
                select:""
            }
        ]).sort({_id:-1});

        message = {
            error:false,
            message:"list of  Wallet",
            data:WalletData
        };
        res.status(200).send(message)
    }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err
        };
        res.status(200).send(message)
    }
});


///////////////////////////////////////////// wallet list for  acctopup ount (admin) ////////////////////////////////////

WalletRoute.get("/topup-wallet-list",async(req,res)=>{
    try{
        let WalletData = await Wallet.find({$and:[{product:req.query.product},{acc_type:"investmentAccounts"}]}).populate([
            {
                path:"user",
                select:"fname lname"
            },
            {
                path:"product",
                select:"title"
            },
            {
                path:"acc_id",
                select:""
            }
        ]).sort({_id:-1});

        message = {
            error:false,
            message:"list of  Wallet",
            data:WalletData
        };
        res.status(200).send(message)
    }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err
        };
        res.status(200).send(message)
    }
});




 module.exports = WalletRoute;
