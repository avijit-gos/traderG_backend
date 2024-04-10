require("dotenv").config();
const express = require("express");
const Broker = require("../models/broker");
const BrokerRoute = express.Router();

/**
 * This method is to create Broker
 */

BrokerRoute.post("/create", async (req, res) => {
	try {
		const BrokerData = new Broker(req.body);
		const result = await BrokerData.save();
		message = {
			error: false,
			message: "Broker Added Successfully!",
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
 * This method is to find all Broker list
 */

BrokerRoute.get("/list",async(req,res)=>{
    try{
        let BrokerData = await Broker.find({}).sort({_id:-1});

        message = {
            error: false,
            message:"All Broker list",
            data:BrokerData
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
 * This method is to find detail Article list
 * @param str brokerId
 */

BrokerRoute.get("/detail/:brokerId",async(req,res)=>{
    try{
        let BrokerData = await Broker.findOne({_id:req.params.brokerId});

        message = {
            error: false,
            message:"Detail Broker list",
            data:BrokerData
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

BrokerRoute.patch("/update/:brokerId",async(req,res)=>{
    try{
        let result = await Broker.findOneAndUpdate({_id:req.params.brokerId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"Broker updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Broker not upadated"
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

BrokerRoute.delete("/delete/:brokerId", async (req, res) => {
    try {
        const result = await Broker.deleteOne({
            _id: req.params.brokerId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Broker deleted successfully!",
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
 module.exports = BrokerRoute;
