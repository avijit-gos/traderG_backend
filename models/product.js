const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
   time_period:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "timePeriods",
   },
   title:{
     type:String,
     required: true
   },
   desc:{
     type:String
   },
   image:{
    type:String
   },
   status:{
     type:Boolean,
     default:true
   }

}, {timestamps: true})

const Product = new mongoose.model("products",productSchema);

module.exports = Product;