require("dotenv").config();
const express = require("express");
const TradingNewLog = require("../models/trading_log_new");
const BrokerageNewLog = require("../models/brokerage_new_log");
//const BrokerageDummyLog = require("../models/brokeragedummy");
const BrokerageNewLogRoute = express.Router();

/**
 * This method is used for create PreShare
 */

//  BrokerageNewLogRoute.get("/list",async(req,res)=>{
//    try{
//     let result = await TradingNewLog.find({});
//     let brokData;
//     let tradingData;
//     for(var i in result){
//         if(result[i].type == "CASH INTRADAY"){
//             const client_id = result[i]?.client_id;
//             const turnover = ((result[i]?.buy_val * result[i]?.total_qty) + (result[i]?.sell_val * result[i]?.total_qty));

//             // Calculate brokerage
//             const brokerage = (turnover * (0.02 / 100));

//             // Calculate STT
//             const stt = ((result[i]?.sell_val * result[i]?.total_qty) * (0.025 / 100));

//             // Calculate transaction charges
//             const transaction_charges = (turnover * (0.89 / 100));

//             // Calculate GST
//             const gst = ((brokerage + transaction_charges) * (18 / 100));

//             // Calculate SEBI charges
//             const sebi_charges = (turnover * (0.00010 / 100));

//             // Calculate stamp charges
//             const stamp_charges = ((result[i]?.buy_val * result[i]?.total_qty) * (0.003 / 100));

//             // Calculate IPFT
//             const ipft = ((result[i]?.buy_val * result[i]?.total_qty) * (0.003 / 100));

//             //Total Brokerage;

//             const total_brokerage = ( brokerage + stt + transaction_charges + gst + sebi_charges + stamp_charges + ipft ).toFixed(2)

//             // Create an object with the calculated data
//             const brokerageData = new BrokerageNewLog({
//                 client_id,
//                 turnover,
//                 brokerage,
//                 stt,
//                 transaction_charges,
//                 gst,
//                 sebi_charges,
//                 stamp_charges,
//                 ipft,
//                 total_brokerage
//             });
//             brokData = await brokerageData.save();

//             tradingData = await TradingNewLog.findOneAndUpdate({_id:result[i]?._id},{brokerage:total_brokerage},{new:true})
            
//         }
//         else if(result[i].type == "CASH DELIVERY"){
// 			const client_id = result[i]?.client_id;
//             const turnover = ((result[i]?.buy_val * result[i]?.total_qty) + (result[i]?.sell_val * result[i]?.total_qty));

//             // Calculate brokerage
//             const brokerage = (turnover * (0.10 / 100));

//             // Calculate STT
//             const stt = ((result[i]?.sell_val * result[i]?.total_qty) * (0.10 / 100));

//             // Calculate transaction charges
//             const transaction_charges = (turnover * (0.003935 / 100));

//             // Calculate GST
//             const gst = ((brokerage + transaction_charges) * (18 / 100));

//             // Calculate SEBI charges
//             const sebi_charges = (turnover * (0.00010 / 100));

//             // Calculate stamp charges
//             const stamp_charges = ((result[i]?.buy_val * result[i]?.total_qty) * (0.015 / 100));

//             // Calculate IPFT
//             const ipft = ((result[i]?.buy_val * result[i]?.total_qty) * (0.00010 / 100));

//                //Total Brokerage;

//             const total_brokerage = ( brokerage + stt + transaction_charges + gst + sebi_charges + stamp_charges + ipft ).toFixed(2)


//             // Create an object with the calculated data
//             const brokerageData = new BrokerageNewLog({
//                 client_id,
//                 turnover,
//                 brokerage,
//                 stt,
//                 transaction_charges,
//                 gst,
//                 sebi_charges,
//                 stamp_charges,
//                 ipft,
//                 total_brokerage
//             });
//             brokData = await brokerageData.save();
//             tradingData = await TradingNewLog.findOneAndUpdate({_id:result[i]?._id},{brokerage:total_brokerage},{new:true})
//         }
//         else if(result[i].type == "FUTURES"){
// 			const client_id = result[i]?.client_id;
//             const turnover = ((result[i]?.buy_val * result[i]?.total_qty) + (result[i]?.sell_val * result[i]?.total_qty));

