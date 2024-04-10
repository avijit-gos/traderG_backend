require("dotenv").config();
const express = require("express");
const SearchRoute = express.Router();
// const TradingLog = require("../models/trading_log");
// const CapitalLog = require('../models/capital_log');
// const BrokerageLog = require('../models/brokerage_log');

const TradingNewLog = require("../models/trading_log_new");
const BrokerageNewLog = require("../models/brokerage_new_log");

//////////////// search on trading data ///////////////////////

SearchRoute.get("/trading-search",async(req,res)=>{
    try{
        let startDate = new Date(req.query.startDate);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        console.log(startDate)
        let endDate = new Date(req.query.endDate)
        endDate = endDate.setDate(endDate.getDate()+1)

        console.log(endDate)

        let tradingData = await TradingNewLog.find({createdAt:{ $gte: startDate, $lt: endDate }});

        message = {
            error:false,
            message:"search List",
            data:tradingData
        };
        return res.status(200).send(message);
    }catch(err){
        message = {
            error: true,
            message: "Operation Failed!",
            data: err
        };
        res.status(200).send(message);
    }
})

//////////////// search on brokerage data ///////////////////////

SearchRoute.get("/brokerage-search",async(req,res)=>{
    try{
        let startDate = new Date(req.query.startDate);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        console.log(startDate)
        let endDate = new Date(req.query.endDate)
        endDate = endDate.setDate(endDate.getDate()+1)

        console.log(endDate)

        let brokerageData = await BrokerageNewLog.find({createdAt:{ $gte: startDate, $lt: endDate }});

        message = {
            error:false,
            message:"search List",
            data:brokerageData
        };
        return res.status(200).send(message);
    }catch(err){
        message = {
            error: true,
            message: "Operation Failed!",
            data: err
        };
        res.status(200).send(message);
    }
})

//////////////// search on capital data ///////////////////////


// SearchRoute.get("/capital-search",async(req,res)=>{
//     try{
//         let startDate = new Date(req.query.startDate);
//         startDate.setHours(0);
//         startDate.setMinutes(0);
//         startDate.setSeconds(0);
//         startDate.setMilliseconds(0);
//         console.log(startDate)
//         let endDate = new Date(req.query.endDate)
//         endDate = endDate.setDate(endDate.getDate()+1)

//         console.log(endDate)

//         let CapitalData = await CapitalLog.find({createdAt:{ $gte: startDate, $lt: endDate }});

//         message = {
//             error:false,
//             message:"search List",
//             data:CapitalData
//         };
//         return res.status(200).send(message);
//     }catch(err){
//         message = {
//             error: true,
//             message: "Operation Failed!",
//             data: err
//         };
//         res.status(200).send(message);
//     }
// })



 module.exports = SearchRoute;

