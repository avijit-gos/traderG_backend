require("dotenv").config();
const express = require("express");
const Query = require("../models/query");
const QueryRoute = express.Router();

/**
 * This method is to create Query
 */
 QueryRoute.post("/create", async (req, res) => {
	try {
		const QueryData = new Query(req.body);
		const result = await QueryData.save();
		message = {
			error: false,
			message: "Query Added Successfully!",
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
 * This method is to find all Query list
 */
 QueryRoute.get("/list", async (req, res) => {
    try {
        let QueryData = await Query.find({}).sort({_id:-1});

        message = {
            error: false,
            message: "All Query list",
            data: QueryData,
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
 * This method is to find all Query list by user id
 * *  @param str userId
 */
 QueryRoute.get("/list-by-userId/:userId", async (req, res) => {
    try {
        let QueryData = await Query.find({user:req.params.userId}).sort({_id:-1});

        message = {
            error: false,
            message: "All Query list",
            data: QueryData,
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
 * This method is to update query
 *  @param str queryId
 */
 QueryRoute.patch("/update/:queryId", async (req, res) => {
	try {
		const result = await Query.findOneAndUpdate({ _id: req.params.queryId }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "query updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "query not updated",
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



module.exports = QueryRoute;