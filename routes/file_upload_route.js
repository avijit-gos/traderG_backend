/** @format */

require("dotenv").config();
const express = require("express");
const app = express();
const fileUploadRouter = express.Router();
const path = require("path");
var admin = require("firebase-admin");
var serviceAccount = {
  type: process.env.TYPE,
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URL,
  token_uri: process.env.TOKEN_URL,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER,
  client_x509_cert_url: process.env.CLIENT_X509,
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.BUCKET_URL,
});
app.locals.bucket = admin.storage().bucket();

const { v4: uuidv4 } = require("uuid");
//multer
const multer = require("multer");
const csv = require("csv-parser");
const TradingLog = require("../models/trading_log");
const CapitalLog = require("../models/capital_log");
const BrokerageLog = require("../models/brokerage_log");
const TradingNewLog = require("../models/trading_log_new");
const BrokerageNewLog = require("../models/brokerage_new_log");
const OfficeData = require("../models/office_data");
const User = require("../models/user");

const acceptedFileTypes = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/pdf",
  "text/csv",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (!acceptedFileTypes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Only .png, .jpg, .jpeg, .pdf, .csv , .doc, .docx format allowed!"
        )
      );
    }
    cb(null, true);
  },
});

/**
 * This method is used upload files
 */
fileUploadRouter.post(
  "/upload",
  upload.single("file"),
  async (req, res, next) => {
    try {
      const name = "TRADERG_" + Date.now();
      const fileName = name + path.extname(req.file.originalname);
      const fileData = await app.locals.bucket
        .file(fileName)
        .createWriteStream()
        .end(req.file.buffer);

      fileurl = `https://firebasestorage.googleapis.com/v0/b/hire2inspire-62f96.appspot.com/o/${fileName}?alt=media`;

      res.status(200).send({
        error: false,
        // data: {file: req.file, fileData, fileName, fileurl}
        data: { fileName, fileurl },
      });
    } catch (error) {
      res.status(200).send({
        error: true,
        mssage: String(error),
      });
    }
  }
);

/**
 * This method is used import CSV file to database
 */
