require("dotenv").config();
const express = require("express");
const AccountCreationRequest = require("../models/account_creation_request");
const AccountCreationRequestRoute = express.Router();
const moment = require("moment-timezone");
const Withdrawal = require("../models/withdrawal");
const Certificate = require("../models/certificate");
const Kyc = require("../models/kyc");
const Product = require("../models/product");
// const TradingLog = require("../models/trading_log");
// const CapitalLog = require('../models/capital_log');
// const BrokerageLog = require('../models/brokerage_log');
// const TradingNewLog = require("../models/trading_log_new");
// const BrokerageNewLog = require("../models/brokerage_new_log");
const isAuthenticate = require("../middleware/authcheck");
const Wallet = require("../models/wallet");
const BankAccount = require("../models/bank_account");
const TrdaingNewLog = require("../models/trading_log_new");
const BrokerageNewLog = require("../models/brokerage_new_log");
const User = require("../models/user");
const sendNotification = require("../helper/sendNotification");
const BrokerProfile = require("../models/broker_profile");
const InvestmentAccount = require("../models/newInvestment_account");
//const Kyc = require("../models/kyc");
// const moment = require("moment");

const nodemailer = require("nodemailer");


var transport = nodemailer.createTransport({
    host: "mail.tradergwealth.com",
    port: 465,
    auth: {
      user: "support@tradergwealth.com",
      pass: "Traderg@123"
    }
  });

/**
 * This method is to create Account creation request
 */

/**
 * Cron here for pre share, holding, trading
 */
 var CronJob = require('cron').CronJob;
const { LoggerLevel } = require("mongodb");
 var job = new CronJob(
    '* * * 1 * *',
     async function() {
    //   console.log('You will see this message every 10 min');
        try {
            let result = await AccountCreationRequest.find({$and:[{ is_kyc_completed:true},{is_aggrement_signed:true},{is_payment_made:true},{is_account_opened:true}]}).populate([
                {
                    path:"product",
                    select:"title"
                }
            ]); 
    
            var updatedData;
            var pid;
            var WalletData;
            for(var i in result){
              // console.log(">>>>>>>",result[i]);
                if(result[i].product?.title.toLowerCase() == "holding") {
    
                    // const startDate = result[i].createdAt;

                    // console.log("startDate",startDate);
    
                    // const endDate = new Date(); 

                    // console.log("endDate",endDate);
                    // const monthDiff = endDate.getMonth() - startDate.getMonth() +
                    // (12 * (endDate.getFullYear() - startDate.getFullYear()));

                    // console.log("monthDiff",monthDiff);

                    const startDate = moment(result[i].createdAt);
                    console.log(startDate);
                    const endDate = moment(new Date());
                    console.log(endDate);

                    let monthDiff = endDate.diff(startDate, 'months');

                    console.log("monthDiff",monthDiff);
    
                    let total_return = ((result[i]?.capital * result[i]?.holding_details?.monthly_return_rate)/100)*monthDiff;
    
                    console.log("total_return",total_return);
    
                    updatedData = await AccountCreationRequest.findOneAndUpdate({_id: result[i]._id},{"holding_details.total_return":total_return},{new: true});
    
                    console.log(updatedData);
                    // if(updatedData?.holding_details.total_return != 0){
                    //     WalletData = await Wallet.findOneAndUpdate({acc_id:result[i]._id},{
                    //         '$inc': { 'total_amount': total_return }, 
                    //         '$push': {
                    //              passbook_amt:{ 
                    //                  amount:total_return , 
                    //                  type: "credit"}
                    //                 }
                    //         },{new:true});
        
                    // }
                }
                if(result[i].product?.title.toLowerCase() == "pre-share") {

                    // const startDate = result[i].createdAt; 
                    // console.log(startDate);
                    
                    // const endDate = new Date(); 
                    // console.log(endDate);
    
                    // const monthDiff = endDate.getMonth() - startDate.getMonth() +
                    // (12 * (endDate.getFullYear() - startDate.getFullYear()));
                    // console.log(monthDiff)

                    const startDate = moment(result[i].createdAt);
                    console.log(startDate);
                    const endDate = moment(new Date());
                    console.log(endDate);

                    let monthDiff = endDate.diff(startDate, 'months');

                    console.log("monthDiff",monthDiff);

    
                    let monthly_dividend_amount = result[i]?.pre_share_details?.fixed_dividend_amount * monthDiff;
                    console.log("monthly_dividend_amount",monthly_dividend_amount);
    
                    updatedData = await AccountCreationRequest.findOneAndUpdate({_id:result[i]._id},{"pre_share_details.monthly_dividend_amount":monthly_dividend_amount},{new: true});
    
                   console.log(updatedData);
                //    if(updatedData?.pre_share_details.monthly_dividend_amount != 0){
                //     WalletData = await Wallet.findOneAndUpdate({acc_id:result[i]._id},{
                //         '$inc': { 'total_amount': monthly_dividend_amount },
                //         '$push': {
                //              passbook_amt:{ 
                //                  amount:monthly_dividend_amount , 
                //                  type: "credit"}
                //                 }
                //             },{new:true});

                //    }
                }
            }
    
            let message;
            if(result) {
                message = {
                    error: false,
                    message:"Account Creation Request updated successfully",
                    data: updatedData
                };
            } else {
                message = {
                    error: true,
                    message: "Account Creation Request not upadated"
                };
            }
           // return res.status(200).send(message);
        } catch(err) {
            message = {
                error: false,
                message:"Operation Failed",
                data: err.toString(),
            }
            //return res.status(200).send(message);
        }
     },
     null,
     true,
     'asia/kolkata'
 );

 AccountCreationRequestRoute.post("/create", async (req, res) => {
	try {
        req.body.per_capital = req.body.capital;
        req.body.client_id = Math.floor(Math.random() * 90000) + 10000;
        req.body.request_no = "TRD/REQ/" + Math.floor(1000 + Math.random() * 9000);
        const pId = req.body.product
        const productData = await Product.findOne({_id:pId});
        const productTitle = productData?.title
        console.log(productTitle);

        //console.log(pId);
        if(productTitle == "holding"){
            req.body.holding_details.monthly_return_amount = (req.body.capital * req.body.holding_details?.monthly_return_rate)/100;
            req.body.holding_details.return_slab = req.body.holding_details?.monthly_return_rate *12;

            req.body.holding_details.pre_monthly_return_amount =  (req.body.capital * req.body.holding_details?.monthly_return_rate)/100;
            req.body.holding_details.pre_return_slab = req.body.holding_details?.monthly_return_rate *12;

            // req.body.holding_details.return_slab = (req.body.capital * req.body.holding_details?.monthly_return_rate)/100;
           // req.body.holding_details.maturity_date = nowDate;
            // req.body.holding_details.total_return = ((req.body.capital * req.body.holding_details?.monthly_return_rate)/100)*req.body.holding_details.holding_month;
        }
        else if(productTitle == "pre-share"){
            req.body.pre_share_details.share = req.body.capital/10;
            req.body.pre_share_details.fixed_dividend_amount = (req.body.capital * req.body.pre_share_details.monthly_return_rate)/100;

            req.body.pre_share_details.exsisting_share = req.body.capital/10;
            req.body.pre_share_details.pre_fixed_dividend_amount = (req.body.capital * req.body.pre_share_details.monthly_return_rate)/100;

            //req.body.pre_share_details.monthly_dividend_amount = req.body.pre_share_details.share * req.body.pre_share_details.fixed_dividend_amount;
        }
        //req.body.agreement_file = "https://traderg.herokuapp.com/survivor-list2022-08-17T14_11_52.702Z.pdf"
        //console.log(req.body);
        const AccountCreationRequestData = new AccountCreationRequest(req.body);
		const result = await AccountCreationRequestData.save();

        const walletExist = await Wallet.findOne({acc_id:result?._id})
        //console.log(kycExist);
        if (walletExist) return res.status(200).send({error: true, message: "This Wallet is already exist. Can not be created."});

        const WalletData = new Wallet({acc_id:result?._id,user:result?.user,product:result?.product,acc_type:"accountCreationRequests",total_amount:result?.capital});
        const WalletResult = await WalletData.save();

        let pid = result?.product;
        console.log("pid>>>>",pid);
     
        const userData = await User.findOne({_id:result?.user});
        const userName = userData?.name;
        const kycData = await Kyc.findOne({user:result?.user});
        console.log({kycData});
        // const productData = await Product.findOne({_id:pid});
        // const productTitle = productData?.title;
        let updatedData;
        if(kycData?.isVerified == true){
            updatedData = await AccountCreationRequest.findOneAndUpdate({_id:result?._id},{is_kyc_completed:true},{new:true})
        }
        
        if(productTitle == "holding"){
            var mailOptions = {
                from: 'support@tradergwealth.com',
                to: userData.email,
                subject: `Welcome to Your New Holding Account!`,
                html:`
                <head>
                <title>Welcome to TRADERG - Your Trusted Partner in Asset Management</title>
            </head>
            <body>
                <p>Dear ${userName},</p>
                <p>We are delighted to welcome you as a valued account holder with TRADERG. Thank you for choosing us to be your trusted partner in managing your assets and investments.</p>
                <p>Your new holding account is now active, and we are excited to assist you in achieving your financial goals. As a holder of this account, you gain access to a range of benefits and services designed to make managing your investments easier and more efficient.</p>
                <p>We want you to make the most of your holdings, and our team is committed to providing you with exceptional service and support throughout your journey with us.</p>
                <p>If you have any further questions or need assistance, don't hesitate to reach out to our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We're here to help!</p>
                <p><strong>Best regards,</strong></p>
                <p>TRADERG</p>
            </body>
        `
 };   
            transport.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
        }
        else if(productTitle == "pre-share"){
            var mailOptions = {
                from: 'support@tradergwealth.com',
                to: userData.email,
                subject: `Welcome to Your New Preference Share Account!`,
                html:`
                <head>
                <title>Welcome to TRADERG - Your Preference Share Account</title>
            </head>
            <body>
                <p>Dear ${userName},</p>
                <p>Congratulations and welcome to your new Preference Share account with TRADERG! We are delighted to have you as an investor and look forward to assisting you in achieving your financial goals through this exciting investment avenue.</p>
                <p>Your new Preference Share account has been successfully set up, and we are thrilled to have you on board. Here are the essential details of your account:</p>
                <p><strong>Account Number:</strong> ${result.request_no} </p>
                <p><strong>Account Type:</strong> Preference Share Account</p>
                <p><strong>Initial Investment:</strong>  ${result.capital} </p>
                <p><strong>Dividend Rate:</strong> [Dividend Rate, if applicable]</p>
                <p>Preference Shares offer a range of benefits, including stable dividends, potential convertibility, and lower volatility compared to common shares. We believe that they can play a significant role in diversifying and strengthening your investment portfolio.</p>
                <p>We value your trust in TRADERG, and we are committed to providing you with exceptional service and support as you navigate the world of investing. Your financial well-being is our priority, and we will work tirelessly to ensure that you have a rewarding experience with us.</p>
                <p>Thank you for choosing TRADERG as your investment partner. We are excited to be part of your financial journey and look forward to building a successful and prosperous future together.</p>
                <p>If you have any further questions or need assistance, don't hesitate to reach out to our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We're here to help!</p>
                <p><strong>Best regards,</strong></p>
                <p>TRADERG</p>
            </body>
        `
 };   
            transport.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
        }
        else if(productTitle == "trading"){
            var mailOptions = {
                from: 'support@tradergwealth.com',
                to: userData.email,
                subject: `Welcome to Your New Trading Account!`,
                html:`
                <head>
                <title>Welcome to TRADERG - Your New Trading Account</title>
            </head>
            <body>
                <p>Dear ${userName},</p>
                <p>Congratulations and welcome to your new trading account with TRADERG. We're thrilled to have you on board and look forward to providing you with a seamless and rewarding trading experience.</p>
                <p>We value your trust in us and are committed to providing you with a secure and reliable trading environment. Our team is continuously working to improve our services and deliver the best possible trading experience to you.</p>
                <p>Thank you for choosing TRADERG. We are excited to partner with you on your trading journey!</p>
                <p>If you have any further questions or need assistance, don't hesitate to reach out to our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We're here to help!</p>
                <p>Happy trading!</p>
                <p><strong>Best regards,</strong></p>
                <p>TRADERG</p>
            </body>
        `
 };   
            transport.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
            
        }

        let sendNotificationData = await sendNotification({
            user: result?.user,
            title: "User Account Created successfully",
            description: "User "+ productTitle + " account created successfully"
        });

		message = {
			error: false,
			message: "Account Creation Request Added Successfully!",
            data: result,
            updatedData
           //WalletResult
		};
		return res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "operation Failed!",
			data: err.toString(),
		};
		return res.status(200).send(message);
	}
});

