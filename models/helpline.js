const mongoose = require("mongoose");

const helplineSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required: [true, "User is required"]
    },
    message:{
        type:String
    }
}, {timestamps: true})

const Helpline = new mongoose.model("helpline",helplineSchema);

module.exports = Helpline;