require("dotenv").config();
const express = require("express");
const Withdrawal = require("../models/withdrawal");
const WithdrawalRoute = express.Router();
const moment = require("moment-timezone");
const AccountCreationRequest = require("../models/account_creation_request");
const isAuthenticate = require("../middleware/authcheck");
const Wallet = require("../models/wallet");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const sendNotification = require("../helper/sendNotification");


var transport = nodemailer.createTransport({
    host: "mail.tradergwealth.com",
    port: 465,
    auth: {
      user: "support@tradergwealth.com",
      pass: "Traderg@123"
    }
  });



/**
 * This method is used for create Withdrawal
 */

 WithdrawalRoute.post("/create",async(req,res)=>{
    try{
        const WithdrawalData = new Withdrawal(req.body);
        const result = await WithdrawalData.save();
        // const accountId = result?.acc_id;
        // const amountdata = result?.amount
        // console.log("accountId>>>>>>>",accountId);
        // console.log("amountdata>>>>>>>",amountdata);
        // // const walletData = await Wallet.findOneAndUpdate(
        // //     {acc_id:req.body.acc_id},
        // //     {
        // //         '$inc': { 'total_amount': -amountdata }, 
        // //         '$push': { 
        // //             passbook_amt: { 
        // //                 amount: req.body.amount , 
        // //                 comment: req.body.comment , 
        // //                 type: "debit" 
        // //             }
        // //         }
        // //     },
        // //     {new:true});

        // // console.log("walletData>>>>>",walletData);
        const userData = await User.findOne({_id:result?.user});
        const userName = userData?.name;
        var mailOptions = {
            from: 'support@tradergwealth.com',
            to: userData.email,
            subject: `Withdrawal Request Confirmation`,
            html:`
            <head>
            <title>Confirmation of Withdrawal Request - TRADERG</title>
        </head>
        <body>
            <p>Dear ${userName},</p>
            <p>I hope this email finds you well. We are writing to confirm that we have received your withdrawal request for your [Account/Investment] with TRADERG.</p>
            <p><strong>Withdrawal Details:</strong></p>
            <p>Amount: ${result.amount}</p>
            <p>Date of Request: ${moment(result.createdAt).format("DD-MM-YYYY")} </p>
            <p>Payment Method: Online </p>
            <p>Please note that processing times may vary depending on the payment method and other factors. Rest assured, our team is working diligently to ensure a smooth and prompt withdrawal process.</p>
            <p>If you have any questions or concerns regarding your withdrawal, please feel free to reach out to our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We are here to assist you every step of the way.</p>
            <p>Thank you for choosing TRADERG! We value your trust in our services, and we will do our best to meet your expectations.</p>
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
            title: "Withdrawal Request Created",
            description: "Withdrawal Request Created"
        });

        message = {
            error:false,
            message:"Withdrawal data added successfully",
            data:result
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




/**
 * This method is used for list by userId of Withdrawal
 */

   WithdrawalRoute.get("/list-by-userId/:userId",isAuthenticate,async(req,res)=>{
    try{
        let WithdrawalData = await Withdrawal.find({$and:[{user:req.params.userId},{status:true}]}).populate([
            {
                path:"user",
                select:"fname lname email mobile"
            },
            {
                path:"product",
                select:"title"
            }
        ]);

        message = {
            error:false,
            message:"list of Withdrawal",
            data:WithdrawalData
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
 * This method is used for list by userId of Withdrawal
 */

//  WithdrawalRoute.get("/list-by-userId-holdingId/:userId/:holdingId",async(req,res)=>{
//     try{
//         let WithdrawalData = await Withdrawal.find({$and:[{user:req.params.userId},{holding_id:req.params.holdingId}]}).populate([
//             {
//                 path:"user",
//                 select:"fname lname email mobile"
//             }
//         ]);

//         message = {
//             error:true,
//             message:"list of Withdrawal",
//             data:WithdrawalData
//         };
//         res.status(200).send(message)
//     }catch(err){
//         message = {
//             error:false,
//             message:"Operation Failed",
//             data:err
//         };
//         res.status(200).send(message)
//     }
// });

/**
 * This method is used for list by userId and productId of Withdrawal
 */

 WithdrawalRoute.get("/list-by-id/:userId/:product_detail_id",async(req,res)=>{
    try{
        let WithdrawalData = await Withdrawal.find({$and:[{user:req.params.userId},{product_detail_id:req.params.product_detail_id}]}).populate([
            {
                path:"user",
                select:"fname lname email mobile"
            }
        ]);

        message = {
            error:false,
            message:"list of Withdrawal",
            data:WithdrawalData
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
 * This method is used for list of Withdrawal
 */

 WithdrawalRoute.get("/list",async(req,res)=>{
    try{
        let WithdrawalData = await Withdrawal.find({$and:[{product:req.query.product},{status:true}]}).populate([
            {
                path:"user",
                select:"fname lname email mobile"
            }
        ]);
        
        let customWithdrawalData = JSON.parse(JSON.stringify(WithdrawalData))

        customWithdrawalData.map(e => {
			e.createdDateTime =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD,YYYY-h:mm:ss a');
            e.createdDate =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD YYYY');
			return e
		})


        message = {
            error:false,
            message:"list of all Withdrawal",
            data:customWithdrawalData
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
 * This method is used for request list of Withdrawal
 */

 WithdrawalRoute.get("/request-list",async(req,res)=>{
    try{
        let WithdrawalData = await Withdrawal.find({$and:[{$or:[{ product:req.query.product},{user:req.query.user}]},{status:false}]}).populate([
            {
                path:"user",
                select:"fname lname email mobile"
            },
            {
                path:"product",
                select:"title"
            }
        ]).sort({_id:-1});
        
        let customWithdrawalData = JSON.parse(JSON.stringify(WithdrawalData))

        customWithdrawalData.map(e => {
			e.createdDateTime =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD,YYYY-h:mm:ss a');
            e.createdDate =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD YYYY');
			return e
		})


        message = {
            error:false,
            message:"list of all Withdrawal",
            data:customWithdrawalData
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
 * This method is to find block/unblock Withdrawal
 */

//  WithdrawalRoute.get("/toggle-status",async(req,res)=>{
//     try{
//         let WithdrawalData = await Withdrawal.find({status:true}).sort({_id:-1});

//         message = {
//             error: false,
//             message:"list of Withdrawal",
//             data:WithdrawalData
//         }
//         return res.status(200).send(message);

//     }catch(err){
//         message = {
//             error: true,
//             message:"Operation Failed",
//             data: err
//         }
//         return res.status(200).send(message);
//     }
// });

/**
 * This method is to upadte Withdrawal
 * @param str withdrawalId
 */

 WithdrawalRoute.patch("/update/:withdrawalId",isAuthenticate,async(req,res)=>{
    try{
        let result = await Withdrawal.findOneAndUpdate({_id:req.params.withdrawalId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"Withdrawal updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Withdrawal not upadated"
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
 * detail withdrawal account
 */

 WithdrawalRoute.get("/detail/:withdrawalId",isAuthenticate,async(req,res)=>{
    try{
        let WithdrawalData = await Withdrawal.findOne({_id:req.params.withdrawalId}).populate([
            {
                path:"user",
                select:"fname lname email mobile address city state pin_code"
            },
            {
                path:"product",
                select:"title"
            }
        ]).sort({_id:-1});

        // let accountId = WithdrawalData?.acc_id
        // //console.log(accountId);

        // let AccountCreationRequestData = await AccountCreationRequest.find({_id:{$in:accountId}});



        message = {
            error: false,
            message:"Detail for Withdrawal Data",
            data:WithdrawalData
            //AccountCreationRequestData
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
 * detail withdrawal account for admin
 */

 WithdrawalRoute.get("/withdrawl-detail/:withdrawalId",async(req,res)=>{
    try{
        let WithdrawalData = await Withdrawal.findOne({_id:req.params.withdrawalId}).populate([
            {
                path:"user",
                select:"fname lname email mobile address city state pin_code"
            },
            {
                path:"product",
                select:"title"
            }
        ]).sort({_id:-1});

        let accountId = WithdrawalData?.acc_id
        // console.log(accountId);

        let AccountCreationRequestData = await AccountCreationRequest.find({_id:{$in:accountId}});

        // console.log("AccountCreationRequestData.....",AccountCreationRequestData);

        message = {
            error: false,
            message:"Detail for Withdrawal Data",
            data:WithdrawalData,
            AccountCreationRequestData
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
 * This method is to upadte Withdrawal status
 * @param str withdrawalId
 */

 WithdrawalRoute.patch("/update-status/:withdrawalId",async(req,res)=>{
    try{
        let result = await Withdrawal.findOneAndUpdate({_id:req.params.withdrawalId},{status:req.body.status},{new: true});
        console.log("status>>>>>",result?.status);
        const accountId = result?.acc_id;
        const amountdata = result?.amount;
        const commentdata = result?.comment;
        const transactionId = result?.transaction_id;
        const transactionDetail = result?.transaction_detail;
        const withdrawlDate = result?.createdAt;
        if(result?.status == true){
            const walletData = await Wallet.findOneAndUpdate(
                {acc_id:accountId},
                {
                    '$inc': { 'total_amount': -amountdata }, 
                    '$push': { 
                        passbook_amt: { 
                            amount: amountdata , 
                            comment: commentdata , 
                            type: "debit" ,
                            date: withdrawlDate,
                            transaction_id:transactionId,
                            transaction_detail:transactionDetail
                        }
                    }
                },
                {new:true});
    
            console.log("walletData>>>>>",walletData);
        }
        const userData = await User.findOne({_id:result?.user});
        const userName = userData?.name;
        var mailOptions = {
            from: 'support@tradergwealth.com',
            to: userData.email,
            subject: `Withdrawal Process Completed - Funds Successfully Transferred`,
            html:`
            <head>
            <title>Withdrawal Confirmation - TRADERG</title>
        </head>
        <body>
            <p>Dear ${userName},</p>
            <p>I hope this email finds you well. We are pleased to inform you that the withdrawal process for your [Account/Investment] with TRADERG has been successfully completed.</p>
            <p><strong>Withdrawal Details:</strong></p>
            <p>Amount: ${result.amount} </p>
            <p>Date of Request: ${moment(result.createdAt).format("DD-MM-YYYY")} </p>
            <p>Payment Method: Online </p>
            <p>Transaction ID: ${result.transaction_id} </p>
            <p>Your funds have been transferred to the designated account associated with your withdrawal request. Depending on the payment method and financial institution involved, it may take a short while for the funds to reflect in your account.</p>
            <p>We advise you to check your account balance or statement to confirm the successful receipt of the withdrawal amount. If you encounter any discrepancies or have concerns regarding the transaction, please do not hesitate to contact our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We are here to assist you and ensure a smooth withdrawal experience.</p>
            <p>Thank you for choosing TRADERG! We truly value your trust and look forward to assisting you with any future financial needs.</p>
            <p>Wishing you continued success and prosperity!</p>
            <p><strong>Best regards,</strong></p>
            <p>TRADERG</p>
        </body>
        </html> 
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
            title: "Withdrawal Confirmation",
            description: "Withdrawal Confirmation"
        });

        if(result){
            message = {
                error: false,
                message:"Withdrawal status updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Withdrawal status not upadated"
            };
            return res.status(200).send(message);
        }

    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err.toString()
        }
        return res.status(200).send(message);
    }
});

