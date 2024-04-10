require("dotenv").config();
const express = require("express");
const BankAccount = require("../models/bank_account");
const BankAccountRoute = express.Router();

/**
 * This method is used for create bank account
 */

// BankAccountRoute.post("/create",async(req,res)=>{
//     try{
//         const BankAccountData = new BankAccount(req.body);
//         const result = await BankAccountData.save();

//         message = {
//             error:false,
//             message:"Bank Account created successfully",
//             data:result
//         };
//         return res.status(200).send(message);
//     }catch(err){
//         message = {
//             error:true,
//             message:"Operation Failed"
//         };
//         return res.status(200).send(message);
//     }
// });

/**
 * This method is used for list
 */

 BankAccountRoute.get("/list",async(req,res)=>{
    try{
        let BankAccountData = await BankAccount.find({}).populate([
            {
                path:"user",
                select:"fname lname mobile address city state pin_code"
            }
        ]).sort({_id:-1});

        message = {
            error:false,
            message:"list of all Bank Account",
            data:BankAccountData
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
 * This method is used for list by userId
 */

 BankAccountRoute.get("/list-by-userId/:userId",async(req,res)=>{
    try{
        let BankAccountData = await BankAccount.findOne({user:req.params.userId}).populate([
            {
                path:"user",
                select:"fname lname mobile address city state pin_code"
            }
        ]);

        message = {
            error:false,
            message:"list of Bank Account",
            data:BankAccountData
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
 * This method is used for update Bank account
 * * @param str bankAccountId
 */

 BankAccountRoute.patch("/update/:bankAccountId",async(req,res)=>{
    try{
        let result = await BankAccount.findOneAndUpdate({_id:req.params.bankAccountId},req.body,{new: true}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ]);
        if(result){
            message = {
                error: false,
                message:"BankAccount updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "BankAccount not upadated"
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

/**
 * This method is to detail Bank Account
 * @param str bankAccountId
 */

 BankAccountRoute.get("/detail/:bankaccId",async(req,res)=>{
    try{
        let BankAccountData = await BankAccount.findOne({_id:req.params.bankaccId}).populate([
            {
                path:"user",
                select:"fname lname mobile address city state pin_code"
            }
        ]);

        message = {
            error:false,
            message:"Detail Bank Account",
            data:BankAccountData
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
 * This method is to delete Bank Account
 * @param str bankAccountId
 */

 BankAccountRoute.delete("/delete/:bankAccountId", async (req, res) => {
    try {
        const result = await BankAccount.deleteOne({
            _id: req.params.bankAccountId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Bank Account deleted successfully!",
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
 module.exports = BankAccountRoute;





