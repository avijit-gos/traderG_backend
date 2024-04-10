require("dotenv").config();
const express = require("express");
const Subscription = require("../models/subscription");
const SubscriptionRoute = express.Router();


/**
 * This method is to Subscription 
 */
 SubscriptionRoute.post("/create", async (req, res) => {
	try {
		const SubscriptionData = new Subscription(req.body);
		const result = await SubscriptionData.save();
		message = {
			error: false,
			message: "Subscription Added Successfully!",
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
 * This method is to find all Subscription  list
 */
 SubscriptionRoute.get("/list", async (req, res) => {
    try {
        let SubscriptionData = await Subscription.find({}).sort({_id:-1})
        message = {
            error: false,
            message: "All Subscription list",
            data: SubscriptionData,
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
 * This method is to detail Subscription  list
 *  @param str subsId
 */
 SubscriptionRoute.get("/detail/:subsId", async (req, res) => {
    try {
        let SubscriptionData = await Subscription.findOne({_id:req.params.subsId});
        message = {
            error: false,
            message: "Detail Subscription list",
            data: SubscriptionData,
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
 * This method is to update Subscription
 * * @param str subsId
 */

 SubscriptionRoute.patch("/update/:subsId", async (req, res) => {
	try {
		const result = await Subscription.findOneAndUpdate({ _id: req.params.subsId }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "Subscription updated successfully!",
				data:result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Subscription not updated",
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
 * This method is to delete Subscription
 * @param str subsId
 */
 SubscriptionRoute.delete("/delete/:subsId", async (req, res) => {
    try {
        const result = await Subscription.deleteOne({
            _id: req.params.subsId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Subscription deleted successfully!",
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




module.exports = SubscriptionRoute;
