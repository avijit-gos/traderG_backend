const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
     user:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"users",
     },
    from_id:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"from_type"
    },
    from_type:{
        type:String,
        enum:{
            values:["users","admins"]
        }
   },
   to_id:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"to_type"
   },
   to_type:{
        type:String,
        enum:{
            values:["users","admins"]
        }
   },
   message:{
        type:String
   },
   is_deleted:{
        type:Boolean,
        default:false
   },
   is_seen:{
        type:Boolean,
        default:false
   }
   
}, {timestamps: true});


const Chat = new mongoose.model("chat", chatSchema);

module.exports = Chat;