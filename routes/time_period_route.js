require("dotenv").config();
const express = require("express");
const TimePeriod = require("../models/time_period");
const TimePeriodRoute = express.Router();


/**
 * This method is to create TimePeriod
 */
 TimePeriodRoute.post("/create", async (req, res) => {
	try {
		const TimePeriodData = new TimePeriod(req.body);
		const result = await TimePeriodData.save();
		message = {
			error: false,
			message: "TimePeriod Added Successfully!",
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
 * This method is to find all TimePeriod  list
 */
 TimePeriodRoute.get("/list", async (req, res) => {
    try {
        let TimePeriodData = await TimePeriod.find({});

        message = {
            error: false,
            message: "All TimePeriod list",
            data: TimePeriodData,
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
 * This method is to detail TimePeriod  list
 *  @param str timePeriodId
 */
 TimePeriodRoute.get("/detail/:timePeriodId", async (req, res) => {
    try {
        let TimePeriodData = await TimePeriod.findOne({_id:req.params.timePeriodId});

        message = {
            error: false,
            message: "Detail TimePeriod list",
            data: TimePeriodData,
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
 * This method is to update TimePeriod
 * * @param str timePeriodId
 */

 TimePeriodRoute.patch("/update/:timePeriodId", async (req, res) => {
	try {
		const result = await TimePeriod.findOneAndUpdate({ _id: req.params.timePeriodId }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "TimePeriod updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "TimePeriod not updated",
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
 * This method is to delete TimePeriod
 * @param str timePeriodId
 */
 TimePeriodRoute.delete("/delete/:timePeriodId", async (req, res) => {
    try {
        const result = await TimePeriod.deleteOne({
            _id: req.params.timePeriodId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "TimePeriod deleted successfully!",
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




module.exports = TimePeriodRoute;