/**
 * This method is to find all Account creation request
 */

 AccountCreationRequestRoute.get("/list",async(req,res)=>{
    try{
        let AccountCreationRequestData = await AccountCreationRequest.find({$and:[{product:req.query.product},{ is_kyc_completed:true},{is_aggrement_signed:true},{is_payment_made:true},{is_account_opened:true}]}).populate([
            {
                path:"user",
                select:"fname lname name email mobile address city state pin_code"
            },
            {
                path:"product",
                select:"title"
            }
        ]).sort({_id:-1});

        let customAccountCreationRequestData = JSON.parse(JSON.stringify(AccountCreationRequestData))

		customAccountCreationRequestData.map(e => {
			e.createdDateTime =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD,YYYY-h:mm:ss a');
            e.createdDate =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD YYYY');
			return e
		})


        message = {
            error: false,
            message:"All Account Creation Request list",
            data:customAccountCreationRequestData
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
 * This method is used for account listing
 */

 AccountCreationRequestRoute.get("/request-list",async(req,res)=>{
    try{
        let AccountCreationRequestData = await AccountCreationRequest.find({$and:[{$or:[{product:req.query.product},{user:req.query.user}]},{$or:[{ is_kyc_completed:false},{is_aggrement_signed:false},{is_payment_made:false},{is_account_opened:false}]}]}).populate([
            {
                path:"user",
                select:"fname lname email mobile client_id address city state pin_code"
            },
            {
                path:"product",
                select:"title"
            }
        ]).sort({_id:-1});

        let customAccountCreationRequestData = JSON.parse(JSON.stringify(AccountCreationRequestData))
        
        let UserList  = customAccountCreationRequestData.filter((e)=>{
            return e?.user !== null; 
        })
        
        UserList.map(e => {
			e.createdDateTime =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD,YYYY-h:mm:ss a');
            e.createdDate =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD YYYY');
			return e
		})

        message = {
            error: false,
            message:"Account Creation Request list",
            data:UserList
        }
        return res.status(200).send(message);

    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err.toString()
        }
        return res.status(200).send(message);
    }
});




/**
 * This method is to find block/unblock Account 
 */

 AccountCreationRequestRoute.get("/list-by-status",async(req,res)=>{
    try{
        let AccountCreationRequestData = await AccountCreationRequest.find({status:true}).sort({_id:-1});

        message = {
            error: false,
            message:"unblock Account Creation Request list",
            data:AccountCreationRequestData
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
 * This method is to find is_kyc_completed
 */

 AccountCreationRequestRoute.get("/data/:userId/:productId",async(req,res)=>{
    try{
        let AccountCreationRequestData = await AccountCreationRequest.find({$and:[{$and:[{user:req.params.userId},{product:req.params.productId}]},{$or:[{is_kyc_completed:false},{is_aggrement_signed:false},{is_payment_made:false},{is_account_opened:false},{user_kyc_completed:false},{user_aggrement_completed:false},{user_payment_completed:false}]}]}).select("is_kyc_completed is_aggrement_signed is_payment_made is_account_opened user_kyc_completed user_aggrement_completed user_payment_completed")

        message = {
            error: false,
            message:"all status ",
            data:AccountCreationRequestData
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
 * This method is to find Account creation request by user Id
 */

AccountCreationRequestRoute.get("/list-by-userId/:userId",isAuthenticate,async(req,res)=>{
    try{
        let AccountCreationRequestData = await AccountCreationRequest.find({$and:[{user:req.params.userId},{is_kyc_completed:true},{is_aggrement_signed:true},{is_payment_made:true},{is_account_opened:true}]}).populate([
            {
                path:"user",
                select:"fname lname email mobile client_id address city state pin_code date_of_birth gender occupation"
            },
            {
                path:"product",
                select:"title"
            },
            {
                path:"kyc_id",
                select:"user_image pan_no pan_image adhaar_no adhaar_image"
            }
            // {
            //     path:"product_detail_id",
            //     select:""
            // }
        ]).sort({_id:-1});

        let brokerData = await BrokerProfile.findOne({user:req.params.userId});
        console.log("brokerData",brokerData)
        message = {
            error: false,
            message:"All Account Creation Request list",
            data:AccountCreationRequestData,
            brokerData

        }
        return res.status(200).send(message);

    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err.toString()
        }
        return res.status(200).send(message);
    }
});


/**
 * This method is to Detail Account creation request for admin
 */

 AccountCreationRequestRoute.get("/detail/:accountCreationReqId",async(req,res)=>{
    try{
        let AccountCreationRequestData = await AccountCreationRequest.findOne({_id:req.params.accountCreationReqId}).populate([
            {
                path:"user",
                select:"fname lname email mobile client_id address city state pin_code"
            },
            {
                path:"product",
                select:"title"
            }
        ]).sort({_id:-1});

        let userId = AccountCreationRequestData?.user?._id;
        console.log(userId);

        let certificateData = await Certificate.find({user:{$in:userId}});

        let WithdrawalData = await Withdrawal.find({user:{$in:userId}});

        let kycData = await Kyc.findOne({user:{$in:userId}});

        let BankData = await BankAccount.findOne({user:{$in:userId}});

        let BrokerData = await BrokerProfile.findOne({user:{$in:userId}}).populate([
            {
                path:"broker",
                select:"name"
            }
        ]);
        

        message = {
            error: false,
            message:"Detail for Account Creation Request ",
            data:AccountCreationRequestData,
            certificateData,
            WithdrawalData,
            kycData,
            BankData,
            BrokerData
        }
        return res.status(200).send(message);

    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err.toString()
        }
        return res.status(200).send(message);
    }
});

/**
 * This method is used for detail account by userId and accountId for user
 */


AccountCreationRequestRoute.get("/detail-account/:userId/:accountCreationReqId",isAuthenticate,async(req,res)=>{
    try{
        let AccountCreationRequestData = await AccountCreationRequest.findOne({$and:[{user:req.params.userId},{_id:req.params.accountCreationReqId}]}).populate([
            {
                path:"user",
                select:"fname lname email mobile client_id address city state pin_code"
            },
            {
                path:"product",
                select:"title"
            }
        ]).sort({_id:-1});

        let walletData = await Wallet.findOne({acc_id:req.params.accountCreationReqId}).populate([
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
        ]);

        let newInvAcc = await InvestmentAccount.find({$and:[{accountId:req.params.accountCreationReqId},{is_newInv_approved:true}]}).sort({_id:-1});



        message = {
            error: false,
            message:"Detail for Account Creation Request ",
            data:AccountCreationRequestData,
            walletData,
            newInvAcc
        }
        return res.status(200).send(message);

    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err.toString()
        }
        return res.status(200).send(message);
    }
});






/**
 * This method is to upadte Account creation request 
 * @param str accountCreationReqId
 */

 AccountCreationRequestRoute.patch("/update/:accountCreationReqId",isAuthenticate,async(req,res)=>{
    try{
        let result = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"Account Creation Request updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Account Creation Request not upadated"
            };
            return res.status(200).send(message);
        }
    }catch(err){
        message = {
            error: false,
            message:"Operation Failed",
            data: err
        }
        return res.status(200).send(message);
    }
});

////////////////////////////// reinvestment /////////////////////////////
AccountCreationRequestRoute.patch("/update-account/:accountCreationReqId",async(req,res)=>{
    try{
        let result = await AccountCreationRequest.findOne({_id:req.params.accountCreationReqId});

        let pid = result?.product;
        console.log("pid>>>>",pid);
     
        const productData = await Product.findOne({_id:pid});
        const productTitle = productData?.title
        console.log("productTitle>>>>>>",productTitle);
        var updatedData;
        if(productTitle == "holding"){
            let oldCapital = result?.capital;
          //  let oldHoldingMonth = result?.holding_details?.holding_month;
            let oldTenure = result?.tenure;
            let oldTenureType = result?.type;
            let oldMaturityDate = result?.holding_details?.maturity_date;
            let oldMonthlyReturn = result?.holding_details?.monthly_return_amount;
            let oldTotalReturn = result?.holding_details?.total_return;
            let oldReturnSlab = result?.holding_details?.return_slab;


            let tenureData = req.body.tenure;
            let typeData = req.body.type;
            let reInvDate = req.body.re_inv_date;
            let reInvAmount = req.body.holding_details.re_inv_amount;
            let new_total = ((result?.capital) + reInvAmount).toFixed(2);
            let rate = req.body.holding_details?.monthly_return_rate;
            let monthlyReturn = (new_total * rate)/100;
            let returnSlab = rate *12;


        //    let monthly_return_amount = (new_total * result?.holding_details?.monthly_return_rate)/100;

            let maturity_date = moment(new Date()).add(tenureData, typeData).format();
            console.log(new Date(maturity_date));

            const startDate = moment(reInvDate);
            console.log(startDate);
            const endDate = moment(new Date());
            console.log(endDate);

            let monthDiff = endDate.diff(startDate, 'months');

            console.log("monthDiff",monthDiff);

            let total_return = ((new_total * monthlyReturn)/100)*monthDiff;


            updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{capital:new_total,tenure:tenureData,type:typeData,old_capital:oldCapital,old_tenure:oldTenure,old_tenure_type:oldTenureType,re_inv_date:reInvDate,"holding_details.re_inv_amount":reInvAmount,"holding_details.old_return_slab":oldReturnSlab,"holding_details.old_maturity_date":oldMaturityDate,"holding_details.old_monthly_return":oldMonthlyReturn,"holding_details.old_total_return":oldTotalReturn,"holding_details.return_slab":returnSlab,"holding_details.maturity_date":maturity_date,"holding_details.total_return":total_return},{new: true}).populate([
                {
                    path:"product",
                    select:"title"
                }
            ]);
        }
        else if(productTitle == "pre-share"){
            let oldCapital = result?.capital;
            let oldTenure = result?.tenure;
            let oldTenureType = result?.type;
            let oldShare = result?.pre_share_details?.share;
            let oldFixedDividendAmount = result?.pre_share_details?.fixed_dividend_amount;
            let oldMonthlyDividendAmount = result?.pre_share_details?.monthly_dividend_amount;


           let reInvAmount = req.body.pre_share_details.re_inv_amount;
           let tenureData = req.body.tenure;
           let typeData = req.body.type;
           let reInvDate = req.body.re_inv_date;
           let rate = req.body.pre_share_details.monthly_return_rate
           let new_total = ((result?.capital) + reInvAmount).toFixed(2);
           let shareData = new_total/10;
           let fixedDividendAmount = (new_total * rate)/100;

           const startDate = moment(reInvDate);
           console.log(startDate);
           const endDate = moment(new Date());
           console.log(endDate);

           let monthDiff = endDate.diff(startDate, 'months');

           console.log("monthDiff",monthDiff);

            let monthly_dividend_amount = fixedDividendAmount * monthDiff;

            updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{capital:new_total,tenure:tenureData,type:typeData,old_capital:oldCapital,old_tenure:oldTenure,old_tenure_type:oldTenureType,re_inv_date:reInvDate,"pre_share_details.old_share":oldShare,"pre_share_details.old_fixed_dividend_amount":oldFixedDividendAmount,"pre_share_details.old_monthly_dividend_amount":oldMonthlyDividendAmount,"pre_share_details.share":shareData,"pre_share_details.fixed_dividend_amount":fixedDividendAmount,"pre_share_details.monthly_dividend_amount":monthly_dividend_amount},{new: true}).populate([
                {
                    path:"product",
                    select:"title"
                }
            ]);
        }
        else if(productTitle == "trading"){
            let oldCapital = result?.capital;
            console.log("oldCapital>>",oldCapital)
            let oldTenure = result?.tenure;
            let oldTenureType = result?.type;
            let oldTurnover = result?.trading_details?.turnover;
            let oldBrokerage = result?.trading_details?.brokerage;
            let oldMtm = result?.trading_details?.old_mtm;
 
            let newTradeamount = req.body.trading_details.new_trade_amt;
            //console.log("newTradeamount>>",newTradeamount)
            let tenureData = req.body.tenure;
            let tenureTypeData = req.body.type

            let new_total = ((result?.capital) + newTradeamount).toFixed(2);

          //  console.log("new_total>>",new_total)

            let applicationId = result?.application_id;

            const TrdaingNewLogData = await TrdaingNewLog.find({client_id:applicationId});
            const BrokerageData = await BrokerageNewLog.find({client_id:applicationId})
          
            let totalmtm = 0;
            let totalBrok = 0;

            TrdaingNewLogData.forEach((element, index) => {
                totalmtm += element.mtm_g_l
                totalBrok += element.brokerage
            });

            let totalturvover = 0;

            BrokerageData.forEach((element,index)=>{
                totalturvover += element.turnover
            })


            updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{capital:new_total,old_capital:oldCapital,old_tenure:oldTenure,old_tenure_type:oldTenureType,tenure:tenureData,type:tenureTypeData,"trading_details.new_trade_amt":newTradeamount,"trading_details.old_turnover":oldTurnover,"trading_details.old_brokerage":oldBrokerage,"trading_details.old_mtm":oldMtm,"trading_details.turnover":totalturvover,"trading_details.brokerage":totalBrok,"trading_details.mtm":totalmtm},{new: true}).populate([
                {
                    path:"product",
                    select:"title"
                }
            ]);
        }

        const userData = await User.findOne({_id:result?.user});
        const userName = userData?.name;

        var mailOptions = {
            from: 'support@tradergwealth.com',
            to: userData.email,
            subject: `Fund Top-Up Confirmation!`,
            html:`
            <head>
            <title>Confirmation of Fund Top-Up - TRADERG</title>
        </head>
        <body>
            <p>Dear ${userName},</p>
            <p>I hope this email finds you well. We are writing to confirm that we have received your fund top-up request, and the transaction has been successfully processed.</p>
            <p><strong>Top-Up Details:</strong></p>
            <p>Amount: [Top-Up Amount]</p>
            <p>Date of Top-Up: [Date of Top-Up]</p>
            <p>Payment Method: [Payment Method Used]</p>
            <p>Transaction ID: [Transaction ID, if applicable]</p>
            <p>Your account has been credited with the top-up amount, and your new balance is now [Updated Account Balance]. You can now utilize these funds for [purpose, e.g., trading, investment, etc.] within your account.</p>
            <p>We value your prompt response and cooperation in completing the top-up process. If you have any questions or require further assistance, please do not hesitate to contact our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. Our representatives are available to help you with any queries you may have.</p>
            <p>Thank you for choosing TRADERG! We appreciate the opportunity to serve you, and we look forward to assisting you with your financial needs.</p>
            <p><strong>Best regards,</strong></p>
            <p>TRADERG</p>
        </body>
    `
};   
        transport.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });

        let sendNotificationData = await sendNotification({
            user: result?.user,
            title: "Confirmation of Fund Top-Up",
            description: "User "+ productTitle + " account Confirmation of Fund Top-Up"
        });

        if(updatedData){
            message = {
                error: false,
                message:"Account Creation Request updated successfully",
                data: updatedData,
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Account Creation Request not upadated"
            };
            return res.status(200).send(message);
        }
      
    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err.toString(),
        }
        return res.status(200).send(message);
    }
});




