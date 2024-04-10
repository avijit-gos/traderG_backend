require("dotenv").config();
const express = require("express");
const Bank = require("../models/bank");
const BankRoute = express.Router();

/**
 * This method is to create Bank
 */

 BankRoute.post("/create", async (req, res) => {
	try {
		const BankData = new Bank(req.body);
		const result = await BankData.save();
		message = {
			error: false,
			message: "Bank Added Successfully!",
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
 * This method is to find all Bank list
 */

  BankRoute.get("/list",async(req,res)=>{
    try{
        let BankData = await Bank.find({}).sort({_id:-1});

        message = {
            error: false,
            message:"All Bank list",
            data:BankData
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
 * This method is to find detail Bank list
 * @param str bankId
 */

 BankRoute.get("/detail/:bankId",async(req,res)=>{
    try{
        let BankData = await Bank.findOne({_id:req.params.bankId});

        message = {
            error: false,
            message:"Detail Bank list",
            data:BankData
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
 * This method is to upadte Bank
 * @param str bankId
 */

 BankRoute.patch("/update/:bankId",async(req,res)=>{
    try{
        let result = await Bank.findOneAndUpdate({_id:req.params.bankId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"Bank updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Bank not upadated"
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

  BankRoute.delete("/delete/:bankId", async (req, res) => {
    try {
        const result = await Bank.deleteOne({
            _id: req.params.bankId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Bank deleted successfully!",
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
 module.exports = BankRoute;