/////////////////////////////////////update status ///////////////////////////////


WithdrawalRoute.patch("/add-transaction/:withdrawalId",async(req,res)=>{
    try{
        let result = await Withdrawal.findOneAndUpdate({_id:req.params.withdrawalId},{transaction_id:req.body.transaction_id,transaction_detail:req.body.transaction_detail,bank:req.body.bank,payment_method:req.body.payment_method},{new: true}).populate([
            {
                path:"bank",
                select:"name"
            }
        ]);
        if(result){
            message = {
                error: false,
                message:"Withdrawal transaction data updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Withdrawal transaction data  not upadated"
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


// WithdrawalRoute.patch("/add-details/:withdrawalId",async(req,res)=>{
//     try{
//         let result = await Withdrawal.findOne({_id:req.params.withdrawalId});
//         console.log("result>>>>>",result?.status);
//         const accountId = result?.acc_id;
//         const amountdata = result?.amount;
//         const commentdata = result?.comment
//         let walletData;
//         if(result?.status == true){
//             const walletData = await Wallet.findOneAndUpdate(
//                 {acc_id:accountId},
//                 {
//                     '$inc': { 'total_amount': -amountdata }, 
//                     '$push': { 
//                         passbook_amt: { 
//                             amount: amountdata , 
//                             comment: commentdata , 
//                             type: "debit" ,
//                             transaction_id:req.body.transaction_id,
//                             transaction_detail:req.body.transaction_detail
//                         }
//                     },
//                     // transaction_id:req.body.transaction_id,
//                     // transaction_detail:req.body.transaction_detail
//                 },
//                 {new:true});
    
//            // console.log("walletData>>>>>",walletData);
//             message = {
//                 error: false,
//                 message:"passbook detail",
//                 data: walletData
//             };
//             return res.status(200).send(message);
//         }else{
//             message = {
//                 error: true,
//                 message:"passbook detail not found",
//             };
//             return res.status(200).send(message);
//         }
//     }catch(err){
//         message = {
//             error: true,
//             message:"Operation Failed",
//             data: err
//         }
//         return res.status(200).send(message);
//     }
// });


/////////////////////////////////  withdrawl list (new) ////////////////////////
WithdrawalRoute.get("/data-list",async(req,res)=>{
    try{
        let WithdrawalData = await Withdrawal.find({product:req.query.product}).populate([
            {
                path:"user",
                select:"fname lname email mobile"
            }
        ]).sort({_id:-1});
        
        let customWithdrawalData = JSON.parse(JSON.stringify(WithdrawalData))

        customWithdrawalData.map(e => {
			e.createdDateTime =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD,YYYY-h:mm:ss a');
            e.createdDate =  moment(e?.createdAt).tz("Asia/Kolkata").format('MMM DD YYYY');
			return e
		})


        message = {
            error:false,
            message:"list of all Withdrawal",
            data:customWithdrawalData
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
 * This method is to delete Holding 
 * @param str withdrawalId
 */

 WithdrawalRoute.delete("/delete/:withdrawalId", async (req, res) => {
    try {
        const result = await Withdrawal.deleteOne({
            _id: req.params.withdrawalId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Withdrawal deleted successfully!",
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


module.exports = WithdrawalRoute;
