const mongoose = require("mongoose");
const bycrpt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    // username:{
    //     type: String,
    //     trim: true,
    //     //required: [true, "First name is required"],
    //     minlength: [2, "First name minimum contains 2 letters"],
    // },
    // name:{
    //     type: String,
    //     trim: true,
    //     required: [true, "First name is required"],
    //     minlength: [2, "First name minimum contains 2 letters"],
    // },
    // client_id:{
    //     type:String
    // },
    userId:{
        type:String
    },
    refferal_code:{
        type:String
    },
    name:{
        type:String
    },
    fname:{
        type: String,
        trim: true,
        required: [true, "First name is required"],
        minlength: [2, "First name minimum contains 2 letters"],
    },
    lname:{
        type: String,
        trim: true,
        required: [true, "Last name is required"],
        minlength: [2, "Last name minimum contains 2 letters"],
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        unique: true,
        trim: true,
        validate(value) {
        const pattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z-.]+$/g
        if(!pattern.test(value)) {
            throw new Error("Wrong email format.")
        }
    },
    },
    mobile:{
        type: String,
        //required: [true, "Mobile no. is required"],
        type: String,
        validate(value) {
            if(value.length !== 10) {
                throw new Error("mobile no should be a 10 digit number")
            }
        },

        //immutable:true,
    },
    password: {
		type: String,
        trim: true,
        minlength: [6, "Password minimum contains 6 characters"],
		required: false,
       // select:false
	},
    emailOtp: {
        type: Number,
        default: 1234
    },
    mobileOtp: {
        type: Number,
        default: 1234
    },
    date_of_birth:{
        type:Date,
    },
    gender:{
        type:String,
        // enum:{
        //     values:["male","female","transgender"],
        //     message:"{VALUE} is not a correct value.Expect male,female,transgender"
        // }
    },
    occupation:{
        type:String
    },
    address:{
        type:String,
        //minlength: [2, "Username minimum contains 2 letters"],
    },
    city:{
        type:String,
        //minlength: [2, "Username minimum contains 2 letters"],
    },
    state:{
        type:String,
        //minlength: [2, "Username minimum contains 2 letters"],
    },
    pin_code:{
        type:Number,
      //  required: [true, "pin code required"],
        //minlength: [6, "Pin minimum contains 6 characters"],

    },
    country:{
        type:String
    },
    status: {
        type: Boolean,
        default: true
    },
    login_via_google:{
        type:Boolean,
        default:false
    },
    role:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "roles",
    }
   
}, {timestamps: true});

userSchema.pre("save", async function(next) {
	if(this.isModified("password")) {
		this.password = await bycrpt.hash(this.password, 10);
		this.confirmPassword = undefined;
	}
    this.refferal_code = "ABCDE" + Date.now();
	next();
})


userSchema.pre("updateOne", async function(next) {
	try {
		if(this._update.password) {
			this._update.password = await bycrpt.hash(this._update.password, 10);
		}
		next();
	} catch (err) {
		return next(err);
	}
})


userSchema.pre("findOneAndUpdate", async function(next) {
	try {
		if(this._update.password) {
			this._update.password = await bycrpt.hash(this._update.password, 10);
		}
		next();
	} catch (err) {
		return next(err);
	}
})

const User = new mongoose.model("users", userSchema);

module.exports = User;