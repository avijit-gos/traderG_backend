const mongoose = require("mongoose");
// const bycrpt = require("bcryptjs");

const brokerProfileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    broker:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "brokers",
        required: [true, "Broker is required"]
    },
    userId:{
        type:String,
        required: [true, "UserId is required"]
    },
    password:{
        type:String,
        trim: true,
       // minlength: [6, "Password minimum contains 6 characters"],
    },
    pin:{
        type:String
    } ,
    status:{
        type:Boolean,
       default:true
    }

}, {timestamps: true});

// brokerProfileSchema.pre("save", async function(next) {
// 	if(this.isModified("password")) {
// 		this.password = await bycrpt.hash(this.password, 10);
// 		this.confirmPassword = undefined;
// 	}
//     this.refferal_code = "ABCDE" + Date.now();
// 	next();
// })



const BrokerProfile = new mongoose.model("brokerProfiles",brokerProfileSchema);

module.exports = BrokerProfile;