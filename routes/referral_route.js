require("dotenv").config();
const express = require("express");
const Referral = require("../models/referral");
const ReferralRoute = express.Router();

/**
 * This method is to create Report
 */

 ReferralRoute.post("/create",async(req,res)=>{
    try{
        const ReferralData = new Referral(req.body);
        const result = await ReferralData.save();

        message = {
            error:false,
            message:"Referral added successfully",
            data:result
        };
       return res.status(200).send(message);
    }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err
        }
        return res.status(200).send(message);
    }

});


/**
 * This method is to list of Referral 
 *  @param str 
 */


 ReferralRoute.get("/list", async (req, res) => {
    try {
        let ReferralData = await Referral.find({}).populate([
            {
                path:"refered_by",
                select:"fname lname"
            }
        ]).sort({_id:-1});

        message = {
            error: false,
            message: "Referral list",
            data: ReferralData,
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


/**
 * This method is to list of Referral by userId
 *  @param str userId
 */


 ReferralRoute.get("/list-by-userId/:userId", async (req, res) => {
    try {
        let ReferralData = await Referral.find({refered_by:req.params.userId}).populate([
            {
                path:"refered_by",
                select:"fname lname"
            }
        ]).sort({_id:-1});

        message = {
            error: false,
            message: "Referral list",
            data: ReferralData,
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

/**
 * This method is to update Report
 *  @param str reportId
 */

//  ReportRoute.patch("/update/:reportId", async (req, res) => {
// 	try {
// 		const result = await Report.findOneAndUpdate({ _id: req.params.reportId }, req.body, {new: true});
// 		if (result) {
// 			message = {
// 				error: false,
// 				message: "Report updated successfully!",
// 				result
// 			};
// 			res.status(200).send(message);
// 		} else {
// 			message = {
// 				error: true,
// 				message: "Report not updated",
// 			};
// 			res.status(200).send(message);
// 		}
// 	} catch (err) {
// 		message = {
// 			error: true,
// 			message: "Operation Failed!",
// 			data: err,
// 		};
// 		res.status(200).send(message);
// 	}
// });

// /**
//  * This method is to delete Report
//  *  @param str reportId
//  */

//  ReportRoute.delete("/delete/:reportId", async (req, res) => {
//     try {
//         const result = await Report.deleteOne({
//             _id: req.params.reportId
//         });
//         if (result.deletedCount == 1) {
//             message = {
//                 error: false,
//                 message: "Report deleted successfully!",
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

module.exports = ReferralRoute;