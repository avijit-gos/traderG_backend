require("dotenv").config();
const express = require("express");
const Role = require("../models/role");
const RoleRoute = express.Router();


/**
 * This method is to create Role
 */
RoleRoute.post("/create", async (req, res) => {
	try {
		const RoleData = new Role(req.body);
		const result = await RoleData.save();
		message = {
			error: false,
			message: "Role Added Successfully!",
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
 * This method is to find all Role  list
 */
RoleRoute.get("/list", async (req, res) => {
    try {
        let RoleData = await Role.find({}).sort({_id:-1});

        message = {
            error: false,
            message: "All Role list",
            data: RoleData,
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
 *  @param str roleId
 */
RoleRoute.get("/detail/:roleId", async (req, res) => {
    try {
        let RoleData = await Role.findOne({_id:req.params.roleId});

        message = {
            error: false,
            message: "Detail role list",
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
 * This method is to update role
 * * @param str roleId
 */

RoleRoute.patch("/update/:roleId", async (req, res) => {
	try {
		const result = await Role.findOneAndUpdate({ _id: req.params.roleId }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "Role updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Role not updated",
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
RoleRoute.delete("/delete/:roleId", async (req, res) => {
    try {
        const result = await Role.deleteOne({
            _id: req.params.roleId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Role deleted successfully!",
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




module.exports = RoleRoute;
