const mongoose = require("mongoose");

const brokerSchema = new mongoose.Schema({
  name:{
      type:String,
      required: [true, "Name is required"]
  },
  status:{
      type:Boolean,
      default:true
  }

}, {timestamps: true})

const Broker = new mongoose.model("brokers",brokerSchema);

module.exports = Broker;