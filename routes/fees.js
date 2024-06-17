const router = require("express").Router();
const ConsultingFees = require("../models/consultingFees");
const mongoose= require("mongoose")

router.post("/", async(req, res) => {
    const obj = new ConsultingFees({
        _id: new mongoose.Types.ObjectId(),
        duration: '84 months',
        amount: 55000
      });
  
    obj.save()
    .then(data => {
        console.log('Document saved:', data);
    })
    .catch(error => {
        console.error('Error saving document:', error);
    })
});

module.exports = router