/**
 * This method is to Admin upadte Account creation request 
 * @param str accountCreationReqId
 */

 AccountCreationRequestRoute.patch("/update-data/:accountCreationReqId",async(req,res)=>{
    try{
        let result = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{is_payment_made:req.body.is_payment_made,is_aggrement_signed:req.body.is_aggrement_signed,status:req.body.status,agreement_file:req.body.agreement_file,aggrement_text:req.body.aggrement_text,kyc_reason:req.body.kyc_reason,payment_reason:req.body.payment_reason,aggrement_reason:req.body.aggrement_reason},{new: true});
        console.log({result});
        // if(result.is_kyc_completed == false && result.kyc_reason != null){
        //     let sendNotificationData = await sendNotification({
        //         user: result?.user,
        //         title: "User KYC Verifried failed",
        //         description: `User KYC Verifried failed for ${result?.kyc_reason}`
        //     });

        // }
        if(result.is_payment_made == false && result.payment_reason != null){

            let sendNotificationData = await sendNotification({
                user: result?.user,
                title: "User Payment Verifried Failed",
                description: `User Payment Verifried Failed for ${result?.payment_reason} `
            });
            
        }
        if(result.is_aggrement_signed == false && result.aggrement_reason != null){

            let sendNotificationData = await sendNotification({
                user: result?.user,
                title: "User aggrement Verifried failed",
                description: `User aggrement Verifried failed for ${result?.aggrement_reason} `
            });
            
        }

        if(result.is_kyc_completed == true && result.is_payment_made == true && result.is_aggrement_signed == true){

            let pid = result?.product;
            let tenureData = result?.tenure
            let typeData = result?.type

            console.log(tenureData);
            console.log(typeData);


            const productData = await Product.findOne({_id:pid});
            const productTitle = productData?.title
            console.log(productTitle);
            var holdingData
            var preShareData
            var tradingData
            var WalletData
            if(productTitle == "holding"){
                let maturity_date = moment(new Date()).add(tenureData, typeData).format();
                console.log(new Date(maturity_date));

                let preMaturity_date = moment(new Date()).add(tenureData, typeData).format();


                // const startDate = moment(result?.createdAt);
                // console.log(startDate);
                // const endDate = moment(new Date());
                // console.log(endDate);

                // let monthDiff = endDate.diff(startDate, 'months');

                // console.log("monthDiff",monthDiff);

                // let total_return = ((result?.capital * result?.holding_details?.monthly_return_rate)/100)*monthDiff;

                let total_return = 0;

                holdingData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{"holding_details.maturity_date":new Date(maturity_date),"holding_details.total_return":total_return,"holding_details.pre_maturity_date":new Date(preMaturity_date)},{new: true});

                //console.log("total return",holdingData?.holding_details.total_return);
                // if(holdingData?.holding_details.total_return != 0){
                //     WalletData = await Wallet.findOneAndUpdate({acc_id:req.params.accountCreationReqId},{
                //         '$inc': { 'total_amount': total_return }, 
                //         '$push': {
                //              passbook_amt:{ 
                //                  amount:total_return , 
                //                  type: "credit"}
                //                 }
                //             },{new:true});
    
                // }
              
            }
            else if(productTitle == "pre-share"){
                // const startDate = moment(result?.createdAt);
                // console.log(startDate);
                // const endDate = moment(new Date());
                // console.log(endDate);

                // let monthDiff = endDate.diff(startDate, 'months');

                // console.log("monthDiff",monthDiff);

                // let monthly_dividend_amount = result?.pre_share_details?.fixed_dividend_amount * monthDiff;
                // console.log(monthly_dividend_amount);

                let monthly_dividend_amount = 0;
                
                preShareData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{"pre_share_details.monthly_dividend_amount":monthly_dividend_amount},{new: true});

                // if(preShareData?.pre_share_details.monthly_dividend_amount != 0){
                //     WalletData = await Wallet.findOneAndUpdate({acc_id:req.params.accountCreationReqId},{
                //         '$inc': { 'total_amount': monthly_dividend_amount },
                //         '$push': {
                //              passbook_amt:{ 
                //                  amount:monthly_dividend_amount , 
                //                  type: "credit"}
                //                 }
                //             },{new:true});
                // }
            }
            // else if(productTitle == "trading"){
            //     const accountData = await AccountCreationRequest.findOne({_id:req.params.accountCreationReqId})
            //     console.log(accountData);
            //     let applicationId = accountData?.application_id;
            //     console.log(applicationId);

            //     const TradingData = await TradingNewLog.find({client_id:applicationId});
            //     console.log(TradingData);

            //  //   const capitalData = await CapitalLog.find({client_id:applicationId});
            //     const BrokerageData = await BrokerageNewLog.find({client_id:applicationId});

                
            //     let totalmtm = 0;
            //     let totalBrok = 0;
            //     let totalturvover = 0;


            //     TradingData.forEach((element, index) => {
            //        // totalturvover += element.total_lot
            //         totalmtm += element.mtm_g_l,
            //         totalBrok += element.brokerage,
            //         totalturvover += element.turnover
            //     });

            //     // console.log(totalturvover);
            //     console.log(totalmtm);

            //     // let totalBrok = 0;
            //     // let totalturvover = 0;

            //     // BrokerageData.forEach((element,index)=>{
            //     //     totalBrok += element.brok
            //     //     totalturvover += element.turn_over
            //     // });

            //     console.log("totalBrok",totalBrok);
            //     console.log(totalturvover);

            //     // let total_net = capitalData?.net;

            //     // let total_net = 0;

            //     // capitalData.forEach((element, index) => {
            //     //     total_net += element.net
            //     //  });

            //     // console.log("total_net",total_net);


            //     tradingData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{"trading_details.turnover":totalturvover,"trading_details.mtm":totalmtm,"trading_details.brokerage":totalBrok,"trading_details.capital":total_net},{new: true})
            // }
        
        }

        const userData = await User.findOne({_id:result?.user});
        const userId = userData?._id;
        console.log({userId});
        const userName = userData?.name;
        const aggrement = result?.agreement_file;
        const accountId = result?._id;
        const aggrementDate = result?.aggrement_date;
        console.log({accountId});

    //     if(result.is_kyc_completed == true && result.agreement_file == null){
    //         console.log("1")
    //         kycFlag = 1;
    //         console.log({kycFlag})
    //         let sendNotificationData = await sendNotification({
    //             user: result?.user,
    //             title: "User KYC Verifried successfully",
    //             description: "User KYC Verifried successfully."
    //         });

    //         var mailOptions = {
    //             from: 'support@tradergwealth.com',
    //             to: userData.email,
    //             subject: `KYC Verification Successful - Welcome to TRADERG!`,
    //             html:`
    //             <head>
    //             <title>KYC Verification Success - Welcome to TRADERG!</title>
    //         </head>
    //         <body>
    //             <p>Dear ${userName},</p>
    //             <p>We hope this email finds you well and in good spirits. We are thrilled to inform you that your KYC verification process with TRADERG has been successfully completed!</p>
    //             <p>Thank you for promptly providing all the necessary documents and information required for the KYC process. Your cooperation and adherence to regulatory guidelines have made it possible for us to complete the verification smoothly.</p>
    //             <p>With your KYC now verified, you have full access to all the features and services offered by TRADERG. You can now enjoy a seamless and secure experience as you engage with our platform.</p>
    //             <p><strong>Here are some benefits of having a verified KYC:</strong></p>
    //             <p>We would like to take this opportunity to express our gratitude for choosing TRADERG as your trusted partner. We are committed to providing you with the best possible experience and assisting you in achieving your financial goals.</p>
    //             <p>If you ever require any assistance, have questions, or need guidance regarding our services, please feel free to reach out to our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We are always here to help.</p>
    //             <p>Once again, congratulations on successfully completing the KYC verification process. We look forward to a long and rewarding association with you.</p>
    //             <p><strong>Welcome to TRADERG!</strong></p>
    //             <p><strong>Best regards,</strong></p>
    //             <p>TRADERG</p>
    //         </body>
            
    //     `
    // };   
    //         transport.sendMail(mailOptions, function(error, info){
    //             if (error) {
    //               console.log(error);
    //             } else {
    //               console.log('Email sent: ' + info.response);
    //             }
    //         });
    
    //     }
        if(result.agreement_file != null && result?.is_aggrement_signed == false){
            console.log("2")
            let sendNotificationData = await sendNotification({
                user: result?.user,
                title: "SignIN and documennt upload pending",
                description: "SignIN and documennt upload pending."
            });

            var mailOptions = {
                from: 'support@tradergwealth.com',
                to: userData.email,
                subject: `Action Required - Sign and Upload Your Document`,
                html:`
                <head>
                <title>Request for Document Signature - TRADERG</title>
            </head>
            <body>
                <p>Dear ${userName} ,</p>
                <p>I hope this email finds you well. We appreciate your prompt response regarding the document , and we kindly request your further action to complete the process.</p>
                <p>We require your signature on the provided document. Please follow the steps below to sign and upload the document securely:</p>
                <ol>
                    <li>Download the Document: Click on the link provided below to download the document. <br><a href="${aggrement}" style="color:blue">Document Download Link</a></li>
                    <p>Find the link :<br>
                    <a href="45.113.122.201/dev/tradergv6/#/thankyou/${accountId}" target="blank" style="display: inline-block;font-size: 16px;color: #ffffff;letter-spacing: 0.5px;padding: 8px 50px;background-color: dodgerblue;border-radius: 6px;margin-top: 10px;">I agree</a>
                  </p>
    
                </ol>
                <p>Please ensure that the uploaded document is clear, legible, and includes your signature on all required pages.</p>
                <p>The deadline for submitting the signed document is ${aggrementDate}. If you encounter any challenges or have any questions, feel free to contact our team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We are always here to help.</p>
                <p>We appreciate your cooperation and prompt attention to this matter. Completing this process in a timely manner will allow us to move forward with the necessary arrangements.</p>
                <p>Thank you for choosing TRADERG. We value your business and look forward to serving you.</p>
                <p><strong>Best regards,</strong></p>
                <p>TRADERG</p>
            </body>
                        
        `
    };   
            transport.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
    
        }
        if(result.is_account_opened == false && result.agreement_file != null){
            console.log("3")

            let sendNotificationData = await sendNotification({
                user: result?.user,
                title: "Account opening status pending",
                description: "Arihant account opening status pending."
            });

            var mailOptions = {
                from: 'support@tradergwealth.com',
                to: userData.email,
                subject: `Arihant Account Opening Status - Pending `,
                html:`
                <head>
                <title>Welcome to TRADERG</title>
            </head>
            <body>
                <p>Dear ${userName} ,</p>
                <p>I hope this email finds you well. Thank you for choosing TRADERG. We are delighted to have you as a potential customer, and we truly appreciate your interest in becoming a part of our financial community.</p>
                <p>We are writing to inform you that your account opening process is pending with Arihant. However, it seems that some required information or documents are awaiting completion to successfully process your application.</p>
                <p>We aim to have your account opened as soon as possible. We understand the importance of a timely response and are committed to providing you with excellent service throughout this process.</p>
                <p>If you have any questions or need assistance with your account opening, please do not hesitate to contact our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We are here to help and will be glad to assist you.</p>
                <p>Thank you for your patience and cooperation. We value your interest in TRADERG, and we look forward to welcoming you as a valued member of our financial community.</p>
                <p>Best regards,<br>
                TRADERG</p>
            </body>                     
        `
    };   
            transport.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
    
        }

    //     if(result.is_account_opened == false){

    //         let sendNotificationData = await sendNotification({
    //             user: result?.user,
    //             title: "Account opening status pending",
    //             description: "Arihant account opening status pending."
    //         });

    //         var mailOptions = {
    //             from: 'support@tradergwealth.com',
    //             to: userData.email,
    //             subject: `Arihant Account Opening Status - Pending `,
    //             html:`
    //             <head>
    //             <title>Welcome to TRADERG</title>
    //         </head>
    //         <body>
    //             <p>Dear ${userName} ,</p>
    //             <p>I hope this email finds you well. Thank you for choosing TRADERG. We are delighted to have you as a potential customer, and we truly appreciate your interest in becoming a part of our financial community.</p>
    //             <p>We are writing to inform you that your account opening process is pending with Arihant. However, it seems that some required information or documents are awaiting completion to successfully process your application.</p>
    //             <p>We aim to have your account opened as soon as possible. We understand the importance of a timely response and are committed to providing you with excellent service throughout this process.</p>
    //             <p>If you have any questions or need assistance with your account opening, please do not hesitate to contact our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We are here to help and will be glad to assist you.</p>
    //             <p>Thank you for your patience and cooperation. We value your interest in TRADERG, and we look forward to welcoming you as a valued member of our financial community.</p>
    //             <p>Best regards,<br>
    //             TRADERG</p>
    //         </body>                     
    //     `
    // };   
        //     transport.sendMail(mailOptions, function(error, info){
        //         if (error) {
        //           console.log(error);
        //         } else {
        //           console.log('Email sent: ' + info.response);
        //         }
        //     });
    
        // }


        if(result){
            message = {
                error: false,
                message:"Account Creation Request updated successfully",
                data: result,
                holdingData,
                preShareData,
              //  tradingData,
                WalletData
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Account Creation Request not upadated"
            };
            return res.status(200).send(message);
        }
    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err.toString(),
        }
        return res.status(200).send(message);
    }
});

