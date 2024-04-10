require("dotenv").config();
const express = require("express");
const Settings = require("../models/settings");
const SettingsRoute = express.Router();


/**
 * This method is to create Settings
 */
 SettingsRoute.post("/create", async (req, res) => {
	try {
		const SettingsData = new Settings(req.body);
		const result = await SettingsData.save();
		message = {
			error: false,
			message: "Settings Added Successfully!",
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
 * This method is to find all Settings  list
 */
 SettingsRoute.get("/list", async (req, res) => {
    try {
        let SettingsData = await Settings.find({}).sort({_id:-1});

        message = {
            error: false,
            message: "All Settings result list",
            data: SettingsData,
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
 SettingsRoute.get("/detail/:settingsId", async (req, res) => {
    try {
        let SettingsData = await Settings.findOne({_id:req.params.settingsId});

        message = {
            error: false,
            message: "Detail Settings result list",
            data: SettingsData,
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

 SettingsRoute.patch("/update/:settingsId", async (req, res) => {
	try {
		const result = await Settings.findOneAndUpdate({ _id: req.params.settingsId }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "Settings updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Settings not updated",
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
 * This method is to delete settings
 * @param str settingsId
 */
 SettingsRoute.delete("/delete/:settingsId", async (req, res) => {
    try {
        const result = await Settings.deleteOne({
            _id: req.params.settingsId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Settings deleted successfully!",
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




module.exports = SettingsRoute;
