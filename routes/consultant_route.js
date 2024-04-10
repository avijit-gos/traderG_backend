require("dotenv").config();
const express = require("express");
const Consultant = require("../models/consultant");
const ConsultantRoute = express.Router();

/**
 * This method is to create Consultant
 */

 ConsultantRoute.post("/create", async (req, res) => {
	try {
		const ConsultantData = new Consultant(req.body);
		const result = await ConsultantData.save();
		message = {
			error: false,
			message: "Consultant Added Successfully!",
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
 * This method is to find all Consultant list
 */

  ConsultantRoute.get("/list",async(req,res)=>{
    try{
        let ConsultantData = await Consultant.find({}).sort({_id:-1});

        message = {
            error: false,
            message:"All Consultant list",
            data:ConsultantData
        }
        return res.status(200).send(message);

    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err
        }
        return res.status(200).send(message);
    }
});


/**
 * This method is to find detail Consultant list
 * @param str consId
 */

 ConsultantRoute.get("/detail/:consId",async(req,res)=>{
    try{
        let ConsultantData = await Consultant.findOne({_id:req.params.consId});

        message = {
            error: false,
            message:"Detail Consultant list",
            data:ConsultantData
        }
        return res.status(200).send(message);

    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err
        }
        return res.status(200).send(message);
    }
});


/**
 * This method is to upadte Consultant 
 * @param str consId
 */

 ConsultantRoute.patch("/update/:consId",async(req,res)=>{
    try{
        let result = await Consultant.findOneAndUpdate({_id:req.params.consId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"Consultant updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Consultant not upadated"
            };
            return res.status(200).send(message);
        }
    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err
        }
        return res.status(200).send(message);
    }
});



 /**
 * This method is to delete Consultant 
 * @param str consId
 */

  ConsultantRoute.delete("/delete/:consId", async (req, res) => {
    try {
        const result = await Consultant.deleteOne({
            _id: req.params.consId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Consultant deleted successfully!",
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
 module.exports = ConsultantRoute;
