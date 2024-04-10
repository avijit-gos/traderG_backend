require("dotenv").config();
const express = require("express");
// const bcrypt = require("bcryptjs");
const BrokerProfile = require("../models/broker_profile");
const BrokerProfileRoute = express.Router();

/**
 * This method is to create Broker Profile
 */

BrokerProfileRoute.post("/create", async (req, res) => {
	try {
		const BrokerProfileData = new BrokerProfile(req.body);
		const result = await BrokerProfileData.save();
		message = {
			error: false,
			message: "Broker Profile Successfully!",
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
 * This method is to find all Broker Profile
 */

BrokerProfileRoute.get("/list",async(req,res)=>{
    try{
        let BrokerProfileData = await BrokerProfile.find({}).populate([
            {
                path:"broker",
                select:"name"
            }
        ]).sort({_id:-1});

        message = {
            error: false,
            message:"All Broker Profile list",
            data:BrokerProfileData
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

BrokerProfileRoute.get("/list-by-userId/:userId",async(req,res)=>{
    try{
        let BrokerProfileData = await BrokerProfile.find({user:req.params.userId}).populate([
            {
                path:"broker",
                select:"name"
            }
        ]).sort({_id:-1});

        message = {
            error: false,
            message:"All Broker Profile list",
            data:BrokerProfileData
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
 * This method is to find detail Broker Profile
 * @param str brokerId
 */

BrokerProfileRoute.get("/detail/:profileId",async(req,res)=>{
    try{
        let BrokerProfileData = await BrokerProfile.findOne({_id:req.params.profileId}).populate([
            {
                path:"broker",
                select:"name"
            }
        ]);

        message = {
            error: false,
            message:"Detail Broker profile detail",
            data:BrokerProfileData
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
 * This method is to upadte Broker 
 * @param str articleId
 */

BrokerProfileRoute.patch("/update/:profileId",async(req,res)=>{
    try{
        let result = await BrokerProfile.findOneAndUpdate({_id:req.params.profileId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"Broker profile updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Broker profile not upadated"
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
 * This method is to delete Article 
 * @param str articleId
 */

BrokerProfileRoute.delete("/delete/:profileId", async (req, res) => {
    try {
        const result = await BrokerProfile.deleteOne({
            _id: req.params.profileId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Broker profile deleted successfully!",
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
 module.exports = BrokerProfileRoute;
