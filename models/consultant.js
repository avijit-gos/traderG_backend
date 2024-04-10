const mongoose = require("mongoose");

const consultantSchema = new mongoose.Schema({
  name:{
      type:String,
      required: [true, "Name is required"]
  },
  status:{
      type:Boolean,
      default:true
  }

}, {timestamps: true})

const Consultant = new mongoose.model("consultants",consultantSchema);

module.exports = Consultant;