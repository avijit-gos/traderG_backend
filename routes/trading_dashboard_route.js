require("dotenv").config();
const express = require("express");
const AccountCreationRequest = require("../models/account_creation_request");
const TrdaingNewLog = require("../models/trading_log_new");
const BrokerageNewLog = require("../models/brokerage_new_log");
const TradingDashboardRoute = express.Router();

// TradingDashboardRoute.post("/trading-dashboard/:accountCreationReqId",async(req,res)=>{
//    try{
//     const result = await AccountCreationRequest.findOne({_id:req.params.accountCreationReqId});
//     let tadingData;
//     if(result.is_kyc_completed == true && result.is_payment_made == true && result.is_aggrement_signed == true){
//         let startDate = new Date(req.body.startDate);
//         startDate.setHours(0);
//         startDate.setMinutes(0);
//         startDate.setSeconds(0);
//         startDate.setMilliseconds(0);
//         let endDate =  new Date(req.body.endDate);
//         endDate = endDate.setDate(endDate.getDate()+1);
//         console.log("startDate",startDate);
//         console.log("endDate",endDate);

//         if(req.body.startDate && req.body.endDate){
//             const accountData = await AccountCreationRequest.findOne({$and:[{_id:req.params.accountCreationReqId},{createdAt:{ $gte: startDate, $lt: endDate }}]});
//            // console.log(accountData);
//             let applicationId = accountData?.application_id;
//           //  console.log(applicationId);

//             const TrdaingNewLogData = await TrdaingNewLog.find({client_id:applicationId});
//             const BrokerageData = await BrokerageNewLog.find({client_id:applicationId})
//          //   console.log(TrdaingNewLogData);

//             // let totalturvover = 0;
//             // TrdaingNewLogData.forEach((element, index) => {
//             //     totalturvover += element.total_lot
//             // });

//             //     let totalBrok = 0;
//             //     let totalturvover = 0;

//             let totalmtm = 0;
//             let totalBrok = 0;
//             TrdaingNewLogData.forEach((element, index) => {
//                 totalmtm += element.mtm_g_l
//                 totalBrok += element.brokerage
//                // totalturvover += element.turnover
//             });

//             let totalturvover = 0;

//             BrokerageData.forEach((element,index)=>{
//                 totalturvover += element.turnover
//             })

//            // console.log("total_mtm....",totalmtm);

//            // let total_brokerage = 0;
//             // TrdaingNewLogData.forEach((element, index) => {
//             //     total_brokerage += element.mtm_g_l
//             // });

//             // console.log("total_mtm....",total_mtm);

//             tadingData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{"trading_details.turnover":totalturvover,"trading_details.mtm":totalmtm,"trading_details.brokerage":totalBrok},{new: true})

//         }else{
//             const accountData = await AccountCreationRequest.findOne({_id:req.params.accountCreationReqId});
//            // console.log(accountData);
//             let applicationId = accountData?.application_id;
//             //console.log(applicationId);

//             const TrdaingNewLogData = await TrdaingNewLog.find({client_id:applicationId}).limit(2);
//             const BrokerageData = await BrokerageNewLog.find({client_id:applicationId}).limit(2)
//            // console.log(TrdaingNewLogData);

//             // let totalturvover = 0;
//             // TrdaingNewLogData.forEach((element, index) => {
//             //     totalturvover += element.total_lot
//             // });

//             //console.log("total_lot....",totalturvover);

//             let totalmtm = 0;
//             let totalBrok = 0;
//           //  let totalturvover = 0;
//             TrdaingNewLogData.forEach((element, index) => {
//                 totalmtm += element.mtm_g_l
//                 totalBrok += element.brokerage
//                 //totalturvover += element.turnover
//             });

//             let totalturvover = 0;

//             BrokerageData.forEach((element,index)=>{
//                 totalturvover += element.turnover
//             })

//            // console.log("total_mtm....",totalmtm);

//             // let total_brokerage = 0;
//             // TrdaingNewLogData.forEach((element, index) => {
//             //     total_brokerage += element.mtm_g_l
//             // });

