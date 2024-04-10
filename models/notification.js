const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: [true, "User is required"]
    },
    title:{
        type:String,
        required: [true, "title is required"]
    },
    description:{
        type:String
    },
    // notification_type:{
    //     type:String,
    //     enum:{
    //         values:["promotional","transactional"],
    //         message:'please select between -promotional/transactional'
    //     }

    // },
    
   
}, {timestamps: true});


const Notification = new mongoose.model("notifications", notificationSchema);

module.exports = Notification;