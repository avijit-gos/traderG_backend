require("dotenv").config();
const express = require("express");
const UserSubscription = require("../models/user_subscription");
const UserSubscriptionRoute = express.Router();

/**
 * This method is to create User Subscription
 */

 UserSubscriptionRoute.post("/create", async (req, res) => {
	try {
		const UserSubscriptionData = new UserSubscription(req.body);
		const result = await UserSubscriptionData.save();
		message = {
			error: false,
			message: "User Subscription created Successfully!",
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
 * This method is to find all User Subscription
 */

  UserSubscriptionRoute.get("/list",async(req,res)=>{
    try{
        let UserSubscriptionData = await UserSubscription.find({}).sort({_id:-1});

        message = {
            error: false,
            message:"All User Subscription list",
            data:UserSubscriptionData
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
 * This method is to find detail  User Subscription list
 * @param str bankId
 */

 UserSubscriptionRoute.get("/detail/:subsId",async(req,res)=>{
    try{
        let UserSubscriptionData = await UserSubscription.findOne({_id:req.params.subsId});

        message = {
            error: false,
            message:"Detail User Subscription list",
            data:UserSubscriptionData
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
 * This method is to upadte  User Subscription
 * @param str bankId
 */

 UserSubscriptionRoute.patch("/update/:subsId",async(req,res)=>{
    try{
        let result = await UserSubscription.findOneAndUpdate({_id:req.params.subsId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"User Subscription successfully",
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

  UserSubscriptionRoute.delete("/delete/:subsId", async (req, res) => {
    try {
        const result = await UserSubscription.deleteOne({
            _id: req.params.subsId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "User Subscription deleted successfully!",
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
 module.exports = UserSubscriptionRoute;
