const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema
const ConsultingFeesSchema = new Schema({
  _id: {type: mongoose.Schema.Types.ObjectId},
  duration: {type: String},
  amount: {type: String}
});

// Create the model
const ConsultingFees = mongoose.model('ConsultingFees', ConsultingFeesSchema);

// Export the model
module.exports = ConsultingFees;
