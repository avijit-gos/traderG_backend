require("dotenv").config();
const express = require("express");
const PreShareTransfer = require("../models/preShare_transfer");
const AccountCreationRequest = require("../models/account_creation_request");
const Product = require("../models/product");
const PreShareTransferRoute = express.Router();
const moment = require("moment-timezone");
const isAuthenticate = require("../middleware/authcheck");

PreShareTransferRoute.post("/create",async(req,res)=>{
    try{
        let accId = req.body.acc_id;
        console.log("accId",accId)
        let accountData = await AccountCreationRequest.findOne({_id:accId});
        let pId = accountData?.product;
        let productData = await Product.findOne({_id:pId});
        let productTitle = productData?.title
        if(productTitle != "pre-share"){
            message = {
                error: true,
                message: "This is not Pre Share Account"
            };
        }else{
            const transferShareData = new PreShareTransfer(req.body);
            const result  = await transferShareData.save();

            message = {
                error: false,
                message: "Share Transfer created Successfully",
                data: result
            };
        }
        return res.status(200).send(message);
    }catch(err){
        message = {
			error: true,
			message: "operation Failed!",
			data: err.toString(),
		};
		return res.status(200).send(message);
    }
});


PreShareTransferRoute.get("/detail/:shareId", async (req, res) => {
    try {
        let transferShareData = await PreShareTransfer.findOne({_id:req.params.shareId}).populate([
            {
                path:"acc_id",
                select:""
            }
        ]);

        message = {
            error: false,
            message: "Detail of share transfer",
            data: transferShareData,
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

PreShareTransferRoute.get("/list",async(req,res)=>{
    try{
        let transferShareData = await PreShareTransfer.find({}).populate([
            {
                path:"acc_id",
                select:""
            }
        ]).sort({_id:-1});
        message = {
            error: false,
            message: "Share Transfer List",
            data: transferShareData
        };
        return res.status(200).send(message);
    }catch(err){
        message = {
			error: true,
			message: "operation Failed!",
			data: err.toString(),
		};
		return res.status(200).send(message); 
    }
});


PreShareTransferRoute.patch("/update-file/:shareId", async (req, res) => {
	try {
		const result = await PreShareTransfer.findOneAndUpdate({ _id: req.params.shareId },{dp_slip_file:req.body.dp_slip_file,is_dp_file_upload:true}, {new: true});
		if (result) {
			message = {
				error: false,
				message: "PreShare Transfer updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "PreShare Transfer not updated",
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


PreShareTransferRoute.patch("/update/:shareId", async (req, res) => {
	try {
		const result = await PreShareTransfer.findOneAndUpdate({ _id: req.params.shareId }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "PreShare Transfer updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "PreShare Transfer not updated",
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
 //////////////////////////// for user /////////////////////////

PreShareTransferRoute.get("/list-by-id/:userId/:accId",async(req,res)=>{
    try{
        let transferShareData = await PreShareTransfer.find({$and:[{userId:req.params.userId},{acc_id:req.params.accId}]}).populate([
            {
                path:"acc_id",
                select:""
            },
            {
                path:"userId",
                select:""
            }
        ]).sort({_id:-1});
        message = {
            error: false,
            message: "Share Transfer List",
            data: transferShareData
        };
        return res.status(200).send(message);
    }catch(err){
        message = {
			error: true,
			message: "operation Failed!",
			data: err.toString(),
		};
		return res.status(200).send(message); 
    }
});




module.exports = PreShareTransferRoute;


