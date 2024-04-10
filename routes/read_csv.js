// const express = require('express');
// const csv = require('csv-parser');
// const TradingLog = require("../models/trading_log")
// const fileReadRouter = express.Router();
// const fs = require('fs');
// require("dotenv").config();

// const results = [];


// fileUploadRouter.post('/upload', function (req, res, next) {
//     upload(req, res, function(err) {
//         if (err instanceof multer.MulterError) {
//             // handle error
//             res.send({error: true, message: 'Multer error', data: err})
//         } else if (err) {
//             // handle error
//             res.send({error: true, message: 'Something went wrong', data: err})
//         } else {
//             // write you code
//             if (req.file) {
//                 const file = req.file;
//                 console.log(file);
//                 if (!file) {
//                     res.send('Please upload a file')
//                 }

//                 filePath = path.join(file.filename);
//                 console.log(filePath);
//                 fileurl = (`${process.env.base_url}${file.filename}`)
//                 console.log(fileurl);
//                 res.send({error: false, message: 'File uploaded', data:{file,filePath,fileurl}})
//             } else {
//                 res.send({error: true, message: 'File can not be empty'})
//             }
//         }
//     })
// })