require("dotenv").config();
const express = require("express");
const Certificate = require("../models/certificate");
const CertificateRoute = express.Router();
const isAuthenticate = require("../middleware/authcheck");
const moment = require("moment-timezone");
const nodemailer = require("nodemailer");
const User = require("../models/user");

var transport = nodemailer.createTransport({
    host: "mail.tradergwealth.com",
    port: 465,
    auth: {
      user: "support@tradergwealth.com",
      pass: "Traderg@123"
    }
  });

/**
 * This method is to create Certificate
 */

CertificateRoute.post("/create",async(req,res)=>{
    try{
        const CertificateData = new Certificate(req.body);
        const result = await CertificateData.save();
        const userData = await User.findOne({_id:result?.user});
        const userName = userData?.name;

        var mailOptions = {
            from: 'support@tradergwealth.com',
            to: userData.email,
            subject: `Acknowledgment of reported query`,
            html:`
            <head>
            <title>Download Link for Your Document - TRADERG</title>
        </head>
        <body>
            <p>Dear ${userName},</p>
            <p>We hope this email finds you well. As requested, we are pleased to provide you with the download link for your document - ${result.name}.</p>
            <p><strong>Document Details:</strong></p>
            <p>Document Name: ${result.name}</p>
            <p>Document Type: [e.g., PDF, Word, Excel, etc.]</p>
            <p>Download Link: ${result.file} </a></p>
            <p>To download your document, simply click on the provided download link above. The document will be saved to your device for easy access.</p>
            <p>If you encounter any issues or have any questions regarding the document, please feel free to contact our support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>. We are here to assist you with any queries you may have.</p>
            <p>Thank you for choosing TRADERG! We appreciate the opportunity to serve you, and we hope this document meets your expectations.</p>
            <p><strong>Best regards,</strong></p>
            <p>TRADERG</p>
        </body>
    `
};   
        transport.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });



        message = {
            error:false,
            message:"certificate added successfully",
            data:result
        };
       return res.status(200).send(message);
    }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err
        }
        return res.status(200).send(message);
    }

});

/**
 * This method is to list of certificate by userId
 *  @param str userId
 */


 CertificateRoute.get("/list-by-userId/:userId",isAuthenticate, async (req, res) => {
    try {
        let CertificateData = await Certificate.find({user:req.params.userId}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ]).sort({_id:-1});

        message = {
            error: false,
            message: "Certificate list",
            data: CertificateData,
        };
        res.status(200).send(message);
    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err,
        };
        res.status(200).send(message);
    }
});

/**
 * This method is to list of certificate by userId
 *  @param str userId
 */


//  CertificateRoute.get("/list-by-userId-holdingId/:userId/:holdingId", async (req, res) => {
//     try {
//         let CertificateData = await Certificate.find({$and:[{user:req.params.userId},{holding:req.params.holdingId}]}).populate([
//             {
//                 path:"user",
//                 select:"fname lname"
//             }
//         ]).sort({_id:-1});

//         message = {
//             error: false,
//             message: "Certificate list",
//             data: CertificateData,
//         };
//         res.status(200).send(message);
//     } catch(err) {
//         message = {
//             error: true,
//             message: "operation failed!",
//             data: err,
//         };
//         res.status(200).send(message);
//     }
// });

/**
 * This method is to list of certificate by accID
 *  @param str userId
 */

CertificateRoute.get("/list-by-userId-accid/:userId/:accId",isAuthenticate, async (req, res) => {
    try {
        let CertificateData = await Certificate.find({$and:[{user:req.params.userId},{account_creation_id:req.params.accId}]}).populate([
            {
                path:"user",
                select:"fname lname"
            },
            {
                path:"account_creation_id",
                select:"product",
                populate : {
                    path : 'product',
                    select:"title"
                  }
            }
        ]).sort({_id:-1});

        message = {
            error: false,
            message: "Certificate list",
            data: CertificateData,
        };
        res.status(200).send(message);
    } catch(err) {
        message = {
            error: true,
            message: "operation failed!",
            data: err,
        };
        res.status(200).send(message);
    }
});


/**
 * This method is to update certificate
 *  @param str certificateId
 */

 CertificateRoute.patch("/update/:certificateId",isAuthenticate, async (req, res) => {
	try {
		const result = await Certificate.findOneAndUpdate({ _id: req.params.certificateId }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "Certificate updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Certificate not updated",
			};
			res.status(200).send(message);
		}
	} catch (err) {
		message = {
			error: true,
			message: "Operation Failed!",
			data: err,
		};
		res.status(200).send(message);
	}
});

/**
 * This method is to delete certificate
 *  @param str certificateId
 */

 CertificateRoute.delete("/delete/:certificateId", async (req, res) => {
    try {
        const result = await Certificate.deleteOne({
            _id: req.params.certificateId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Certificate deleted successfully!",
            };
            res.status(200).send(message);
        } else {
            message = {
                error: true,
                message: "Operation failed!",
            };
            res.status(200).send(message);
        }
    } catch (err) {
        message = {
            error: true,
            message: "Operation Failed!",
            data: err,
        };
        res.status(200).send(message);
    }
});

module.exports = CertificateRoute;