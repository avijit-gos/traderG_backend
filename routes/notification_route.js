require("dotenv").config();
const express = require("express");
const Notification = require("../models/notification");
const NotificationRoute = express.Router();

/**
 * This method is to create notification
 */
 NotificationRoute.post("/create", async (req, res) => {
	try {
		const NotificationData = new Notification(req.body);
		const result = await NotificationData.save();
		message = {
			error: false,
			message: "Notification Added Successfully!",
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
 * This method is to create notification
 */
 NotificationRoute.post("/bulk-create", async (req, res) => {
	try {
        // var userData = userData.push(req.body.user);
        // console.log(userData);
		const NotificationData = await Notification.insertMany([req.body]);
		//const result = await NotificationData.save();
		message = {
			error: false,
			message: "Notification Added Successfully!",
			data: NotificationData,
		};
		return res.status(200).send(message);
	} catch (err) {
		message = {
			error: true,
			message: "operation Failed!",
			data: err.toString(),
		};
		return res.status(200).send(message);
	}
});


/**
 * This method is to find all Notification list
 */
 NotificationRoute.get("/list", async (req, res) => {
    try {
        let NotificationData = await Notification.find({}).populate([
            {
                path:"user",
                select:"fname lname email mobile"
            }
        ]).sort({_id:-1});

        message = {
            error: false,
            message: "All Notification list",
            data: NotificationData,
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
 * This method is to find all Notification list by userId
 */
 NotificationRoute.get("/list-by-userId/:userId", async (req, res) => {
    try {
        let NotificationData = await Notification.find({user:req.params.userId}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ]).sort({_id:-1});

        message = {
            error: false,
            message: "All Notification list",
            data: NotificationData,
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
 * This method is to delete User
 * @param str chatId
 */
 NotificationRoute.delete("/delete/:notificationId", async (req, res) => {
    try {
        const result = await Notification.deleteOne({
            _id: req.params.notificationId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Notification deleted successfully!",
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

module.exports = NotificationRoute;