//             // Calculate brokerage
//             const brokerage = (turnover * (0.10 / 100));

//             // Calculate STT
//             const stt = ((result[i]?.sell_val * result[i]?.total_qty) * (0.0125 / 100));

//             // Calculate transaction charges
//             const transaction_charges = (turnover * (0.003037 / 100));

//             // Calculate GST
//             const gst = ((brokerage + transaction_charges) * (18 / 100));

//             // Calculate SEBI charges
//             const sebi_charges = (turnover * (0.00010 / 100));

//             // Calculate stamp charges
//             const stamp_charges = ((result[i]?.buy_val * result[i]?.total_qty) * (0.002 / 100));

//             // Calculate IPFT
//             const ipft = ((result[i]?.buy_val * result[i]?.total_qty) * (0.0005 / 100));

//             //Total Brokerage;

//             const total_brokerage = ( brokerage + stt + transaction_charges + gst + sebi_charges + stamp_charges + ipft ).toFixed(2)


//             // Create an object with the calculated data
//             const brokerageData = new BrokerageNewLog({
//                 client_id,
//                 turnover,
//                 brokerage,
//                 stt,
//                 transaction_charges,
//                 gst,
//                 sebi_charges,
//                 stamp_charges,
//                 ipft,
//                 total_brokerage
//             });
//             brokData = await brokerageData.save();
//             tradingData = await TradingNewLog.findOneAndUpdate({_id:result[i]?._id},{brokerage:total_brokerage},{new:true})

//         }
//         else if(result[i].type == "OPTIONS"){
//             const client_id = result[i]?.client_id;
//             const turnover = ((result[i]?.buy_val * result[i]?.total_lot) + (result[i]?.sell_val * result[i]?.total_lot));

//             // Calculate brokerage
//             const brokerage = (turnover * 20 );

//             // Calculate STT
//             const stt = ((result[i]?.sell_val * result[i]?.total_lot) * (0.06250 / 100));

//             // Calculate transaction charges
//             const transaction_charges = (turnover * (0.06068 / 100));

//             // Calculate GST
//             const gst = ((brokerage + transaction_charges) * (18 / 100));

//             // Calculate SEBI charges
//             const sebi_charges = (turnover * (0.00010 / 100));

//             // Calculate stamp charges
//             const stamp_charges = ((result[i]?.buy_val * result[i]?.total_lot) * (0.003 / 100));

//             // Calculate IPFT
//             const ipft = ((result[i]?.buy_val * result[i]?.total_lot) * (0.0005 / 100));

//             //Total Brokerage;

//             const total_brokerage = ( brokerage + stt + transaction_charges + gst + sebi_charges + stamp_charges + ipft ).toFixed(2)


//             // Create an object with the calculated data
//             const brokerageData = new BrokerageNewLog({
//                 client_id,
//                 turnover,
//                 brokerage,
//                 stt,
//                 transaction_charges,
//                 gst,
//                 sebi_charges,
//                 stamp_charges,
//                 ipft,
//                 total_brokerage
//             });
//             brokData = await brokerageData.save();
//             tradingData = await TradingNewLog.findOneAndUpdate({_id:result[i]?._id},{brokerage:total_brokerage},{new:true})
//         }

