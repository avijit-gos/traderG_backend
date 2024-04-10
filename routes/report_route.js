require("dotenv").config();
const express = require("express");
const Report = require("../models/report");
const ReportRoute = express.Router();
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
 * This method is to create Report
 */

 ReportRoute.post("/create",async(req,res)=>{
    try{
        const ReportData = new Report(req.body);
        const result = await ReportData.save();
        const userData = await User.findOne({_id:result?.user});
        const userName = userData?.name;

        var mailOptions = {
            from: 'support@tradergwealth.com',
            to: userData.email,
            subject: `Acknowledgment of reported query`,
            html:`
            <head>
            <title>Acknowledgment of Inquiry - TRADERG</title>
        </head>
        <body>
            <p>Dear ${userName},</p>
            <p>I am writing to acknowledge that we have received your inquiry date ${moment(result.createdAt).format("DD-MM-YYYY")}. Thank you for reaching out to us.</p>
            <p>We value your communication and the trust you have placed in TRADERG. Please be assured that your query is important to us, and we will respond to your inquiry as soon as possible. Depending on the nature of your request, it may take us some time to gather the necessary information or consult with the relevant departments to provide you with a comprehensive response.</p>
            <p>In the meantime, if you have any urgent matters or additional details to add, please feel free to reply to this email or contact our customer support team at <a href="mailto:support@tradergwealth.com">support@tradergwealth.com</a>.</p>
            <p>Thank you once again for getting in touch with us. We value your feedback and appreciate your patience as we work on providing you with the best possible support.</p>
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
            message:"Report added successfully",
            data:result
        };
       return res.status(200).send(message);
    }catch(err){
        message = {
            error:true,
            message:"Operation Failed",
            data:err.toString()
        }
        return res.status(200).send(message);
    }

});

/**
 * This method is to list of Report 
 *  @param str userId
 */


 ReportRoute.get("/list", async (req, res) => {
    try {
        let ReportData = await Report.find({}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ]).sort({_id:-1});

        message = {
            error: false,
            message: "Report list",
            data: ReportData,
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

////////////////////////////// detail ///////////////////////


ReportRoute.get("/detail/:reportId", async (req, res) => {
    try {
        let ReportData = await Report.findOne({_id:req.params.reportId}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ]).sort({_id:-1});

        message = {
            error: false,
            message: "Report list",
            data: ReportData,
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
 * This method is to list of Report by userId
 *  @param str userId
 */


 ReportRoute.get("/list-by-userId/:userId", async (req, res) => {
    try {
        let ReportData = await Report.find({user:req.params.userId}).populate([
            {
                path:"user",
                select:"fname lname"
            }
        ]).sort({_id:-1});

        message = {
            error: false,
            message: "Report list",
            data: ReportData,
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
 * This method is to update Report
 *  @param str reportId
 */

 ReportRoute.patch("/update/:reportId", async (req, res) => {
	try {
		const result = await Report.findOneAndUpdate({ _id: req.params.reportId }, req.body, {new: true});
		if (result) {
			message = {
				error: false,
				message: "Report updated successfully!",
				result
			};
			res.status(200).send(message);
		} else {
			message = {
				error: true,
				message: "Report not updated",
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
 * This method is to delete Report
 *  @param str reportId
 */

 ReportRoute.delete("/delete/:reportId", async (req, res) => {
    try {
        const result = await Report.deleteOne({
            _id: req.params.reportId
        });
        if (result.deletedCount == 1) {
            message = {
                error: false,
                message: "Report deleted successfully!",
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

module.exports = ReportRoute;