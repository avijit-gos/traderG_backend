require("dotenv").config();
const express = require("express");
const Kyc = require("../models/kyc");
const KycRoute = express.Router();


/**
 * This method is to find all Asset
 */

 KycRoute.get("/list", async(req,res)=>{
    try{
        let KycData = await Kyc.find({}).sort({_id:-1});

        message ={
            error: false,
            message: "All Kyc list",
            data: KycData
        };
        return res.status(200).send(message)
    }catch(err){
        message = {
            error:true,
            message:"Operation failed",
            data: err
        };
        return res.status(200).send(message)
    }
});

/**
 * This method is to find all Asset
 */

 KycRoute.get("/list-by-id/:userId", async(req,res)=>{
    try{
        let KycData = await Kyc.find({user:req.params.userId}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ]).sort({_id:-1});

        message ={
            error: false,
            message: "All Kyc list",
            data: KycData
        };
        return res.status(200).send(message)
    }catch(err){
        message = {
            error:true,
            message:"Operation failed",
            data: err
        };
        return res.status(200).send(message)
    }
});

/**
 * This method is to create Asset
 */

//  KycRoute.post("/create", async (req, res) => {
// 	try {
// 		const KycData = new Kyc(req.body);
// 		const result = await KycData.save();
// 		message = {
// 			error: false,
// 			message: "Kyc Added Successfully!",
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

/**
 * This method is to find detail Asset
 * * @param str assetId
 */

 KycRoute.get("/detail/:kycId", async(req,res)=>{
    try{
        let KycData = await Kyc.findOne({_id:req.params.kycId}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ])

        message ={
            error: false,
            message: "All Kyc list",
            data: KycData
        };
        return res.status(200).send(message)
    }catch(err){
        message = {
            error:true,
            message:"Operation failed",
            data: err
        };
        return res.status(200).send(message)
    }
});


/**
 * This method is to update Asset
 * * @param str assetId
 */

//  KycRoute.patch("/update/:kycId", async (req, res) => {
// 	try {
// 		const result = await Kyc.findOneAndUpdate({ _id: req.params.kycId }, req.body, {new: true});
// 		if (result) {
// 			message = {
// 				error: false,
// 				message: "Kyc updated successfully!",
// 				result
// 			};
// 			res.status(200).send(message);
// 		} else {
// 			message = {
// 				error: true,
// 				message: "Kyc not updated",
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

KycRoute.patch("/update/:kycId", async (req, res) => {
    try {
        // Check if the provided PAN card (pan_no) exists for another user
       // const existingKyc = await Kyc.findOne({ pan_no: req.body.pan_no, user: { $ne: req.body.user } });
        const existingKyc = await Kyc.findOne({$and:[{ pan_no: req.body.pan_no},{user: { $ne: req.body.user }},{status:true}]});
        console.log("existingKyc>>>",existingKyc)
        if (existingKyc !== null) {
            return res.status(200).json({
                error: true,
                message: "PAN card already exists for another user.",
            });
        }

        // Proceed with updating the KYC record
        const result = await Kyc.findOneAndUpdate(
            { _id: req.params.kycId },
            req.body,
            { new: true }
        );

        if (result) {
            const message = {
                error: false,
                message: "KYC updated successfully!",
                result
            };
            res.status(200).json(message);
        } else {
            const message = {
                error: true,
                message: "KYC not updated",
            };
            res.status(404).json(message);
        }
    } catch (err) {
        const message = {
            error: true,
            message: "Operation Failed!",
            data: err,
        };
        res.status(500).json(message);
    }
});

// KycRoute.patch("/update/:kycId", async (req, res) => {
//     try {
//         // Check if the provided PAN card (pan_no) exists for another user with status true
//         const existingKyc = await Kyc.findOne({
//             _id: { $ne: req.params.kycId }, // Exclude the current KYC record being updated
//             pan_no: req.body.pan_no,
//             user: req.body.user,
//             status: true
//         });

//         console.log({existingKyc})

//         if (existingKyc) {
//             return res.status(200).json({
//                 error: true,
//                 message: "PAN card already exists for another user.",
//             });
//         }

//         // Proceed with updating the KYC record
//         const result = await Kyc.findOneAndUpdate(
//             { _id: req.params.kycId }, // Filter by KYC ID
//             req.body, // Update with the request body
//             { new: true } // Return the updated record
//         );

//         if (result) {
//             const message = {
//                 error: false,
//                 message: "KYC updated successfully!",
//                 data:result
//             };
//             res.status(200).json(message);
//         } else {
//             const message = {
//                 error: true,
//                 message: "KYC not updated",
//             };
//             res.status(404).json(message);
//         }
//     } catch (err) {
//         const message = {
//             error: true,
//             message: "Operation Failed!",
//             data: err,
//         };
//         res.status(500).json(message);
//     }
// });


/**
 * This method is to delete User
 * @param str assetId
 */
 KycRoute.delete("/delete/:kycId", async (req, res) => {
    try {
        const result = await Kyc.deleteOne({
            _id: req.params.kycId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Kyc deleted successfully!",
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

module.exports = KycRoute;