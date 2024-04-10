require("dotenv").config();
const express = require("express");
const Trading = require("../models/trading");
const TradingRoute = express.Router();

/**
 * This method is used to create trading
 */

TradingRoute.post("/create",async(req,res)=>{
    try{
        req.body.wallet_id = "WL" + Date.now();
        req.body.client_id = "CL" + Date.now();
        const TradingData = new Trading(req.body);
        const result = await TradingData.save();

        message = {
            error:false,
            message:"Trading data added successfully",
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
 * This method is used to List by uderId
 */

 TradingRoute.get("/list-by-userId/:userId",async(req,res)=>{
    try{
        let TradingData = await Trading.find({user:req.params.userId}).populate([
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
            message:"list of Trading data",
            data:TradingData
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
 * This method is used for detail of trading by userId and holdingId
 */

 TradingRoute.get("/detail/:userId/:tradingId",async(req,res)=>{
    try{
        let TradingData = await Trading.findOne({$and:[{user:req.params.userId},{_id:req.params.tradingId}]}).populate([
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
            data:TradingData
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



module.exports = TradingRoute;