/**
 * This method is to user upadte Account creation request 
 * @param str accountCreationReqId
 */

 AccountCreationRequestRoute.patch("/user-update-data/:accountCreationReqId",async(req,res)=>{
    try{
        let result = await AccountCreationRequest.findOne({_id:req.params.accountCreationReqId});

        let pid = result?.product;
      //  console.log("pid>>>>",pid);
     
        const productData = await Product.findOne({_id:pid});
        const productTitle = productData?.title;
      //  console.log("productTitle>>>>>>",productTitle);
        var updatedData;
       // var holdingData
        if(productTitle == "holding"){
            let holdingPaymentFile = req.body.holding_payment_file;
            let holdingPaymentDetail = req.body.holding_payment_detail;

            updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{user_aggrement_completed:req.body.user_aggrement_completed,user_payment_completed:req.body.user_payment_completed,user_kyc_completed:req.body.user_kyc_completed,user_signed_file:req.body.user_signed_file,payment_method:req.body.payment_method,"holding_details.holding_payment_file":holdingPaymentFile,"holding_details.holding_payment_detail":holdingPaymentDetail},{new: true}).populate([
                {
                    path:"product",
                    select:"title"
                }
            ]);
        }
        else if(productTitle == "pre-share"){
            let presharePaymentFile = req.body.pre_share_payment_file;
            let presharePaymentDetail = req.body.pre_share_payment_detail;

            updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{user_aggrement_completed:req.body.user_aggrement_completed,user_payment_completed:req.body.user_payment_completed,user_kyc_completed:req.body.user_kyc_completed,user_signed_file:req.body.user_signed_file,payment_method:req.body.payment_method,"pre_share_details.pre_share_payment_file":presharePaymentFile,"pre_share_details.pre_share_payment_detail":presharePaymentDetail},{new: true}).populate([
                {
                    path:"product",
                    select:"title"
                }
            ]);
        }
        else if(productTitle == "trading"){
            let tradingPaymentFile = req.body.trading_payment_file;
            let tradingPaymentDetail = req.body.trading_payment_detail;

            updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{user_aggrement_completed:req.body.user_aggrement_completed,user_payment_completed:req.body.user_payment_completed,user_kyc_completed:req.body.user_kyc_completed,user_signed_file:req.body.user_signed_file,payment_method:req.body.payment_method,"trading_details.trading_payment_file":tradingPaymentFile,"trading_details.trading_payment_detail":tradingPaymentDetail},{new: true}).populate([
                {
                    path:"product",
                    select:"title"
                }
            ]);
        }
    //     const userData = await User.findOne({_id:result?.user});
    //     const userName = userData?.name;

    //     if(result.is_kyc_completed == false){

    //         let sendNotificationData = await sendNotification({
    //             user: result?.user,
    //             title: "KYC verification pending",
    //             description: "KYC verification pending."
    //         });

    //         var mailOptions = {
    //             from: 'support@tradergwealth.com',
    //             to: userData.email,
    //             subject: `Status Update: KYC Verification Pending`,
    //             html:`
    //             <head>
    //             <title>KYC Verification Status Update</title>
    //           </head>
    //           <body>
    //             <p>Dear ${userName} ,</p>
    //             <p>We hope this email finds you well. We are writing to inform you about the current status of your KYC verification process with TRADERG.</p>
    //             <p>We appreciate your cooperation in providing the necessary documentation to fulfil our regulatory requirements and ensure the security of your account. Our team is diligently reviewing your submitted documents to complete the KYC verification process.</p>
    //             <p>We kindly request your continued patience and assure you that we will notify you promptly once your KYC verification is successfully completed. In the meantime, you can continue to access your account and utilize our services within the limits defined for accounts with pending verification.</p>
    //             <p>If you have any concerns or require further assistance, please do not hesitate to contact our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. Our representatives will be glad to assist you.</p>
    //             <p>Thank you for choosing TRADERG.</p>
    //             <p>Best regards,<br>TRADERG</p>
    //           </body>           
    //     `
    // };   
    //         transport.sendMail(mailOptions, function(error, info){
    //             if (error) {
    //               console.log(error);
    //             } else {
    //               console.log('Email sent: ' + info.response);
    //             }
    //         });
    
    //     }
        if(updatedData){
            message = {
                error: false,
                message:"Account Creation Request updated successfully",
                data: updatedData,
                //holdingData
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Account Creation Request not upadated"
            };
            return res.status(200).send(message);
        }
      
    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err.toString(),
        }
        return res.status(200).send(message);
    }
});
/**
 * This method is used for update all ID//Admin puropose
 */

 AccountCreationRequestRoute.patch("/admin-update/:accountCreationReqId",async(req,res)=>{
    try{
        let result = await AccountCreationRequest.findOne({_id:req.params.accountCreationReqId});
        let pid = result?.product;
        console.log(pid);
        const productData = await Product.findOne({_id:pid});
        const productTitle = productData?.title
        console.log(productTitle);
        var updatedData
        var walletData
       // var preShareData

        if(productTitle == "holding"){
            updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{wallet_id:req.body.wallet_id,is_account_opened:true},{new: true});

            walletData = await Wallet.findOneAndUpdate({acc_id:req.params.accountCreationReqId},{wallet_id:updatedData?.wallet_id},{new:true})

        }
        else if(productTitle == "pre-share"){
            updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{dp_id:req.body.dp_id,application_id:req.body.application_id,is_account_opened:true},{new: true});
        }
        else if(productTitle == "trading"){
            updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{dp_id:req.body.dp_id,application_id:req.body.application_id,is_account_opened:true},{new: true});
        }
        if(result){
            message = {
                error: false,
                message:"Account Creation Request updated successfully",
                data: updatedData,
               // walletData
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Account Creation Request not upadated"
            };
            return res.status(200).send(message);
        }
    }catch(err){
        message = {
            error: false,
            message:"Operation Failed",
            data: err.toString()
        }
        return res.status(200).send(message);
    }
});

