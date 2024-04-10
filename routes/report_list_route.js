require("dotenv").config();
const express = require("express");
const AccountCreationRequest = require("../models/account_creation_request");
const User = require("../models/user");
const Withdrawal = require("../models/withdrawal");
const TradingLog = require("../models/trading_log");
const Kyc = require("../models/kyc");
const ReportListRoute = express.Router();


// date wise trading preshare holoding account create
ReportListRoute.post("/date-wise-account",async(req,res) =>{
    try{
     let dateWiseAccount = await AccountCreationRequest.find({createdAt:{ $gte: req.body.from, $lte: req.body.to }}).populate([
         {
            path:"product",
            select:"title"
         },
         {
            path:"user",
            select:"fname lname email mobile occupation"
        }
     ]).sort({_id:-1});

     let userIds = dateWiseAccount.map(e => e.user?._id.toString());

     console.log("userIds",userIds);

     let userKyc = await Kyc.find({user: {$in: userIds}}).populate([
         {
             path:"user",
             select:" "
         }
     ]);

     console.log("userKyc",userKyc);
    
    message = {
        error: false,
        message: "Report Data",
        data:{dateWiseAccount,userKyc}
    };
    res.status(200).send(message);
} catch(err) {
    message = {
        error: true,
        message: "operation failed!",
        data: err,
    };
    res.status(200).send(message);
}
});

// date wise User

ReportListRoute.post("/date-wise-user",async(req,res) =>{
    try{
     let dateWiseUser = await User.find({createdAt:{ $gte: req.body.from, $lte: req.body.to }}).sort({_id:-1});
    
    message = {
        error: false,
        message: "Report Data",
        data:dateWiseUser
    };
    res.status(200).send(message);
} catch(err) {
    message = {
        error: true,
        message: "operation failed!",
        data: err,
    };
    res.status(200).send(message);
}
});

// date wise Withdrawal

ReportListRoute.post("/date-wise-withdrawal",async(req,res) =>{
    try{
     let dateWiseWithdrawal = await Withdrawal.find({createdAt:{ $gte: req.body.from, $lte: req.body.to }}).populate([
        {
            path:"user",
            select:"fname lname email mobile"
        }
    ]).sort({_id:-1});
    
    message = {
        error: false,
        message: "Report Data",
        data:dateWiseWithdrawal
    };
    res.status(200).send(message);
} catch(err) {
    message = {
        error: true,
        message: "operation failed!",
        data: err,
    };
    res.status(200).send(message);
}
});


// date wise trading report

ReportListRoute.post("/date-wise-tradingreport",async(req,res)=>{
    try{
        let dateWiseTradingRepaort = await TradingLog.find({createdAt:{ $gte: req.body.from, $lte: req.body.to }});

        message = {
            error:false,
            message:"Trading Report data",
            data:dateWiseTradingRepaort
        },
        res.status(200).send(message);
    }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err
        },
        res.status(200).send(message);
    }
})



module.exports = ReportListRoute;