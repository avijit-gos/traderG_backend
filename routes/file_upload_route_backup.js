const express = require('express');
const app = express();
const TradingLog = require("../models/trading_log")
const fileUploadRouter = express.Router();
const path = require('path');
require("dotenv").config();

//multer

const multer = require('multer');
const { application } = require('express');
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'uploads')
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname)
    }
})

const csv = require('csv-parser');
const fs = require('fs');

const acceptedFileTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'application/pdf',
    'text/csv'
]

const upload = multer({
    storage : storage,
    fileFilter: (req,file,cb) => {
        if(!acceptedFileTypes.includes(file.mimetype)){
            return cb({
                message: 'Only .png .jpeg .jpg , .csv, .pdf format allowed!'
            })
        }
        cb(null, true)
    }
}).single('file')   /** Formadata key should be "file" */

/**
 * multiple file upload
 */
//  fileUploadRouter.post('/upload', function (req, res, next) {
//     upload(req, res, function(err) {
//         if (err instanceof multer.MulterError) {
//             // handle error
//             return res.status(200).send({error: true, message: 'File upload error', data: err})
//         } else if (err) {
//             // handle error
//             return res.status(200).send({error: true, message: JSON.parse(JSON.stringify(err))?.message || "File upload failed!"})
//         } else {
//             // write you code
//             if (req.files) {
//                 let file = req.files;
//                 console.log(file);
//                 if (!file.length) {
//                     return res.status(200).send({error: true, message: 'Please upload a file'})
//                 }
                
//                 file.map(e => e.fileurl = `${process.env.base_url}${e.filename}`)
//                 return res.status(200).send({error: false, message: 'File uploaded', data: file})
//             } else {
//                 return res.status(200).send({error: true, message: 'File can not be empty'})
//             }
//         }
//     })
// })

/**
 * single file upload
 */
 fileUploadRouter.post('/upload', function (req, res, next) {
    upload(req, res, function(err) {
        if (err instanceof multer.MulterError) {
            // handle error
            res.send({error: true, message: 'Multer error', data: err})
        } else if (err) {
            // handle error
            res.send({error: true, message: 'Something went wrong', data: err})
        } else {
            // write you code
            if (req.file) {
                const file = req.file;
                console.log(file);
                if (!file) {
                    res.send('Please upload a file')
                }

                filePath = path.join(file.filename);
                console.log(filePath);
                fileurl = (`${process.env.base_url}${file.filename}`)
                console.log(fileurl);
                csvFunc(file.filename);
                res.send({error: false, message: 'File uploaded', data:{file,filePath,fileurl}})
            } else {
                res.send({error: true, message: 'File can not be empty'})
            }
        }
    })
})

let results = [];

const csvFunc = (filename) => {
    fs.createReadStream('./uploads/'+filename)
    .pipe(csv({}))
    .on('data',(data) => results.push(data))
    .on('end', async() => {
        console.log(results);
        //results.map(e => )
        const res = await TradingLog.insertMany(results)
        console.log(res);

        // for(let i in results) {
        // }
    })
}



module.exports = fileUploadRouter