require("dotenv").config();
const express = require("express");
const TradingLog = require("../models/trading_log");
const TradingNewLog = require("../models/trading_log_new");
const BrokerageNewLog = require("../models/brokerage_new_log");
const BrokerageLog = require("../models/brokerage_log");
const CapitalLog = require("../models/capital_log");
const CsvLogRoute = express.Router();


CsvLogRoute.get("/list", async (req, res) => {
    try {
        let TradingLogData = await TradingLog.find({}).sort({_id:-1});
        let BrokerageLogData = await BrokerageNewLog.find({}).sort({_id:-1});
        let CapitalLogData = await CapitalLog.find({}).sort({_id:-1});
        let TradingNewLogData = await TradingNewLog.find({}).sort({_id:-1});

        message = {
            error: false,
            message: "Csv Data",
            data: {TradingLogData,BrokerageLogData,CapitalLogData,TradingNewLogData}
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


CsvLogRoute.get("/list-by-appId", async (req, res) => {
    try {
        let appId = req.query.appId;
        let TradingNewLogData = await TradingNewLog.find({client_id:appId}).sort({_id:-1});
        let BrokerageNewLogData = await BrokerageNewLog.find({client_id:appId}).sort({_id:-1});


        message = {
            error: false,
            message: "Csv Data",
            data: {TradingNewLogData,BrokerageNewLogData}
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


CsvLogRoute.post("/list-by-id", async (req, res) => {
    try {
        let appId = req.query.appId;
        let startDate = new Date(req.body.startDate);
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);
        startDate.setMilliseconds(0);
        let endDate =  new Date(req.body.endDate);
        endDate = endDate.setDate(endDate.getDate()+1);
        console.log("startDate",startDate);
        console.log("endDate",endDate);
        let TradingNewLogData;
        let BrokerageNewLogData
        if(req.body.startDate && req.body.endDate){
            TradingNewLogData = await TradingNewLog.find({$and:[{client_id:appId},{exp_date:{ $gte: startDate, $lt: endDate }}]}).sort({_id:-1});
            BrokerageNewLogData = await BrokerageNewLog.find({client_id:appId}).sort({_id:-1});


        }else{
            TradingNewLogData = await TradingNewLog.find({client_id:appId}).sort({_id:-1});
            BrokerageNewLogData = await BrokerageNewLog.find({client_id:appId}).sort({_id:-1});

        }
        message = {
            error: false,
            message:"Csv Data",
            data: {TradingNewLogData,BrokerageNewLogData}
        };
        return res.status(200).send(message)

    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err.toString(),
        };
        res.status(200).send(message);
    }
});

////////////////////////////////////// month yearl weekly filter ///////////////////////////

// CsvLogRoute.post("/list-filter", async (req, res) => {
//     try {
//         let appId = req.query.appId;
//         let startDate = new Date(req.body.startDate);
//         startDate.setHours(0);
//         startDate.setMinutes(0);
//         startDate.setSeconds(0);
//         startDate.setMilliseconds(0);
//         let endDate =  new Date(req.body.endDate);
//         endDate = endDate.setDate(endDate.getDate()+1);
//         console.log("startDate",startDate);
//         console.log("endDate",endDate);
//         let TradingNewLogData;
//         let BrokerageNewLogData;

//         function getFirstAndLastDayOfMonth(year=2023, month) {
//             // Ensure month is within valid range (0-11)
//             if (month < 0 || month > 11) {
//                 throw new Error("Invalid month. Month should be between 0 and 11.");
//             }
            
//             // Create a new Date object for the first day of the specified month
//             var firstDay = new Date(year, month, 1);
        
//             // Create a new Date object for the last day of the specified month
//             var lastDay = new Date(year, month + 1, 0);
        
//             // Format the first and last days as strings
//             var firstDayString = firstDay.toISOString().slice(0, 10);
//             var lastDayString = lastDay.toISOString().slice(0, 10);
        
//             return {
//                 firstDay: firstDayString,
//                 lastDay: lastDayString
//             };
//         }


        

//         if(req.body.startDate && req.body.endDate){

//             // month calculation

            
//             var month = 8;   

//             var result = getFirstAndLastDayOfMonth(year, month);
//             console.log("First Day:", result.firstDay);
//             console.log("Last Day:", result.lastDay);

//             TradingNewLogData = await TradingNewLog.find({$and:[{client_id:appId},{exp_date:{ $gte: startDate, $lt: endDate }}]}).sort({_id:-1});
//             BrokerageNewLogData = await BrokerageNewLog.find({client_id:appId}).sort({_id:-1});


//         }else{
//             let default_startDate = new Date();

//             var sevenDaysAgo = new Date();
//             sevenDaysAgo.setDate(default_startDate.getDate() - 7);

            
//             // TradingNewLogData = await TradingNewLog.find({client_id:appId}).sort({_id:-1});
//             // BrokerageNewLogData = await BrokerageNewLog.find({client_id:appId}).sort({_id:-1});

//             console.log({sevenDaysAgo})
//             console.log({default_startDate})

//             TradingNewLogData = await TradingNewLog.find({$and:[{client_id:appId},{exp_date:{ $gte: sevenDaysAgo, $lt: default_startDate }}]}).sort({_id:-1});
//             BrokerageNewLogData = await BrokerageNewLog.find({client_id:appId}).sort({_id:-1});

//         }
//         message = {
//             error: false,
//             message:"Csv Data",
//             data: {TradingNewLogData,BrokerageNewLogData}
//         };
//         return res.status(200).send(message)

//     } catch(err) {
//         message = {
//             error: true,
//             message: "operation failed!",
//             data: err.toString(),
//         };
//         res.status(200).send(message);
//     }
// });

////////////////////////////////////// month yearl weekly filter ///////////////////////////

CsvLogRoute.get("/list-filter", async (req, res) => {
    try {
        let appId = req.query.appId;
        let type = req.query.type
        // let startDate = new Date(req.body.startDate);
        // startDate.setHours(0);
        // startDate.setMinutes(0);
        // startDate.setSeconds(0);
        // startDate.setMilliseconds(0);
        // let endDate =  new Date(req.body.endDate);
        // endDate = endDate.setDate(endDate.getDate()+1);
        // console.log("startDate",startDate);
        // console.log("endDate",endDate);
        let TradingNewLogData;
        let BrokerageNewLogData;

        function getFirstAndLastDayOfMonth(year=2023, month) {
            // Ensure month is within valid range (0-11)
            if (month < 0 || month > 11) {
                throw new Error("Invalid month. Month should be between 0 and 11.");
            }
            
            // Create a new Date object for the first day of the specified month
            var firstDay = new Date(year, month, 1);
        
            // Create a new Date object for the last day of the specified month
            var lastDay = new Date(year, month + 1, 0);
        
            // Format the first and last days as strings
            var firstDayString = firstDay.toISOString().slice(0, 10);
            var lastDayString = lastDay.toISOString().slice(0, 10);
        
            return {
                firstDay: firstDayString,
                lastDay: lastDayString
            };
        }


        if(type == "monthly"){
            // console.log("hii")
            let default_startDate = new Date();

            var oneMonthAgo = new Date();
            oneMonthAgo.setDate(default_startDate.getDate() - 31);

            console.log({oneMonthAgo})
            console.log({default_startDate})

            TradingNewLogData = await TradingNewLog.find({$and:[{client_id:appId},{exp_date:{ $gte: oneMonthAgo, $lt: default_startDate }}]}).sort({_id:-1});
            BrokerageNewLogData = await BrokerageNewLog.find({client_id:appId}).sort({_id:-1});


        }else if(type == "yearly"){
            // console.log("hello")
            let default_startDate = new Date();

            var oneYearAgo = new Date();
            oneYearAgo.setDate(default_startDate.getDate() - 365);

            console.log({oneYearAgo})
            console.log({default_startDate})

            TradingNewLogData = await TradingNewLog.find({$and:[{client_id:appId},{exp_date:{ $gte: oneYearAgo, $lt: default_startDate }}]}).sort({_id:-1});
            BrokerageNewLogData = await BrokerageNewLog.find({client_id:appId}).sort({_id:-1});


        }else if(type == "weekly"){
            let default_startDate = new Date();

            var sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(default_startDate.getDate() - 7);


            console.log({sevenDaysAgo})
            console.log({default_startDate})

            TradingNewLogData = await TradingNewLog.find({$and:[{client_id:appId},{exp_date:{ $gte: sevenDaysAgo, $lt: default_startDate }}]}).sort({_id:-1});
            BrokerageNewLogData = await BrokerageNewLog.find({client_id:appId}).sort({_id:-1});

        }
        message = {
            error: false,
            message:"Csv Data",
            data: {TradingNewLogData,BrokerageNewLogData}
        };
        return res.status(200).send(message)

    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err.toString(),
        };
        res.status(200).send(message);
    }
});






module.exports = CsvLogRoute;