///////////////testing api///////////////

/**
 * This method is to Admin upadte Account creation request 
 * @param str accountCreationReqId
 */

// AccountCreationRequestRoute.patch("/test-update-data/:accountCreationReqId",async(req,res)=>{
//     try{
//         let result = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{is_kyc_completed:req.body.is_kyc_completed,is_payment_made:req.body.is_payment_made,is_aggrement_signed:req.body.is_aggrement_signed,status:req.body.status,agreement_file:req.body.agreement_file,aggrement_text:req.body.aggrement_text},{new: true});

//         if(result.is_kyc_completed == true && result.is_payment_made == true && result.is_aggrement_signed == true){

//             let pid = result?.product;
//             let tenureData = result?.tenure
//             let typeData = result?.type

//             console.log(tenureData);
//             console.log(typeData);


//             const productData = await Product.findOne({_id:pid});
//             const productTitle = productData?.title
//             console.log(productTitle);
//             var holdingData
//             var preShareData
//             var tradingData
//             if(productTitle == "holding"){
//                 let maturity_date = moment(new Date()).add(tenureData, typeData).format();
//                 console.log(new Date(maturity_date));

//                 const startDate = new Date(result?.updatedAt); 
//                 console.log(startDate);
                
//                 const endDate = new Date(); 
//                 console.log(endDate);

