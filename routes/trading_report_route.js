// require("dotenv").config();
// const express = require("express");
// const TradingReport = require("../models/trading_report");
// const TradingReportRoute = express.Router();

// /**
//  * This method is to create Trading report
//  */

//  TradingReportRoute.post("/create", async (req, res) => {
// 	try {
// 		const TradingReportData = new TradingReport(req.body);
// 		const result = await TradingReportData.save();
// 		message = {
// 			error: false,
// 			message: "Trading report Added Successfully!",
// 			data: result,
// 		};
// 		return res.status(200).send(message);
// 	} catch (err) {
// 		message = {
// 			error: true,
// 			message: "operation Failed!",
// 			data: err,
// 		};
// 		return res.status(200).send(message);
// 	}
// });

// /**
//  * This method is to find all Trading report
//  */

//  TradingReportRoute.get("/list",async(req,res)=>{
//     try{
//         let TradingReportData = await TradingReport.find({}).sort({_id:-1});

//         message = {
//             error: false,
//             message:"All Trading report Request list",
//             data:TradingReportData
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



// /**
//  * This method is to find all Trading report by client Id
//  *  @param str clientId
//  */

//  TradingReportRoute.get("/list-by-clientId/:clientId",async(req,res)=>{
//     try{
//         let TradingReportData = await TradingReport.findOne({client_id:req.params.clientId}).sort({_id:-1});

//         message = {
//             error: false,
//             message:"Trading report list",
//             data:TradingReportData
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

// /**
//  * This method is to upadte  Trading report 
//  * @param str tradingreportid
//  */

//  TradingReportRoute.patch("/update/:tradingreportid",async(req,res)=>{
//     try{
//         let result = await TradingReport.findOneAndUpdate({_id:req.params.tradingreportid},req.body,{new: true});
//         if(result){
//             message = {
//                 error: false,
//                 message:"Trading report updated successfully",
//                 data: result
//             };
//             return res.status(200).send(message);
//         }else{
//             message = {
//                 error: true,
//                 message: "Trading report Request not upadated"
//             };
//             return res.status(200).send(message);
//         }
//     }catch(err){
//         message = {
//             error: false,
//             message:"Operation Failed",
//             data: err
//         }
//         return res.status(200).send(message);
//     }
// });

// /**
//  * This method is to delete Trading Report
//  * @param str tradingreportid
//  */

//  TradingReportRoute.delete("/delete/:tradingreportid", async (req, res) => {
//     try {
//         const result = await TradingReport.deleteOne({
//             _id: req.params.tradingreportid
//         });
//         if (result.deletedCount == 1) {
//             message = {
//                 error: false,
//                 message: "Trading report deleted successfully!",
//             };
//             res.status(200).send(message);
//         } else {
//             message = {
//                 error: true,
//                 message: "Operation failed!",
//             };
//             res.status(200).send(message);
//         }
//     } catch (err) {
//         message = {
//             error: true,
//             message: "Operation Failed!",
//             data: err,
//         };
//         res.status(200).send(message);
//     }
// });
//  module.exports = TradingReportRoute;



