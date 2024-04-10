require("dotenv").config();
const express = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const AccountCreationRequest = require("../models/account_creation_request");
const Withdrawal = require("../models/withdrawal");
const DashboardRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");


DashboardRoute.get("/list",async(req,res)=>{
    try{
        let userData = await User.find({status:true}).limit(5).sort({_id:-1});

        let accountCreationRequestData = await AccountCreationRequest.find({$and:[{$or:[{ is_kyc_completed:false},{is_aggrement_signed:false},{is_payment_made:false},{is_account_opened:false}]}]}).populate([
            {
                path:"product",
                select:"title"
            },
            {
                path:"user",
                select:"fname lname email mobile"
            }
        ]).limit(5).sort({_id:-1});

        let holdingRequest = accountCreationRequestData.filter(e => e.product?.title == 'holding');
        let preShareRequest = accountCreationRequestData.filter(e => e.product?.title == 'pre-share');
        let tradingRequest = accountCreationRequestData.filter(e => e.product?.title == 'trading');


        let accountRequest = await AccountCreationRequest.find({$and:[{ is_kyc_completed:true},{is_aggrement_signed:true},{is_payment_made:true},{is_account_opened:true}]}).populate([
            {
                path:"product",
                select:"title"
            },
            {
                path:"user",
                select:"fname lname email mobile"
            }
        ]).limit(5).sort({_id:-1});

        let holdingAccountData = accountRequest.filter(e => e.product?.title == 'holding');
        let preShareAccountData = accountRequest.filter(e => e.product?.title == 'pre-share');
        let tradingAccountData = accountRequest.filter(e => e.product?.title == 'trading');


        let WithdrawalRequest = await Withdrawal.find({status:false}).populate([
            {
                path:"product",
                select:"title"
            },
            {
                path:"user",
                select:"fname lname email mobile"
            }
        ]).limit(5).sort({_id:-1});

        let WithdrawalData = await Withdrawal.find({status:true}).populate([
            {
                path:"product",
                select:"title"
            },
            {
                path:"user",
                select:"fname lname email mobile"
            }
        ]).limit(5).sort({_id:-1});


        ////////////////////////////////////// count all data ///////////////////////////////////


        let userCount = await User.find({status:true});
        let userDataCount = userCount.length;

        let accountCreationRequestCount = await AccountCreationRequest.find({$or:[{ is_kyc_completed:false},{is_aggrement_signed:false},{is_payment_made:false},{is_account_opened:false}]}).populate([
            {
                path:"product",
                select:"title"
            }
        ]);

        let holdingRequestData = accountCreationRequestCount.filter(e => e.product?.title == 'holding')

        //let holdingRequestDataCount = holdingRequestData.length;

        let preShareRequestData = accountCreationRequestCount.filter(e => e.product?.title == 'pre-share')

        //let preShareRequestDataCount = preShareRequestData.length;

        let tradingRequestData = accountCreationRequestCount.filter(e => e.product?.title == 'trading')

       // let tradingRequestDataCount = tradingRequestData.length;


        let accountCreationCount = await AccountCreationRequest.find({$and:[{ is_kyc_completed:true},{is_aggrement_signed:true},{is_payment_made:true},{is_account_opened:true}]}).populate([
            {
                path:"product",
                select:"title"
            }
        ]);


        let holdingData = accountCreationCount.filter(e => e.product?.title == 'holding')

        //let holdingDataCount = holdingData.length;

        let preShareData = accountCreationCount.filter(e => e.product?.title == 'pre-share')

       // let preShareDataCount = preShareData.length;

        let tradingData = accountCreationCount.filter(e => e.product?.title == 'trading')

       // let tradingDataCount = tradingData.length;


        
        let WithdrawalRequestCount = await Withdrawal.find({status:false})

        totalreqamount = 0;

		WithdrawalRequestCount.forEach((element, index) => {
			totalreqamount += element.amount
		});

        //let WithdrawalRequestDataCount = WithdrawalRequestCount.length;



        let WithdrawalCount = await Withdrawal.find({status:true})

        totalamount = 0;

		WithdrawalCount.forEach((element, index) => {
			totalamount += element.amount
		});


       // let WithdrawalDataCount = WithdrawalCount.length

        /////////////////////////////////////////// Todays withdrawl/////////////////////////////////

        let startDate = new Date();
        let endDate = new Date();


        let todayWithdrawalRequestCount = await Withdrawal.find({$and:[{$or:[{ product:req.query.product},{user:req.query.user}]},{status:false},{createdAt:{ $gte: startDate, $lte: endDate }}]});

        totalreqtodayamount = 0;

		todayWithdrawalRequestCount.forEach((element, index) => {
			totalreqtodayamount += element.amount
		});

       // let todayWithdrawalRequestDataCount = todayWithdrawalRequestCount.length;


        let todayWithdrawalCount = await Withdrawal.find({$and:[{product:req.query.product},{status:true},{createdAt:{ $gte: startDate, $lte: endDate }}]})

        totaltodayamount = 0;

		todayWithdrawalCount.forEach((element, index) => {
			totaltodayamount += element.amount
		});


       // let todayWithdrawalDataCount = todayWithdrawalCount.length



       /////////////////////////////////////// monthly user count ///////////////////////////////


        let monthWiseUserCount = await User.aggregate([
            { "$match" : { status : true } },
            {$group: {
                _id: {$month: "$createdAt"}, 
                count: {$sum: 1} 
            }}
        ]);

        let months = [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec"
        ]

        let monthWiseUser = [];
            months.forEach((element, index) => {
                let monthData = monthWiseUserCount.find(e => e._id == index+1);
                // console.log(monthData);
                monthWiseUser[index] = {
                    month: element,
                    count: (monthData !== undefined) ? monthData?.count : 0
                }

            })


        ////////////////////////////////// monthly withdrawl count//////////////////////////
        
        
        let monthWiseWithdrawlCount = await Withdrawal.aggregate([
            { "$match" : { status : true } },
            {$group: {
                _id: {$month: "$createdAt"}, 
                count: {$sum: "$amount"} 
            }}
        ]);

        let month = [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec"
        ]

        let monthWiseWithdrawl = [];
        month.forEach((element, index) => {
            let monthData = monthWiseWithdrawlCount.find(e => e._id == index+1);
            monthWiseWithdrawl[index] = {
                month: element,
                count: (monthData !== undefined) ? monthData?.count : 0
            }

        })


        ////////////////////////////////// monthly account count ///////////////////////////


        let monthWiseAccountCount = await AccountCreationRequest.aggregate([
            { "$match" : { $and:[{ is_kyc_completed:true},{is_aggrement_signed:true},{is_payment_made:true},{is_account_opened:true}]} },
            {$group: {
                _id: {$month: "$createdAt"}, 
                count: {$sum: 1} 
            }}
        ]);

        let monthlist = [
            "jan",
            "feb",
            "mar",
            "apr",
            "may",
            "jun",
            "jul",
            "aug",
            "sep",
            "oct",
            "nov",
            "dec"
        ]

        let monthWiseAccount = [];
        monthlist.forEach((element, index) => {
                let monthData = monthWiseAccountCount.find(e => e._id == index+1);
                // console.log(monthData);
                monthWiseAccount[index] = {
                    month: element,
                    count: (monthData !== undefined) ? monthData?.count : 0
                }

            })


        ////////////////////////// type of account count//////////////////


        let accountTypeCount = await AccountCreationRequest.aggregate([
            { "$match" : { $and:[{ is_kyc_completed:true},{is_aggrement_signed:true},{is_payment_made:true},{is_account_opened:true}]} },
            { "$group" : {
                _id: { product: "$product" }, 
                count:{ $sum: 1 }
            }},
            { "$lookup": {
                "from": "products",
                "localField": "_id.product",
                "foreignField": "_id",
                "as": "productType"
            }},
        ]);



        message = {
            error:false,
            message:"Dashboard Data",
            data: {
                latestUser:userData,
                latestHoldingAccountRequest:holdingRequest,
                latestPreShareAccountRequest:preShareRequest,
                latestTradingAccountRequest:tradingRequest,
                latestHoldingAccount:holdingAccountData,
                latestPreShareAccount:preShareAccountData,
                latestTradingAccount:tradingAccountData,
                withdrawalRequest:WithdrawalRequest,
                withdrawal:WithdrawalData,
                totalUser:userDataCount,
                totalHoldingRequestedAccount:holdingRequestData.length,
                totalPreShareRequestedAccount:preShareRequestData.length,
                totalTradingRequestedAccount:tradingRequestData.length,
                totalHoldingAccountCreationCount:holdingData.length,
                totalPreShareAccountCreationCount:preShareData.length,
                totalTradingAccountCreationCount:tradingData.length,
                totalWithdrawalRequestDataCount:WithdrawalRequestCount.length,
                totalWithdrawalDataCount:WithdrawalCount.length,
                totalWithdrawlRequestAmount:totalreqamount,
                totalWithdrawlAmount:totalamount,
                totaltodaysWithdrawlRequest:todayWithdrawalRequestCount.length,
                todaysTotalWithdrawlRequestAmount:totalreqtodayamount,
                todaysTotalWithdrawl:todayWithdrawalCount.length,
                todaysTotalWithdrawlAmount:totaltodayamount,
            },
            chartData:{
                monthWiseUser,
                monthWiseWithdrawl,
                monthWiseAccount,
                accountTypeCount
                
            }

        };
        return res.status(200).send(message);
    }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err.toString()
        };
        return res.status(200).send(message);
    }
});

module.exports = DashboardRoute;