//                 const monthDiff = endDate.getMonth() - startDate.getMonth() +
//                 (12 * (endDate.getFullYear() - startDate.getFullYear()));
//                 console.log(monthDiff)

//                 let total_return = ((result?.capital * result?.holding_details?.monthly_return_rate)/100)*monthDiff;

//                 holdingData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{"holding_details.maturity_date":new Date(maturity_date),"holding_details.total_return":total_return},{new: true});

                
//             }
//             else if(productTitle == "pre-share"){
//                 const startDate = new Date(result?.updatedAt); 
//                 console.log(startDate);
                
//                 const endDate = new Date(); 
//                 console.log(endDate);

//                 const monthDiff = endDate.getMonth() - startDate.getMonth() +
//                 (12 * (endDate.getFullYear() - startDate.getFullYear()));
//                 console.log(monthDiff)

//                 let monthly_dividend_amount = result?.pre_share_details?.fixed_dividend_amount * monthDiff;
//                 console.log(monthly_dividend_amount);
//                 preShareData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{"pre_share_details.monthly_dividend_amount":monthly_dividend_amount},{new: true})
//             }
//             else if(productTitle == "trading"){
//                 const accountData = await AccountCreationRequest.findOne({_id:req.params.accountCreationReqId})
//                 console.log(accountData);
//                 let clientId = accountData?.client_id;
//                 console.log(clientId);

//                 const TradingData = await TradingLog.find({client_id:clientId});
//                 console.log(TradingData);

//                 let totalturvover = 0;
//                 let totalmtm = 0;

//                 TradingData.forEach((element, index) => {
//                     totalturvover += element.total_lot
//                     totalmtm += element.mtm_g_l
//                 });

//                 console.log(totalturvover);
//                 console.log(totalmtm);

//                 tradingData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{"trading_details.turnover":totalturvover,"trading_details.mtm":totalmtm},{new: true})
//             }
        
//         }
//         if(result){
//             message = {
//                 error: false,
//                 message:"Account Creation Request updated successfully",
//                 data: result,
//                 holdingData,
//                 preShareData,
//                 tradingData
//             };
//             return res.status(200).send(message);
//         }else{
//             message = {
//                 error: true,
//                 message: "Account Creation Request not upadated"
//             };
//             return res.status(200).send(message);
//         }
//     }catch(err){
//         message = {
//             error: false,
//             message:"Operation Failed",
//             data: err.toString(),
//         }
//         return res.status(200).send(message);
//     }
// });

//////////////////////////////////////// create new topup /////////////////////////

AccountCreationRequestRoute.patch("/topup-create/:accountCreationReqId", async (req, res) => {
	try {
        let result = await AccountCreationRequest.findOne({_id:req.params.accountCreationReqId});
        const pId = result?.product
        const productData = await Product.findOne({_id:pId});
        const productTitle = productData?.title
        console.log(productTitle);
        var updatedData;
        if(productTitle == "holding"){
            let oldCapital = result?.capital;
              let oldTenure = result?.tenure;
              let oldTenureType = result?.type;
              let oldMaturityDate = result?.holding_details?.maturity_date;
              let oldMonthlyReturn = result?.holding_details?.monthly_return_amount;
              let oldTotalReturn = result?.holding_details?.total_return;
              let oldReturnSlab = result?.holding_details?.return_slab;
  
  
              let tenureData = req.body.tenure;
              let typeData = req.body.type;
              let reInvDate = req.body.re_inv_date;
              let reInvAmount = req.body.holding_details.re_inv_amount;
              let new_total = ((result?.capital) + reInvAmount).toFixed(2);
              let rate = req.body.holding_details?.monthly_return_rate;
              let monthlyReturn = (new_total * rate)/100;
              let returnSlab = rate *12;

              updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{capital:new_total,tenure:tenureData,type:typeData,old_capital:oldCapital,old_tenure:oldTenure,old_tenure_type:oldTenureType,re_inv_date:reInvDate,"holding_details.re_inv_amount":reInvAmount,"holding_details.old_return_slab":oldReturnSlab,"holding_details.old_maturity_date":oldMaturityDate,"holding_details.old_monthly_return":oldMonthlyReturn,"holding_details.old_total_return":oldTotalReturn,"holding_details.return_slab":returnSlab,"holding_details.maturity_date":"","holding_details.total_return":"",is_newInv_approved:false},{new: true}).populate([
                {
                    path:"product",
                    select:"title"
                }
            ]);

        }
        else if(productTitle == "pre-share"){
            let oldCapital = result?.capital;
            let oldTenure = result?.tenure;
            let oldTenureType = result?.type;
            let oldShare = result?.pre_share_details?.share;
            let oldFixedDividendAmount = result?.pre_share_details?.fixed_dividend_amount;
            let oldMonthlyDividendAmount = result?.pre_share_details?.monthly_dividend_amount;


           let reInvAmount = req.body.pre_share_details.re_inv_amount;
           let tenureData = req.body.tenure;
           let typeData = req.body.type;
           let reInvDate = req.body.re_inv_date;
           let rate = req.body.pre_share_details.monthly_return_rate
           let new_total = ((result?.capital) + reInvAmount).toFixed(2);
           let shareData = new_total/10;
           let fixedDividendAmount = (new_total * rate)/100;

           updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{capital:new_total,tenure:tenureData,type:typeData,old_capital:oldCapital,old_tenure:oldTenure,old_tenure_type:oldTenureType,re_inv_date:reInvDate,"pre_share_details.old_share":oldShare,"pre_share_details.old_fixed_dividend_amount":oldFixedDividendAmount,"pre_share_details.old_monthly_dividend_amount":oldMonthlyDividendAmount,"pre_share_details.share":shareData,"pre_share_details.fixed_dividend_amount":fixedDividendAmount,"pre_share_details.monthly_dividend_amount":"",is_newInv_approved:false},{new: true}).populate([
            {
                path:"product",
                select:"title"
            }
        ]);
            
        }
        else if(productTitle == "trading"){
            let oldCapital = result?.capital;
            console.log("oldCapital>>",oldCapital)
            let oldTenure = result?.tenure;
            let oldTenureType = result?.type;
            let oldTurnover = result?.trading_details?.turnover;
            let oldBrokerage = result?.trading_details?.brokerage;
            let oldMtm = result?.trading_details?.old_mtm;
 
            let newTradeamount = req.body.trading_details.new_trade_amt;
            let tenureData = req.body.tenure;
            let tenureTypeData = req.body.type

            let new_total = ((result?.capital) + newTradeamount).toFixed(2);

            updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{capital:new_total,old_capital:oldCapital,old_tenure:oldTenure,old_tenure_type:oldTenureType,tenure:tenureData,type:tenureTypeData,"trading_details.new_trade_amt":newTradeamount,"trading_details.old_turnover":oldTurnover,"trading_details.old_brokerage":oldBrokerage,"trading_details.old_mtm":oldMtm,"trading_details.turnover":"","trading_details.brokerage":"","trading_details.mtm":"",is_newInv_approved:false},{new: true}).populate([
                {
                    path:"product",
                    select:"title"
                }
            ]);
        }
        
        // console.log("updatedData>>>>>>>>",updatedData)

		message = {
			error: false,
			message: "Account Creation Request Added Successfully!",
			data: updatedData,
		};
		return res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "operation Failed!",
			data: err.toString(),
		};
		return res.status(200).send(message);
	}
});

