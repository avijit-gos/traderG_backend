const ConsultingFees = require("./models/consultingFees")
const mongoose = require('mongoose');

// Connect to the MongoDB database
async function init() {
    // Data to be inserted
    const durations = [
      { duration: { days: 90 }, value: 3000 },
      { duration: { days: 180 }, value: 5000 },
      { duration: { days: 365 }, value: 10000 },
      { duration: { months: 36 }, value: 25000 },
      { duration: { months: 60 }, value: 40000 },
      { duration: { months: 84 }, value: 55000 }
    ];

    const obj = new ConsultingFees({
      _id: new mongoose.Types.ObjectId(),
      duration: '90 days',
      amount: 3000
    });

    obj.save()
      .then(data => {
        console.log('Document saved:', data);
      })
      .catch(error => {
        console.error('Error saving document:', error);
      })

}
init();