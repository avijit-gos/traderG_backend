const mongoose = require("mongoose");

const userSubscritptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: [true, "User is required"]
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "subscriptions",
    required: [true, "Subscription is required"]
  },
  expiryDate: {
    type: Date,
   // required: true,
  },
});

const UserSubscription = new mongoose.model("userSubscriptions",userSubscritptionSchema);

module.exports = UserSubscription;