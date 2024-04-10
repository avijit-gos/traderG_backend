const mongoose = require("mongoose");

const timePeriodSchema = new mongoose.Schema({
   period_of_time:{
    type:Number
   },
   type:{
      type:String,
        enum:{
            values:["days","months","years"],
            message:"{VALUE} is not a correct value.Expect days,months,years"
        }
   }

}, {timestamps: true})

const TimePeriod = new mongoose.model("timePeriods",timePeriodSchema);

module.exports = TimePeriod;