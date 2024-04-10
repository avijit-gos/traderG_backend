const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
   email1:{
        type: String,
   },
   email2:{
        type: String
   },
   phone_no:{
        type: String,
        required: [true, "Phone no. is required"],
   },
   whatsapp_no:{
        type: String,
        required: [true, "whatsapp no. is required"],
        validate(value) {
            if(value.length !== 10) {
                throw new Error("whatsapp no should be a 10 digit number")
            }
        }
   },
   no_of_customer:{
      type:Number
   },
   turnover:{
      type:Number
   },
   investment_amt:{
        type:Number
   },
   return:{
        type:Number
   },
   about_us:{
     type:String
   },
   terms_conditions:{
     type:String
   },
   privacy_policy:{
     type:String
   },
   message:{
     type:String
   },
   admin_note:{
        type:String
   },
   consulting_fees:{
     type:String
 }


}, {timestamps: true})

const Settings = new mongoose.model("settings",settingsSchema);

module.exports = Settings;