fileUploadRouter.post("/save-csv-to-db/:csvType", async (req, res, next) => {
  try {
    let results = [];
    console.log("file", req.body.file);
    app.locals.bucket
      .file(req.body.file)
      .createReadStream()
      // .pipe(csv({}))
      // .on('data',(data) => results.push(data))
      //my code
      .pipe(csv({}))
      .on("data", (data) => {
        data["search_date"] = data?.doc_date;
        console.warn(data, "data!!!!!!!!");
        results.push(data);
      })
      .on("end", async () => {
        let resp;
        if (req.params.csvType == "TradingLog") {
          // Trading log CSV Uppload
          resp = await TradingLog.insertMany(results);
        } else if (req.params.csvType == "CapitalLog") {
          // User CSV Upload
          resp = await CapitalLog.insertMany(results);
        } else if (req.params.csvType == "BrokerageLog") {
          // User CSV Upload
          resp = await BrokerageLog.insertMany(results);
        } else if (req.params.csvType == "TradingNewLog") {
          // User CSV Upload
          resp = await TradingNewLog.insertMany(results);
        } else if (req.params.csvType == "OfficeData") {
          // User CSV Upload
          resp = await OfficeData.insertMany(results);
        } else if (req.params.csvType == "User") {
          // User CSV Upload
          resp = await User.insertMany(results);
        } else {
          res.status(200).send({
            error: true,
            message: `${req.params.csvType} type not valid one. Use (TradingLog / User / CapitalLog/BrokerageLog/TradingNewLog)`,
            resp,
          });
        }

        let brokData;
        let tradingData;
        if (resp.length != null && req.params.csvType == "TradingNewLog") {
          console.log("hiii");
          for (var i in resp) {
            if (resp[i].type == "CASH INTRADAY") {
              const trading_id = resp[i]?._id;
              const client_id = resp[i]?.client_id;

              // console.log("totalValue",result[i]?.total_value)
              // Calculate brokerage
              const brokerage = resp[i]?.total_value * (0.02 / 100);

              // Calculate STT
              const stt = resp[i]?.total_value * (0.025 / 100);

              // Calculate transaction charges
              const transaction_charges =
                resp[i]?.total_value * (0.003935 / 100);

              // Calculate GST
              const gst = resp[i]?.total_value * (18 / 100);

              // Calculate SEBI charges
              const sebi_charges = resp[i]?.total_value * (0.0001 / 100);

              // Calculate stamp charges
              const stamp_charges = resp[i]?.total_value * (0.003 / 100);

              // Calculate IPFT
              const ipft = resp[i]?.total_value * (0.0001 / 100);

              //Total Brokerage;

              const total_brokerage = (
                brokerage +
                stt +
                transaction_charges +
                gst +
                sebi_charges +
                stamp_charges +
                ipft
              ).toFixed(2);

              const turnover = resp[i]?.total_value;

              // Create an object with the calculated data
              const brokerageData = new BrokerageNewLog({
                trading_id,
                client_id,
                turnover,
                brokerage,
                stt,
                transaction_charges,
                gst,
                sebi_charges,
                stamp_charges,
                ipft,
                total_brokerage,
              });
              brokData = await brokerageData.save();

              tradingData = await TradingNewLog.findOneAndUpdate(
                { _id: resp[i]?._id },
                { brokerage: total_brokerage },
                { new: true }
              );
            } else if (resp[i].type == "CASH DELIVERY") {
              const trading_id = resp[i]?._id;

              const client_id = resp[i]?.client_id;

              // Calculate brokerage
              const brokerage = resp[i]?.total_value * (0.1 / 100);

              // Calculate STT
              const stt = resp[i]?.total_value * (0.1 / 100);

              // Calculate transaction charges
              const transaction_charges =
                resp[i]?.total_value * (0.003935 / 100);

              // Calculate GST
              const gst = resp[i]?.total_value * (18 / 100);

              // Calculate SEBI charges
              const sebi_charges = resp[i]?.total_value * (0.0001 / 100);

              // Calculate stamp charges
              const stamp_charges = resp[i]?.total_value * (0.015 / 100);

              // Calculate IPFT
              const ipft = resp[i]?.total_value * (0.0001 / 100);

              //Total Brokerage;

              const total_brokerage = (
                brokerage +
                stt +
                transaction_charges +
                gst +
                sebi_charges +
                stamp_charges +
                ipft
              ).toFixed(2);

              const turnover = resp[i]?.total_value;

              // Create an object with the calculated data
              const brokerageData = new BrokerageNewLog({
                trading_id,
                client_id,
                turnover,
                brokerage,
                stt,
                transaction_charges,
                gst,
                sebi_charges,
                stamp_charges,
                ipft,
                total_brokerage,
              });
              brokData = await brokerageData.save();
              tradingData = await TradingNewLog.findOneAndUpdate(
                { _id: resp[i]?._id },
                { brokerage: total_brokerage },
                { new: true }
              );
            } else if (resp[i].type == "FUTURES") {
              const trading_id = resp[i]?._id;

              const client_id = resp[i]?.client_id;

              // Calculate brokerage
              const brokerage = resp[i]?.total_value * (0.01 / 100);

              // Calculate STT
              const stt = resp[i]?.total_value * (0.0125 / 100);

              // Calculate transaction charges
              const transaction_charges =
                resp[i]?.total_value * (0.003037 / 100);

              // Calculate GST
              const gst = resp[i].total_value * (18 / 100);

              // Calculate SEBI charges
              const sebi_charges = resp[i]?.total_value * (0.0001 / 100);

              // Calculate stamp charges
              const stamp_charges = resp[i]?.total_value * (0.002 / 100);

              // Calculate IPFT
              const ipft = resp[i]?.total_value * (0.0005 / 100);

              //Total Brokerage;

              const total_brokerage = (
                brokerage +
                stt +
                transaction_charges +
                gst +
                sebi_charges +
                stamp_charges +
                ipft
              ).toFixed(2);

              const turnover = resp[i]?.total_value;

              // Create an object with the calculated data
              const brokerageData = new BrokerageNewLog({
                trading_id,
                client_id,
                turnover,
                brokerage,
                stt,
                transaction_charges,
                gst,
                sebi_charges,
                stamp_charges,
                ipft,
                total_brokerage,
              });
              brokData = await brokerageData.save();
              tradingData = await TradingNewLog.findOneAndUpdate(
                { _id: resp[i]?._id },
                { brokerage: total_brokerage },
                { new: true }
              );
            } else if (resp[i].type == "OPTIONS") {
              const trading_id = resp[i]?._id;

              const client_id = resp[i]?.client_id;

              //  console.log("totalLot",result[i]?.total_lot)

              // Calculate brokerage
              const brokerage = resp[i]?.total_lot * 20;

              // Calculate STT
              const stt = resp[i]?.total_lot * (0.0625 / 100);

              // Calculate transaction charges
              const transaction_charges = resp[i]?.total_lot * (0.06068 / 100);

              // Calculate GST
              const gst = resp[i]?.total_lot * (18 / 100);

              // Calculate SEBI charges
              const sebi_charges = resp[i]?.total_lot * (0.0001 / 100);

              // Calculate stamp charges
              const stamp_charges = resp[i]?.total_lot * (0.003 / 100);

              // Calculate IPFT
              const ipft = resp[i]?.total_lot * (0.0005 / 100);

              //Total Brokerage;

              const total_brokerage = (
                brokerage +
                stt +
                transaction_charges +
                gst +
                sebi_charges +
                stamp_charges +
                ipft
              ).toFixed(2);

              const turnover = resp[i]?.total_lot;

              // Create an object with the calculated data
              const brokerageData = new BrokerageNewLog({
                trading_id,
                client_id,
                turnover,
                brokerage,
                stt,
                transaction_charges,
                gst,
                sebi_charges,
                stamp_charges,
                ipft,
                total_brokerage,
              });
              brokData = await brokerageData.save();
              tradingData = await TradingNewLog.findOneAndUpdate(
                { _id: resp[i]?._id },
                { brokerage: total_brokerage },
                { new: true }
              );
            }
          }
        }

        res.status(200).send({
          error: false,
          message: `${req.params.csvType} Data stored`,
          resp,
        });
      });
  } catch (error) {
    res.status(200).send({
      error: true,
      mssage: String(error),
    });
  }
});

////////////////////////////////////////// for office data //////////////////////////////////////

module.exports = fileUploadRouter;
