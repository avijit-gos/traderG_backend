require("dotenv").config();
const express = require("express");
const CashfreeRouter = express.Router();
const axios = require('axios');
const AccountCreationRequest = require("../models/account_creation_request");
const payment = require("../models/payment");

CashfreeRouter.post("/generate-payment-session", async(req, res, next) => {
    try {
      const accountRequestData = await AccountCreationRequest.findOne({$and:[{user: req.body.userId},{_id: req.body.acc_id}]}).populate([
        {
          path: 'user',
          select: 'name fname lname email mobile _id'
        }
      ]);

      //console.log("accountRequestData",accountRequestData?.capital);
      

     let paymentData = {
        user: accountRequestData?.user?._id,
        acc_id: accountRequestData?._id,
        amount: accountRequestData?.capital,
    }
    let result = await payment.create(paymentData);
   // console.log("result",result);
    

      const options = {
        method: 'POST',
        url: process.env.CASHFREE_SESSION_URL,
        headers: {
          'x-client-id': process.env.CASHFREE_CLIENT_ID,
          'x-client-secret': process.env.CASHFREE_CLIENT_SECRET,
          'x-api-version': process.env.CASHFREE_CLIENT_VERSION,
          'content-type': 'application/json'
        },
        data: {
          customer_details: {
            customer_id: accountRequestData?.user?._id,
            customer_fname: accountRequestData?.user?.fname,
            customer_lname: accountRequestData?.user?.lname,
            customer_email: accountRequestData?.user?.email,
            customer_phone: accountRequestData?.user?.mobile
          },
          payment_details: {
            user: result?.user,
            acc_id: result?.acc_id,
            amount: result?.capital,
        },
          order_amount: accountRequestData?.capital,
          order_id: Date.now,
          order_currency: 'INR'
        }
      };

      let resp = await axios.request(options);

      //console.log("res",resp.data);
      

      message = {
        error: false,
        message:"My payment Data",
        data: resp.data
    };
    return res.status(200).send(message);
          
    } catch (error) {
      throw error;
        return res.status(500).send({
            error: true,
            message: 'Operation failed',
            data: String(error)
        })
    }
})

module.exports = CashfreeRouter