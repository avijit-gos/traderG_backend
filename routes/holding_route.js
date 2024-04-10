require("dotenv").config();
const express = require("express");
const Holding = require("../models/holding");
const HoldingRoute = express.Router();

/**
 * This method is used for create holding
 */

 HoldingRoute.post("/create",async(req,res)=>{
   try{
    req.body.wallet_id = "WL" + Date.now();
    req.body.client_id = "CL" + Date.now();
    const HoldingData = new Holding(req.body);
    const result = await HoldingData.save();
    message = {
        error:false,
        message:"Holding data added successfully",
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
 * This method is used for list of holding
 */

HoldingRoute.get("/list",async(req,res)=>{
    try{
        let HoldingData = await Holding.find({}).populate([
            {
                path:"user",
                select:"fname lname"
            },
            {
                path:"product_id",
                select:"title"
            }
        ]).sort({_id:-1});

        message = {
            error:true,
            message:"list of all holding account",
            data:HoldingData
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
 * This method is used for list of holding by userId
 */

 HoldingRoute.get("/list-by-userId/:userId",async(req,res)=>{
    try{
        let HoldingData = await Holding.find({user:req.params.userId}).populate([
            {
                path:"user",
                select:"fname lname"
            },
            {
                path:"product_id",
                select:"title"
            }
        ]).sort({_id:-1});

        message = {
            error:true,
            message:"list of holding account",
            data:HoldingData
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
 * This method is used for detail of holding by userId and holdingId
 */

HoldingRoute.get("/detail/:userId/:holdingId",async(req,res)=>{
    try{
        let HoldingData = await Holding.findOne({$and:[{user:req.params.userId},{_id:req.params.holdingId}]}).populate([
            {
                path:"user",
                select:"fname lname"
            },
            {
                path:"product_id",
                select:"title"
            }
        ]).sort({_id:-1});

        message = {
            error:true,
            message:"Detail of holding account",
            data:HoldingData
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
 * This method is to find block/unblock holding
 */

 HoldingRoute.get("/toggle-status",async(req,res)=>{
    try{
        let HoldingData = await Holding.find({status:true}).sort({_id:-1});

        message = {
            error: false,
            message:"list of holding",
            data:HoldingData
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
 * This method is to upadte Holding
 * @param str holdingId
 */

 HoldingRoute.patch("/update/:holdingId",async(req,res)=>{
    try{
        let result = await Holding.findOneAndUpdate({_id:req.params.holdingId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"Holding updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Holding not upadated"
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
 * @param str holdingId
 */

 HoldingRoute.delete("/delete/:holdingId", async (req, res) => {
    try {
        const result = await Holding.deleteOne({
            _id: req.params.holdingId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Holding deleted successfully!",
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
 module.exports = HoldingRoute;
