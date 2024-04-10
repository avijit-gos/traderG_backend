require("dotenv").config();
const express = require("express");
const Product = require("../models/product");
const ProductRoute = express.Router();


/**
 * This method is to create Product
 */
 ProductRoute.post("/create", async (req, res) => {
	try {
		const ProductdData = new Product(req.body);
		const result = await ProductdData.save();
		message = {
			error: false,
			message: "Product Added Successfully!",
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
 * This method is to find all Product  list
 */
 ProductRoute.get("/list", async (req, res) => {
    try {
        let ProductdData = await Product.find({}).populate([
            {
                path:"time_period",
                select:"period_of_time type"
            }
        ]);

        message = {
            error: false,
            message: "All Product list",
            data: ProductdData,
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
 * This method is to detail Product  list
 *  @param str productId
 */
 ProductRoute.get("/detail/:productId", async (req, res) => {
    try {
        let ProductData = await Product.findOne({_id:req.params.productId}).populate([
            {
                path:"time_period",
                select:"period_of_time type"
            }
        ]);

        message = {
            error: false,
            message: "Detail Product list",
            data: ProductData,
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
 * This method is to update Product
 * * @param str productId
 */

 ProductRoute.patch("/update/:productId", async (req, res) => {
	try {
		const result = await Product.findOneAndUpdate({ _id: req.params.productId }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "Product updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Product not updated",
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
 * This method is to delete Product
 * @param str productId
 */
 ProductRoute.delete("/delete/:productId", async (req, res) => {
    try {
        const result = await Product.deleteOne({
            _id: req.params.productId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Product deleted successfully!",
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




module.exports = ProductRoute;