//             // console.log("total_mtm....",total_mtm);


//             tadingData = await AccountCreationRequest.findOneAndUpdate({_id:req.params.accountCreationReqId},{"trading_details.turnover":totalturvover,"trading_details.mtm":totalmtm,"trading_details.brokerage":totalBrok},{new: true})

//         }
//         message = {
//             error: false,
//             message:"Account Creation Request updated successfully",
//             data: tadingData
//         };
//         return res.status(200).send(message)
//     }
//    }catch(err){
//         message = {
//             error: true,
//             message:"Operation Failed",
//             data: err.toString(),
//         }
//         return res.status(200).send(message);
//    }
// })


///////////////////////////////////////////// Trading Data ////////////////////////////////

TradingDashboardRoute.post("/trading-dashboard",async(req,res)=>{
    try{
        let appId = req.query.appId;
        const result = await AccountCreationRequest.findOne({application_id:appId});
        //console.log("result>>>",result);
        let tadingData;
        if(result.is_kyc_completed == true && result.is_payment_made == true && result.is_aggrement_signed == true){
            let startDate = new Date(req.body.startDate);
            startDate.setHours(0);
            startDate.setMinutes(0);
            startDate.setSeconds(0);
            startDate.setMilliseconds(0);
            let endDate =  new Date(req.body.endDate);
            endDate = endDate.setDate(endDate.getDate()+1);
            console.log("startDate",startDate);
            console.log("endDate",endDate);
            if(req.body.startDate && req.body.endDate){
                const TrdaingNewLogData = await TrdaingNewLog.find({$and:[{client_id:appId},{exp_date:{ $gte: startDate, $lt: endDate }}]});
                console.log("TrdaingNewLogData>>>>",TrdaingNewLogData)
                const BrokerageData = await BrokerageNewLog.find({client_id:appId});

                console.log("BrokerageData>>>>",BrokerageData)
                const accountData = await AccountCreationRequest.findOne({application_id:appId});
                let totalmtm = 0;
                let totalBrok = 0;
                TrdaingNewLogData.forEach((element, index) => {
                    totalmtm += element.mtm_g_l
                    totalBrok += element.brokerage
                // totalturvover += element.turnover
                });

                console.log("totalmtm>>>>",totalmtm);
                console.log("totalBrok>>>>",totalBrok);

                let totalturvover = 0;

                BrokerageData.forEach((element,index)=>{
                    totalturvover += element.turnover
                });
                console.log("totalturvover>>>>",totalturvover)

                tadingData = await AccountCreationRequest.findOneAndUpdate({application_id:appId},{"trading_details.turnover":totalturvover,"trading_details.mtm":totalmtm,"trading_details.brokerage":totalBrok,"trading_details.pre_turnover":totalturvover,"trading_details.pre_mtm":totalmtm,"trading_details.pre_brokerage":totalBrok},{new: true});
            }else{
                const TrdaingNewLogData = await TrdaingNewLog.find({client_id:appId});
                const BrokerageData = await BrokerageNewLog.find({client_id:appId});
                console.log("BrokerageData>>>>",BrokerageData)
                const accountData = await AccountCreationRequest.findOne({application_id:appId});
                let totalmtm = 0;
                let totalBrok = 0;
                TrdaingNewLogData.forEach((element, index) => {
                    totalmtm += element.mtm_g_l
                    totalBrok += element.brokerage
                // totalturvover += element.turnover
                });

                console.log("totalmtm>>>>",totalmtm);
                console.log("totalBrok>>>>",totalBrok);

                let totalturvover = 0;

                BrokerageData.forEach((element,index)=>{
                    totalturvover += element.turnover
                });
                console.log("totalturvover>>>>",totalturvover)

                tadingData = await AccountCreationRequest.findOneAndUpdate({application_id:appId},{"trading_details.turnover":totalturvover,"trading_details.mtm":totalmtm,"trading_details.brokerage":totalBrok,"trading_details.pre_turnover":totalturvover,"trading_details.pre_mtm":totalmtm,"trading_details.pre_brokerage":totalBrok},{new: true});
            }

        }
        message = {
                error: false,
                message:"Account Creation Request updated successfully",
                data: tadingData
            };
            return res.status(200).send(message)

    }catch(err){
         message = {
             error: true,
             message:"Operation Failed",
             data: err.toString(),
         }
         return res.status(200).send(message);
    }
 });

  /////////// trding log delete ////////////////////////
 TradingDashboardRoute.delete("/trading-delete/:tradingId",async(req,res)=>{
     try{
        const result = await TrdaingNewLog.deleteOne({
            _id: req.params.tradingId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Trading Data deleted successfully!",
            };
            res.status(200).send(message);
        } else {
            message = {
                error: true,
                message: "Operation failed!",
            };
            res.status(200).send(message);
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


 /**
 * This method is to detail of trading log
 *  @param str tradingId
 */
TradingDashboardRoute.get("/detail/:tradingId", async (req, res) => {
    try {
        let TradingData = await TrdaingNewLog.findOne({_id:req.params.tradingId});

        message = {
            error: false,
            message: "Detail trading list",
            data: TradingData,
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


 TradingDashboardRoute.patch("/trading-update/:tradingId",async(req,res)=>{
    try{
        const result = await TrdaingNewLog.findOneAndUpdate({ _id: req.params.tradingId }, req.body, {new: true});

        const brokerData = await BrokerageNewLog.findOne({trading_id:req.params.tradingId});

        let tradingData;
        let brokerlist;

        if(brokerData){
            if(result.type == "CASH INTRADAY"){
                const client_id = result?.client_id;

                const brokerage = ((result?.total_value) * (0.02 / 100));
            
                // Calculate STT
                const stt = ((result?.total_value) * (0.025 / 100));
    
                // Calculate transaction charges
                const transaction_charges = ((result?.total_value) * (0.003935 / 100));
    
                // Calculate GST
                const gst = ((result?.total_value) * (18 / 100));
    
                // Calculate SEBI charges
                const sebi_charges = ((result?.total_value) * (0.00010 / 100));
    
                // Calculate stamp charges
                const stamp_charges = ((result?.total_value) * (0.003 / 100));
    
                // Calculate IPFT
                const ipft = ((result?.total_value) * (0.00010 / 100));
    
                //Total Brokerage;
    
                const total_brokerage = ( brokerage + stt + transaction_charges + gst + sebi_charges + stamp_charges + ipft ).toFixed(2);
   
                const turnover = result?.total_value;

                brokerlist = await BrokerageNewLog.findOneAndUpdate({trading_id:req.params.tradingId},{client_id:client_id,brokerage:brokerage,stt:stt,transaction_charges:transaction_charges,gst:gst,sebi_charges:sebi_charges,stamp_charges:stamp_charges,ipft:ipft,total_brokerage:total_brokerage,turnover:turnover},{new:true});

                tradingData = await TrdaingNewLog.findOneAndUpdate({_id:req.params.tradingId},{brokerage:total_brokerage},{new:true})
    
            }
            else if(result.type == "CASH DELIVERY"){
                        const client_id = result?.client_id;

                        const brokerage = ((result?.total_value) * (0.10 / 100));
            
                        // Calculate STT
                        const stt = ((result?.total_value) * (0.10 / 100));
            
                        // Calculate transaction charges
                        const transaction_charges = ((result?.total_value) * (0.003935 / 100));
            
                        // Calculate GST
                        const gst = ((result?.total_value) * (18 / 100));
            
                        // Calculate SEBI charges
                        const sebi_charges = ((result?.total_value) * (0.00010 / 100));
            
                        // Calculate stamp charges
                        const stamp_charges = ((result?.total_value) * (0.015 / 100));
            
                        // Calculate IPFT
                        const ipft = (((result?.total_value) * (0.00010 / 100)));
            
                           //Total Brokerage;
            
                        const total_brokerage = ( brokerage + stt + transaction_charges + gst + sebi_charges + stamp_charges + ipft ).toFixed(2);
           
                        const turnover = result?.total_value;


                        brokerlist = await BrokerageNewLog.findOneAndUpdate({trading_id:req.params.tradingId},{client_id:client_id,brokerage:brokerage,stt:stt,transaction_charges:transaction_charges,gst:gst,sebi_charges:sebi_charges,stamp_charges:stamp_charges,ipft:ipft,total_brokerage:total_brokerage,turnover:turnover},{new:true});

                        tradingData = await TrdaingNewLog.findOneAndUpdate({_id:req.params.tradingId},{brokerage:total_brokerage},{new:true})

            }
            else if(result.type == "FUTURES"){

                const client_id = result?.client_id;

                // Calculate brokerage
                const brokerage = ((result?.total_value) * (0.01 / 100));
            
                // Calculate STT
                const stt = ((result?.total_value) * (0.0125 / 100));
    
                // Calculate transaction charges
                const transaction_charges = ((result?.total_value) * (0.003037 / 100));
    
                // Calculate GST
                const gst = ((result?.total_value)  * (18 / 100));
    
                // Calculate SEBI charges
                const sebi_charges = ((result?.total_value) * (0.00010 / 100));
    
                // Calculate stamp charges
                const stamp_charges = ((result?.total_value)  * (0.002 / 100));
    
                // Calculate IPFT
                const ipft = ((result?.total_value)  * (0.0005 / 100));
    
                //Total Brokerage;
    
                const total_brokerage = ( brokerage + stt + transaction_charges + gst + sebi_charges + stamp_charges + ipft ).toFixed(2);
   
                const turnover = result?.total_value;

                brokerlist = await BrokerageNewLog.findOneAndUpdate({trading_id:req.params.tradingId},{client_id:client_id,brokerage:brokerage,stt:stt,transaction_charges:transaction_charges,gst:gst,sebi_charges:sebi_charges,stamp_charges:stamp_charges,ipft:ipft,total_brokerage:total_brokerage,turnover:turnover},{new:true});

                tradingData = await TrdaingNewLog.findOneAndUpdate({_id:req.params.tradingId},{brokerage:total_brokerage},{new:true})

            }
            else if(result.type == "OPTIONS"){

                const client_id = result?.client_id;
                 // Calculate brokerage
                 const brokerage = ((result?.total_lot) * 20 );
            
                 // Calculate STT
                 const stt = ((result?.total_lot) * (0.06250 / 100));
     
                 // Calculate transaction charges
                 const transaction_charges = ((result?.total_lot) * (0.06068 / 100));
     
                 // Calculate GST
                 const gst = ((result?.total_lot) * (18 / 100));
     
                 // Calculate SEBI charges
                 const sebi_charges = ((result?.total_lot) * (0.00010 / 100));
     
                 // Calculate stamp charges
                 const stamp_charges = ((result?.total_lot) * (0.003 / 100));
     
                 // Calculate IPFT
                 const ipft = ((result?.total_lot) * (0.0005 / 100));
     
                 //Total Brokerage;
     
                 const total_brokerage = ( brokerage + stt + transaction_charges + gst + sebi_charges + stamp_charges + ipft ).toFixed(2);
    
                 const turnover = result?.total_lot;

                 brokerlist = await BrokerageNewLog.findOneAndUpdate({trading_id:req.params.tradingId},{client_id:client_id,brokerage:brokerage,stt:stt,transaction_charges:transaction_charges,gst:gst,sebi_charges:sebi_charges,stamp_charges:stamp_charges,ipft:ipft,total_brokerage:total_brokerage,turnover:turnover},{new:true});

                 tradingData = await TrdaingNewLog.findOneAndUpdate({_id:req.params.tradingId},{brokerage:total_brokerage},{new:true})
 
            }
        }
		if (result) {
			message = {
				error: false,
				message: "Trading Data updated successfully",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Trading Data updated",
			};
			res.status(200).send(message);
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



 
 module.exports = TradingDashboardRoute;