/////////////////////////////////////// update to toup account /////////////////////////////

AccountCreationRequestRoute.patch("/update-account-topup/:accountCreationReqId",async(req,res)=>{
    try{
        let result = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{is_newInv_approved:req.body.is_newInv_approved},{new:true});

        let pid = result?.product;
        console.log("pid>>>>",pid);

        let tenureData = result?.tenure
        let typeData = result?.type

        console.log(tenureData);
        console.log(typeData);
     
        const productData = await Product.findOne({_id:pid});
        const productTitle = productData?.title
        console.log("productTitle>>>>>>",productTitle);
        var updatedData;
        if(result?.is_newInv_approved == true){
            if(productTitle == "holding"){
                let rate = result?.holding_details?.monthly_return_rate;
                let monthlyReturn = (result?.capital * rate)/100;
                let returnSlab = rate *12;
    
    
                let maturity_date = moment(new Date()).add(tenureData, typeData).format();
                console.log(new Date(maturity_date));
    
                const startDate = moment(result?.re_inv_date);
                console.log(startDate);
                const endDate = moment(new Date());
                console.log(endDate);
    
                let monthDiff = endDate.diff(startDate, 'months');
    
                console.log("monthDiff",monthDiff);
    
                let total_return = ((result?.capital * monthlyReturn)/100)*monthDiff;
    
    
                updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{"holding_details.maturity_date":maturity_date,"holding_details.total_return":total_return},{new: true}).populate([
                    {
                        path:"product",
                        select:"title"
                    }
                ]);
            }
            else if(productTitle == "pre-share"){
               const startDate = moment(result?.re_inv_date);
               console.log(startDate);
               const endDate = moment(new Date());
               console.log(endDate);
    
               let monthDiff = endDate.diff(startDate, 'months');
    
               console.log("monthDiff",monthDiff);
    
                let monthly_dividend_amount = (result?.pre_share_details?.fixed_dividend_amount) * monthDiff;

                console.log("fixedDividendAmount>>>>>",result?.pre_share_details?.fixed_dividend_amount)

                console.log("monthly_dividend_amount>>>>>",monthly_dividend_amount)
    
                updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{"pre_share_details.monthly_dividend_amount":monthly_dividend_amount},{new: true}).populate([
                    {
                        path:"product",
                        select:"title"
                    }
                ]);
            }
            else if(productTitle == "trading"){
            //     let oldCapital = result?.capital;
            //     console.log("oldCapital>>",oldCapital)
            //     let oldTenure = result?.tenure;
            //     let oldTenureType = result?.type;
            //     let oldTurnover = result?.trading_details?.turnover;
            //     let oldBrokerage = result?.trading_details?.brokerage;
            //     let oldMtm = result?.trading_details?.old_mtm;
     
            //     let newTradeamount = req.body.trading_details.new_trade_amt;
            //     //console.log("newTradeamount>>",newTradeamount)
            //     let tenureData = req.body.tenure;
            //     let tenureTypeData = req.body.type
    
               // let new_total = ((result?.capital) + newTradeamount).toFixed(2);
    
              //  console.log("new_total>>",new_total)
    
                let applicationId = result?.application_id;
    
                const TrdaingNewLogData = await TrdaingNewLog.find({client_id:applicationId});
                const BrokerageData = await BrokerageNewLog.find({client_id:applicationId})
              
                let totalmtm = 0;
                let totalBrok = 0;
    
                TrdaingNewLogData.forEach((element, index) => {
                    totalmtm += element.mtm_g_l
                    totalBrok += element.brokerage
                });
    
                let totalturvover = 0;
    
                BrokerageData.forEach((element,index)=>{
                    totalturvover += element.turnover
                })
    

                updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{"trading_details.turnover":totalturvover,"trading_details.brokerage":totalBrok,"trading_details.mtm":totalmtm},{new: true}).populate([
                    {
                        path:"product",
                        select:"title"
                    }
                ]);
            }
    
        }
        const userData = await User.findOne({_id:result?.user});
        const userName = userData?.name;

        var mailOptions = {
            from: 'support@tradergwealth.com',
            to: userData.email,
            subject: `Fund Top-Up Confirmation!`,
            html:`
            <head>
            <title>Confirmation of Fund Top-Up - TRADERG</title>
        </head>
        <body>
            <p>Dear ${userName},</p>
            <p>I hope this email finds you well. We are writing to confirm that we have received your fund top-up request, and the transaction has been successfully processed.</p>
            <p><strong>Top-Up Details:</strong></p>
            <p>Amount: [Top-Up Amount]</p>
            <p>Date of Top-Up: [Date of Top-Up]</p>
            <p>Payment Method: [Payment Method Used]</p>
            <p>Transaction ID: [Transaction ID, if applicable]</p>
            <p>Your account has been credited with the top-up amount, and your new balance is now [Updated Account Balance]. You can now utilize these funds for [purpose, e.g., trading, investment, etc.] within your account.</p>
            <p>We value your prompt response and cooperation in completing the top-up process. If you have any questions or require further assistance, please do not hesitate to contact our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. Our representatives are available to help you with any queries you may have.</p>
            <p>Thank you for choosing TRADERG! We appreciate the opportunity to serve you, and we look forward to assisting you with your financial needs.</p>
            <p><strong>Best regards,</strong></p>
            <p>TRADERG</p>
        </body>
    `
};   
        transport.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });

        let sendNotificationData = await sendNotification({
            user: result?.user,
            title: "Confirmation of Fund Top-Up",
            description: "User "+ productTitle + " account Confirmation of Fund Top-Up"
        });

        if(updatedData){
            message = {
                error: false,
                message:"Account Creation Request updated successfully",
                data: updatedData,
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Account Creation Request not upadated"
            };
            return res.status(200).send(message);
        }
      
    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err.toString(),
        }
        return res.status(200).send(message);
    }
});



