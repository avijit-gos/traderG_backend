require("dotenv").config();
const express = require("express");
const HoldingWallet = require("../models/holding_wallet");
const HoldingWalletRoute = express.Router();

/**
 * This method is used for create HoldingWallet
 */

 HoldingWalletRoute.post("/create",async(req,res)=>{
   try{
    const HoldingWalletData = new HoldingWallet(req.body);
    const result = await HoldingWalletData.save();
    message = {
        error:false,
        message:"HoldingWallet data added successfully",
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

HoldingWalletRoute.get("/list",async(req,res)=>{
    try{
        let HoldingWalletData = await HoldingWallet.find({}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ]);

        message = {
            error:true,
            message:"list of all Holding Wallet",
            data:HoldingWalletData
        };
        res.status(200).send(message)
    }catch(err){
        message = {
            error:false,
            message:"Operation Failed",
            data:err
        };
        res.status(200).send(message)
    }
});

 /**
 * This method is used for list of HoldingWallet
 */

HoldingWalletRoute.get("/list-by-id/:userId/:holdingId",async(req,res)=>{
    try{
        let HoldingWalletData = await HoldingWallet.find({$and:[{user:req.params.userId},{holding_id:req.params.holdingId}]}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ]);

        message = {
            error:true,
            message:"list of all Holding Wallet",
            data:HoldingWalletData
        };
        res.status(200).send(message)
    }catch(err){
        message = {
            error:false,
            message:"Operation Failed",
            data:err
        };
        res.status(200).send(message)
    }
});

/**
 * This method is used for list of HoldingWallet by userId
 */

 HoldingWalletRoute.get("/list-by-userId/:userId",async(req,res)=>{
    try{
        let HoldingWalletData = await HoldingWallet.find({user:req.params.userId}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ]);

        message = {
            error:true,
            message:"list of Holding Wallet",
            data:HoldingWalletData
        };
        res.status(200).send(message)
    }catch(err){
        message = {
            error:false,
            message:"Operation Failed",
            data:err
        };
        res.status(200).send(message)
    }
});

/**
 * This method is to find block/unblock HoldingWallet
 */

 HoldingWalletRoute.get("/toggle-status",async(req,res)=>{
    try{
        let HoldingWalletData = await HoldingWallet.find({status:true}).sort({_id:-1});

        message = {
            error: false,
            message:"list of Holding Wallet",
            data:HoldingWalletData
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

 HoldingWalletRoute.patch("/update/:holdingwalletId",async(req,res)=>{
    try{
        let result = await HoldingWallet.findOneAndUpdate({_id:req.params.holdingwalletId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"HoldingWallet updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "HoldingWallet not upadated"
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
 * This method is to delete Holding 
 * @param str holdingwalletId
 */

 HoldingWalletRoute.delete("/delete/:holdingwalletId", async (req, res) => {
    try {
        const result = await HoldingWallet.deleteOne({
            _id: req.params.holdingwalletId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "HoldingWallet deleted successfully!",
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
 module.exports = HoldingWalletRoute;
