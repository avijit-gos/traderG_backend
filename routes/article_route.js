require("dotenv").config();
const express = require("express");
const Article = require("../models/article");
const ArticleRoute = express.Router();

/**
 * This method is to create Article
 */

 ArticleRoute.post("/create", async (req, res) => {
	try {
		const ArticleData = new Article(req.body);
		const result = await ArticleData.save();
		message = {
			error: false,
			message: "Article Added Successfully!",
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
 * This method is to find all Article list
 */

ArticleRoute.get("/list",async(req,res)=>{
    try{
        let ArticleData = await Article.find({}).sort({_id:-1});

        message = {
            error: false,
            message:"All Article list",
            data:ArticleData
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
 * This method is to find detail Article list
 * @param str articleId
 */

 ArticleRoute.get("/detail/:articleId",async(req,res)=>{
    try{
        let ArticleData = await Article.findOne({_id:req.params.articleId});

        message = {
            error: false,
            message:"Detail Article list",
            data:ArticleData
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
 * This method is to upadte Article 
 * @param str articleId
 */

 ArticleRoute.patch("/update/:articleId",async(req,res)=>{
    try{
        let result = await Article.findOneAndUpdate({_id:req.params.articleId},req.body,{new: true});
        if(result){
            message = {
                error: false,
                message:"Article updated successfully",
                data: result
            };
            return res.status(200).send(message);
        }else{
            message = {
                error: true,
                message: "Article not upadated"
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



 /**
 * This method is to delete Article 
 * @param str articleId
 */

  ArticleRoute.delete("/delete/:articleId", async (req, res) => {
    try {
        const result = await Article.deleteOne({
            _id: req.params.articleId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Article deleted successfully!",
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
 module.exports = ArticleRoute;
