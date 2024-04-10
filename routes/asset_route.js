require("dotenv").config();
const express = require("express");
const Asset = require("../models/asset");
const AssetRoute = express.Router();


/**
 * This method is to find all Asset
 */

AssetRoute.get("/list", async(req,res)=>{
    try{
        let AssetData = await Asset.find({}).sort({_id:-1});

        message ={
            error: false,
            message: "All AssetData list",
            data: AssetData
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

 AssetRoute.post("/create", async (req, res) => {
	try {
		const AssetData = new Asset(req.body);
		const result = await AssetData.save();
		message = {
			error: false,
			message: "AssetData Added Successfully!",
			data: result,
		};
		return res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "operation Failed!",
			data: err,
		};
		return res.status(200).send(message);
	}
});

/**
 * This method is to find detail Asset
 * * @param str assetId
 */

 AssetRoute.get("/detail/:assetId", async(req,res)=>{
    try{
        let AssetData = await Asset.findOne({_id:req.params.assetId})

        message ={
            error: false,
            message: "All AssetData list",
            data: AssetData
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

 AssetRoute.patch("/update/:assetId", async (req, res) => {
	try {
		const result = await Asset.findOneAndUpdate({ _id: req.params.assetId }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "Asset updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Asset not updated",
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

/**
 * This method is to delete User
 * @param str assetId
 */
 AssetRoute.delete("/delete/:assetId", async (req, res) => {
    try {
        const result = await Asset.deleteOne({
            _id: req.params.assetId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Asset deleted successfully!",
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

module.exports = AssetRoute;