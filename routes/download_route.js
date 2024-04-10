require("dotenv").config();
const express = require("express");
const Download = require("../models/download");
const DownloadRoute = express.Router();

/**
 * This method is to create Download
 */

 DownloadRoute.post("/create",async(req,res)=>{
    try{
        const DownloadData = new Download(req.body);
        const result = await DownloadData.save();

        message = {
            error:false,
            message:"Download added successfully",
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
 * This method is to list of Download 
 *  @param str userId
 */


 DownloadRoute.get("/list", async (req, res) => {
    try {
        let DownloadData = await Download.find({}).sort({_id:-1});

        message = {
            error: false,
            message: "Download list",
            data: DownloadData,
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
 * This method is to update Download
 *  @param str downloadId
 */

 DownloadRoute.patch("/update/:downloadId", async (req, res) => {
	try {
		const result = await Download.findOneAndUpdate({ _id: req.params.downloadId }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "Download updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Download not updated",
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
 * This method is to delete certificate
 *  @param str certificateId
 */

 DownloadRoute.delete("/delete/:downloadId", async (req, res) => {
    try {
        const result = await Download.deleteOne({
            _id: req.params.downloadId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Download deleted successfully!",
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

module.exports = DownloadRoute;