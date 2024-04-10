const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name:{
      type:String
  },
  status:{
    type:Boolean,
    default:true
  }

}, {timestamps: true})

const Role = new mongoose.model("roles",roleSchema);

module.exports = Role;