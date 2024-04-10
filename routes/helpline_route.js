require("dotenv").config();
const express = require("express");
const Helpline = require("../models/helpline");
const HelplineRoute = express.Router();


/**
 * This method is to create InvestorHelpline
 */
 HelplineRoute.post("/create", async (req, res) => {
	try {
		const HelplineData = new Helpline(req.body);
		const result = await HelplineData.save();
		message = {
			error: false,
			message: "message Added Successfully!",
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
 * This method is to find all Helpline  list
 */
 HelplineRoute.get("/list", async (req, res) => {
    try {
        let HelplineData = await Helpline.find({}).sort({_id:-1});

        message = {
            error: false,
            message: "All  message list",
            data: HelplineData,
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
 * This method is to find all InvestorHelpline  list by userId
 */
 HelplineRoute.get("/list-by-id/:userId", async (req, res) => {
    try {
        let HelplineData = await Helpline.find({user:req.params.userId}).sort({_id:-1});

        message = {
            error: false,
            message: "message list",
            data: HelplineData,
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
 * This method is to detail Settings  list
 *  @param str settingsId
 */
 HelplineRoute.get("/detail/:helplineId", async (req, res) => {
    try {
        let HelplineData = await Helpline.findOne({_id:req.params.helplineId});

        message = {
            error: false,
            message: "Detail message",
            data: HelplineData,
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
 * This method is to update settings
 * * @param str settingsId
 */

 HelplineRoute.patch("/update/:helplineId", async (req, res) => {
	try {
		const result = await Helpline.findOneAndUpdate({ _id: req.params.helplineId }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "Helpline message updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Helpline message not updated",
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
 * This method is to delete InvestorHelplineRoute
 * @param str settingsId
 */
 HelplineRoute.delete("/delete/:helplineId", async (req, res) => {
    try {
        const result = await Helpline.deleteOne({
            _id: req.params.helplineId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "message deleted successfully!",
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




module.exports = HelplineRoute;
