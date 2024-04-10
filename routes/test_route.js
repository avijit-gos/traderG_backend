
require("dotenv").config();
const express = require("express");
const AccountCreationRequest = require("../models/account_creation_request");
const TestRoute = express.Router();
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
// const moment = require("moment");

const nodemailer = require("nodemailer");


var transport = nodemailer.createTransport({
    host: "mail.demo91.co.in",
    port: 465,
    auth: {
      user: "developer@demo91.co.in",
      pass: "Developer@2023"
    }
  });


  TestRoute.patch("/update-account/:accountCreationReqId",async(req,res)=>{
    try{
        let result = await AccountCreationRequest.findOne({_id:req.params.accountCreationReqId});

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
            from: 'developer@demo91.co.in',
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


//////////////////////////////////// topup create ///////////////////////////////////////

TestRoute.patch("/topup-create/:accountCreationReqId", async (req, res) => {
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

              updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{capital:new_total,tenure:tenureData,type:typeData,old_capital:oldCapital,old_tenure:oldTenure,old_tenure_type:oldTenureType,re_inv_date:reInvDate,"holding_details.re_inv_amount":reInvAmount,"holding_details.old_return_slab":oldReturnSlab,"holding_details.old_maturity_date":oldMaturityDate,"holding_details.old_monthly_return":oldMonthlyReturn,"holding_details.old_total_return":oldTotalReturn,"holding_details.return_slab":returnSlab,"holding_details.maturity_date":"","holding_details.total_return":""},{new: true}).populate([
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

           updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{capital:new_total,tenure:tenureData,type:typeData,old_capital:oldCapital,old_tenure:oldTenure,old_tenure_type:oldTenureType,re_inv_date:reInvDate,"pre_share_details.old_share":oldShare,"pre_share_details.old_fixed_dividend_amount":oldFixedDividendAmount,"pre_share_details.old_monthly_dividend_amount":oldMonthlyDividendAmount,"pre_share_details.share":shareData,"pre_share_details.fixed_dividend_amount":fixedDividendAmount,"pre_share_details.monthly_dividend_amount":""},{new: true}).populate([
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

            updatedData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{capital:new_total,old_capital:oldCapital,old_tenure:oldTenure,old_tenure_type:oldTenureType,tenure:tenureData,type:tenureTypeData,"trading_details.new_trade_amt":newTradeamount,"trading_details.old_turnover":oldTurnover,"trading_details.old_brokerage":oldBrokerage,"trading_details.old_mtm":oldMtm,"trading_details.turnover":"","trading_details.brokerage":"","trading_details.mtm":""},{new: true}).populate([
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


module.exports = TestRoute;