/**
 * This method is to delete Account creation request 
 * @param str accountCreationReqId
 */

 AccountCreationRequestRoute.delete("/delete/:accountCreationReqId", async (req, res) => {
    try {
        const result = await AccountCreationRequest.deleteOne({
            _id: req.params.accountCreationReqId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Account Creation Request deleted successfully!",
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

///////////////////////////////////////// new inv req list ////////////////////////////////

AccountCreationRequestRoute.get("/inv-request-list",async(req,res)=>{
    try{
        let AccountCreationRequestData = await AccountCreationRequest.find({$and:[{$or:[{product:req.query.product},{user:req.query.user}]},{is_newInv_approved:false}]}).populate([
            {
                path:"user",
                select:"fname lname email mobile client_id address city state pin_code"
            },
            {
                path:"product",
                select:"title"
            }
        ]).sort({_id:-1});

       // console.log("data",AccountCreationRequestData)

        let customAccountCreationRequestData = JSON.parse(JSON.stringify(AccountCreationRequestData))
        
        let UserList  = customAccountCreationRequestData.filter((e)=>{
            return e?.user !== null; 
        })
        
        UserList.map(e => {
			e.createdDateTime =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD,YYYY-h:mm:ss a');
            e.createdDate =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD YYYY');
			return e
		})

        message = {
            error: false,
            message:"Account Creation Request list",
            data:UserList
        }
        return res.status(200).send(message);

    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err.toString()
        }
        return res.status(200).send(message);
    }
});

///////////////////////////////////////// new inv list ////////////////////////////////

AccountCreationRequestRoute.get("/inv-list",async(req,res)=>{
    try{
        let AccountCreationRequestData = await AccountCreationRequest.find({$and:[{$or:[{product:req.query.product},{user:req.query.user}]},{is_newInv_approved:true}]}).populate([
            {
                path:"user",
                select:"fname lname email mobile client_id address city state pin_code"
            },
            {
                path:"product",
                select:"title"
            }
        ]).sort({_id:-1});

        let customAccountCreationRequestData = JSON.parse(JSON.stringify(AccountCreationRequestData))
        
        let UserList  = customAccountCreationRequestData.filter((e)=>{
            return e?.user !== null; 
        })
        
        UserList.map(e => {
			e.createdDateTime =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD,YYYY-h:mm:ss a');
            e.createdDate =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD YYYY');
			return e
		})

        message = {
            error: false,
            message:"Account Creation New Investment list",
            data:UserList
        }
        return res.status(200).send(message);

    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err.toString()
        }
        return res.status(200).send(message);
    }
});



////kyc verification


AccountCreationRequestRoute.patch("/kyc-verification/:accId",async(req,res)=>{
    try{
        let result = await AccountCreationRequest.findOne({_id:req.params.accId});
        console.log({result})
        let kycData = await Kyc.findOne({$and:[{user:result?.user},{status:true}]});
        console.log({kycData})
       let kycApproved = kycData?.isVerified;
       console.log({kycApproved})

        let pid = result?.product;

        console.log({pid})
    
        const productData = await Product.findOne({_id:pid});
        const productTitle = productData?.title;
        console.log({productTitle})

        let updatedData;
        let updatedKyc;
        let userData = await User.findOne({_id:result?.user});
        let userId = userData?._id;
        let userName = userData?.name;
        if(productTitle == "holding"){
            if(kycData?.isVerified == true){
                updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accId},{is_kyc_completed:true},{new:true}).populate([
                    {
                        path:"product",
                        select:"title"
                    }
                ])
                // console.log({updatedData})
            }else{
                updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accId},{is_kyc_completed:req.body.is_kyc_completed,kyc_reason:req.body.kyc_reason},{new:true})

                // console.log({updatedData})

                if(updatedData?.is_kyc_completed == true){
                    updatedKyc = await Kyc.findOneAndUpdate({_id:kycData?._id},{isVerified:true},{new:true});

                var mailOptions = {
                    from: 'support@tradergwealth.com',
                    to: userData.email,
                    subject: `KYC Verification Successful - Welcome to TRADERG!`,
                    html:`
                    <head>
                    <title>KYC Verification Success - Welcome to TRADERG!</title>
                </head>
                <body>
                    <p>Dear ${userName},</p>
                    <p>We hope this email finds you well and in good spirits. We are thrilled to inform you that your KYC verification process with TRADERG has been successfully completed!</p>
                    <p>Thank you for promptly providing all the necessary documents and information required for the KYC process. Your cooperation and adherence to regulatory guidelines have made it possible for us to complete the verification smoothly.</p>
                    <p>With your KYC now verified, you have full access to all the features and services offered by TRADERG. You can now enjoy a seamless and secure experience as you engage with our platform.</p>
                    <p><strong>Here are some benefits of having a verified KYC:</strong></p>
                    <p>We would like to take this opportunity to express our gratitude for choosing TRADERG as your trusted partner. We are committed to providing you with the best possible experience and assisting you in achieving your financial goals.</p>
                    <p>If you ever require any assistance, have questions, or need guidance regarding our services, please feel free to reach out to our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We are always here to help.</p>
                    <p>Once again, congratulations on successfully completing the KYC verification process. We look forward to a long and rewarding association with you.</p>
                    <p><strong>Welcome to TRADERG!</strong></p>
                    <p><strong>Best regards,</strong></p>
                    <p>TRADERG</p>
                </body>
                
            `
        };   
                transport.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                });

                }

            }
        }
        else if(productTitle == "pre-share"){
            if(kycData?.isVerified == true){
                updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accId},{is_kyc_completed:true},{new:true}).populate([
                    {
                        path:"product",
                        select:"title"
                    }
                ])
            }else{
                updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accId},{is_kyc_completed:req.body.is_kyc_completed,kyc_reason:req.body.kyc_reason},{new:true})

                if(updatedData?.is_kyc_completed == true){
                    updatedKyc = await Kyc.findOneAndUpdate({_id:kycData?._id},{isVerified:true},{new:true});

                var mailOptions = {
                    from: 'support@tradergwealth.com',
                    to: userData.email,
                    subject: `KYC Verification Successful - Welcome to TRADERG!`,
                    html:`
                    <head>
                    <title>KYC Verification Success - Welcome to TRADERG!</title>
                </head>
                <body>
                    <p>Dear ${userName},</p>
                    <p>We hope this email finds you well and in good spirits. We are thrilled to inform you that your KYC verification process with TRADERG has been successfully completed!</p>
                    <p>Thank you for promptly providing all the necessary documents and information required for the KYC process. Your cooperation and adherence to regulatory guidelines have made it possible for us to complete the verification smoothly.</p>
                    <p>With your KYC now verified, you have full access to all the features and services offered by TRADERG. You can now enjoy a seamless and secure experience as you engage with our platform.</p>
                    <p><strong>Here are some benefits of having a verified KYC:</strong></p>
                    <p>We would like to take this opportunity to express our gratitude for choosing TRADERG as your trusted partner. We are committed to providing you with the best possible experience and assisting you in achieving your financial goals.</p>
                    <p>If you ever require any assistance, have questions, or need guidance regarding our services, please feel free to reach out to our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We are always here to help.</p>
                    <p>Once again, congratulations on successfully completing the KYC verification process. We look forward to a long and rewarding association with you.</p>
                    <p><strong>Welcome to TRADERG!</strong></p>
                    <p><strong>Best regards,</strong></p>
                    <p>TRADERG</p>
                </body>
                
            `
        };   
                transport.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                });

                }
            }
        }
        else if(productTitle == "trading"){
            if(kycData?.isVerified == true){
                updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accId},{is_kyc_completed:true},{new:true}).populate([
                    {
                        path:"product",
                        select:"title"
                    }
                ])
            }else{
                updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accId},{is_kyc_completed:req.body.is_kyc_completed,kyc_reason:req.body.kyc_reason},{new:true})

                if(updatedData?.is_kyc_completed == true){
                    updatedKyc = await Kyc.findOneAndUpdate({_id:kycData?._id},{isVerified:true},{new:true});

                var mailOptions = {
                    from: 'support@tradergwealth.com',
                    to: userData.email,
                    subject: `KYC Verification Successful - Welcome to TRADERG!`,
                    html:`
                    <head>
                    <title>KYC Verification Success - Welcome to TRADERG!</title>
                </head>
                <body>
                    <p>Dear ${userName},</p>
                    <p>We hope this email finds you well and in good spirits. We are thrilled to inform you that your KYC verification process with TRADERG has been successfully completed!</p>
                    <p>Thank you for promptly providing all the necessary documents and information required for the KYC process. Your cooperation and adherence to regulatory guidelines have made it possible for us to complete the verification smoothly.</p>
                    <p>With your KYC now verified, you have full access to all the features and services offered by TRADERG. You can now enjoy a seamless and secure experience as you engage with our platform.</p>
                    <p><strong>Here are some benefits of having a verified KYC:</strong></p>
                    <p>We would like to take this opportunity to express our gratitude for choosing TRADERG as your trusted partner. We are committed to providing you with the best possible experience and assisting you in achieving your financial goals.</p>
                    <p>If you ever require any assistance, have questions, or need guidance regarding our services, please feel free to reach out to our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We are always here to help.</p>
                    <p>Once again, congratulations on successfully completing the KYC verification process. We look forward to a long and rewarding association with you.</p>
                    <p><strong>Welcome to TRADERG!</strong></p>
                    <p><strong>Best regards,</strong></p>
                    <p>TRADERG</p>
                </body>
                
            `
        };   
                transport.sendMail(mailOptions, function(error, info){
                    if (error) {
                      console.log(error);
                    } else {
                      console.log('Email sent: ' + info.response);
                    }
                });

                }
            }
        }
        // console.log({updatedData})

         message = {
            error: false,
            message:"Kyc update",
            data:updatedData
        }
        return res.status(200).send(message);

    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err.toString()
        }
        return res.status(200).send(message);
    }
});

// arihant account open

AccountCreationRequestRoute.patch("/update-arihant-acc/:accountCreationReqId",async(req,res)=>{
    try{
        let result = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{arihant_open_account:req.body.arihant_open_account},{new: true});
        var userData = await User.findOne({_id:result?.user});
        var userId = userData?._id;
        var userName = userData?.name;
        if(result?.arihant_open_account == false){
            var mailOptions = {
                from: 'support@tradergwealth.com',
                to: userData.email,
                subject: `Arihant open account`,
                html:`
                <head>
                <title> Arihant open account!</title>
            </head>
            <body>
                <p>Dear ${userName},</p>
                <p>Thank you for choosing Arhiant. To open an account, please follow the steps below:</p>
    <ol></ol>
      <li>Click on the "Sign Up" or "Create Account" button.</li>
      <li>Fill in the required information to create your account.</li>
      <li>Follow the verification steps sent to your email to complete the registration.</li>
    </ol>
    <p>If you have any questions or need assistance, feel free to contact our support team at support@arhiant.com.</p>
    <p>We look forward to having you as a valued customer!</p>
    <p>Best regards,<br> The Arhiant Team</p>
    <p><strong>Welcome to TRADERG!</strong></p>
    <p><strong>Best regards,</strong></p>
     <p>TRADERG</p>
    </body>
            
     `
    }; 
    transport.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });

}
        if(result){
            message = {
                error: false,
                message:"Account Creation Request updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Account Creation Request not upadated"
            };
            return res.status(200).send(message);
        }
    }catch(err){
        message = {
            error: false,
            message:"Operation Failed",
            data: err
        }
        return res.status(200).send(message);
    }
});

 module.exports = AccountCreationRequestRoute;



