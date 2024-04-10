require("dotenv").config();
const express = require("express");
const Chat = require("../models/chat");
const Admin = require("../models/admin")
const ChatRoute = express.Router();

/**
 * This method is to create Chat
 */
 ChatRoute.post("/create", async (req, res) => {
	try {
        const AdminData = await Admin.findOne({});
        //console.log(AdminData);
        const AdminId = AdminData?._id;
        //console.log(AdminId);
        req.body.to_id = AdminId;
        req.body.to_type = "admins";
		const ChatData = new Chat(req.body);
		const result = await ChatData.save();
		message = {
			error: false,
			message: "Chat Added Successfully!",
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
 * This method is to create Chat
 */
 ChatRoute.post("/admin-chat", async (req, res) => {
	try {
		const ChatData = new Chat(req.body);
		const result = await ChatData.save();
		message = {
			error: false,
			message: "Chat Added Successfully!",
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
 * This method is to find all Chat list
 */
 ChatRoute.get("/list", async (req, res) => {
    try {
        let ChatData = await Chat.aggregate([
            {
                "$group" : {
                    _id: {user:"$user"},
                    "data": { "$first": "$$ROOT" }
                },
            },
            { "$lookup": 
                {
                    "from": "users",
                    "localField": "data.user",
                    "foreignField": "_id",
                    "as": "user"
                }
            }
        ])
        //let ChatData = await Chat.find({})
        message = {
            error: false,
            message: "All Chat list",
            data: ChatData,
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
 * This method is to find all Chat list by user Id
 */
 ChatRoute.get("/list-by-id/:userId", async (req, res) => {
    try {
        let ChatData = await Chat.find({user:req.params.userId});

        message = {
            error: false,
            message: "All Chat list",
            data: ChatData,
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
 ChatRoute.delete("/delete/:chatId", async (req, res) => {
    try {
        const result = await Chat.deleteOne({
            _id: req.params.chatId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Chat deleted successfully!",
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


module.exports = ChatRoute;