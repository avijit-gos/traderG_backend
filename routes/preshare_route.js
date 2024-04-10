require("dotenv").config();
const express = require("express");
const PreShare = require("../models/preshare");
const PreShareRoute = express.Router();

/**
 * This method is used for create PreShare
 */

 PreShareRoute.post("/create",async(req,res)=>{
   try{
    req.body.wallet_id = "WL" + Date.now();
    req.body.client_id = "CL" + Date.now();
    const PreShareData = new PreShare(req.body);
    const result = await PreShareData.save();
    message = {
        error:false,
        message:"PreShare data added successfully",
        data:result
    };
        return res.status(200).send(message);
   }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err
        };
        return res.status(200).send(message);
   }
 });

 /**
 * This method is used for list of holding
 */

  PreShareRoute.get("/list",async(req,res)=>{
    try{
        let PreShareData = await PreShare.find({}).populate([
            {
                path:"user",
                select:"fname lname"
            },
            {
                path:"product_id",
                select:"title"
            }
        ]).sort({_id:-1});

        message = {
            error:true,
            message:"list of all PreShare account",
            data:PreShareData
        };
        res.status(200).send(message)
    }catch(err){
        message = {
            error:false,
            message:"Operation Failed",
            data:err
        };
        res.status(200).send(message)
    }
});

/**
 * This method is used for list of holding by userId
 */

 PreShareRoute.get("/list-by-userId/:userId",async(req,res)=>{
    try{
        let PreShareData = await PreShare.find({user:req.params.userId}).populate([
            {
                path:"user",
                select:"fname lname"
            },
            {
                path:"product_id",
                select:"title"
            }
        ]).sort({_id:-1});

        message = {
            error:true,
            message:"list of PreShare account",
            data:PreShareData
        };
        res.status(200).send(message)
    }catch(err){
        message = {
            error:false,
            message:"Operation Failed",
            data:err
        };
        res.status(200).send(message)
    }
});

/**
 * This method is used for detail of holding by userId and holdingId
 */

 PreShareRoute.get("/detail/:userId/:preshareId",async(req,res)=>{
    try{
        let PreShareData = await PreShare.findOne({$and:[{user:req.params.userId},{_id:req.params.preshareId}]}).populate([
            {
                path:"user",
                select:"fname lname"
            },
            {
                path:"product_id",
                select:"title"
            }
        ]).sort({_id:-1});

        message = {
            error:true,
            message:"Detail of PreShare account",
            data:PreShareData
        };
        res.status(200).send(message)
    }catch(err){
        message = {
            error:false,
            message:"Operation Failed",
            data:err
        };
        res.status(200).send(message)
    }
});

/**
 * This method is to find block/unblock holding
 */

 PreShareRoute.get("/toggle-status",async(req,res)=>{
    try{
        let PreShareData = await PreShare.find({status:true}).sort({_id:-1});

        message = {
            error: false,
            message:"list of holding",
            data:PreShareData
        }
        return res.status(200).send(message);

    }catch(err){
        message = {
            error: true,
            message:"Operation Failed",
            data: err
        }
        return res.status(200).send(message);
    }
});

/**
 * This method is to upadte Holding
 * @param str holdingId
 */

 PreShareRoute.patch("/update/:preshareId",async(req,res)=>{
    try{
        let result = await PreShare.findOneAndUpdate({_id:req.params.preshareId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"PreShare updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "PreShare not upadated"
            };
            return res.status(200).send(message);
        }
    }catch(err){
        message = {
            error: false,
            message:"Operation Failed",
            data: err
        }
        return res.status(200).send(message);
    }
});


/**
 * This method is to delete Holding 
 * @param str holdingId
 */

 PreShareRoute.delete("/delete/:preshareId", async (req, res) => {
    try {
        const result = await PreShare.deleteOne({
            _id: req.params.preshareId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "PreShare deleted successfully!",
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
 module.exports = PreShareRoute;
