require("dotenv").config();
const express = require("express");
const AdminBank = require("../models/adminBank");
const AdminBankRoute = express.Router();

/**
 * This method is to get list of Admin 
 */
 AdminBankRoute.get("/list", async (req, res) => {
    try {
        const bankData = await AdminBank.find({});
        message = {
            error: false,
            message: "All Bank list",
            data: bankData,
        };
        res.status(200).send(message);
    } catch (err) {
        message = {
            error: true, 
            message: "operation failed!",
            data: err,
        };
        res.status(200).send(message);
    }
});

/**
 * This method is to create new Admin
 */

 AdminBankRoute.post("/create", async (req, res) => {
    try {
        const bankData = new AdminBank(req.body);
        const result = await bankData.save();

        message = {
            error: false,
            message: "Bank account successfully created",
            data: result,
        };
        return res.status(200).send(message);
        
    } catch (err) {
        message = {
            error: true,
            message: "Operation Failed!",
            data: err,
        };
        return res.status(200).send(message);
    }
});


/**
 * This method is to detail new Admin
 */

 AdminBankRoute.get("/detail/:bankId", async (req, res) => {
    try {
       let bankData = await AdminBank.findOne({_id:req.params.bankId}).populate([
           {
               path:"admin",
               select:"username email mobile"
           }
       ]);

        message = {
            error: false,
            message: "Details of company bank account",
            data: bankData,
        };
        return res.status(200).send(message);
        
    } catch (err) {
        message = {
            error: true,
            message: "Operation Failed!",
            data: err,
        };
        return res.status(200).send(message);
    }
});

//////////////////////////////// update /////////////////////////////

AdminBankRoute.patch("/update/:bankId",async(req,res)=>{
    try{
        let result = await AdminBank.findOneAndUpdate({_id:req.params.bankId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"Bank updated successfully",
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


//////////////////////////////// delete /////////////////////////////

AdminBankRoute.delete("/delete/:bankId", async (req, res) => {
	try {
		const result = await AdminBank.deleteOne({ _id: req.params.bankId });
		if (result.deletedCount == 1) {
			message = {
				error: false,
				message: "Bank account deleted successfully!",
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



module.exports = AdminBankRoute;