//     }
//     let broklist = await BrokerageNewLog.find({})
//     message = {
//         error:false,
//         message:"Brokerage data added successfully",
//         data:broklist,
//         //tradingData
//     };
//         return res.status(200).send(message);
//    }catch(err){
//         message = {
//             error:true,
//             message:"Operation Failed",
//             data:err.toString()
//         };
//         return res.status(200).send(message);
//    }
//  });


 ///////////////////////////////// for changing /////////////////////////////////////
 BrokerageNewLogRoute.get("/list",async(req,res)=>{
    try{
     let result = await TradingNewLog.find({});
     let brokData;
     let tradingData;
     for(var i in result){
         if(result[i].type == "CASH INTRADAY"){
             const client_id = result[i]?.client_id;

            // console.log("totalValue",result[i]?.total_value)
             // Calculate brokerage
             const brokerage = ((result[i]?.total_value) * (0.02 / 100));
 
             // Calculate STT
             const stt = ((result[i]?.total_value) * (0.025 / 100));
 
             // Calculate transaction charges
             const transaction_charges = ((result[i]?.total_value) * (0.003935 / 100));
 
             // Calculate GST
             const gst = ((result[i]?.total_value) * (18 / 100));
 
             // Calculate SEBI charges
             const sebi_charges = ((result[i]?.total_value) * (0.00010 / 100));
 
             // Calculate stamp charges
             const stamp_charges = ((result[i]?.total_value) * (0.003 / 100));
 
             // Calculate IPFT
             const ipft = ((result[i]?.total_value) * (0.00010 / 100));
 
             //Total Brokerage;
 
             const total_brokerage = ( brokerage + stt + transaction_charges + gst + sebi_charges + stamp_charges + ipft ).toFixed(2);

             const turnover = total_brokerage;
 
             // Create an object with the calculated data
             const brokerageData = new BrokerageNewLog({
                 client_id,
                 turnover,
                 brokerage,
                 stt,
                 transaction_charges,
                 gst,
                 sebi_charges,
                 stamp_charges,
                 ipft,
                 total_brokerage
             });
             brokData = await brokerageData.save();
 
             tradingData = await TradingNewLog.findOneAndUpdate({_id:result[i]?._id},{brokerage:total_brokerage},{new:true})
             
         }
         else if(result[i].type == "CASH DELIVERY"){
             const client_id = result[i]?.client_id;
           
             // Calculate brokerage
             const brokerage = ((result[i]?.total_value) * (0.10 / 100));
 
             // Calculate STT
             const stt = ((result[i]?.total_value) * (0.10 / 100));
 
             // Calculate transaction charges
             const transaction_charges = ((result[i]?.total_value) * (0.003935 / 100));
 
             // Calculate GST
             const gst = ((result[i]?.total_value) * (18 / 100));
 
             // Calculate SEBI charges
             const sebi_charges = ((result[i]?.total_value) * (0.00010 / 100));
 
             // Calculate stamp charges
             const stamp_charges = ((result[i]?.total_value) * (0.015 / 100));
 
             // Calculate IPFT
             const ipft = (((result[i]?.total_value) * (0.00010 / 100)));
 
                //Total Brokerage;
 
             const total_brokerage = ( brokerage + stt + transaction_charges + gst + sebi_charges + stamp_charges + ipft ).toFixed(2);

             const turnover = total_brokerage;
 
             // Create an object with the calculated data
             const brokerageData = new BrokerageNewLog({
                 client_id,
                 turnover,
                 brokerage,
                 stt,
                 transaction_charges,
                 gst,
                 sebi_charges,
                 stamp_charges,
                 ipft,
                 total_brokerage
             });
             brokData = await brokerageData.save();
             tradingData = await TradingNewLog.findOneAndUpdate({_id:result[i]?._id},{brokerage:total_brokerage},{new:true})
         }
         else if(result[i].type == "FUTURES"){
             const client_id = result[i]?.client_id;
 
             // Calculate brokerage
             const brokerage = ((result[i]?.total_value) * (0.01 / 100));
 
             // Calculate STT
             const stt = ((result[i]?.total_value) * (0.0125 / 100));
 
             // Calculate transaction charges
             const transaction_charges = ((result[i]?.total_value) * (0.003037 / 100));
 
             // Calculate GST
             const gst = ((result[i].total_value)  * (18 / 100));
 
             // Calculate SEBI charges
             const sebi_charges = ((result[i]?.total_value) * (0.00010 / 100));
 
             // Calculate stamp charges
             const stamp_charges = ((result[i]?.total_value)  * (0.002 / 100));
 
             // Calculate IPFT
             const ipft = ((result[i]?.total_value)  * (0.0005 / 100));
 
             //Total Brokerage;
 
             const total_brokerage = ( brokerage + stt + transaction_charges + gst + sebi_charges + stamp_charges + ipft ).toFixed(2);

             const turnover = total_brokerage;
 
 
             // Create an object with the calculated data
             const brokerageData = new BrokerageNewLog({
                 client_id,
                 turnover,
                 brokerage,
                 stt,
                 transaction_charges,
                 gst,
                 sebi_charges,
                 stamp_charges,
                 ipft,
                 total_brokerage
             });
             brokData = await brokerageData.save();
             tradingData = await TradingNewLog.findOneAndUpdate({_id:result[i]?._id},{brokerage:total_brokerage},{new:true})
 
         }
         else if(result[i].type == "OPTIONS"){
             const client_id = result[i]?.client_id;

           //  console.log("totalLot",result[i]?.total_lot)
           
             // Calculate brokerage
             const brokerage = ((result[i]?.total_lot) * 20 );
 
             // Calculate STT
             const stt = ((result[i]?.total_lot) * (0.06250 / 100));
 
             // Calculate transaction charges
             const transaction_charges = ((result[i]?.total_lot) * (0.06068 / 100));
 
             // Calculate GST
             const gst = ((result[i]?.total_lot) * (18 / 100));
 
             // Calculate SEBI charges
             const sebi_charges = ((result[i]?.total_lot) * (0.00010 / 100));
 
             // Calculate stamp charges
             const stamp_charges = ((result[i]?.total_lot) * (0.003 / 100));
 
             // Calculate IPFT
             const ipft = ((result[i]?.total_lot) * (0.0005 / 100));
 
             //Total Brokerage;
 
             const total_brokerage = ( brokerage + stt + transaction_charges + gst + sebi_charges + stamp_charges + ipft ).toFixed(2);

             const turnover = total_brokerage;
 
             // Create an object with the calculated data
             const brokerageData = new BrokerageNewLog({
                 client_id,
                 turnover,
                 brokerage,
                 stt,
                 transaction_charges,
                 gst,
                 sebi_charges,
                 stamp_charges,
                 ipft,
                 total_brokerage
             });
             brokData = await brokerageData.save();
             tradingData = await TradingNewLog.findOneAndUpdate({_id:result[i]?._id},{brokerage:total_brokerage},{new:true})
         }
 
     }
     let broklist = await BrokerageNewLog.find({}).sort({_id:-1})
     message = {
         error:false,
         message:"Brokerage data added successfully",
         data:broklist,
         //tradingData
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
 

// BrokerageNewLogRoute.post("/create",async(req,res)=>{
//     try{
//         const brokerageData = new BrokerageNewLog(req.body);
// 		const result = await brokerageData.save();

//        let total = (result?.brokerage + result?.stt + result?.transaction_charges + result?.gst + result?.sebi_charges +  result?.stamp_charges + result?.ipft).toFixed(2)

//        let updateData = await BrokerageNewLog.findOneAndUpdate({_id:result?._id},{total_brokerage:total},{new:true})

// 		message = {
// 			error: false,
// 			message: "Brokerage Added Successfully!",
// 			data: updateData
// 		};
// 		return res.status(200).send(message);
//     }catch(err){
//         message = {
// 			error: true,
// 			message: "operation Failed!",
// 			data: err,
// 		};
// 		return res.status(200).send(message);
//     }
// })



 module.exports = BrokerageNewLogRoute;
