const mongoose = require("mongoose");

const SubscritptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  imageUrl: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  expiryDate: {
    type: Date,
   // required: true,
  },
});

const Subscription = new mongoose.model("subscriptions",SubscritptionSchema);

module.exports = Subscription;