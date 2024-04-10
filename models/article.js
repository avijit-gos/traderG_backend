const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true, "title is required"]
    },
    desc:{
        type:String
    }

}, {timestamps: true})

const Article = new mongoose.model("articles",articleSchema);

module.exports = Article;