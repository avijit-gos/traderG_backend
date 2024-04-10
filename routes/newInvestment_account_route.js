require("dotenv").config();
const express = require("express");
const AccountCreationRequest = require("../models/account_creation_request");
const InvestmentAccount = require("../models/newInvestment_account");
const Product = require("../models/product");
const TrdaingNewLog = require("../models/trading_log_new");
const BrokerageNewLog = require("../models/brokerage_new_log");
const InvestmentAccountRoute = express.Router();
const moment = require("moment-timezone");
const Wallet = require("../models/wallet");
const User = require("../models/user");
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
 * This method is to create InvestmentAccount
 */
 InvestmentAccountRoute.post("/create", async (req, res) => {
	try {
		let accountlist = await AccountCreationRequest.findOne({_id:req.body.accountId});

		if(accountlist?.is_inv_req_exist == true){
			message = {
				error: true,
				message: "Can not Invest",
			};
			return res.status(200).send(message);
		}else{
			const InvestmentAccountData = new InvestmentAccount(req.body);
		    const result = await InvestmentAccountData.save();

		    let accountData = await AccountCreationRequest.findOneAndUpdate({_id:result?.accountId},{is_inv_req_exist:true},{new:true});

            const WalletData = new Wallet({acc_id:result?._id,user:result?.user,product:result?.product,acc_type:"investmentAccounts",total_amount:result?.re_inv_amount});
            const WalletResult = await WalletData.save();

		//console.log("accountData>>>>",accountData)
		message = {
			error: false,
			message: "New Investment Added Successfully!",
			data: result,
		};
		return res.status(200).send(message);
		}
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
 * This method is to detail InvestmentAccount
 */

 InvestmentAccountRoute.get("/detail/:invId", async(req,res)=>{
    try{
        let investmentData = await InvestmentAccount.findOne({_id:req.params.invId}).populate([
            {
                path:"user",
                select:"fname lname"
            },
            {
                path:"accountId",
                select:" "
            },
            {
                path:"product",
                select:"title"
            },
            {
                path:"consultant_id",
                select:"name"
            }
        ])

        message ={
            error: false,
            message: "Detail account",
            data: investmentData
        };
        return res.status(200).send(message)
    }catch(err){
        message = {
            error:true,
            message:"Operation failed",
            data: err
        };
        return res.status(200).send(message)
    }
});

/**
 * This method is to find all InvestmentAccount req list
 */
 InvestmentAccountRoute.get("/req-list-by-userId-accId/:userId/:accId", async (req, res) => {
    try {
        let InvestmentAccountData = await InvestmentAccount.find({$and:[{user:req.params.userId},{accountId:req.params.accId},{is_newInv_approved:false}]}).populate([
			{
				path:"user",
				select:"fname lname"
			},
			{
				path:"accountId",
				select:""
			},
			{
				path:"product",
				select:"title"
			},
            {
                path:"consultant_id",
                select:"name"
            }
		]).sort({_id:-1});

        message = {
            error: false,
            message: "All New Investment list",
            data: InvestmentAccountData,
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

InvestmentAccountRoute.get("/list-by-userId-accId/:userId/:accId", async (req, res) => {
    try {
        let InvestmentAccountData = await InvestmentAccount.find({$and:[{user:req.params.userId},{accountId:req.params.accId},{is_newInv_approved:true}]}).populate([
			{
				path:"user",
				select:"fname lname"
			},
			{
				path:"accountId",
				select:""
			},
			{
				path:"product",
				select:"title"
			},
            {
                path:"consultant_id",
                select:"name"
            }
		]).sort({_id:-1});

        message = {
            error: false,
            message: "All New Investment list",
            data: InvestmentAccountData,
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


/**
 * This method is to find all InvestmentAccount  list by accountId
 */
 InvestmentAccountRoute.get("/req-list-by-productId-accid/:proId/:accId", async (req, res) => {
    try {
        let InvestmentAccountData = await InvestmentAccount.find({$and:[{product:req.params.proId},{accountId:req.params.accId},{is_newInv_approved:false}]}).populate([
			{
				path:"user",
				select:"fname lname"
			},
			{
				path:"accountId",
				select:""
			},
			{
				path:"product",
				select:"title"
			},
            {
                path:"consultant_id",
                select:"name"
            }
		]).sort({_id:-1});

        message = {
            error: false,
            message: "New investment list",
            data: InvestmentAccountData,
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

InvestmentAccountRoute.get("/list-by-productId-accid/:proId/:accId", async (req, res) => {
    try {
        let InvestmentAccountData = await InvestmentAccount.find({$and:[{product:req.params.proId},{accountId:req.params.accId},{is_newInv_approved:true}]}).populate([
			{
				path:"user",
				select:"fname lname"
			},
			{
				path:"accountId",
				select:""
			},
			{
				path:"product",
				select:"title"
			},
            {
                path:"consultant_id",
                select:"name"
            }
		]).sort({_id:-1});

		console.log("InvestmentAccountData",InvestmentAccountData)

        message = {
            error: false,
            message: "New investment list",
            data: InvestmentAccountData,
        };
        res.status(200).send(message);
    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err.toString(),
        };
        res.status(200).send(message);
    }
});


/**
 * This method is to detail InvestmentAccount status update
 *  @param str settingsId
 */
 InvestmentAccountRoute.patch("/update-topup/:invId", async (req, res) => {
	try {
		const result = await InvestmentAccount.findOneAndUpdate({ _id: req.params.invId },{is_newInv_approved:req.body.is_newInv_approved},{new: true});
		let reInvAmount = result?.re_inv_amount
		let reInvDate = result?.re_inv_date
		let tenureData = result?.tenure
        let typeData = result?.type

        console.log(tenureData);
        console.log(typeData);
		var updatedData;
		var newInvData;
		if(result?.is_newInv_approved == true){
			let accountData = await AccountCreationRequest.findOne({_id:result?.accountId});
			console.log("accountData",accountData);
			const pId = result?.product
			const productData = await Product.findOne({_id:pId});
			const productTitle = productData?.title
			console.log(productTitle);
			if(productTitle == "holding"){
				let oldCapital = accountData?.capital;
				let oldTenure = accountData?.tenure;
				let oldTenureType = accountData?.type;
				let oldMaturityDate = accountData?.holding_details?.maturity_date;
				let oldMonthlyReturn = accountData?.holding_details?.monthly_return_amount;
				let oldTotalReturn = accountData?.holding_details?.total_return;
				let oldReturnSlab = accountData?.holding_details?.return_slab;
				
  
				let new_total = ((accountData?.capital) + (result?.re_inv_amount)).toFixed(2);
				let rate = result?.holding_details?.monthly_return_rate;
				let monthlyReturn = (new_total * rate)/100;
				let returnSlab = rate *12;

                console.log({returnSlab})
                //let returnSlab =  monthlyReturn;
                let returnmain = accountData?.holding_details?.monthly_return_amount + monthlyReturn;


				let maturity_date = moment(new Date()).add(tenureData, typeData).format();
                console.log(new Date(maturity_date));
    
                const startDate = moment(result?.re_inv_date);
                console.log(startDate);
                const endDate = moment(new Date());
                console.log(endDate);
    
                let monthDiff = endDate.diff(startDate, 'months');
    
                console.log("monthDiff",monthDiff);
    
                let total_return = ((new_total * monthlyReturn)/100)*monthDiff;

				console.log("total_return>>>>",total_return);



				updatedData = await AccountCreationRequest.findOneAndUpdate({_id:result?.accountId},{capital:new_total,tenure:tenureData,type:typeData,old_capital:oldCapital,old_tenure:oldTenure,old_tenure_type:oldTenureType,re_inv_date:reInvDate,"holding_details.re_inv_amount":reInvAmount,"holding_details.old_return_slab":oldReturnSlab,"holding_details.old_maturity_date":oldMaturityDate,"holding_details.old_monthly_return":oldMonthlyReturn,"holding_details.old_total_return":oldTotalReturn,"holding_details.return_slab":returnSlab,"holding_details.maturity_date":maturity_date,"holding_details.total_return":total_return,"holding_details.monthly_return_amount":returnmain,is_inv_req_exist:false},{new: true}).populate([
					{
						path:"product",
						select:"title"
					}
				]);

				newInvData = await InvestmentAccount.findOneAndUpdate({_id:req.params.invId},{"holding_details.monthly_return_amount":monthlyReturn,"holding_details.total_return":total_return,"holding_details.maturity_date":maturity_date,"holding_details.return_slab":returnSlab},{new:true}).populate([
					{
						path:"product",
						select:"title"
					}
				]);

			}
			else if(productTitle == "pre-share"){
				let oldCapital = accountData?.capital;
				let oldTenure = accountData?.tenure;
				let oldTenureType = accountData?.type;
				let oldShare = accountData?.pre_share_details?.share;
				let oldFixedDividendAmount = accountData?.pre_share_details?.fixed_dividend_amount;
				let oldMonthlyDividendAmount = accountData?.pre_share_details?.monthly_dividend_amount;

				let rate = result.pre_share_details.monthly_return_rate
				let new_total = ((accountData?.capital) + (result?.re_inv_amount)).toFixed(2);
				let shareData = new_total/10;
				let fixedDividendAmount = (new_total * rate)/100;

				const startDate = moment(result?.re_inv_date);
               console.log(startDate);
               const endDate = moment(new Date());
               console.log(endDate);
    
               let monthDiff = endDate.diff(startDate, 'months');
    
               console.log("monthDiff",monthDiff);
    
                let monthly_dividend_amount = (fixedDividendAmount * monthDiff );

                console.log("fixedDividendAmount>>>>>",fixedDividendAmount)

                console.log("monthly_dividend_amount>>>>>",monthly_dividend_amount);

				updatedData = await AccountCreationRequest.findOneAndUpdate({_id:result?.accountId},{capital:new_total,tenure:tenureData,type:typeData,old_capital:oldCapital,old_tenure:oldTenure,old_tenure_type:oldTenureType,re_inv_date:reInvDate,"pre_share_details.old_share":oldShare,"pre_share_details.old_fixed_dividend_amount":oldFixedDividendAmount,"pre_share_details.old_monthly_dividend_amount":oldMonthlyDividendAmount,"pre_share_details.share":shareData,"pre_share_details.fixed_dividend_amount":fixedDividendAmount,"pre_share_details.monthly_dividend_amount":monthly_dividend_amount,is_inv_req_exist:false},{new: true}).populate([
					{
						path:"product",
						select:"title"
					}
				]);

				newInvData = await InvestmentAccount.findOneAndUpdate({_id:req.params.invId},{"pre_share_details.fixed_dividend_amount":fixedDividendAmount,"pre_share_details.monthly_dividend_amount":monthly_dividend_amount,"pre_share_details.share":shareData},{new:true}).populate([
					{
						path:"product",
						select:"title"
					}
				]);
    
			}
			else if(productTitle == "trading"){
				let oldCapital = accountData?.capital;
				let oldTenure = accountData?.tenure;
				let oldTenureType = accountData?.type;
				let oldTurnover = accountData?.trading_details?.turnover;
				let oldBrokerage = accountData?.trading_details?.brokerage;
				let oldMtm = accountData?.trading_details?.mtm;

				let new_total =  ((accountData?.capital) + (result?.re_inv_amount)).toFixed(2);

				let applicationId = accountData?.application_id;
    
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
                });

				updatedData = await AccountCreationRequest.findOneAndUpdate({_id:result?.accountId},{capital:new_total,old_capital:oldCapital,old_tenure:oldTenure,old_tenure_type:oldTenureType,tenure:tenureData,type:typeData,"trading_details.new_trade_amt":reInvAmount,"trading_details.old_turnover":oldTurnover,"trading_details.old_brokerage":oldBrokerage,"trading_details.old_mtm":oldMtm,"trading_details.turnover":totalturvover,"trading_details.brokerage":totalBrok,"trading_details.mtm":totalmtm,is_inv_req_exist:false},{new: true}).populate([
					{
						path:"product",
						select:"title"
					}
				]);

				newInvData = await InvestmentAccount.findOneAndUpdate({_id:req.params.invId},{"trading_details.turnover":totalturvover,"trading_details.brokerage":totalBrok,"trading_details.mtm":totalmtm},{new:true}).populate([
					{
						path:"product",
						select:"title"
					}
				]);
			}

		}
		if (result) {
			message = {
				error: false,
				message: "Investment status updated successfully!",
				data: updatedData,
                newInvData
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Helpline message not updated",
			};
			res.status(200).send(message);
		}
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: err.toString(),
		};
		res.status(200).send(message);
	}
});

////////////////////////////////// new investment account  req list /////////////////////////

InvestmentAccountRoute.get("/invested-account",async(req,res)=>{
	try {
        let AccountData = await AccountCreationRequest.find({$and:[{product:req.query.product},{is_inv_req_exist:true}]}).populate([
			{
                path:"user",
                select:"fname lname name email mobile address city state pin_code"
            },
            {
                path:"product",
                select:"title"
            }
		]).sort({_id:-1});


        message = {
            error: false,
            message: "New invested account list",
            data: AccountData,
        };
        res.status(200).send(message);
    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err.toString(),
        };
        res.status(200).send(message);
    }
});


InvestmentAccountRoute.get("/comp-account",async(req,res)=>{
	try {
        let AccountData = await AccountCreationRequest.find({$and:[{product:req.query.product},{is_inv_req_exist:false}]}).populate([
			{
                path:"user",
                select:"fname lname name email mobile address city state pin_code"
            },
            {
                path:"product",
                select:"title"
            }
		]).sort({_id:-1});


        message = {
            error: false,
            message: "New invested account list",
            data: AccountData,
        };
        res.status(200).send(message);
    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err.toString(),
        };
        res.status(200).send(message);
    }
});

////////////////////////////////// new investment account user update/////////////////////////

InvestmentAccountRoute.patch("/user-invupdate-data/:invId",async(req,res)=>{
    try{
        const result = await InvestmentAccount.findOne({ _id: req.params.invId });
        let pid = result?.product;
        console.log("pid>>>>",pid);
     
        const productData = await Product.findOne({_id:pid});
        const productTitle = productData?.title
        console.log("productTitle>>>>>>",productTitle);
        var updatedData;
        if(productTitle == "holding"){
            let holdingPaymentFile = req.body.holding_payment_file;
            let holdingPaymentDetail = req.body.holding_payment_detail;

            updatedData = await InvestmentAccount.findOneAndUpdate({_id:req.params.invId},{user_aggrement_completed:req.body.user_aggrement_completed,user_payment_completed:req.body.user_payment_completed,user_signed_file:req.body.user_signed_file,"holding_details.holding_payment_file":holdingPaymentFile,"holding_details.holding_payment_detail":holdingPaymentDetail},{new: true}).populate([
                {
                    path:"product",
                    select:"title"
                }
            ]);

        }
        else if(productTitle == "pre-share"){
            let presharePaymentFile = req.body.pre_share_payment_file;
            let presharePaymentDetail = req.body.pre_share_payment_detail;

            updatedData = await InvestmentAccount.findOneAndUpdate({_id:req.params.invId},{user_aggrement_completed:req.body.user_aggrement_completed,user_payment_completed:req.body.user_payment_completed,user_signed_file:req.body.user_signed_file,"pre_share_details.pre_share_payment_file":presharePaymentFile,"pre_share_details.pre_share_payment_detail":presharePaymentDetail},{new: true}).populate([
                {
                    path:"product",
                    select:"title"
                }
            ]);
        }
        
        if(updatedData){
            message = {
                error: false,
                message:"New Investment Request updated successfully",
                data: updatedData,
                //holdingData
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "New Investment Request not upadated"
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


///////////////////////////////////////////// Admin update //////////////////////////////

InvestmentAccountRoute.patch("/admin-data/:invId",async(req,res)=>{
    try{
        const result = await InvestmentAccount.findOne({$and:[{_id:req.params.invId},{is_newInv_approved:false}]});
		let pid = result?.product;
        console.log("pid>>>>",pid);
     
        const productData = await Product.findOne({_id:pid});
        const productTitle = productData?.title;
        console.log("productTitle>>>>>>",productTitle);
        var updatedData;
		if(productTitle == "holding"){
			updatedData = await InvestmentAccount.findOneAndUpdate({_id:req.params.invId},{is_payment_completed:req.body.is_payment_completed,is_aggrement_completed:req.body.is_aggrement_completed,agreement_file:req.body.agreement_file},{new:true})
		}else if(productTitle == "pre-share"){
			updatedData = await InvestmentAccount.findOneAndUpdate({_id:req.params.invId},{is_payment_completed:req.body.is_payment_completed,is_aggrement_completed:req.body.is_aggrement_completed,agreement_file:req.body.agreement_file},{new:true})
        };

        let datalist = await InvestmentAccount.findOne({_id:req.params.invId});

        console.log({datalist});
        const userData = await User.findOne({_id:datalist?.user});
        const userName = userData?.name;
        console.log({userName});
        const aggrement = datalist?.agreement_file;
        console.log({aggrement});
        const accountId = datalist?._id;
        console.log({accountId});
        
        if(datalist.agreement_file != null){

            var mailOptions = {
                from: 'support@tradergwealth.com',
                to: userData.email,
                subject: `Action Required - Verify the link`,
                html:`
                <head>
                <title>Request for Document Signature - TRADERG</title>
            </head>
            <body>
                <p>Dear ${userName} ,</p>
                <p>I hope this email finds you well. We appreciate your prompt response regarding the document [Document Name], and we kindly request your further action to complete the process.</p>
                <p>We require your signature on the provided document. Please follow the steps below to sign and upload the document securely:</p>
                <ol>
                    <li>Download the Document: Click on the link provided below to download the document. <br><a href="${aggrement}" style="color:blue">Document Download Link</a></li>
                    <p>Find the link :<br>
                    <a href="45.113.122.201/dev/tradergv6/#/thankingyou/${accountId}" target="blank" style="display: inline-block;font-size: 16px;color: #ffffff;letter-spacing: 0.5px;padding: 8px 50px;background-color: dodgerblue;border-radius: 6px;margin-top: 10px;">I agree</a>
                  </p>
    
                </ol>
                <p>Please ensure that the uploaded document is clear, legible, and includes your signature on all required pages.</p>
                <p>The deadline for submitting the signed document is [Deadline Date]. If you encounter any challenges or have any questions, feel free to contact our team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We are always here to help.</p>
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


        if(result){
            message = {
                error: false,
                message:"New Investment Request updated successfully",
                data: updatedData,
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "New Investment Request not upadated"
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

////////////////////////////// account open update //////////////////////////

InvestmentAccountRoute.get("/acc-opened/:invId",async(req,res)=>{
    try{
        const result = await InvestmentAccount.findOne({$and:[{_id:req.params.invId},{is_newInv_approved:false}]});
		let pid = result?.product;
        console.log("pid>>>>",pid);
     
        const productData = await Product.findOne({_id:pid});
        const productTitle = productData?.title;
        console.log("productTitle>>>>>>",productTitle);
        var updatedData;
        var WalletData;
        var walletId = "WA" + Math.floor(1000 + Math.random() * 9000);
		if(productTitle == "holding"){
            updatedData = await InvestmentAccount.findOneAndUpdate({_id:req.params.invId},{is_account_opened:true, wallet_id:walletId},{new:true});
            
            WalletData = await Wallet.findOneAndUpdate({acc_id:req.params.invId},{wallet_id:walletId},{new:true});
		}else if(productTitle == "pre-share"){
            updatedData = await InvestmentAccount.findOneAndUpdate({_id:req.params.invId},{is_account_opened:true, wallet_id:walletId},{new:true});
            
            WalletData = await Wallet.findOneAndUpdate({acc_id:req.params.invId},{wallet_id:walletId},{new:true});
		}


        if(result){
            message = {
                error: false,
                message:"New Investment Request updated successfully",
                data: updatedData,
                WalletData
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "New Investment Request not upadated"
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










module.exports = InvestmentAccountRoute;
